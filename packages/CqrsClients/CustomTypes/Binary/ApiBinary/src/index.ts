export type ApiBinaryRaw = string;

class _ApiBinary {
    private _!: never;
}

export default interface ApiBinary extends _ApiBinary {}

export function toRaw(apiBinary: ApiBinary) {
    return apiBinary as unknown as ApiBinaryRaw;
}

export function fromRaw(apiBinaryRaw: ApiBinaryRaw) {
    return apiBinaryRaw as unknown as ApiBinary;
}
