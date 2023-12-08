import { Button } from "@chakra-ui/react";
import { ButtonComponentProps } from "@leancodepl/kratos";

export function NodeButton({ header, social: _social, fullWidth: _fullWidth, ...props }: ButtonComponentProps) {
    return <Button {...props}>{header}</Button>;
}
