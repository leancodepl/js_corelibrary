import { CannotRefreshToken, LoginManager } from "@leancode/login-manager";
import "whatwg-fetch";
import { ApiResponse, CommandResult, IRemoteCommand, IRemoteQuery } from "./ClientType";

export class MalformedRequest extends Error {
    constructor(m: string) {
        super(m);
        Object.setPrototypeOf(this, MalformedRequest.prototype);
    }
}

export class UnauthorizedRequest extends Error {
    constructor(m: string) {
        super(m);
        Object.setPrototypeOf(this, UnauthorizedRequest.prototype);
    }
}

export class ForbiddenRequest extends Error {
    constructor(m: string) {
        super(m);
        Object.setPrototypeOf(this, ForbiddenRequest.prototype);
    }
}

export class CommandQueryNotFound extends Error {
    constructor(m: string) {
        super(m);
        Object.setPrototypeOf(this, CommandQueryNotFound.prototype);
    }
}

export class CommandQueryExecutionFailed extends Error {
    constructor(m: string) {
        super(m);
        Object.setPrototypeOf(this, CommandQueryExecutionFailed.prototype);
    }
}

export class CQRS {
    public constructor(private cqrsEndpoint: string, private loginManager?: LoginManager) {}

    public executeQuery<TResult>(type: string, dto: IRemoteQuery<TResult>): Promise<ApiResponse<TResult>> {
        const path = this.cqrsEndpoint + "/query/" + type;

        return this.checkForError(path, dto);
    }

    public executeCommand<TErrorCodes extends { [name: string]: number }>(
        type: string,
        dto: IRemoteCommand,
    ): Promise<ApiResponse<CommandResult<TErrorCodes>>> {
        const path = this.cqrsEndpoint + "/command/" + type;

        return this.checkForError(path, dto);
    }

    private async checkForError(path: string, dto: any): Promise<ApiResponse<any>> {
        try {
            const result = await this.makeRequest(path, dto, true);
            return {
                isSuccess: true,
                result,
            };
        } catch (error) {
            return {
                isSuccess: false,
                error,
            };
        }
    }

    private async makeRequest(url: string, dto: any, firstRequest: boolean): Promise<any> {
        const init = await this.prepareRequest(dto);
        const result = await fetch(url, init);

        // 422 UnprocessableEntity means that command validation failed
        if (!result.ok && result.status !== 422) {
            if (result.status === 400) {
                console.error("The request was malformed");
                throw new MalformedRequest("The request was malformed");
            }
            if (result.status === 401) {
                if (this.loginManager) {
                    if (firstRequest) {
                        if (!(await this.loginManager.tryRefreshToken())) {
                            throw new CannotRefreshToken(
                                "Cannot refresh access token after the server returned 401 Unauthorized",
                            );
                        }
                        return await this.makeRequest(url, dto, false);
                    } else {
                        throw new UnauthorizedRequest(
                            "The request has not been authorized and token refresh did not help",
                        );
                    }
                } else {
                    throw new UnauthorizedRequest("User need to be authenticated to execute the command/query");
                }
            }
            if (result.status === 403) {
                throw new ForbiddenRequest("User is not authorized to execute the command/query");
            }
            if (result.status === 404) {
                throw new CommandQueryNotFound("Command/query not found");
            }
            throw new CommandQueryExecutionFailed(
                `Cannot execute command/query, server returned a ${result.status} code`,
            );
        }
        return await result.json();
    }

    private async prepareRequest(dto: any): Promise<RequestInit> {
        const headers = new Headers();
        headers.append("Content-Type", "application/json");

        if (this.loginManager && (await this.loginManager.isSigned())) {
            const token = await this.loginManager.getToken();
            headers.append("Authorization", "Bearer " + token);
        }

        return {
            method: "POST",
            body: JSON.stringify(dto),
            headers: headers,
        };
    }
}
