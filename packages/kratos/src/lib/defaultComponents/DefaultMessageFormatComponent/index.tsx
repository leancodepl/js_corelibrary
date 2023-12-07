import type { MessageFormatComponentProps } from "../../types/components";

export function DefaultMessageFormatComponent({ text }: MessageFormatComponentProps) {
    return <span>{text}</span>;
}
