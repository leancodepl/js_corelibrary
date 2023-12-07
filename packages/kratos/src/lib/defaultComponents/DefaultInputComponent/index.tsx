import type { InputComponentProps } from "../../types/components";

export function DefaultInputComponent({ helperMessage, header, ...props }: InputComponentProps) {
    return (
        <div>
            <label>
                {header && <p>{header}</p>}
                <input {...props} />
            </label>
            {helperMessage}
        </div>
    );
}
