import { useCallback, useEffect, useState } from "react"
import { ContinueWith, FrontendApi, SettingsFlow, UpdateSettingsFlowBody } from "../kratos"
import { AxiosError, AxiosRequestConfig } from "axios"
import { useKratosContext } from "../kratosContext"
import { handleCancelError } from "../utils/handleCancelError"
import { flowIdParameterName, returnToParameterName } from "../utils/variables"

type SettingsFlowSearchParams = {
    [flowIdParameterName]?: string
    [returnToParameterName]?: string
}

export function useSettingsFlow({
    kratosClient,
    onContinueWith,
    searchParams = {},
    updateSearchParams,
}: {
    kratosClient: FrontendApi
    onContinueWith?: (continueWith: ContinueWith[]) => void
    searchParams?: SettingsFlowSearchParams
    updateSearchParams: (searchParams: SettingsFlowSearchParams) => void
}) {
    const { useHandleFlowError } = useKratosContext()

    const [flow, setFlow] = useState<SettingsFlow>()

    const { [flowIdParameterName]: flowId, [returnToParameterName]: returnTo } = searchParams

    const handleFlowError = useHandleFlowError({
        resetFlow: useCallback(() => {
            const { [flowIdParameterName]: _flowId, ...newParams } = searchParams

            updateSearchParams(newParams)

            setFlow(undefined)
        }, [searchParams, updateSearchParams]),
    })

    useEffect(() => {
        if (flow) return

        const controller = new AbortController()

        if (flowId) {
            kratosClient
                .getSettingsFlow({ id: flowId }, { signal: controller.signal })
                .then(data => setFlow(data))
                .catch(handleCancelError)
                .catch(handleFlowError)
        } else {
            kratosClient
                .createBrowserSettingsFlow(
                    {
                        returnTo,
                    },
                    {
                        signal: controller.signal,
                    },
                )
                .then(data => setFlow(data))
                .catch(handleCancelError)
                .catch(handleFlowError)
        }

        return () => {
            controller.abort()
        }
    }, [flow, flowId, handleFlowError, kratosClient, returnTo])

    const submit = useCallback(
        ({ body }: { body: UpdateSettingsFlowBody }) => {
            if (!flow) return

            updateSearchParams({ ...searchParams, [flowIdParameterName]: flow.id })

            return kratosClient
                .updateSettingsFlow({ flow: flow.id, updateSettingsFlowBody: body })
                .then(data => {
                    if (flow.return_to) {
                        window.location.href = flow.return_to
                        return
                    }

                    setFlow(data)

                    if (data.continue_with) {
                        onContinueWith?.(data.continue_with)
                    }
                })
                .catch(handleFlowError)
                .catch((err: AxiosError<SettingsFlow>) => {
                    if (err.response?.status === 400) {
                        setFlow(err.response?.data)
                        return
                    }

                    return Promise.reject(err)
                })
        },
        [flow, updateSearchParams, searchParams, kratosClient, handleFlowError, onContinueWith],
    )

    return { flow, submit }
}
