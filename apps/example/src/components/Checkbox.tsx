import { CommonCheckboxFieldProps } from "@leancodepl/kratos"
import { FC, ReactNode } from "react"
import { getErrorMessage } from "../services/kratos"

export const Checkbox: FC<CommonCheckboxFieldProps & { placeholder?: string; children?: ReactNode }> = ({
    errors,
    children,
    ...props
}) => (
    <div>
        <label>
            <input {...props} />
            {children}
        </label>

        {errors && errors.length > 0 && (
            <div>
                {errors.map(error => (
                    <div key={error.id}>{getErrorMessage(error)}</div>
                ))}
            </div>
        )}
    </div>
)
