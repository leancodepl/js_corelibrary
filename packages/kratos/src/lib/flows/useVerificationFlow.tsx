import { useCallback, useEffect, useState } from "react"
import { FrontendApi, UpdateVerificationFlowBody, VerificationFlow } from "../kratos"
import { AxiosError } from "axios"
import { useKratosContext } from "../kratosContext"
import { handleCancelError } from "../utils/handleCancelError"
import { flowIdParameterName, returnToParameterName } from "../utils/variables"

type RecoveryFlowSearchParams = {
    [flowIdParameterName]?: string
    [returnToParameterName]?: string
}

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
                .then(data => setFlow(data))
                .catch(handleCancelError)
                .catch(handleFlowError)
        } else {
            kratosClient
                .createBrowserVerificationFlow({ returnTo }, { signal: controller.signal })
                .then(data => setFlow(data))
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
                .then(data => setFlow(data))
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
