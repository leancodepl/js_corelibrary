import { ComponentType, ReactNode, useCallback, useMemo } from "react"
import * as Slot from "@radix-ui/react-slot"
import { useRegistrationFlowContext } from "../.."
import { CommonButtonProps, getCsrfToken, getNodeById, inputNodeAttributes } from "../../../../utils"
import { passkeyRegister } from "../../../../utils/passkeys"
import { useGetRegistrationFlow, useUpdateRegistrationFlow } from "../../hooks"

type PasskeyProps = {
    children: ReactNode
}

export function Passkey({ children }: PasskeyProps) {
    const { traits } = useRegistrationFlowContext()
    const { mutate: updateRegistrationFlow } = useUpdateRegistrationFlow()
    const { data: registrationFlow } = useGetRegistrationFlow()

    const registerWithPasskeyUsingCredential = useCallback(
        (credential: string) => {
            if (!registrationFlow) return

            updateRegistrationFlow({
                method: "passkey",
                csrf_token: getCsrfToken(registrationFlow),
                traits: traits ?? {},
                passkey_register: credential,
            })
        },
        [registrationFlow, traits, updateRegistrationFlow],
    )

    const challenge = useMemo(
        () => inputNodeAttributes(getNodeById(registrationFlow?.ui.nodes, "passkey_create_data")),
        [registrationFlow?.ui.nodes],
    )

    const registerWithPasskey = useCallback(async () => {
        if (!challenge) return

        const credential = await passkeyRegister(challenge.value, undefined, traits)

        if (!credential) return

        registerWithPasskeyUsingCredential(credential)
    }, [challenge, registerWithPasskeyUsingCredential, traits])

    const Comp: ComponentType<CommonButtonProps> = Slot.Root

    return (
        <Comp type="button" onClick={registerWithPasskey}>
            {children}
        </Comp>
    )
}
