import { FormControl, FormErrorMessage, FormHelperText, FormLabel, Input } from "@chakra-ui/react";
import { InputComponentProps } from "@leancodepl/kratos";

export function NodeInput({ header, name, helperMessage, isError, size, ...props }: InputComponentProps) {
    return (
        <FormControl isInvalid={isError}>
            <FormLabel htmlFor={name}>{header}</FormLabel>
            <Input name={name} {...props} formNoValidate />
            {helperMessage &&
                (isError ? (
                    <FormErrorMessage>{helperMessage}</FormErrorMessage>
                ) : (
                    <FormHelperText>{helperMessage}</FormHelperText>
                ))}
        </FormControl>
    );
}
