import { FormControl, FormHelperText, FormLabel, Input } from "@chakra-ui/react";
import { InputComponentProps } from "@leancodepl/kratos";

export function NodeInput({ header, name, helperMessage, size, ...props }: InputComponentProps) {
    return (
        <FormControl>
            <FormLabel htmlFor={name}>{header}</FormLabel>
            <Input name={name} {...props} />
            {helperMessage && <FormHelperText>{helperMessage}</FormHelperText>}
        </FormControl>
    );
}
