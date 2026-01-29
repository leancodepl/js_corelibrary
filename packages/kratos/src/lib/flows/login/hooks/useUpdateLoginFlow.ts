import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useKratosClientContext } from "../../../hooks"
import { LoginFlow, SuccessfulNativeLogin, UpdateLoginFlowBody } from "../../../kratos"
import { handleContinueWith, handleFlowError } from "../../../kratos/contrib"
import { useVerificationFlowContext } from "../../verification"
import { loginFlowKey } from "./queryKeys"
import { useLoginFlowContext } from "./useLoginFlowContext"

export function useUpdateLoginFlow() {
  const { kratosClient } = useKratosClientContext()
  const { loginFlowId, resetFlow } = useLoginFlowContext()
  const { setVerificationFlowId, setVerifiableAddress } = useVerificationFlowContext()
  const client = useQueryClient()

  return useMutation<LoginFlow | SuccessfulNativeLogin | undefined, Error, UpdateLoginFlowBody, unknown>({
    mutationFn: async updateLoginFlowBody => {
      if (!loginFlowId) throw new Error("Login flow ID is not set")
      try {
        const response = await kratosClient.updateLoginFlowRaw(
          { flow: loginFlowId, updateLoginFlowBody },
          {
            headers: { Accept: "application/json", "Content-Type": "application/json" },
          },
        )

        const data = await response.value()

        if (data && "continue_with" in data) {
          const showVerificationUI = data.continue_with?.find(e => e.action === "show_verification_ui")

          if (showVerificationUI !== undefined) {
            setVerificationFlowId(showVerificationUI.flow.id)
            setVerifiableAddress(showVerificationUI.flow.verifiable_address)
          } else {
            handleContinueWith(data.continue_with, {
              onRedirect: (url, _external) => {
                globalThis.location.href = url
              },
            })
          }
        }

        return data
      } catch (error) {
        return (await handleFlowError<LoginFlow>({
          onRedirect: (url, _external) => {
            globalThis.location.href = url
          },
          onRestartFlow: resetFlow,
          onValidationError: body => body,
        })(error)) as LoginFlow | undefined
      }
    },
    onSuccess(data) {
      if (data && "id" in data) {
        client.setQueryData(loginFlowKey(data.id), data)
      }
    },
  })
}
