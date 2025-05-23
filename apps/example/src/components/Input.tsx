import { CommonInputFieldProps } from "@leancodepl/kratos"
import { FC } from "react"
import { getErrorMessage } from "../services/kratos"

export const Input: FC<CommonInputFieldProps & { placeholder?: string }> = ({ errors, ...props }) => (
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
