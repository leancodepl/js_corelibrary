import { ButtonHTMLAttributes, InputHTMLAttributes } from "react"
import { FormError } from "./errors"

export type CommonInputFieldProps = Pick<
    InputHTMLAttributes<HTMLInputElement>,
    "children" | "name" | "onChange" | "type" | "value"
> & { errors?: Array<FormError> }

export type CommonButtonProps = Pick<
    ButtonHTMLAttributes<HTMLButtonElement>,
    "children" | "disabled" | "onClick" | "type"
>
