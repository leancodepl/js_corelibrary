function transformFirst(value: string, transformFn: (value: string) => string) {
    if (value.length === 0) {
        return "";
    }

    return transformFn(value[0]) + value.slice(1);
}

export function toLowerFirst(value: string) {
    return transformFirst(value, value => value.toLowerCase());
}

export function toUpperFirst<TValue extends string>(value: TValue) {
    return transformFirst(value, value => value.toUpperCase()) as Capitalize<TValue>;
}
