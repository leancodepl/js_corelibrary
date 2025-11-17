import { ReactNode } from "react"
import { CommonCheckboxFieldProps } from "@leancodepl/kratos"
import { getErrorMessage } from "../services/kratos"

type CheckboxProps = CommonCheckboxFieldProps & { placeholder?: string; children?: ReactNode }

export const Checkbox = ({ errors, children, ...props }: CheckboxProps) => (
  <div>
    <label>
      <input {...props} />
      {children}
    </label>

    {errors && errors.length > 0 && (
      <div data-testid="checkbox-errors">
        {errors.map(error => (
          <div key={error.id}>{getErrorMessage(error)}</div>
        ))}
      </div>
    )}
  </div>
)
