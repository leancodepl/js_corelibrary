import { ComponentType, useEffect, useMemo } from "react"
import { useFlowManager } from "../../hooks"
import { isSessionAlreadyAvailable } from "../../kratos"
import { OidcProvidersConfig, TraitsConfig } from "../../utils"
import {
  EmailVerificationFormProps,
  useVerificationFlowContext,
  VerificationFlowProvider,
  VerificationFlowWrapper,
} from "../verification"
import { ChooseMethodFormProps, ChooseMethodFormWrapper } from "./chooseMethodForm"
import {
  RegistrationFlowProvider,
  useCreateRegistrationFlow,
  useGetRegistrationFlow,
  useRegistrationFlowContext,
} from "./hooks"
import { TraitsFormProps, TraitsFormWrapper } from "./traitsForm"
import { OnRegistrationFlowError } from "./types"

export type RegistrationFlowProps<
  TTraitsConfig extends TraitsConfig,
  TOidcProvidersConfig extends OidcProvidersConfig = readonly []
> = {
  traitsConfig: TTraitsConfig
  oidcProvidersConfig?: TOidcProvidersConfig
  traitsForm: ComponentType<TraitsFormProps<TTraitsConfig, TOidcProvidersConfig>>
  chooseMethodForm: ComponentType<ChooseMethodFormProps>
  emailVerificationForm: ComponentType<EmailVerificationFormProps>
  initialFlowId?: string
  returnTo?: string
  onError?: OnRegistrationFlowError<TTraitsConfig>
  onRegistrationSuccess?: () => void
  onVerificationSuccess?: () => void
  onFlowRestart?: () => void
  onSessionAlreadyAvailable?: () => void
}

function RegistrationFlowWrapper<
  TTraitsConfig extends TraitsConfig,
  TOidcProvidersConfig extends OidcProvidersConfig = readonly []
>({
  traitsConfig,
  oidcProvidersConfig,
  traitsForm: TraitsForm,
  chooseMethodForm: ChooseMethodForm,
  emailVerificationForm: EmailVerificationForm,
  initialFlowId,
  returnTo,
  onError,
  onRegistrationSuccess,
  onVerificationSuccess,
  onFlowRestart,
  onSessionAlreadyAvailable,
}: RegistrationFlowProps<TTraitsConfig, TOidcProvidersConfig>) {
  const { verificationFlowId } = useVerificationFlowContext()
  const { registrationFlowId, setRegistrationFlowId, traitsFormCompleted } = useRegistrationFlowContext()

  const { error: getRegistrationFlowError } = useGetRegistrationFlow()
  const { mutate: createRegistrationFlow, error: createRegistrationFlowError } = useCreateRegistrationFlow({
    returnTo,
  })

  useFlowManager({
    initialFlowId,
    currentFlowId: registrationFlowId,
    error: getRegistrationFlowError ?? undefined,
    onFlowRestart,
    createFlow: createRegistrationFlow,
    setFlowId: setRegistrationFlowId,
  })

  const isSessionAvailable = useMemo(
    () => isSessionAlreadyAvailable(getRegistrationFlowError) || isSessionAlreadyAvailable(createRegistrationFlowError),
    [getRegistrationFlowError, createRegistrationFlowError],
  )

  useEffect(() => {
    if (isSessionAvailable) {
      onSessionAlreadyAvailable?.()
    }
  }, [isSessionAvailable, onSessionAlreadyAvailable])

  const step = useMemo(() => {
    if (isSessionAvailable) return "invalid"
    if (verificationFlowId) return "emailVerification"
    if (traitsFormCompleted) return "credentials"
    return "traits"
  }, [traitsFormCompleted, verificationFlowId, isSessionAvailable])

  return (
    <>
      {step === "traits" && (
        <TraitsFormWrapper
          traitsConfig={traitsConfig}
          oidcProvidersConfig={oidcProvidersConfig}
          traitsForm={TraitsForm}
          onError={onError}
          onRegistrationSuccess={onRegistrationSuccess}
        />
      )}
      {step === "credentials" && (
        <ChooseMethodFormWrapper
          chooseMethodForm={ChooseMethodForm}
          onError={onError}
          onRegistrationSuccess={onRegistrationSuccess}
        />
      )}
      {step === "emailVerification" && (
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
 * Provides a complete registration flow with step-by-step form handling and verification.
 *
 * Manages the user registration process through multiple steps: traits collection,
 * credentials selection, and optional email verification. Automatically handles flow
 * transitions and error states.
 *
 * @template TTraitsConfig - Configuration type for user traits schema
 * @param props - Registration flow configuration and form components
 * @param props.traitsConfig - Configuration defining user traits schema and validation
 * @param props.traitsForm - React component for collecting user traits (name, email, etc.)
 * @param props.chooseMethodForm - React component for selecting authentication method
 * @param props.emailVerificationForm - React component for email verification process
 * @param props.initialFlowId - Optional existing flow ID to resume registration
 * @param props.returnTo - Optional URL to redirect after successful registration
 * @param props.onError - Optional callback for handling registration flow errors
 * @param props.onRegistrationSuccess - Optional callback triggered after successful registration
 * @param props.onVerificationSuccess - Optional callback triggered after email verification
 * @param props.onFlowRestart - Optional callback triggered when flow restarts due to expiration
 * @param props.onSessionAlreadyAvailable - Optional callback triggered when user is already authenticated
 * @returns React component that renders the appropriate registration step
 * @example
 * ```tsx
 * import { RegistrationFlow } from '@leancodepl/kratos';
 *
 * const traitsConfig = { Email: { trait: "email", type: "string", }, GivenName: { trait: "given_name", type: "string", } } as const;
 *
 * function App() {
 *   return (
 *     <RegistrationFlow
 *       traitsConfig={traitsConfig}
 *       traitsForm={UserTraitsForm}
 *       chooseMethodForm={MethodSelectionForm}
 *       emailVerificationForm={EmailVerifyForm}
 *       onRegistrationSuccess={() => console.log('Registration completed')}
 *       onVerificationSuccess={() => console.log('Email verified')}
 *     />
 *   );
 * }
 * ```
 */
export function RegistrationFlow<
  TTraitsConfig extends TraitsConfig,
  TOidcProvidersConfig extends OidcProvidersConfig = readonly []
>(props: RegistrationFlowProps<TTraitsConfig, TOidcProvidersConfig>) {
  return (
    <VerificationFlowProvider>
      <RegistrationFlowProvider>
        <RegistrationFlowWrapper {...props} />
      </RegistrationFlowProvider>
    </VerificationFlowProvider>
  )
}
