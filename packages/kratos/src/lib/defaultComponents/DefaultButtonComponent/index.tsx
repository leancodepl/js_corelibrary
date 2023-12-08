import type { ButtonComponentProps } from "../../types/components";

export function DefaultButtonComponent({ header, ...props }: ButtonComponentProps) {
    return <button {...props}>{header}</button>;
}
