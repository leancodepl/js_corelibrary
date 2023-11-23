import type { InputComponentProps } from "../../kratosContext";

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
