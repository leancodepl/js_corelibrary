export function parseSearchParams(searchParams: URLSearchParams) {
    const resultObject: Record<string, string> = {}

    for (const [key, value] of searchParams.entries()) {
        resultObject[key] = value
    }

    return resultObject
}
