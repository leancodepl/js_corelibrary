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

export function withErrorHandling<
    TClientParams extends {[key in keyof TClientResults]: object },
    TClientResults extends {[key in keyof TClientParams]: object },
    TOptions>(client: ClientType<TClientParams, TClientResults, TOptions>) {

    let handledClient: ClientType<TClientParams, {[key in keyof TClientResults]: ApiResponse<TClientResults[key]>}, TOptions> = {} as any;
    let key: keyof TClientParams & keyof TClientResults;

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
