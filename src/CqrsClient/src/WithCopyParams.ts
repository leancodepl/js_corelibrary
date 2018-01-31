import { ClientType } from "./ClientType";

export function withCopyParams<
    TClientParams extends {[key in keyof TClientResults]: object },
    TClientResults extends {[key in keyof TClientParams]: object },
    TOptions>(client: ClientType<TClientParams, TClientResults, TOptions>) {

    let clientWithParams: ClientType<TClientParams, {[key in keyof TClientResults]: { params: TClientParams[key] } & TClientResults[key]}, TOptions> = {} as any;
    let key: keyof TClientParams & keyof TClientResults;

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
