import { ElementType, isValidElement, ReactElement } from "react";

export default function isElementOfType<T extends ElementType<any>>(type: T) {
    return (object: {} | null | undefined): object is ReactElement<PropsOf<T>, T> =>
        isValidElement<PropsOf<T>>(object) && object.type === type;
}
