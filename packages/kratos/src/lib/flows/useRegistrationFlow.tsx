import { useCallback, useEffect, useState } from "react"
import { ContinueWith, FrontendApi, RegistrationFlow, UpdateRegistrationFlowBody } from "@ory/client"
import { AxiosError } from "axios"
import { useKratosContext } from "../kratosContext"
import { handleCancelError } from "../utils/handleCancelError"
import { flowIdParameterName, returnToParameterName } from "../utils/variables"

type RegistrationFlowSearchParams = {
    [flowIdParameterName]?: string
    [returnToParameterName]?: string
}

export function useRegisterFlow({
    kratosClient,
    onSessionAlreadyAvailable,
    onContinueWith,
    searchParams = {},
    updateSearchParams,
}: {
    kratosClient: FrontendApi
    onSessionAlreadyAvailable: () => void
    onContinueWith?: (continueWith: ContinueWith[]) => void
    searchParams?: RegistrationFlowSearchParams
    updateSearchParams: (searchParams: RegistrationFlowSearchParams) => void
}) {
    const { useHandleFlowError } = useKratosContext()

    const [flow, setFlow] = useState<RegistrationFlow>()
    const [isRegistered, setIsRegistered] = useState(false)

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
                .getRegistrationFlow({ id: flowId }, { signal: controller.signal })
                .then(({ data }) => setFlow(data))
                .catch(handleCancelError)
                .catch(handleFlowError)
        } else {
            kratosClient
                .createBrowserRegistrationFlow({ returnTo }, { signal: controller.signal })
                .then(({ data }) => setFlow(data))
                .catch(handleCancelError)
                .catch(handleFlowError)
        }

        return () => {
            controller.abort()
        }
    }, [flowId, returnTo, flow, handleFlowError, kratosClient])

    const submit = useCallback(
        ({ body }: { body: UpdateRegistrationFlowBody }) => {
            if (!flow) return

            updateSearchParams({ ...searchParams, [flowIdParameterName]: flow.id })

            return kratosClient
                .updateRegistrationFlow({ flow: flow.id, updateRegistrationFlowBody: body })
                .then(data => {
                    setIsRegistered(true)

                    if (data.data.continue_with) {
                        onContinueWith?.(data.data.continue_with)
                    }
                })
                .catch(handleFlowError)
                .catch((err: AxiosError<RegistrationFlow>) => {
                    if (err.response?.status === 400) {
                        setFlow(err.response?.data)
                        return
                    }

                    return Promise.reject(err)
                })
        },
        [flow, updateSearchParams, searchParams, kratosClient, handleFlowError, onContinueWith],
    )

    return { flow, submit, isRegistered }
}
