export function parseSearchParams(search: string) {
    const resultObject: Record<string, string> = {};
    const searchParams = new URLSearchParams(search);

    for (const [key, value] of searchParams.entries()) {
        resultObject[key] = value;
    }

    return resultObject;
}
