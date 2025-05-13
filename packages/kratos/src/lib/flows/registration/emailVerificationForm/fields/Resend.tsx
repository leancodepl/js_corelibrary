import { ReactNode, useCallback } from "react"
import * as Slot from "@radix-ui/react-slot"
import { useRegistrationFlowContext } from "../.."
import { getCsrfToken } from "../../../../utils"
import { useGetVerificationFlow, useUpdateVerificationFlow } from "../../hooks"

type ResendProps = {
    children: ReactNode
}

export function Resend({ children }: ResendProps) {
    const { verifableAddress } = useRegistrationFlowContext()
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
        <Comp type="button" onClick={continueWithEmail}>
            {children}
        </Comp>
    )
}
