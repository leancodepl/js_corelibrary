import { ComponentType, ReactNode } from "react"
import * as Slot from "@radix-ui/react-slot"
import { CommonInputFieldProps, getAuthErrorsFromFormErrorMap } from "../../../../utils"
import { useEmailVerificationFormContext } from "../emailVerificationFormContext"

type CodeProps = {
  children: ReactNode
}

export function Code({ children }: CodeProps) {
  const { emailVerificationForm } = useEmailVerificationFormContext()

  const Comp = Slot.Root as ComponentType<CommonInputFieldProps>

  return (
    <emailVerificationForm.Field name="code">
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
    </emailVerificationForm.Field>
  )
}
