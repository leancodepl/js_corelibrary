import { CheckboxComponentProps } from "../../kratosContext";

export function DefaultCheckboxComponent({ label, helperMessage, ...props }: CheckboxComponentProps) {
    return (
        <div>
            <label>
                <input {...props} type="checkbox" />
                {label}
            </label>
            {helperMessage}
        </div>
    );
}
