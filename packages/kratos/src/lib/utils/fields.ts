import { ButtonHTMLAttributes, InputHTMLAttributes } from "react"

export type CommonInputFieldProps = Pick<
    InputHTMLAttributes<HTMLInputElement>,
    "children" | "name" | "onChange" | "type" | "value"
>

export type CommonButtonProps = Pick<
    ButtonHTMLAttributes<HTMLButtonElement>,
    "children" | "disabled" | "onClick" | "type"
>
