import { useCallback, useEffect, useState } from "react"
import { ContinueWith, FrontendApi, RecoveryFlow, UpdateRecoveryFlowBody } from "../kratos"
import { AxiosError } from "axios"
import { useKratosContext } from "../kratosContext"
import { handleCancelError } from "../utils/handleCancelError"
import { flowIdParameterName, returnToParameterName } from "../utils/variables"

type RecoveryFlowSearchParams = {
    [flowIdParameterName]?: string
    [returnToParameterName]?: string
}

export function useRecoveryFlow({
    kratosClient,
    onSessionAlreadyAvailable,
    onContinueWith,
    searchParams = {},
    updateSearchParams,
}: {
    kratosClient: FrontendApi
    onSessionAlreadyAvailable: () => void
    onContinueWith?: (continueWith: ContinueWith[]) => void
    searchParams?: RecoveryFlowSearchParams
    updateSearchParams: (searchParams: RecoveryFlowSearchParams) => void
}) {
    const { useHandleFlowError } = useKratosContext()

    const [flow, setFlow] = useState<RecoveryFlow>()

    const { [flowIdParameterName]: flowId, [returnToParameterName]: returnTo } = searchParams

    const handleFlowError = useHandleFlowError({
        resetFlow: useCallback(() => {
            const { [flowIdParameterName]: _flowId, ...newParams } = searchParams

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
                .getRecoveryFlow({ id: flowId }, { signal: controller.signal })
                .then(data => setFlow(data))
                .catch(handleCancelError)
                .catch(handleFlowError)
            return
        } else {
            kratosClient
                .createBrowserRecoveryFlow({ returnTo }, { signal: controller.signal })
                .then(data => setFlow(data))
                .catch(handleCancelError)
                .catch(handleFlowError)
        }

        return () => {
            controller.abort()
        }
    }, [flowId, returnTo, flow, handleFlowError, kratosClient])

    const submit = useCallback(
        ({ body }: { body: UpdateRecoveryFlowBody }) => {
            if (!flow) return

            updateSearchParams({ ...searchParams, [flowIdParameterName]: flow.id })

            return kratosClient
                .updateRecoveryFlow({ flow: flow.id, updateRecoveryFlowBody: body })
                .then(data => {
                    setFlow(data)

                    if (data.continue_with) {
                        onContinueWith?.(data.continue_with)
                    }
                })
                .catch(handleFlowError)
                .catch((err: AxiosError<RecoveryFlow>) => {
                    if (err.response?.status === 400) {
                        setFlow(err.response?.data)
                        return
                    }

                    return Promise.reject(err)
                })
        },
        [flow, updateSearchParams, searchParams, kratosClient, handleFlowError, onContinueWith],
    )

    return { flow, submit, isRecovering: flow?.state === "sent_email" }
}
