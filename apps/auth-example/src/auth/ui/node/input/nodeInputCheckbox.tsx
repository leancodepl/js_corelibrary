import { Checkbox, Flex, Text } from "@chakra-ui/react";
import { UiNode, UiNodeInputAttributes } from "@ory/kratos-client";
import { useFormContext } from "react-hook-form";
import { getMessages } from "../../messages/getMessages";
import { useCustomUiMessageContext } from "../../messages/UiMessage";
import { UiNodeLabel } from "../../messages/UiNodeLabel";

type NodeInputCheckboxProps = {
    node: UiNode;
    attributes: UiNodeInputAttributes;
    disabled: boolean;
};

export function NodeInputCheckbox({ node, attributes, disabled }: NodeInputCheckboxProps) {
    const customUiMessage = useCustomUiMessageContext();
    const { register } = useFormContext();

    const { error, info } = getMessages({
        messages: node.messages,
        attributes,
        customUiMessage,
        maxMessagesPerGroup: 1,
    });

    return (
        <Flex direction="column" gap="2" pt="4">
            <Checkbox {...register(attributes.name)} disabled={disabled}>
                <UiNodeLabel node={node} />
            </Checkbox>

            {error && (
                <Text color="red.400" fontSize="sm">
                    {error}
                </Text>
            )}
            {info && <Text fontSize="sm">{info}</Text>}
        </Flex>
    );
}
