import { ComponentType, useEffect } from "react"
import { useKratosContext } from "../login"
import { useCreateRegistrationFlow } from "./hooks/useCreateRegistrationFlow"
import { RegisterFormProps, RegisterFormWrapper } from "./registerForm/RegisterFormWrapper"
import { TraitsBase } from "./registerForm/types"
import { OnRegistrationFlowError } from "./types"

type RegistrationFlowProps = {
    traitsDefaultValues: TraitsBase
    registerForm: ComponentType<RegisterFormProps>
    initialFlowId?: string
    returnTo?: string
    onError?: OnRegistrationFlowError
}

export function KratosRegistrationFlow({
    traitsDefaultValues,
    registerForm: RegisterForm,
    initialFlowId,
    returnTo,
    onError,
}: RegistrationFlowProps) {
    const { registrationFlowId, setRegistrationFlowId } = useKratosContext()

    const { mutate: createRegistrationFlow } = useCreateRegistrationFlow({ returnTo })

    useEffect(() => {
        if (registrationFlowId) return

        if (initialFlowId) {
            setRegistrationFlowId(initialFlowId)
        } else {
            createRegistrationFlow()
        }
    }, [createRegistrationFlow, registrationFlowId, initialFlowId, setRegistrationFlowId])

    return (
        <RegisterFormWrapper registerForm={RegisterForm} traitsDefaultValues={traitsDefaultValues} onError={onError} />
    )
}
