type PrefixWith<T, TPrefix extends string> = { [K in keyof T as K extends string ? `${TPrefix}${K}` : never]: T[K] }

export function addPrefix<T extends object, TPrefix extends string>(object: T, prefix: TPrefix) {
    return Object.fromEntries(Object.entries(object).map(([key, value]) => [`${prefix}${key}`, value])) as PrefixWith<
        T,
        TPrefix
    >
}
