import { FetchQueryOptions, QueryClient, useQuery } from "@tanstack/react-query"
import { FrontendApi, isGenericErrorResponse, isSessionAal2Required, ResponseError } from "../kratos"
import { createQueryKey, TraitsConfig, withQueryKeyPrefix } from "../utils"
import { IdentityWithTypedTraits, SessionWithTypedUserTraits } from "./types"

export type BaseSessionManagerContructorProps = {
    queryClient: QueryClient
    api: FrontendApi
}

const sessionQueryKey = createQueryKey([withQueryKeyPrefix("session_manager"), "session"])

const mkSessionQuery = <TTraitsConfig extends TraitsConfig>(api: FrontendApi) =>
    ({
        queryKey: sessionQueryKey,
        queryFn: async () => {
            try {
                return (await api.toSession()) as SessionWithTypedUserTraits<TTraitsConfig>
            } catch (error: unknown) {
                if (error instanceof ResponseError) {
                    if (error.response.status === 401) {
                        return null
                    }

                    const response = await error.response.json()

                    if (isGenericErrorResponse(response)) {
                        throw new Error("Kratos error occurred while fetching session", { cause: response })
                    }
                }

                throw new Error("Unexpected error while fetching session")
            }
        },
        staleTime: Infinity,
        retry: false,
    }) satisfies FetchQueryOptions

/**
 * Manages Ory Kratos session and identity state with React Query integration.
 *
 * @param queryClient - React Query `QueryClient` instance for caching and fetching session data
 * @param api - Ory Kratos `FrontendApi` instance for session and identity requests
 * @example
 * ```typescript
 * import { QueryClient } from "@tanstack/react-query";
 * import { FrontendApi } from "../kratos";
 * import { BaseSessionManager } from "./baseSessionManager";
 *
 * const queryClient = new QueryClient();
 * const api = new FrontendApi();
 * const sessionManager = new BaseSessionManager({ queryClient, api });
 * ```
 */
export class BaseSessionManager<TTraitsConfig extends TraitsConfig> {
    queryClient: QueryClient
    api: FrontendApi

    getSession = async (): Promise<SessionWithTypedUserTraits<TTraitsConfig> | undefined> => {
        try {
            return (await this.queryClient.fetchQuery(mkSessionQuery<TTraitsConfig>(this.api))) ?? undefined
        } catch {
            return undefined
        }
    }

    getIdentity = async (): Promise<IdentityWithTypedTraits<TTraitsConfig> | undefined> => {
        return (await this.getSession())?.identity
    }

    getUserId = async (): Promise<string | undefined> => {
        return (await this.getIdentity())?.id
    }

    isLoggedIn = async (): Promise<boolean> => {
        return (await this.getSession())?.active ?? false
    }

    useSession = () => {
        const {
            data: session,
            isLoading,
            error,
            // eslint-disable-next-line react-hooks/rules-of-hooks
        } = useQuery({
            ...mkSessionQuery<TTraitsConfig>(this.api),
            retryOnMount: false,
        })

        return {
            session: session ?? undefined,
            isLoading,
            error,
        }
    }

    useIdentity = () => {
        const { session, ...rest } = this.useSession()

        return {
            identity: session?.identity,
            ...rest,
        }
    }

    useUserId = () => {
        const { identity, ...rest } = this.useIdentity()

        return {
            userId: identity?.id,
            ...rest,
        }
    }

    useIsLoggedIn = () => {
        const { session, isLoading, error } = this.useSession()

        return {
            isLoggedIn: session?.active ?? (!isLoading ? false : undefined),
            isLoading,
            error,
        }
    }

    useIsAal2Required = () => {
        const session = this.useSession()

        return {
            isAal2Required: session.error?.cause
                ? isGenericErrorResponse(session.error.cause) && isSessionAal2Required(session.error.cause)
                : undefined,
            isLoading: session.isLoading,
        }
    }

    checkIfLoggedIn = async () => {
        return await this.queryClient.refetchQueries({
            queryKey: sessionQueryKey,
            exact: true,
        })
    }

    constructor({ queryClient, api }: BaseSessionManagerContructorProps) {
        this.api = api
        this.queryClient = queryClient
    }
}
