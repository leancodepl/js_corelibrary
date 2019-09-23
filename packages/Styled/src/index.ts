import React from "react";

type MergeRight<T, U> = T & Omit<U, keyof T>;

class RawStyle {
    constructor(public className?: string) {
        this.className = className;
    }
}

type PropsOf<T extends import("react").ElementType<any>> = T extends import("react").ElementType<infer P>
    ? P
    : T extends JSX.IntrinsicElements
    ? import("react").PropsWithChildren<JSX.IntrinsicElements[T]>
    : never;

type StyleDataProp<T> = false extends { [TKey in keyof T]: undefined extends T[TKey] ? true : false }[keyof T]
    ? { styleData: T }
    : { styleData?: T };

type ElementsFn<TInProps, TStyledData, TElements> = <TNewElements extends { [K: string]: React.ComponentType<any> }>(
    this: StyledComponent<TInProps, TStyledData, TElements>,
    o: TNewElements,
) => StyledComponent<TInProps, TStyledData, MergeRight<TNewElements, TElements>>;

type StyledComponentElements<TInProps, TStyledData, TElements> = {
    elements: ElementsFn<TInProps, TStyledData, TElements>;
} & TElements;

type StyledComponent<TInProps, TStyledData = undefined, TElements = {}> = React.FunctionComponent<
    TInProps & StyleDataProp<TStyledData>
> &
    StyledComponentElements<TInProps, TStyledData, TElements> &
    StyledComponentCast<TStyledData>;

type StyledComponentCast<TStyledData> = {
    withComponent<Tag extends React.ElementType>(tag: Tag): StyledComponent<PropsOf<Tag>, TStyledData>;
};

export default function configureMkStyled<TIntrinsics extends keyof JSX.IntrinsicElements>(intrinsics: TIntrinsics[]) {
    type StylesObject<TKeys extends string> = { [K in TKeys]: string };

    type StyledPartiallyApplied<TKeys extends string, TInProps> = {
        <TStyledData = undefined>(...classes: ParameterType<TKeys, TStyledData>[]): StyledComponent<
            TInProps,
            TStyledData
        >;
    };

    type Styled<TKeys extends string> = StyledFn<TKeys> & StyledStatics<TKeys>;

    type StyledFn<TKeys extends string> = {
        <Tag extends React.ElementType>(tag: Tag): StyledPartiallyApplied<TKeys, PropsOf<Tag>>;
    };

    type StyledStatics<TKeys extends string> = {
        [Tag in TIntrinsics]: StyledPartiallyApplied<TKeys, JSX.IntrinsicElements[Tag]>;
    };

    type ParameterSimple<TKeys extends string> = RawStyle | TKeys | false | undefined;

    type ParameterFunction<TKeys extends string, TStyledData> = (styledData: TStyledData) => ParameterSimple<TKeys>;

    type ParameterType<TKeys extends string, TStyledData> =
        | ParameterSimple<TKeys>
        | ParameterFunction<TKeys, TStyledData>;

    function mkMapClassesToString<TKeys extends string, TProps>(styles: StylesObject<TKeys>) {
        return (c: ParameterType<TKeys, TProps>) => {
            if (c instanceof RawStyle) {
                return c.className;
            }

            if (typeof c === "string") {
                return styles[c];
            }

            return undefined;
        };
    }

    return function mkStyled<TKeys extends string>(styles: StylesObject<TKeys>): Styled<TKeys> {
        const mapClassesToString = mkMapClassesToString(styles);

        type StyledReturn<Tag extends React.ElementType> = StyledPartiallyApplied<TKeys, PropsOf<Tag>>;

        const styled = <Tag extends React.ElementType>(tag: Tag): StyledReturn<Tag> => {
            const addClasses: StyledReturn<Tag> = <TStyledData = undefined>(
                ...classes: ParameterType<TKeys, TStyledData>[]
            ): StyledComponent<PropsOf<Tag>, TStyledData> => {
                const parsedClasses = classes
                    .map(mapClassesToString)
                    .filter(Boolean)
                    .join(" ");

                const parsedFunctions = classes.filter(
                    (c): c is ParameterFunction<TKeys, TStyledData> => c instanceof Function,
                );

                const styledComponent: React.RefForwardingComponent<
                    Tag,
                    { styleData?: TStyledData; className?: string }
                > = (props, ref) => {
                    const { styleData, ...elemProps } = props;

                    const className = parsedFunctions
                        .map(c => c(styleData || ({} as any)))
                        .map(mapClassesToString)
                        .concat([elemProps.className, parsedClasses])
                        .filter(Boolean)
                        .join(" ");

                    return React.createElement(tag, { ...elemProps, className, ref });
                };
                styledComponent.displayName = `Styled(${parsedClasses})`;
                const refForwarded = (React.forwardRef(styledComponent) as any) as StyledComponent<
                    PropsOf<Tag>,
                    TStyledData
                >;

                refForwarded.withComponent = function withComponent(tag) {
                    return styled(tag)(...classes);
                };
                refForwarded.elements = function elements(o) {
                    return Object.assign({}, this, o) as any;
                };

                return refForwarded;
            };

            return addClasses;
        };

        let proxiedStyled = styled;

        if (typeof Proxy === "function") {
            proxiedStyled = new Proxy(styled, {
                get: (styled, prop) => {
                    if (
                        typeof prop === "string" &&
                        !(prop in styled) &&
                        (intrinsics as readonly string[]).includes(prop)
                    ) {
                        (styled as any)[prop] = styled(prop as any);
                    }
                    return (styled as any)[prop];
                },
            });
        } else {
            for (let styledIntrinsic of intrinsics) {
                (styled as any)[styledIntrinsic] = styled(styledIntrinsic);
            }
        }

        return proxiedStyled as Styled<TKeys>;
    };
}
