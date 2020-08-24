import { Children, ReactElement, ReactNode } from "react";

export type ComponentPredicate<T = any> = (o: ReactNode) => o is ReactElement<T>;

type PredicateToElementMap<T extends ComponentPredicate[]> = {
    [Index in keyof T]: T[Index] extends ComponentPredicate<infer Props> ? ReactElement<Props>[] : never;
};

export default function splitChildrenByPredicates<T extends ComponentPredicate[]>(...predicates: T) {
    return (children: ReactNode | ReactNode[]) => {
        const buckets = new Array(predicates.length).map(() => [] as any[]) as [
            ...PredicateToElementMap<T>,
            ReactNode[],
        ];

        Children.forEach(children, child => {
            const bucketIdx = (predicates.findIndex(predicate => predicate(child)) + buckets.length) % buckets.length;
            buckets[bucketIdx].push(child as any);
        });

        return buckets;
    };
}
