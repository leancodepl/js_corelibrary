import { ComponentType, ReactNode, useMemo } from "react"
import { chooseMethodFormContext, ChooseMethodFormContextData } from "./chooseMethodFormContext"
import { Apple, Facebook, Google, Identifier, Passkey, Password } from "./fields"
import { usePasswordForm } from "./usePasswordForm"

export type ChooseMethodFormProps = {
    Identifier?: ComponentType<{ children: ReactNode }>
    Password?: ComponentType<{ children: ReactNode }>
    Google?: ComponentType<{ children: ReactNode }>
    Passkey?: ComponentType<{ children: ReactNode }>
    Apple?: ComponentType<{ children: ReactNode }>
    Facebook?: ComponentType<{ children: ReactNode }>
}

type ChooseMethodFormWrapperProps = {
    chooseMethodForm: ComponentType<ChooseMethodFormProps>
}

export function ChooseMethodFormWrapper({ chooseMethodForm: ChooseMethodForm }: ChooseMethodFormWrapperProps) {
    const passwordForm = usePasswordForm()
    // const { data: loginFlow } = useGetLoginFlow()

    const chooseMethodFormContextData = useMemo<ChooseMethodFormContextData>(() => ({ passwordForm }), [passwordForm])

    // const { hasPasskey } = useMemo(() => {
    //     if (!loginFlow) return { hasPasskey: false }

    //     return {
    //         hasPasskey: loginFlow.methods.passkey.enabled,
    //         hasGoogle: loginFlow.methods.oidc.google.enabled,

    //     }
    // }, [])

    return (
        <chooseMethodFormContext.Provider value={chooseMethodFormContextData}>
            <form
                onSubmit={e => {
                    e.preventDefault()
                    passwordForm.handleSubmit()
                }}>
                <ChooseMethodForm
                    Apple={Apple}
                    Facebook={Facebook}
                    Google={Google}
                    Identifier={Identifier}
                    Passkey={Passkey}
                    Password={Password}
                />
            </form>
        </chooseMethodFormContext.Provider>
    )
}
