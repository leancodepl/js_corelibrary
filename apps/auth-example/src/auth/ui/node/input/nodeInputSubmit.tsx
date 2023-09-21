import { Button, Flex } from "@chakra-ui/react";
import { UiNode, UiNodeInputAttributes } from "@ory/kratos-client";
import { useFormContext } from "react-hook-form";
import { UiNodeLabel } from "../../messages/UiNodeLabel";

type NodeInputProps = {
    node: UiNode;
    attributes: UiNodeInputAttributes;
    disabled: boolean;
};

export function NodeInputSubmit({ node, attributes, disabled }: NodeInputProps) {
    const {
        formState: { isSubmitting },
    } = useFormContext();

    const isSecondary = isSecondaryButton(attributes);

    return (
        <Flex direction="column" pt="4">
            <Button
                colorScheme={attributes.name === "totp_unlink" ? "red" : undefined}
                data-test-id={`kratos-${attributes.name}-${attributes.value}`}
                disabled={attributes.disabled || disabled}
                isLoading={isSubmitting}
                type="submit"
                variant={isSecondary ? "outline" : "solid"}>
                <UiNodeLabel node={node} />
            </Button>
        </Flex>
    );
}

function isSecondaryButton(attributes: UiNodeInputAttributes) {
    return attributes.name === "email";
}
