import * as Slot from "@radix-ui/react-slot"
import { CommonInputFieldProps } from "../../../../utils"
import { useChooseMethodFormContext } from "../chooseMethodFormContext"

type IdentifierProps = {
    children: React.ReactNode
}

export function Identifier({ children }: IdentifierProps) {
    const { passwordForm } = useChooseMethodFormContext()

    const Comp = Slot.Root as React.ComponentType<CommonInputFieldProps>

    return (
        <passwordForm.Field name="identifier">
            {field => (
                <Comp
                    name={field.name}
                    type="text"
                    value={field.state.value}
                    onChange={e => field.handleChange(e.target.value)}>
                    {children}
                </Comp>
            )}
        </passwordForm.Field>
    )
}
