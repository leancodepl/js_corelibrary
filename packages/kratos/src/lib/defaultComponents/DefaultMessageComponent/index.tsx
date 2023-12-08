import type { MessageComponentProps } from "../../types/components";

export function DefaultMessageComponent({ children }: MessageComponentProps) {
    // eslint-disable-next-line react/jsx-no-useless-fragment
    return <>{children}</>;
}
