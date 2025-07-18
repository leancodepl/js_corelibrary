export type TraitsConfig = Record<string, { trait: string; type: "boolean" | "string" }>

export const traitPrefix = "traits." as const
