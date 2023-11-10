import { UiNode } from "@ory/client";
import {
    isUiNodeAnchorAttributes,
    isUiNodeImageAttributes,
    isUiNodeInputAttributes,
    isUiNodeTextAttributes,
} from "@ory/integrations/ui";
import { NodeMessages } from "./errorMessages";
import { FormattedMessage } from "./formattedMessage";
import { getNodeLabel } from "./getNodeLabel";
import { ButtonComponentProps, useKratosContext } from "../kratosContext";

type NodeProps = {
    node: UiNode;
    className?: string;
};

export function Node({ node, className }: NodeProps) {
    const {
        components: { Image, Text, Link, Input, Button, Checkbox },
    } = useKratosContext();

    if (isUiNodeImageAttributes(node.attributes)) {
        return (
            <Image
                header={<FormattedMessage message={node.meta.label} />}
                height={node.attributes.height}
                src={node.attributes.src}
                width={node.attributes.width}
            />
        );
    } else if (isUiNodeTextAttributes(node.attributes)) {
        return (
            <Text
                attributes={node.attributes}
                id={node.attributes.id}
                label={<FormattedMessage message={node.meta.label} />}
                node={node}>
                <FormattedMessage message={node.attributes.text} />
            </Text>
        );
    } else if (isUiNodeInputAttributes(node.attributes)) {
        const attrs = node.attributes;
        const nodeType = attrs.type;

        switch (nodeType) {
            case "button":
            case "submit": {
                const isSocial = (attrs.name === "provider" || attrs.name === "link") && node.group === "oidc";

                const submit: Partial<ButtonComponentProps> = {
                    type: attrs.type as "submit" | "reset" | "button" | undefined,
                    name: attrs.name,
                };

                if (attrs.value) {
                    submit.value = attrs.value;
                }

                if (isSocial) {
                    submit.formNoValidate = true;
                    submit.onClick = e => {
                        e.currentTarget.type = "submit";
                        e.currentTarget.dispatchEvent(new Event("submit", { cancelable: true, bubbles: true }));
                    };
                }

                if (attrs.onclick) {
                    // This is a bit hacky but it wouldn't work otherwise.
                    const oc = attrs.onclick;
                    submit.onClick = () => {
                        // eslint-disable-next-line no-eval
                        eval(oc);
                    };
                }

                // the recovery code resend button
                if (node.meta.label?.id === 1070008) {
                    // on html forms the required flag on an input field will prevent the form from submitting.
                    // we disable validation for this form since the resend button does not rely on any input fields
                    submit.formNoValidate = true;
                }

                return (
                    <Button
                        fullWidth
                        className={className}
                        disabled={attrs.disabled}
                        header={<FormattedMessage message={getNodeLabel(node)} />}
                        social={isSocial ? (attrs.value as string).toLowerCase() : undefined}
                        {...submit}
                    />
                );
            }
            case "datetime-local":
            case "checkbox":
                return (
                    <Checkbox
                        className={className}
                        defaultChecked={Boolean(attrs.value)}
                        disabled={attrs.disabled}
                        helperMessage={<NodeMessages nodes={[node]} />}
                        label={<FormattedMessage message={getNodeLabel(node)} />}
                        name={attrs.name}
                        required={attrs.required}
                        value="true"
                    />
                );
            default:
                return (
                    <Input
                        autoComplete={attrs.autocomplete ?? (attrs.name === "identifier" ? "username" : "")}
                        className={className}
                        defaultValue={attrs.value as string | number | string[]}
                        disabled={attrs.disabled}
                        header={<FormattedMessage message={getNodeLabel(node)} />}
                        helperMessage={<NodeMessages nodes={[node]} />}
                        name={attrs.name}
                        pattern={attrs.pattern}
                        required={attrs.required}
                        type={attrs.type}
                    />
                );
        }
    } else if (isUiNodeAnchorAttributes(node.attributes)) {
        return (
            <Link className={className} href={node.attributes.href}>
                <FormattedMessage message={node.attributes.title} />
            </Link>
        );
    }
    return null;
}
