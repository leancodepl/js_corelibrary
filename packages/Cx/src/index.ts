export class RawClassName {
    public className?: string;

    constructor(className?: string) {
        this.className = className;
    }
}

export function rawClassName(className?: string) {
    return new RawClassName(className);
}

type ParameterSimple<TKeys extends string> = TKeys | RawClassName | false | undefined | null;
type ParameterDictionary<TKeys extends string> = { [key in TKeys]?: boolean | undefined | null };
interface ParameterArray<TKeys extends string> extends Array<ParameterType<TKeys>> {}

type ParameterType<TKeys extends string> = ParameterSimple<TKeys> | ParameterDictionary<TKeys> | ParameterArray<TKeys>;

type StylesObject<TKeys extends string> = { [K in TKeys]: string };

export default function mkCx<TKeys extends string>(styles: StylesObject<TKeys>) {
    function mapClassToString(c: ParameterSimple<TKeys>) {
        if (c instanceof RawClassName) {
            return c.className;
        }

        if (typeof c === "string") {
            return styles[c];
        }

        return undefined;
    }

    function joinTwoClasses(left: string | undefined, right: string | undefined) {
        if (left && right) {
            return left + " " + right;
        } else if (left) {
            return left;
        } else if (right) {
            return right;
        }
        return undefined;
    }

    const f = (...classes: ParameterType<TKeys>[]): string | undefined =>
        classes.reduce((prev, c) => {
            if (Array.isArray(c)) {
                return joinTwoClasses(prev, f(...c));
            }

            if (c !== null && typeof c === "object" && !(c instanceof RawClassName)) {
                for (const key in c) {
                    if (c[key]) {
                        prev = joinTwoClasses(prev, mapClassToString(key));
                    }
                }

                return prev;
            }

            return joinTwoClasses(prev, mapClassToString(c));
        }, undefined as string | undefined);

    return f;
}
