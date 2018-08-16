import { ClientType } from "./ClientType";

export type CopyParamsOutputMapper<TClientParams, TOutputMapper extends { [K in keyof TOutputMapper]: any }, > = {
    [K in keyof TClientParams]: { params: TClientParams[K] } & TOutputMapper[K]
};

export function withCopyParams<TClientParams, TOptions, TOutputMapper extends { [K in keyof TClientParams]: any }>(
    client: ClientType<TClientParams, TOptions, TOutputMapper>) {
    let clientWithParams: ClientType<TClientParams, TOptions, CopyParamsOutputMapper<TClientParams, TOutputMapper>> = {} as any;

    let key: keyof TClientParams;

    for (key in client) {
        const base = client[key];

        clientWithParams[key] = (dto, options) =>
            base(dto, options)
                .then(result => ({
                    params: dto,
                    ...(result as any)
                }));
    }

    return clientWithParams;
}
