import { MessageComponentProps } from "../../kratosContext";

export function DefaultMessageComponent({ children }: MessageComponentProps) {
    // eslint-disable-next-line react/jsx-no-useless-fragment
    return <>{children}</>;
}
