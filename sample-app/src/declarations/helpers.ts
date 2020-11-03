type Intrinsics = keyof JSX.IntrinsicElements;

// eslint-disable-next-line @typescript-eslint/no-unused-vars, unused-imports/no-unused-vars-ts
type PropsOf<T extends import("react").ElementType<any>> = T extends import("react").ElementType<infer P>
    ? P
    : T extends Intrinsics
    ? import("react").PropsWithChildren<JSX.IntrinsicElements[T]>
    : never;
