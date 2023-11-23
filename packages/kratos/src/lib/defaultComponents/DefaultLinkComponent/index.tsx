import type { LinkComponentProps } from "../../kratosContext";

export function DefaultLinkComponent({ href, ...props }: LinkComponentProps) {
    // eslint-disable-next-line jsx-a11y/anchor-has-content
    return <a {...props} />;
}
