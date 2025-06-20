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

        const result = {
            session: session ?? undefined,
            isLoading,
            error,
        }

        return result
    }

    useIdentity = () => {
        const { session, isLoading, error } = this.useSession()

        return {
            identity: session?.identity,
            isLoading,
            error,
        }
    }

    useUserId = () => {
        const { identity, isLoading, error } = this.useIdentity()

        return {
            userId: identity?.id,
            isLoading,
            error,
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
