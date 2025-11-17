import { ComponentType, ReactNode, useCallback } from "react"
import * as Slot from "@radix-ui/react-slot"
import { CommonButtonProps, getCsrfToken } from "../../../../utils"
import { useGetSettingsFlow, useUpdateSettingsFlow } from "../../hooks"

type UnlinkProps = {
  children: ReactNode
}

export function Unlink({ children }: UnlinkProps) {
  const { mutateAsync: updateSettingsFlow } = useUpdateSettingsFlow()
  const { data: settingsFlow } = useGetSettingsFlow()

  const unlinkTotp = useCallback(async () => {
    if (!settingsFlow) return

    await updateSettingsFlow({
      method: "totp",
      csrf_token: getCsrfToken(settingsFlow),
      totp_unlink: true,
    })
  }, [settingsFlow, updateSettingsFlow])

  const Comp: ComponentType<CommonButtonProps> = Slot.Root

  return (
    <Comp type="button" onClick={unlinkTotp}>
      {children}
    </Comp>
  )
}
