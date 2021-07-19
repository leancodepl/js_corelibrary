export default function ensureDefined<T>(value: T | undefined, message?: string) {
    if (value === undefined) {
        throw new Error(message ?? "Value must be defined");
    }

    return value;
}
