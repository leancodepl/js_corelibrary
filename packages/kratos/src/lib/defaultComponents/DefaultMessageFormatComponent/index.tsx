import type { MessageFormatComponentProps } from "../../kratosContext";

export function DefaultMessageFormatComponent({ text }: MessageFormatComponentProps) {
    return <span>{text}</span>;
}
