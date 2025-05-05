import { ComponentType, ReactNode } from "react"
import * as Slot from "@radix-ui/react-slot"
import { CommonInputFieldProps, getAuthErrorsFromFormErrorMap } from "../../../../utils"
import { useSecondFactorFormContext } from "../secondFactorFormContext"

type TotpProps = {
    children: ReactNode
}

export function Totp({ children }: TotpProps) {
    const { totpForm } = useSecondFactorFormContext()
    const Comp = Slot.Root as ComponentType<CommonInputFieldProps>

    return (
        <totpForm.Field name="totp_code">
            {field => (
                <Comp
                    errors={getAuthErrorsFromFormErrorMap(field.state.meta.errorMap)}
                    name={field.name}
                    type="text"
                    value={field.state.value}
                    onChange={e => field.handleChange(e.target.value)}>
                    {children}
                </Comp>
            )}
        </totpForm.Field>
    )
}
