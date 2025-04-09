import * as Slot from "@radix-ui/react-slot"
import { CommonInputFieldProps } from "../../../../utils"
import { useChooseMethodFormContext } from "../chooseMethodFormContext"

type PasswordProps = {
    children: React.ReactNode
}

export function Password({ children }: PasswordProps) {
    const { passwordForm } = useChooseMethodFormContext()

    const Comp = Slot.Root as React.ComponentType<CommonInputFieldProps>

    return (
        <passwordForm.Field name="password">
            {field => (
                <Comp
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
