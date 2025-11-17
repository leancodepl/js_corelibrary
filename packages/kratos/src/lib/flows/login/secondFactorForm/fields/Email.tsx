import { ReactNode, useCallback } from "react"
import * as Slot from "@radix-ui/react-slot"
import { getCsrfToken, getNodeById, inputNodeAttributes } from "../../../../utils"
import { useGetLoginFlow, useUpdateLoginFlow } from "../../hooks"

type EmailProps = {
  children: ReactNode
}

export function Email({ children }: EmailProps) {
  const { mutate: updateLoginFlow } = useUpdateLoginFlow()
  const { data: loginFlow } = useGetLoginFlow()

  const continueWithEmail = useCallback(() => {
    if (!loginFlow) return

    const email = inputNodeAttributes(getNodeById(loginFlow.ui.nodes, "address"))?.value

    if (!email) return

    updateLoginFlow({
      method: "code",
      csrf_token: getCsrfToken(loginFlow),
      address: email,
    })
  }, [loginFlow, updateLoginFlow])

  const Comp = Slot.Root as React.ComponentType<any>

  return (
    <Comp type="button" onClick={continueWithEmail}>
      {children}
    </Comp>
  )
}
