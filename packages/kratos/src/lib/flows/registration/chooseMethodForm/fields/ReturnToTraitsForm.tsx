import { ReactNode, useCallback } from "react"
import * as Slot from "@radix-ui/react-slot"
import { useRegistrationFlowContext } from "../../hooks"

type ReturnToTraitsFormProps = {
    children: ReactNode
}

export function ReturnToTraitsForm({ children }: ReturnToTraitsFormProps) {
    const { setTraitsFormCompleted } = useRegistrationFlowContext()

    const goReturnToTraitsForm = useCallback(() => {
        setTraitsFormCompleted(false)
    }, [setTraitsFormCompleted])

    const Comp = Slot.Root as React.ComponentType<any>

    return (
        <Comp type="button" onClick={goReturnToTraitsForm}>
            {children}
        </Comp>
    )
}
