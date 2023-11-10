import { Checkbox, Flex, Text } from "@chakra-ui/react";
import { CheckboxComponentProps } from "@leancodepl/kratos";

export function NodeCheckbox({
    label,
    helperMessage,
    value,
    size: _size,
    "aria-invalid": _ariaInvalid,
    ...props
}: CheckboxComponentProps) {
    return (
        <Flex direction="column" gap="2" pt="4">
            <Checkbox value={value as string | number} {...props}>
                {label}
            </Checkbox>

            {helperMessage && <Text fontSize="sm">{helperMessage}</Text>}
        </Flex>
    );
}
