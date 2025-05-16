import { ReactNode, useCallback } from "react"
import * as Slot from "@radix-ui/react-slot"
import { getCsrfToken } from "../../../../utils"
import { useGetVerificationFlow, useUpdateVerificationFlow } from "../../hooks"
import { useLoginFlowContext } from "../../loginFlow"

type ResendProps = {
    children: ReactNode
}

export function Resend({ children }: ResendProps) {
    const { verifableAddress } = useLoginFlowContext()
    const { mutate: updateVerificationFlow } = useUpdateVerificationFlow()
    const { data: verificationFlow } = useGetVerificationFlow()

    const continueWithEmail = useCallback(() => {
        if (!verificationFlow || !verifableAddress) return

        updateVerificationFlow({
            method: "code",
            csrf_token: getCsrfToken(verificationFlow),
            email: verifableAddress,
            code: "",
        })
    }, [verificationFlow, verifableAddress, updateVerificationFlow])

    const Comp = Slot.Root as React.ComponentType<any>

    return (
        <Comp email={verifableAddress} type="button" onClick={continueWithEmail}>
            {children}
        </Comp>
    )
}
