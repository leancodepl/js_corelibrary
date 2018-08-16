export class RemoteQuery<TContext, TOutput> { private _: TOutput; }
export class RemoteCommand<TContext> { private _: TContext; }

export interface IRemoteQuery<TContext, TOutput> extends RemoteQuery<TContext, TOutput> { }
export interface IRemoteCommand<TContext> extends RemoteCommand<TContext> { }

export type Break<T> = { [K in keyof T]: T[K] };

export interface ValidationError {
    readonly PropertyName: string;
    readonly ErrorMessage: string;
    readonly AttemptedValue: any;
    readonly ErrorCode: number;
}

export interface CommandResult {
    readonly WasSuccessful: boolean;
    readonly ValidationErrors: ReadonlyArray<ValidationError>;
}

export type BaseOutputMapper<TClientType> = {
    [K in keyof TClientType]:
    (TClientType[K]) extends IRemoteQuery<any, infer TOutput> ? TOutput :
    (TClientType[K]) extends IRemoteCommand<any> ? CommandResult : never
};

export type ClientType<TClientType, TOptions = never, TOutputMapper extends { [key in keyof TClientType]: any } = BaseOutputMapper<TClientType>> = {
    [K in keyof TClientType]: (dto: Break<TClientType[K]>, additionalOptions?: TOptions) => Promise<TOutputMapper[K]>;
};
