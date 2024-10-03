import { PathMatch } from "react-router-dom"

export function useKeyByRoute<TKey extends string>(
    routeMatches: Record<TKey, (PathMatch | null)[] | never | PathMatch | null>,
) {
    const keys: TKey[] = []
    for (const key in routeMatches) {
        const matches = routeMatches[key]

        if (Array.isArray(matches) ? matches.some(match => match !== null) : matches !== null) {
            keys.push(key)
        }
    }
    return keys
}
