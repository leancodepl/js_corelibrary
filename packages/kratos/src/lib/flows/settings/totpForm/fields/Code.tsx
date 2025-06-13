import { ComponentType, ReactNode } from "react"
import * as Slot from "@radix-ui/react-slot"
import { CommonInputFieldProps, getAuthErrorsFromFormErrorMap } from "../../../../utils"
import { useTotpFormContext } from "../totpFormContext"

type CodeProps = {
    children: ReactNode
}

export function Code({ children }: CodeProps) {
    const { totpForm } = useTotpFormContext()

    const Comp: ComponentType<CommonInputFieldProps> = Slot.Root

    return (
        <totpForm.Field name="code">
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
