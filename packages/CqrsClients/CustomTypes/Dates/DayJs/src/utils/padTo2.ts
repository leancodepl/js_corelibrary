export function padTo2(x: number) {
    let stringified = x.toFixed(0)

    if (stringified.length < 2) {
        stringified = "0" + stringified
    }

    return stringified
}
