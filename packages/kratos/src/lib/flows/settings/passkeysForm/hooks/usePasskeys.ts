import { useCallback, useMemo } from "react"
import { getCsrfToken, getNodeById, inputNodeAttributes, passkeySettingsRegister } from "../../../../utils"
import { useGetSettingsFlow, useUpdateSettingsFlow } from "../../hooks"

export const usePasskeys = () => {
  const { mutateAsync: updateSettingsFlow, isPending } = useUpdateSettingsFlow()
  const { data: settingsFlow } = useGetSettingsFlow()

  const removePasskey = useCallback(
    async (passkeyId: string) => {
      if (isPending) {
        return
      }

      if (!settingsFlow) {
        throw new Error("Settings flow is not available")
      }

      await updateSettingsFlow({
        method: "passkey",
        csrf_token: getCsrfToken(settingsFlow),
        passkey_remove: passkeyId,
      })
    },
    [isPending, settingsFlow, updateSettingsFlow],
  )

  const addNewPasskeyUsingCredential = useCallback(
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

  const addNewPasskey = useCallback(async () => {
    if (isPending) return

    if (!challenge) return

    const credential = await passkeySettingsRegister(challenge.value)

    if (!credential) return

    await addNewPasskeyUsingCredential(credential)
  }, [isPending, challenge, addNewPasskeyUsingCredential])

  return {
    isPending,
    removePasskey,
    addNewPasskey,
  }
}
