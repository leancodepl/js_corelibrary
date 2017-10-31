import { LoginManager, CannotRefreshToken } from "@leancode/login-manager/LoginManager";
import "isomorphic-fetch";

export interface IRemoteQuery<TOutput> { }
export interface IRemoteCommand { }

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

export class MalformedRequest extends Error { }
export class UnauthorizedRequest extends Error { }
export class CommandQueryNotFound extends Error { }
export class CommandQueryExecutionFailed extends Error {}

export class CQRS {
    public constructor(
        private cqrsEndpoint: string,
        private loginManager?: LoginManager) {
    }

    public executeQuery<TOutput>(type: string, dto: IRemoteQuery<TOutput>): Promise<TOutput> {
        const path = this.cqrsEndpoint + "/query/" + type;
        return this.makeRequest(path, dto, true);
    }

    public executeCommand(type: string, dto: IRemoteCommand): Promise<CommandResult> {
        const path = this.cqrsEndpoint + "/command/" + type;
        return this.makeRequest(path, dto, true);
    }

    private async makeRequest(url: string, dto: any, firstRequest: boolean): Promise<any> {
        let init = await this.prepareRequest(dto);
        let result = await fetch(url, init);

        // 422 UnprocessableEntity means that command validation failed
        if (!result.ok && result.status !== 422) {
            if (result.status === 400) {
                console.error("The request was malformed");
                throw new MalformedRequest("The request was malformed");
            }
            if (result.status === 401) {
                if (this.loginManager) {
                    if (firstRequest) {
                        if (!await this.loginManager.tryRefreshToken()) {
                            throw new CannotRefreshToken("Cannot refresh access token after the server returned 401 Unauthorized");
                        }
                        return await this.makeRequest(url, dto, false);
                    } else {
                        throw new UnauthorizedRequest("The request has not been authorized and token refresh did not help");
                    }
                }
                else {
                    throw new UnauthorizedRequest("User need to be authenticated to execute the command/query");
                }
            }
            if (result.status === 403) {
                throw new UnauthorizedRequest("User is not authorized to execute the command/query");
            }
            if (result.status === 404) {
                throw new CommandQueryNotFound("Command/query not found");
            }
            throw new CommandQueryExecutionFailed(`Cannot execute command/query, server returned a ${result.status} code`);
        }
        return await result.json();
    }

    private async prepareRequest(dto: any): Promise<RequestInit> {
        let headers = new Headers();
        headers.append("Content-Type", "application/json");

        if (this.loginManager && this.loginManager.isSigned) {
            let token = await this.loginManager.getToken();
            headers.append("Authorization", "Bearer " + token);
        }

        return {
            method: "POST",
            body: JSON.stringify(dto),
            headers: headers
        };
    }
}
