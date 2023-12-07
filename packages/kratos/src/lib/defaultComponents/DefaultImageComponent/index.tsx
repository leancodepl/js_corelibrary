import type { ImageComponentProps } from "../../types/components";

export function DefaultImageComponent({ header, ...props }: ImageComponentProps) {
    return (
        <div>
            {header && <p>{header}</p>}
            {/* eslint-disable-next-line jsx-a11y/alt-text */}
            <img {...props} />
        </div>
    );
}
