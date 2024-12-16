/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import { ReactNode } from "react"
import { LoginFlow, RecoveryFlow, RegistrationFlow, SettingsFlow, UiNodeGroupEnum, VerificationFlow } from "../kratos"
import { FilterNodesByGroups } from "../utils/filterNodesByGroups"
import { FilterFlowNodes } from "./filterFlowNodes"

export type SelfServiceFlow = LoginFlow | RecoveryFlow | RegistrationFlow | SettingsFlow | VerificationFlow

/**
 * Additional props that can be passed to the UserAuthForm component
 * @see UserAuthForm
 *
 * @param onSubmit - function that is called when the form is submitted. It automatically maps the form data to the request body and prevents native form submits.
 */
export type UserAuthFormAdditionalProps<TBody> = {
    onSubmit?: ({ body, event }: { body: TBody; event?: React.FormEvent<HTMLFormElement> }) => void
}

export type UserAuthFormProps<TBody> = {
    flow: SelfServiceFlow
    children: ReactNode
    formFilterOverride?: FilterNodesByGroups
    submitOnEnter?: boolean
    className?: string
} & Omit<React.FormHTMLAttributes<HTMLFormElement>, "onSubmit"> &
    UserAuthFormAdditionalProps<TBody>

/**
 * UserAuthForm is a component that renders a form for a given Ory flow.
 * It automatically adds the form action and method and adds csrf tokens to the form.
 * When the `onSubmit` parameter is passed, it also automatically maps the form data to the request body and prevents native form submits.
 * @see UserAuthFormProps
 * @returns JSX.Element
 */
export function UserAuthForm<TBody>({
    flow,
    children,
    submitOnEnter,
    onSubmit,
    formFilterOverride,
    ...props
}: UserAuthFormProps<TBody>) {
    return (
        <form
            noValidate
            action={flow.ui.action}
            method={flow.ui.method}
            onKeyDown={e => {
                if (e.key === "Enter" && !submitOnEnter) {
                    e.stopPropagation()
                    e.preventDefault()
                }
            }}
            {...(onSubmit && {
                onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
                    event.preventDefault()

                    const form = event.currentTarget
                    const formData = new FormData(form)

                    // map the entire form data to JSON for the request body
                    let body = Object.fromEntries(formData as any) as unknown as TBody

                    // We need the method specified from the name and value of the submit button.
                    // when multiple submit buttons are present, the clicked one's value is used.
                    if ("submitter" in event.nativeEvent) {
                        const method = (event.nativeEvent as unknown as { submitter: HTMLInputElement }).submitter
                        body = {
                            ...body,
                            ...{ [method.name]: method.value },
                        }
                    }

                    onSubmit({ body, event })
                },
            })}
            {...props}>
            {/*always add csrf token and other hidden fields to form*/}
            <FilterFlowNodes
                includeCSRF
                filter={
                    formFilterOverride ?? {
                        nodes: flow.ui.nodes,
                        groups: UiNodeGroupEnum.Default,
                        attributes: "hidden",
                    }
                }
            />
            {children}
        </form>
    )
}
