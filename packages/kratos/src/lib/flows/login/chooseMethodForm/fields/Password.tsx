import { ComponentType } from "react"
import * as Slot from "@radix-ui/react-slot"
import { CommonInputFieldProps, getErrorsFromErrorMap } from "../../../../utils"
import { useChooseMethodFormContext } from "../chooseMethodFormContext"

type PasswordProps = {
    children: React.ReactNode
}

export function Password({ children }: PasswordProps) {
    const { passwordForm } = useChooseMethodFormContext()

    const Comp: ComponentType<CommonInputFieldProps> = Slot.Root

    return (
        <passwordForm.Field name="password">
            {field => (
                <Comp
                    errors={getErrorsFromErrorMap(field.state.meta.errorMap)}
                    name={field.name}
                    type="password"
                    value={field.state.value}
                    onChange={e => field.handleChange(e.target.value)}>
                    {children}
                </Comp>
            )}
        </passwordForm.Field>
    )
}
