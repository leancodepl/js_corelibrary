import { ComponentType } from "react"
import { useFlowManager } from "../../hooks/useFlowManager"
import { EmailVerificationFormProps, EmailVerificationFormWrapper } from "./emailVerificationForm"
import {
  useCreateVerificationFlow,
  useGetVerificationFlow,
  useVerificationFlowContext,
  VerificationFlowProvider,
} from "./hooks"
import { OnVerificationFlowError } from "./types"

export type VerificationFlowProps = {
  emailVerificationForm: ComponentType<EmailVerificationFormProps>
  initialFlowId?: string
  initialVerifiableAddress?: string
  returnTo?: string
  onError?: OnVerificationFlowError
  onVerificationSuccess?: () => void
  onFlowRestart?: () => void
}

/**
 * Renders email verification flow with provider context and flow management.
 *
 * @param emailVerificationForm - Component to render the verification form UI
 * @param initialFlowId - Optional flow ID to initialize with existing flow
 * @param initialVerifiableAddress - Optional email address to pre-populate
 * @param returnTo - Optional URL to redirect to after successful verification
 * @param onError - Optional callback for handling verification errors
 * @param onVerificationSuccess - Optional callback for successful verification
 * @param onFlowRestart - Optional callback when flow needs to restart
 * @returns JSX element with verification flow provider and wrapper
 * @example
 * ```tsx
 * import { VerificationFlow } from "@leancodepl/kratos";
 *
 * function MyVerificationPage() {
 *   return (
 *     <VerificationFlow
 *       emailVerificationForm={EmailForm}
 *       initialVerifiableAddress="user@example.com"
 *       onVerificationSuccess={() => navigate("/dashboard")}
 *       onError={(error) => console.error("Verification failed:", error)}
 *     />
 *   );
 * }
 * ```
 */
export function VerificationFlow(props: VerificationFlowProps) {
  return (
    <VerificationFlowProvider>
      <VerificationFlowWrapper {...props} />
    </VerificationFlowProvider>
  )
}

export function VerificationFlowWrapper({
  emailVerificationForm: EmailVerificationForm,
  initialFlowId,
  initialVerifiableAddress,
  returnTo,
  onError,
  onVerificationSuccess,
  onFlowRestart,
}: VerificationFlowProps) {
  const { verificationFlowId, setVerificationFlowId, verifiableAddress, setVerifiableAddress } =
    useVerificationFlowContext()

  const { error } = useGetVerificationFlow()
  const { mutate: createVerificationFlow } = useCreateVerificationFlow({
    returnTo,
  })

  useFlowManager({
    initialFlowId,
    currentFlowId: verificationFlowId,
    error,
    onFlowRestart,
    createFlow: createVerificationFlow,
    setFlowId: setVerificationFlowId,
  })

  if (!verifiableAddress && initialVerifiableAddress) {
    setVerifiableAddress(initialVerifiableAddress)
  }

  return (
    <EmailVerificationFormWrapper
      emailVerificationForm={EmailVerificationForm}
      onError={onError}
      onVerificationSuccess={onVerificationSuccess}
    />
  )
}
