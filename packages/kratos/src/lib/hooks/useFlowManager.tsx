import { useEffect, useRef } from "react"

type UseFlowManagerProps = {
    initialFlowId?: string
    isCreatingFlow: boolean
    currentFlowId: string | undefined
    onFlowRestart?: () => void
    createFlow: () => void
    setFlowId: (flowId: string | undefined) => void
}

export const useFlowManager = ({
    initialFlowId,
    isCreatingFlow,
    currentFlowId,
    onFlowRestart,
    createFlow,
    setFlowId,
}: UseFlowManagerProps) => {
    const isInitialFlowIdUsed = useRef(false)

    useEffect(() => {
        if (currentFlowId || isCreatingFlow) {
            return
        }

        if (initialFlowId && !isInitialFlowIdUsed.current) {
            isInitialFlowIdUsed.current = true
            setFlowId(initialFlowId)
        } else {
            if (isInitialFlowIdUsed.current) {
                onFlowRestart?.()
            }
            createFlow()
        }
    }, [createFlow, initialFlowId, currentFlowId, setFlowId, isCreatingFlow, onFlowRestart])

    return {
        isInitialFlowIdUsed,
    }
}
