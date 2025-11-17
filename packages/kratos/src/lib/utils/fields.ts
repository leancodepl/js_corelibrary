import { ButtonHTMLAttributes, InputHTMLAttributes } from "react"
import { AuthError } from "./errors"

export type CommonInputFieldProps = Pick<
  InputHTMLAttributes<HTMLInputElement>,
  "children" | "disabled" | "name" | "onBlur" | "onChange" | "type" | "value"
> & { errors?: Array<AuthError> }

export type CommonCheckboxFieldProps = Pick<
  InputHTMLAttributes<HTMLInputElement>,
  "checked" | "children" | "disabled" | "name" | "onBlur" | "onChange" | "type"
> & { errors?: Array<AuthError> }

export type CommonButtonProps = Pick<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "children" | "disabled" | "onClick" | "type"
>
