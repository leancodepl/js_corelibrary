export type ClientType<TClientParams extends {[key in keyof TClientResults]: any }, TClientResults extends {[key in keyof TClientParams]: any }, TOptions = void> = {
    [P in (keyof TClientParams & keyof TClientResults)]: (dto: TClientParams[P], additionalOptions?: TOptions) => Promise<TClientResults[P]>;
};
