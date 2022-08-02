export default function padTo2(x?: number) {
    const stringified = x?.toFixed(0) ?? "0";

    return stringified.padStart(2, "0");
}
