export class RemoteQuery<TOutput> { protected _: TOutput; }
export class RemoteCommand { }

export interface IRemoteQuery<TOutput> extends RemoteQuery<TOutput> { }
export interface IRemoteCommand extends RemoteCommand { }

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
    (TClientType[K]) extends IRemoteQuery<infer TOutput> ? TOutput :
    (TClientType[K]) extends IRemoteCommand ? CommandResult : never
};

export type ClientType<TClientType, TOptions = never, TOutputMapper extends { [key in keyof TClientType]: any } = BaseOutputMapper<TClientType>> = {
    [K in keyof TClientType]: (dto: Break<TClientType[K]>, additionalOptions?: TOptions) => Promise<TOutputMapper[K]>;
};
