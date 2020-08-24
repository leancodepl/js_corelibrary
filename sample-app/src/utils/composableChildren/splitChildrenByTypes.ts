import { ElementType } from "react";
import isElementOfType from "./isElementOfType";
import splitChildrenByPredicates, { ComponentPredicate } from "./splitChildrenByPredicates";

/**
 * Splits provided children by specified types into separate arrays preserving same order as provided by `React.Children.forEach`:
 * if child is a valid element and of type `types[0]`, it lands in `returned[0]`
 * if child is a valid element and of type `types[i]`, it lands in `returned[i]`
 * if a child is not a valid element or not of any of specified types, it lands in `returned[types.length]` (last extra bucket)
 *
 * @param types
 * @returns an array of length `types.length + 1` of arrays of ReactNodes
 */
export default function splitChildrenByTypes<T extends ElementType<any>[]>(...types: T) {
    const predicates = types.map(isElementOfType) as {
        [Index in keyof T]: T[Index] extends ElementType<infer Props> ? ComponentPredicate<Props> : never;
    };
    return splitChildrenByPredicates(...predicates);
}
