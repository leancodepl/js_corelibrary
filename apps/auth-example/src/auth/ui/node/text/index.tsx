import { Flex, Text } from "@chakra-ui/react";
import { UiNode, UiNodeTextAttributes, UiText } from "@ory/kratos-client";
import { isObject } from "lodash";
import { UiMessage } from "../../messages/UiMessage";

type NodeTextProps = {
    node: UiNode;
    attributes: UiNodeTextAttributes;
};

export function NodeText({ attributes, node }: NodeTextProps) {
    return (
        <>
            <Text fontSize="md">
                <UiMessage attributes={attributes} text={node.meta.label} />
            </Text>
            <Content attributes={attributes} node={node} />
        </>
    );
}

function Content({ attributes }: NodeTextProps) {
    switch (attributes.text.id) {
        case 1050015:
            return (
                <Flex gap="2">
                    {isContextWithSecrets(attributes.text.context) &&
                        attributes.text.context.secrets.map((text: UiText, i: number) => (
                            <Text key={i} as="b">
                                <code>{text.id === 1050014 ? "Zużyty" : text.text}</code>
                            </Text>
                        ))}
                </Flex>
            );
    }

    return (
        <Text as="b" fontSize="md">
            {attributes.text.text}
        </Text>
    );
}

type ContextWithSecrets = {
    secrets: UiText[];
};

function isContextWithSecrets(value: unknown): value is ContextWithSecrets {
    return isObject(value) && "secrets" in value && Array.isArray(value.secrets);
}
