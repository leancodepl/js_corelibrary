import { ReactNode, useCallback } from "react"
import * as Slot from "@radix-ui/react-slot"
import { getCsrfToken } from "../../../../utils"
import { useGetVerificationFlow, useUpdateVerificationFlow, useVerificationFlowContext } from "../../hooks"

type ResendProps = {
    children: ReactNode
}

export function Resend({ children }: ResendProps) {
    const { verifiableAddress } = useVerificationFlowContext()
    const { mutate: updateVerificationFlow } = useUpdateVerificationFlow()
    const { data: verificationFlow } = useGetVerificationFlow()

    const continueWithEmail = useCallback(() => {
        if (!verificationFlow || !verifiableAddress) return

        updateVerificationFlow({
            method: "code",
            csrf_token: getCsrfToken(verificationFlow),
            email: verifiableAddress,
            code: "",
        })
    }, [verificationFlow, verifiableAddress, updateVerificationFlow])

    const Comp = Slot.Root as React.ComponentType<any>

    return (
        <Comp type="button" onClick={continueWithEmail}>
            {children}
        </Comp>
    )
}
