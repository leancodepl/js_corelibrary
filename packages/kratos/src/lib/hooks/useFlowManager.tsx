import { useEffect, useState } from "react"
import { GetFlowError } from "../types"
import { useKratosSessionContext } from "./useKratosSessionContext"

type UseFlowManagerProps = {
    initialFlowId?: string
    currentFlowId: string | undefined
    error?: Error | null
    onFlowRestart?: () => void
    createFlow: () => void
    setFlowId: (flowId: string | undefined) => void
    waitForSession?: boolean
}

export const useFlowManager = ({
    initialFlowId,
    currentFlowId,
    error,
    onFlowRestart,
    createFlow,
    setFlowId,
    waitForSession,
}: UseFlowManagerProps) => {
    const [initialFlowIdUsed, setInitialFlowIdUsed] = useState(false)
    const [prevInitialFlowId, setPrevInitialFlowId] = useState(initialFlowId)
    const { sessionManager } = useKratosSessionContext()
    const { isLoading } = sessionManager.useSession()

    if (prevInitialFlowId !== initialFlowId) {
        setInitialFlowIdUsed(false)
        setPrevInitialFlowId(initialFlowId)
    }

    const shouldWait = !!waitForSession && isLoading

    useEffect(() => {
        if (currentFlowId || shouldWait) {
            return
        }

        if (initialFlowId && !initialFlowIdUsed) {
            setFlowId(initialFlowId)
            setInitialFlowIdUsed(true)
        } else {
            createFlow()
        }
    }, [createFlow, currentFlowId, initialFlowId, initialFlowIdUsed, setFlowId, shouldWait])

    useEffect(() => {
        if (error && error.cause === GetFlowError.FlowRestartRequired) {
            createFlow()
            onFlowRestart?.()
        }
    }, [createFlow, error, onFlowRestart])
}
