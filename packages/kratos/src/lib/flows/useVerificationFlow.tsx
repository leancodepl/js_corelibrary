import { useCallback, useEffect, useState } from "react"
import { FrontendApi, UpdateVerificationFlowBody, VerificationFlow } from "@ory/client"
import { AxiosError } from "axios"
import { useKratosContext } from "../kratosContext"
import { handleCancelError } from "../utils/handleCancelError"
import { flowIdParameterName, returnToParameterName } from "../utils/variables"

type RecoveryFlowSearchParams = {
    [flowIdParameterName]?: string
    [returnToParameterName]?: string
}

/**
 * Manages Kratos email/phone verification flow state and form submission.
 * 
 * Handles verification flow creation, retrieval, and submission with automatic error handling,
 * URL parameter management, and verification status tracking.
 * 
 * @param initialFlowId - Optional initial flow ID to start with
 * @param kratosClient - Configured Kratos FrontendApi client
 * @param onVerified - Callback executed when verification is successful
 * @param searchParams - URL search parameters for flow state
 * @param updateSearchParams - Function to update URL search parameters
 * @returns Object with current flow, submit function, and reset function
 * @example
 * ```typescript
 * import { useVerificationFlow } from '@leancodepl/kratos';
 * 
 * function VerifyEmailForm() {
 *   const { flow, submit, reset } = useVerificationFlow({
 *     kratosClient,
 *     onVerified: () => navigate('/dashboard'),
 *     updateSearchParams: (params) => setSearchParams(params)
 *   });
 * 
 *   return <form onSubmit={submit}>...</form>;
 * }
 * ```
 */
export function useVerificationFlow({
    initialFlowId,
    kratosClient,
    onVerified,
    searchParams = {},
    updateSearchParams,
}: {
    initialFlowId?: string
    kratosClient: FrontendApi
    onVerified: () => void
    searchParams?: RecoveryFlowSearchParams
    updateSearchParams: (searchParams: RecoveryFlowSearchParams) => void
}) {
    const { useHandleFlowError } = useKratosContext()

    const [flow, setFlow] = useState<VerificationFlow>()

    const { [flowIdParameterName]: flowId = initialFlowId, [returnToParameterName]: returnTo } = searchParams

    const resetFlow = useCallback(
        (flowId?: string) => {
            updateSearchParams({ ...searchParams, [flowIdParameterName]: flowId })

            setFlow(undefined)
        },
        [searchParams, updateSearchParams],
    )

    const reset = () => {
        resetFlow()
    }

    const handleFlowError = useHandleFlowError({
        resetFlow,
    })

    useEffect(() => {
        if (flow?.state === "passed_challenge") onVerified()
    }, [flow?.state, onVerified])

    useEffect(() => {
        if (flow) return

        const controller = new AbortController()

        if (flowId) {
            kratosClient
                .getVerificationFlow({ id: flowId }, { signal: controller.signal })
                .then(({ data }) => setFlow(data))
                .catch(handleCancelError)
                .catch(handleFlowError)
        } else {
            kratosClient
                .createBrowserVerificationFlow({ returnTo }, { signal: controller.signal })
                .then(({ data }) => setFlow(data))
                .catch(handleCancelError)
                .catch(handleFlowError)
        }

        return () => {
            controller.abort()
        }
    }, [flowId, returnTo, flow, handleFlowError, kratosClient, onVerified])

    const submit = useCallback(
        ({ body }: { body: UpdateVerificationFlowBody }) => {
            if (!flow) return

            updateSearchParams({ ...searchParams, [flowIdParameterName]: flow.id })

            return kratosClient
                .updateVerificationFlow({ flow: flow.id, updateVerificationFlowBody: body })
                .then(({ data }) => setFlow(data))
                .catch(handleFlowError)
                .catch((err: AxiosError<VerificationFlow>) => {
                    if (err.response?.status === 400) {
                        setFlow(err.response?.data)
                        return
                    }

                    return Promise.reject(err)
                })
        },
        [flow, updateSearchParams, searchParams, kratosClient, handleFlowError],
    )

    return { flow, submit, reset }
}
