import { UiNodeInputAttributes } from "@ory/kratos-client";
import { useFormContext } from "react-hook-form";

type DefaultNodeInputHiddenProps = {
    attributes: UiNodeInputAttributes;
};

export function DefaultNodeInputHidden({ attributes }: DefaultNodeInputHiddenProps) {
    const { register } = useFormContext();

    return <input {...register(attributes.name)} type="hidden" />;
}
