export function mkErrors<TError extends string>(errorNames: TError[]) {
    return errorNames.reduce((a, v) => ({ ...a, [v]: v }), {}) as { [T in TError]: T }
}
