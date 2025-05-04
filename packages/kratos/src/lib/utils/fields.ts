import { ButtonHTMLAttributes, InputHTMLAttributes } from "react"
import { AuthError } from "./errors"

export type CommonInputFieldProps = Pick<
    InputHTMLAttributes<HTMLInputElement>,
    "children" | "name" | "onChange" | "type" | "value"
> & { errors?: Array<AuthError> }

export type CommonButtonProps = Pick<
    ButtonHTMLAttributes<HTMLButtonElement>,
    "children" | "disabled" | "onClick" | "type"
>
