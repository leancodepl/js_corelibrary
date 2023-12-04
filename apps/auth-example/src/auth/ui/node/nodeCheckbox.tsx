import { Checkbox, Flex, FormErrorMessage, Text } from "@chakra-ui/react";
import { CheckboxComponentProps } from "@leancodepl/kratos";

export function NodeCheckbox({
    label,
    helperMessage,
    value,
    size: _size,
    isError,
    "aria-invalid": _ariaInvalid,
    ...props
}: CheckboxComponentProps) {
    return (
        <Flex direction="column" gap="2" pt="4">
            <Checkbox value={value as string | number} {...props} formNoValidate>
                {label}
            </Checkbox>
            {helperMessage &&
                (isError ? (
                    <FormErrorMessage>
                        <Text fontSize="sm">{helperMessage}</Text>
                    </FormErrorMessage>
                ) : (
                    <Text fontSize="sm">{helperMessage}</Text>
                ))}
        </Flex>
    );
}
