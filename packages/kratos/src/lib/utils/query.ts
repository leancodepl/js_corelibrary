export const baseQueryKey = "leancode_kratos"

export const createQueryKey = <TEntries extends string[]>(entries: TEntries) => [baseQueryKey, ...entries] as const

export const withQueryKeyPrefix = <TEntry extends string>(entry: TEntry) => `${baseQueryKey}_${entry}` as const
