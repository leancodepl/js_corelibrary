import { ComponentType, ReactNode, useCallback, useMemo } from "react"
import * as Slot from "@radix-ui/react-slot"
import { instanceOfSuccessfulNativeRegistration } from "../../../../kratos"
import {
    CommonButtonProps,
    getCsrfToken,
    getNodeById,
    handleOnSubmitErrors,
    inputNodeAttributes,
    passkeyRegister,
} from "../../../../utils"
import { useGetRegistrationFlow, useRegistrationFlowContext, useUpdateRegistrationFlow } from "../../hooks"
import { OnRegistrationFlowError } from "../../types"
import { useChooseMethodFormContext } from "../chooseMethodFormContext"

type PasskeyProps = {
    children: ReactNode
    onError?: OnRegistrationFlowError
    onRegistrationSuccess?: () => void
}

export function Passkey({ children, onError, onRegistrationSuccess }: PasskeyProps) {
    const { traits } = useRegistrationFlowContext()
    const { mutateAsync: updateRegistrationFlow } = useUpdateRegistrationFlow()
    const { data: registrationFlow } = useGetRegistrationFlow()
    const { chooseMethodForm } = useChooseMethodFormContext()

    const registerWithPasskeyUsingCredential = useCallback(
        async (credential: string) => {
            if (!registrationFlow) return

            const response = await updateRegistrationFlow({
                method: "passkey",
                csrf_token: getCsrfToken(registrationFlow),
                traits: traits ?? {},
                passkey_register: credential,
            })

            if (!response) {
                return
            }

            if (instanceOfSuccessfulNativeRegistration(response)) {
                onRegistrationSuccess?.()

                return
            }

            handleOnSubmitErrors(response, chooseMethodForm, onError)
        },
        [onError, onRegistrationSuccess, registrationFlow, traits, chooseMethodForm, updateRegistrationFlow],
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
