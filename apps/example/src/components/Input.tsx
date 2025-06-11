import { CommonInputFieldProps } from "@leancodepl/kratos"
import { getErrorMessage } from "../services/kratos"

type InputProps = CommonInputFieldProps & { placeholder?: string }

export const Input = ({ errors, ...props }: InputProps) => (
    <div>
        <input {...props} />
        {errors && errors.length > 0 && (
            <div>
                {errors.map(error => (
                    <div key={error.id}>{getErrorMessage(error)}</div>
                ))}
            </div>
        )}
    </div>
)
