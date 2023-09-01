export type ApiBinaryRaw = string;

class _ApiBinary {
    private _!: never;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ApiBinary extends _ApiBinary {}

export function toRaw(apiBinary: ApiBinary) {
    return apiBinary as unknown as ApiBinaryRaw;
}

export function fromRaw(apiBinaryRaw: ApiBinaryRaw) {
    return apiBinaryRaw as unknown as ApiBinary;
}
