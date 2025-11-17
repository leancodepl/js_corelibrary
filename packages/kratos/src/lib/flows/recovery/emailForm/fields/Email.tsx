import { ComponentType, ReactNode } from "react"
import * as Slot from "@radix-ui/react-slot"
import { CommonInputFieldProps, getAuthErrorsFromFormErrorMap } from "../../../../utils"
import { useEmailFormContext } from "../emailFormContext"

type EmailProps = {
  children: ReactNode
}

export function Email({ children }: EmailProps) {
  const { emailForm } = useEmailFormContext()

  const Comp: ComponentType<CommonInputFieldProps> = Slot.Root

  return (
    <emailForm.Field name="email">
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
    </emailForm.Field>
  )
}
