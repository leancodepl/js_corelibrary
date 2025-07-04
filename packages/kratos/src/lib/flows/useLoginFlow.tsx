import { useCallback, useEffect, useState } from "react"
import { FrontendApi, LoginFlow, Session, UpdateLoginFlowBody } from "@ory/client"
import { AxiosError } from "axios"
import yn from "yn"
import { useKratosContext } from "../kratosContext"
import { handleCancelError } from "../utils/handleCancelError"
import { aalParameterName, flowIdParameterName, refreshParameterName, returnToParameterName } from "../utils/variables"

export type LoginSearchParams = {
    [flowIdParameterName]?: string
    [returnToParameterName]?: string
    [refreshParameterName]?: string
    [aalParameterName]?: string
}

/**
 * Manages Kratos login flow state and form submission.
 * 
 * Handles login flow creation, retrieval, and submission with automatic error handling,
 * URL parameter management, and session callbacks. Supports multi-factor authentication
 * and refresh flows.
 * 
 * @param kratosClient - Configured Kratos FrontendApi client
 * @param returnTo - URL to redirect after successful login
 * @param onLoggedIn - Callback executed when user successfully logs in
 * @param onSessionAlreadyAvailable - Callback when session already exists
 * @param searchParams - URL search parameters for flow state
 * @param updateSearchParams - Function to update URL search parameters
 * @returns Object with current flow and submit function
 * @example
 * ```typescript
 * import { useLoginFlow } from '@leancodepl/kratos';
 * 
 * function LoginForm() {
 *   const { flow, submit } = useLoginFlow({
 *     kratosClient,
 *     onLoggedIn: (session) => navigate('/dashboard'),
 *     updateSearchParams: (params) => setSearchParams(params)
 *   });
 * 
 *   return <form onSubmit={submit}>...</form>;
 * }
 * ```
 */
export function useLoginFlow({
    kratosClient,
    returnTo,
    onLoggedIn,
    onSessionAlreadyAvailable,
    searchParams = {},
    updateSearchParams,
}: {
    kratosClient: FrontendApi
    returnTo?: string
    onLoggedIn?: (session: Session) => void
    onSessionAlreadyAvailable?: () => void
    updateSearchParams: (searchParams: LoginSearchParams) => void
    searchParams?: LoginSearchParams
}) {
    const { useHandleFlowError } = useKratosContext()

    const [flow, setFlow] = useState<LoginFlow>()

    const {
        [flowIdParameterName]: flowId,
        [returnToParameterName]: returnToFromSearch,
        [refreshParameterName]: refresh,
        [aalParameterName]: authorizationAssuranceLevel,
    } = searchParams

    useEffect(() => {
        setFlow(undefined)
    }, [authorizationAssuranceLevel])

    const handleFlowError = useHandleFlowError({
        resetFlow: useCallback(() => {
            const { [flowIdParameterName]: _flowId, [aalParameterName]: _aal, ...newParams } = searchParams

            updateSearchParams(newParams)

            setFlow(undefined)
        }, [searchParams, updateSearchParams]),
        onSessionAlreadyAvailable,
    })

    useEffect(() => {
        if (flow) return

        const controller = new AbortController()

        if (flowId) {
            kratosClient
                .getLoginFlow({ id: flowId }, { signal: controller.signal })
                .then(({ data }) => setFlow(data))
                .catch(handleCancelError)
                .catch(handleFlowError)
        } else {
            kratosClient
                .createBrowserLoginFlow(
                    {
                        aal: authorizationAssuranceLevel,
                        refresh: yn(refresh),
                        returnTo: returnTo ?? returnToFromSearch,
                    },
                    { signal: controller.signal },
                )
                .then(({ data }) => setFlow(data))
                .catch(handleCancelError)
                .catch(handleFlowError)
        }

        return () => {
            controller.abort()
        }
    }, [
        authorizationAssuranceLevel,
        flow,
        flowId,
        handleFlowError,
        kratosClient,
        refresh,
        returnTo,
        returnToFromSearch,
    ])

    const submit = useCallback(
        ({ body }: { body: UpdateLoginFlowBody }) => {
            if (!flow) return

            updateSearchParams({ ...searchParams, [flowIdParameterName]: flow.id })

            kratosClient
                .updateLoginFlow({ flow: flow.id, updateLoginFlowBody: body })
                .then(({ data }) => {
                    if (flow.return_to) {
                        window.location.href = flow.return_to
                        return
                    }

                    onLoggedIn?.(data.session)
                })
                .catch(handleFlowError)
                .catch((err: AxiosError<LoginFlow>) => {
                    if (err.response?.status === 400) {
                        setFlow(err?.response?.data)
                        return
                    }

                    return Promise.reject(err)
                })
        },
        [flow, updateSearchParams, searchParams, kratosClient, handleFlowError, onLoggedIn],
    )

    return { flow, submit }
}
