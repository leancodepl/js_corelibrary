// import { FormControl, FormErrorMessage, FormHelperText, FormLabel, Input } from "@chakra-ui/react";
// import { UiNode, UiNodeInputAttributes } from "@ory/client";
// import { useController, useFormContext } from "react-hook-form";
// import { getMessages } from "../../messages/getMessages";
// import { UiMessage, useCustomUiMessageContext } from "../../messages/UiMessage";

// type NodeInputDefaultProps = {
//     node: UiNode;
//     attributes: UiNodeInputAttributes;
//     disabled: boolean;
// };

// export function NodeInputDefault({ node, disabled, attributes }: NodeInputDefaultProps) {
//     const customUiMessage = useCustomUiMessageContext();
//     const { control } = useFormContext();

//     const { error, info } = getMessages({
//         messages: node.messages,
//         attributes,
//         customUiMessage,
//         maxMessagesPerGroup: 1,
//     });

//     const {
//         field: { onChange, onBlur, name, value, ref },
//     } = useController({ name: attributes.name, control });

//     return (
//         <FormControl>
//             <FormLabel htmlFor={name}>
//                 <UiMessage attributes={attributes} text={node.meta.label} />
//             </FormLabel>
//             <Input
//                 ref={ref}
//                 autoComplete={attributes.autocomplete ?? "on"}
//                 data-test-id={`kratos-${name}`}
//                 disabled={attributes.disabled || disabled}
//                 name={name}
//                 type={attributes.type}
//                 value={value}
//                 onBlur={onBlur}
//                 onChange={onChange}
//             />
//             {error && <FormErrorMessage>{error}</FormErrorMessage>}
//             {info && <FormHelperText>{info}</FormHelperText>}
//         </FormControl>
//     );
// }
