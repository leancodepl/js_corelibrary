import { useCallback, useEffect, useState } from "react"
import { FrontendApi, LoginFlow, Session, UpdateLoginFlowBody } from "@ory/client"
import { AxiosError } from "axios"
import { omit } from "lodash"
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
            const newParams = omit({ ...searchParams }, [flowIdParameterName, aalParameterName])

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
