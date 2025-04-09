import { ComponentType } from "react"
import * as Slot from "@radix-ui/react-slot"
import { CommonInputFieldProps } from "../../../../utils"
import { useSecondFactorFormContext } from "../secondFactorFormContext"

type TotpProps = {
    children: React.ReactNode
}

export function Totp({ children }: TotpProps) {
    const { totpForm } = useSecondFactorFormContext()
    const Comp = Slot.Root as ComponentType<CommonInputFieldProps>

    return (
        <totpForm.Field name="totp_code">
            {field => (
                <Comp
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
