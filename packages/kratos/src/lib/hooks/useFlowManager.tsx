import { useEffect, useState } from "react"
import { GetFlowError } from "../types"

type UseFlowManagerProps = {
    initialFlowId?: string
    currentFlowId: string | undefined
    error?: Error | null
    onFlowRestart?: () => void
    createFlow: () => void
    setFlowId: (flowId: string | undefined) => void
}

export const useFlowManager = ({
    initialFlowId,
    currentFlowId,
    error,
    onFlowRestart,
    createFlow,
    setFlowId,
}: UseFlowManagerProps) => {
    const [initialFlowIdUsed, setInitialFlowIdUsed] = useState(false)
    const [prevInitialFlowId, setPrevInitialFlowId] = useState(initialFlowId)

    if (prevInitialFlowId !== initialFlowId) {
        setInitialFlowIdUsed(false)
        setPrevInitialFlowId(initialFlowId)
    }

    useEffect(() => {
        if (currentFlowId) {
            return
        }

        if (initialFlowId && !initialFlowIdUsed) {
            setFlowId(initialFlowId)
            setInitialFlowIdUsed(true)
        } else {
            createFlow()
        }
    }, [createFlow, initialFlowId, currentFlowId, setFlowId, onFlowRestart, initialFlowIdUsed])

    useEffect(() => {
        if (error && error.cause === GetFlowError.FlowRestartRequired) {
            createFlow()
            onFlowRestart?.()
        }
    }, [createFlow, error, onFlowRestart])
}
