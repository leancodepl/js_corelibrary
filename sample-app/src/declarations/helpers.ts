type Intrinsics = keyof JSX.IntrinsicElements;

type PropsOf<T extends import("react").ElementType<any>> = T extends import("react").ElementType<infer P>
    ? P
    : T extends Intrinsics
    ? import("react").PropsWithChildren<JSX.IntrinsicElements[T]>
    : never;
