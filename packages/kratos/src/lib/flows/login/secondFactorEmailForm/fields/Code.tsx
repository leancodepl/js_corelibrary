import { ComponentType, ReactNode } from "react"
import * as Slot from "@radix-ui/react-slot"
import { CommonInputFieldProps } from "../../../../utils"
import { useSecondFactorEmailFormContext } from "../secondFactorEmailFormContext"

type CodeProps = {
    children: ReactNode
}

export function Code({ children }: CodeProps) {
    const { codeForm } = useSecondFactorEmailFormContext()

    const Comp = Slot.Root as ComponentType<CommonInputFieldProps>

    return (
        <codeForm.Field name="code">
            {field => (
                <Comp
                    name={field.name}
                    type="text"
                    value={field.state.value}
                    onChange={e => field.handleChange(e.target.value)}>
                    {children}
                </Comp>
            )}
        </codeForm.Field>
    )
}
