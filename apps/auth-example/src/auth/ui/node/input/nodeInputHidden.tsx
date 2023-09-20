import { UiNodeInputAttributes } from "@ory/kratos-client";
import { useFormContext } from "react-hook-form";

type NodeInputHiddenProps = {
    attributes: UiNodeInputAttributes;
};

export function NodeInputHidden({ attributes }: NodeInputHiddenProps) {
    const { register } = useFormContext();

    return <input {...register(attributes.name)} type="hidden" />;
}
