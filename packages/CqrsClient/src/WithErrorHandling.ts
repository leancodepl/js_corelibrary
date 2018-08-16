import { ClientType } from "./ClientType";

export type ApiSuccess<TResult> = {
    readonly isSuccess: true;
    readonly result: TResult;
};

export type ApiError = {
    readonly isSuccess: false;
    readonly error: any;
};

export type ApiResponse<TResult> = ApiSuccess<TResult> | ApiError;

export type ErrorHandledOutputMapper<TOutputMapper> = {
    [K in keyof TOutputMapper]: ApiResponse<TOutputMapper[K]>;
};

export function withErrorHandling<TClientParams, TOptions, TOutputMapper extends { [K in keyof TClientParams]: any }>(
    client: ClientType<TClientParams, TOptions, TOutputMapper>) {
    let handledClient: ClientType<TClientParams, TOptions, ErrorHandledOutputMapper<TOutputMapper>> = {} as any;

    let key: keyof TClientParams;

    for (key in client) {
        const base = client[key];

        handledClient[key] = async (dto, options) => {
            try {
                const result = await base(dto, options);
                return {
                    isSuccess: true,
                    result
                };
            }
            catch (error) {
                return {
                    isSuccess: false,
                    error
                };
            }
        };
    }

    return handledClient;
}
