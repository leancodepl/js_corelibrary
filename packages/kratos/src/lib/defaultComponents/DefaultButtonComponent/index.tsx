import type { ButtonComponentProps } from "../../kratosContext";

export function DefaultButtonComponent({ header, ...props }: ButtonComponentProps) {
    return <button {...props}>{header}</button>;
}
