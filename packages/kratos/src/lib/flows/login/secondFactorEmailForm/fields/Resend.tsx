import { ReactNode, useCallback } from "react"
import * as Slot from "@radix-ui/react-slot"
import { getCsrfToken, getNodeById, inputNodeAttributes } from "../../../../utils"
import { useGetLoginFlow, useUpdateLoginFlow } from "../../hooks"

type ResendProps = {
    children: ReactNode
}

export function Resend({ children }: ResendProps) {
    const { mutate: updateLoginFlow } = useUpdateLoginFlow()
    const { data: loginFlow } = useGetLoginFlow()

    const continueWithEmail = useCallback(() => {
        if (!loginFlow) return

        const identifier = inputNodeAttributes(getNodeById(loginFlow.ui.nodes, "identifier"))?.value

        updateLoginFlow({
            method: "code",
            csrf_token: getCsrfToken(loginFlow),
            resend: "code",
            identifier,
        })
    }, [loginFlow, updateLoginFlow])

    const Comp = Slot.Root as React.ComponentType<any>

    return (
        <Comp type="button" onClick={continueWithEmail}>
            {children}
        </Comp>
    )
}
