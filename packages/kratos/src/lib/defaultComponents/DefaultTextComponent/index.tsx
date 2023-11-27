import { FormattedMessage } from "../../helpers/formattedMessage";
import type { TextComponentProps } from "../../kratosContext";

export function DefaultTextComponent({ label, codes }: TextComponentProps) {
    return (
        <div>
            <span>{label}</span>
            {codes?.map(code => (
                <pre key={code.text}>
                    <code>
                        <FormattedMessage message={code} />
                    </code>
                </pre>
            ))}
        </div>
    );
}
