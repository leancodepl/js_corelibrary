import { ApiError, ApiResponse, ApiSuccess, CommandResult, TokenProvider } from "@leancode/cqrs-client-base";
import { handleResponse } from "@leancode/validation";
import axios, { AxiosRequestConfig, AxiosResponse } from "axios";

function createSuccess<TResult>(result: TResult): ApiSuccess<TResult> {
    return {
        isSuccess: true,
        result,
    };
}

function createError(error: any): ApiError {
    return {
        isSuccess: false,
        error,
    };
}

export default function mkCqrsClient(cqrsEndpoint: string, tokenProvider: TokenProvider) {
    const apiAxios = axios.create({
        baseURL: cqrsEndpoint,
    });

    apiAxios.interceptors.request.use(async config => {
        const token = await tokenProvider.getToken();

        if (token) {
            config.headers["Authorization"] = `Bearer ${token}`;
        }

        return config;
    });

    apiAxios.interceptors.response.use(
        response => {
            response.data = createSuccess(response.data);

            return response;
        },
        async (error: { response: AxiosResponse; config: AxiosRequestConfig }) => {
            const response = error.response;

            switch (error.response.status) {
                case 401: {
                    const config = error.config;

                    if (config.params?.isRetry) {
                        response.data = createError(
                            "The request has not been authorized and token refresh did not help",
                        );
                        break;
                    }
                    if (!tokenProvider.invalidateToken) {
                        response.data = createError("User need to be authenticated to execute the command/query");
                        break;
                    }
                    if (!(await tokenProvider.invalidateToken())) {
                        response.data = createError(
                            "Cannot refresh access token after the server returned 401 Unauthorized",
                        );
                        break;
                    }

                    config.params = error.config.params || {};
                    config.params.isRetry = true;

                    return await apiAxios.request(config);
                }
                case 400:
                    response.data = createError("The request was malformed");
                    break;
                case 403:
                    response.data = createError("User is not authorized to execute the command/query");
                    break;
                case 404:
                    response.data = createError("Command query not found");
                    break;
                case 422:
                    response.data = createSuccess(error.response.data);
                    break;
                default:
                    response.data = createError(
                        `Cannot execute command/query, server returned a ${error.response.status} code`,
                    );
                    break;
            }
            return response;
        },
    );

    return {
        createQuery<TQuery, TResult>(type: string) {
            return (dto: TQuery) => apiAxios.post<ApiResponse<TResult>>("query/" + type, dto).then(r => r.data);
        },
        createCommand<TCommand, TErrorCodes extends { [name: string]: number }>(
            type: string,
            errorCodesMap: TErrorCodes,
        ) {
            async function call(dto: TCommand) {
                const response = await apiAxios.post<ApiResponse<CommandResult<TErrorCodes>>>("command/" + type, dto);
                return response.data;
            }

            call.handle = (dto: TCommand) => call(dto).then(response => handleResponse(response, errorCodesMap));

            return call;
        },
    };
}
