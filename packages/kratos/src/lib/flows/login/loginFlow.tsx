import { ComponentType, useEffect, useMemo } from "react"
import { useFlowManager, useKratosSessionContext } from "../../hooks"
import { isSessionAlreadyAvailable } from "../../kratos"
import { OidcProvidersConfig } from "../../utils"
import {
  EmailVerificationFormProps,
  useVerificationFlowContext,
  VerificationFlowProvider,
  VerificationFlowWrapper,
} from "../verification"
import { ChooseMethodFormProps, ChooseMethodFormWrapper } from "./chooseMethodForm"
import { LoginFlowProvider, useCreateLoginFlow, useGetLoginFlow, useLoginFlowContext } from "./hooks"
import { SecondFactorEmailFormProps, SecondFactorEmailFormWrapper } from "./secondFactorEmailForm"
import { SecondFactorFormProps, SecondFactorFormWrapper } from "./secondFactorForm"
import { OnLoginFlowError } from "./types"

export type LoginFlowProps<TOidcProvidersConfig extends OidcProvidersConfig = []> = {
  loaderComponent?: ComponentType
  chooseMethodForm: ComponentType<ChooseMethodFormProps<TOidcProvidersConfig>>
  secondFactorForm: ComponentType<SecondFactorFormProps>
  secondFactorEmailForm: ComponentType<SecondFactorEmailFormProps>
  emailVerificationForm: ComponentType<EmailVerificationFormProps>
  initialFlowId?: string
  returnTo?: string
  onError?: OnLoginFlowError
  onLoginSuccess?: () => void
  onVerificationSuccess?: () => void
  onFlowRestart?: () => void
  onSessionAlreadyAvailable?: () => void
}

function LoginFlowWrapper<TOidcProvidersConfig extends OidcProvidersConfig = []>({
  loaderComponent: LoaderComponent,
  chooseMethodForm: ChooseMethodForm,
  secondFactorForm: SecondFactorForm,
  secondFactorEmailForm: SecondFactorEmailForm,
  emailVerificationForm: EmailVerificationForm,
  initialFlowId,
  returnTo,
  onError,
  onLoginSuccess,
  onVerificationSuccess,
  onFlowRestart,
  onSessionAlreadyAvailable,
}: LoginFlowProps<TOidcProvidersConfig>) {
  const { loginFlowId, setLoginFlowId } = useLoginFlowContext()
  const { verificationFlowId } = useVerificationFlowContext()
  const { sessionManager } = useKratosSessionContext()
  const { isAal2Required } = sessionManager.useIsAal2Required()

  const { mutate: createLoginFlow, error: createLoginFlowError } = useCreateLoginFlow({
    returnTo,
    aal: isAal2Required ? "aal2" : undefined,
  })
  const { data: loginFlow, error: getLoginFlowError } = useGetLoginFlow()

  useFlowManager({
    initialFlowId,
    currentFlowId: loginFlowId,
    error: getLoginFlowError ?? undefined,
    onFlowRestart,
    createFlow: createLoginFlow,
    setFlowId: setLoginFlowId,
    waitForSession: true,
  })

  const isSessionAvailable = useMemo(
    () => isSessionAlreadyAvailable(createLoginFlowError) || isSessionAlreadyAvailable(getLoginFlowError),
    [createLoginFlowError, getLoginFlowError],
  )

  useEffect(() => {
    if (isSessionAvailable) {
      onSessionAlreadyAvailable?.()
    }
  }, [isSessionAvailable, onSessionAlreadyAvailable])

  const step = useMemo(() => {
    if (isSessionAvailable) return "invalid"

    if (!loginFlow) return "loader"

    if (verificationFlowId) return "verifyEmail"

    if (loginFlow.state === "choose_method") {
      if (loginFlow.requested_aal === "aal1") return "chooseMethod"
      if (loginFlow.requested_aal === "aal2") return "secondFactor"
    }

    if (loginFlow.state === "sent_email") return "secondFactorEmail"

    throw new Error("Invalid login flow state")
  }, [loginFlow, verificationFlowId, isSessionAvailable])

  const isRefresh = useMemo(() => loginFlow?.refresh, [loginFlow])

  return (
    <>
      {step === "loader" && LoaderComponent && <LoaderComponent />}
      {step === "chooseMethod" && (
        <ChooseMethodFormWrapper
          chooseMethodForm={ChooseMethodForm}
          isRefresh={isRefresh}
          onError={onError}
          onLoginSuccess={onLoginSuccess}
        />
      )}
      {step === "secondFactor" && (
        <SecondFactorFormWrapper
          isRefresh={isRefresh}
          secondFactorForm={SecondFactorForm}
          onError={onError}
          onLoginSuccess={onLoginSuccess}
        />
      )}
      {step === "secondFactorEmail" && (
        <SecondFactorEmailFormWrapper
          secondFactorForm={SecondFactorEmailForm}
          onError={onError}
          onLoginSuccess={onLoginSuccess}
        />
      )}
      {step === "verifyEmail" && (
        <VerificationFlowWrapper
          emailVerificationForm={EmailVerificationForm}
          onError={onError}
          onVerificationSuccess={onVerificationSuccess}
        />
      )}
    </>
  )
}

/**
 * Renders a complete login flow with multi-step authentication support.
 *
 * Handles login method selection, second-factor authentication, email verification,
 * and session management. Provides context for managing flow state and transitions
 * between different authentication steps.
 *
 * @param props - Configuration and component props for the login flow
 * @param props.loaderComponent - Optional component to display during loading states
 * @param props.chooseMethodForm - React component for login method selection
 * @param props.secondFactorForm - React component for second factor authentication
 * @param props.secondFactorEmailForm - React component for email-based second factor
 * @param props.emailVerificationForm - React component for email verification process
 * @param props.initialFlowId - Optional existing login flow ID to resume
 * @param props.returnTo - Optional URL to redirect after successful login
 * @param props.onError - Optional callback for handling login flow errors
 * @param props.onLoginSuccess - Optional callback triggered after successful login
 * @param props.onVerificationSuccess - Optional callback triggered after email verification
 * @param props.onFlowRestart - Optional callback triggered when flow restarts due to expiration
 * @param props.onSessionAlreadyAvailable - Optional callback triggered when user is already authenticated
 * @returns JSX element containing the complete login flow interface
 * @example
 * ```tsx
 * import { LoginFlow } from '@leancodepl/kratos';
 *
 * function App() {
 *   return (
 *     <LoginFlow
 *       chooseMethodForm={ChooseMethodForm}
 *       secondFactorForm={SecondFactorForm}
 *       secondFactorEmailForm={SecondFactorEmailForm}
 *       emailVerificationForm={EmailVerificationForm}
 *       onLoginSuccess={() => navigate('/dashboard')}
 *       onSessionAlreadyAvailable={() => navigate('/dashboard')}
 *     />
 *   );
 * }
 * ```
 */
export function LoginFlow<TOidcProvidersConfig extends OidcProvidersConfig = []>(props: LoginFlowProps<TOidcProvidersConfig>) {
  return (
    <VerificationFlowProvider>
      <LoginFlowProvider>
        <LoginFlowWrapper {...props} />
      </LoginFlowProvider>
    </VerificationFlowProvider>
  )
}
