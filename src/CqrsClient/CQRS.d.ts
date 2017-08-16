import { LoginManager } from "@leancode/login-manager/LoginManager";
import "isomorphic-fetch";
export interface IRemoteQuery<TOutput> {
}
export interface IRemoteCommand {
}
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
export declare class MalformedRequest extends Error {
}
export declare class UnauthorizedRequest extends Error {
}
export declare class CommandQueryNotFound extends Error {
}
export declare class CommandQueryExecutionFailed extends Error {
}
export declare class CQRS {
    private cqrsEndpoint;
    private loginManager;
    constructor(cqrsEndpoint: string, loginManager?: LoginManager | undefined);
    executeQuery<TOutput>(type: string, dto: IRemoteQuery<TOutput>): Promise<TOutput>;
    executeCommand(type: string, dto: IRemoteCommand): Promise<CommandResult>;
    private makeRequest(url, dto, firstRequest);
    private prepareRequest(dto);
}
