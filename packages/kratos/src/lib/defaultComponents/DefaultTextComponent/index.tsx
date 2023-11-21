import { FormattedMessage } from "../../helpers/formattedMessage";
import { TextComponentProps } from "../../kratosContext";
import { isUiNodeTextSecretsAttributes } from "../../utils/typeGuards";

export function DefaultTextComponent({ label, attributes }: TextComponentProps) {
    const codes = isUiNodeTextSecretsAttributes(attributes)
        ? attributes.text.context.secrets.map(text => text)
        : [attributes.text];

    return (
        <div>
            <span>{label}</span>
            {codes.map(code => (
                <pre key={code.text}>
                    <code>
                        <FormattedMessage message={code} />
                    </code>
                </pre>
            ))}
        </div>
    );
}
