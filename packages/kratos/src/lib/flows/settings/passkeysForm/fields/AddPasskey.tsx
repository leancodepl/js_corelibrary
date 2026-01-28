import { ComponentType, ReactNode, useCallback, useMemo } from "react"
import * as Slot from "@radix-ui/react-slot"
import {
  CommonButtonProps,
  getCsrfToken,
  getNodeById,
  inputNodeAttributes,
  passkeySettingsRegister,
} from "../../../../utils"
import { useGetSettingsFlow, useUpdateSettingsFlow } from "../../hooks"

type PasskeyProps = {
  children: ReactNode
}

export function AddPasskey({ children }: PasskeyProps) {
  const { mutateAsync: updateSettingsFlow } = useUpdateSettingsFlow()
  const { data: settingsFlow } = useGetSettingsFlow()

  const registerWithPasskeyUsingCredential = useCallback(
    async (credential: string) => {
      if (!settingsFlow) return

      await updateSettingsFlow({
        method: "passkey",
        csrf_token: getCsrfToken(settingsFlow),
        passkey_settings_register: credential,
      })
    },
    [settingsFlow, updateSettingsFlow],
  )

  const challenge = useMemo(
    () => inputNodeAttributes(getNodeById(settingsFlow?.ui.nodes, "passkey_create_data")),
    [settingsFlow?.ui.nodes],
  )

  const registerWithPasskey = useCallback(async () => {
    if (!challenge) return

    const credential = await passkeySettingsRegister(challenge.value)

    if (!credential) return

    registerWithPasskeyUsingCredential(credential)
  }, [challenge, registerWithPasskeyUsingCredential])

  const Comp: ComponentType<CommonButtonProps> = Slot.Root

  return (
    <Comp type="button" onClick={registerWithPasskey}>
      {children}
    </Comp>
  )
}
