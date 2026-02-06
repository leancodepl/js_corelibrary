import { useCallback } from "react"
import { dataTestIds } from "@example/e2e-ids"
import { createFileRoute, useNavigate } from "@tanstack/react-router"
import { z } from "zod"
import { loginFlow, verificationFlow } from "@leancodepl/kratos"
import { Input } from "../components/Input"
import { useRemoveFlowFromUrl } from "../hooks/useRemoveFlowFromUrl"
import { getErrorMessage, LoginFlow, type OidcProvidersConfig, sessionManager } from "../services/kratos"

const loginSearchSchema = z.object({
  flow: z.string().optional(),
})

const handleError: loginFlow.OnLoginFlowError = ({ target, errors }) => {
  if (target === "root") {
    alert(`Błędy formularza: ${errors.map(e => e.id).join(", ")}`)
  } else {
    alert(`Błędy pola ${target}: ${errors.map(e => e.id).join(", ")}`)
  }
}

export const Route = createFileRoute("/login")({
  component: RouteComponent,
  validateSearch: loginSearchSchema,
})

function RouteComponent() {
  const { isLoading } = sessionManager.useSession()
  const { flow } = Route.useSearch()
  const removeFlowIdFromUrl = useRemoveFlowFromUrl()
  const navigate = useNavigate()

  const handleSessionAlreadyAvailable = useCallback(() => {
    navigate({
      to: "/identity",
    })
  }, [navigate])

  if (isLoading) {
    return <p>Loading login page...</p>
  }

  return (
    <div data-testid={dataTestIds.login.page}>
      <LoginFlow
        chooseMethodForm={ChooseMethodForm}
        emailVerificationForm={EmailVerificationForm}
        initialFlowId={flow}
        loaderComponent={Loader}
        returnTo="/identity?after-login=true"
        secondFactorEmailForm={SecondFactorEmailForm}
        secondFactorForm={SecondFactorForm}
        onError={handleError}
        onFlowRestart={removeFlowIdFromUrl}
        onSessionAlreadyAvailable={handleSessionAlreadyAvailable}
      />
    </div>
  )
}

function Loader() {
  return <p>Loading login methods...</p>
}

function ChooseMethodForm(props: loginFlow.ChooseMethodFormProps<OidcProvidersConfig>) {
  const { errors, isSubmitting, isValidating, oidcProviders, isRefresh } = props

  if (isRefresh) {
    const { passwordFields, Passkey, identifier } = props

    return (
      <div data-testid={dataTestIds.login.chooseMethodForm.wrapper}>
        {identifier && (
          <h2>
            Complete login process as{" "}
            <strong data-testid={dataTestIds.login.chooseMethodForm.existingIdentifier}>{identifier}</strong>
          </h2>
        )}

        {passwordFields && (
          <>
            <passwordFields.Password>
              <Input
                data-testid={dataTestIds.login.chooseMethodForm.passwordInput}
                disabled={isSubmitting || isValidating}
                placeholder="Password"
              />
            </passwordFields.Password>
            <passwordFields.Submit>
              <button data-testid={dataTestIds.login.common.loginButton} disabled={isSubmitting || isValidating}>
                Login
              </button>
            </passwordFields.Submit>
          </>
        )}

        {oidcProviders.Google && (
          <oidcProviders.Google>
            <button
              data-testid={dataTestIds.login.chooseMethodForm.googleButton}
              disabled={isSubmitting || isValidating}>
              Sign in with Google
            </button>
          </oidcProviders.Google>
        )}

        {oidcProviders.Apple && (
          <oidcProviders.Apple>
            <button
              data-testid={dataTestIds.login.chooseMethodForm.appleButton}
              disabled={isSubmitting || isValidating}>
              Sign in with Apple
            </button>
          </oidcProviders.Apple>
        )}

        {oidcProviders.Facebook && (
          <oidcProviders.Facebook>
            <button
              data-testid={dataTestIds.login.chooseMethodForm.facebookButton}
              disabled={isSubmitting || isValidating}>
              Sign in with Facebook
            </button>
          </oidcProviders.Facebook>
        )}

        <Passkey>
          <button
            data-testid={dataTestIds.login.chooseMethodForm.passkeyButton}
            disabled={isSubmitting || isValidating}>
            Sign in with Passkey
          </button>
        </Passkey>

        {errors && errors.length > 0 && (
          <div data-testid={dataTestIds.common.errors}>
            {errors.map(error => (
              <div key={error.id}>{getErrorMessage(error)}</div>
            ))}
          </div>
        )}
      </div>
    )
  }

  const {
    passwordFields: { Identifier, Password, Submit },
    Passkey,
  } = props

  return (
    <div data-testid={dataTestIds.login.chooseMethodForm.wrapper}>
      <Identifier>
        <Input
          data-testid={dataTestIds.login.chooseMethodForm.identifierInput}
          disabled={isSubmitting || isValidating}
          placeholder="Identifier"
        />
      </Identifier>

      <Password>
        <Input
          data-testid={dataTestIds.login.chooseMethodForm.passwordInput}
          disabled={isSubmitting || isValidating}
          placeholder="Password"
        />
      </Password>

      <Submit>
        <button data-testid={dataTestIds.login.common.loginButton} disabled={isSubmitting || isValidating}>
          Login
        </button>
      </Submit>

      <p>
        Forgot password?{" "}
        <a data-testid={dataTestIds.login.chooseMethodForm.forgotPasswordLink} href="/recovery">
          Click here to reset it
        </a>
      </p>

      {oidcProviders.Google && (
        <oidcProviders.Google>
          <button data-testid={dataTestIds.login.chooseMethodForm.googleButton} disabled={isSubmitting || isValidating}>
            Sign in with Google
          </button>
        </oidcProviders.Google>
      )}

      {oidcProviders.Apple && (
        <oidcProviders.Apple>
          <button data-testid={dataTestIds.login.chooseMethodForm.appleButton} disabled={isSubmitting || isValidating}>
            Sign in with Apple
          </button>
        </oidcProviders.Apple>
      )}

      {oidcProviders.Facebook && (
        <oidcProviders.Facebook>
          <button
            data-testid={dataTestIds.login.chooseMethodForm.facebookButton}
            disabled={isSubmitting || isValidating}>
            Sign in with Facebook
          </button>
        </oidcProviders.Facebook>
      )}

      <Passkey>
        <button data-testid={dataTestIds.login.chooseMethodForm.passkeyButton} disabled={isSubmitting || isValidating}>
          Sign in with Passkey
        </button>
      </Passkey>

      {errors && errors.length > 0 && (
        <div data-testid={dataTestIds.common.errors}>
          {errors.map(error => (
            <div key={error.id}>{getErrorMessage(error)}</div>
          ))}
        </div>
      )}
    </div>
  )
}

function SecondFactorForm({
  Totp,
  Submit,
  Email,
  errors,
  isSubmitting,
  isValidating,
}: loginFlow.SecondFactorFormProps) {
  return (
    <div data-testid={dataTestIds.login.secondFactorForm.wrapper}>
      <Totp>
        <Input
          data-testid={dataTestIds.login.secondFactorForm.totpInput}
          disabled={isSubmitting || isValidating}
          placeholder="TOTP"
        />
      </Totp>

      <Submit>
        <button data-testid={dataTestIds.login.secondFactorForm.loginButton} disabled={isSubmitting || isValidating}>
          Login
        </button>
      </Submit>

      {Email && (
        <Email>
          <button
            data-testid={dataTestIds.login.secondFactorForm.continueWithEmailButton}
            disabled={isSubmitting || isValidating}>
            Continue with email
          </button>
        </Email>
      )}

      {errors && errors.length > 0 && (
        <div data-testid={dataTestIds.common.errors}>
          {errors.map(error => (
            <div key={error.id}>{getErrorMessage(error)}</div>
          ))}
        </div>
      )}
    </div>
  )
}

function SecondFactorEmailForm({
  Code,
  Submit,
  Resend,
  errors,
  isSubmitting,
  isValidating,
}: loginFlow.SecondFactorEmailFormProps) {
  return (
    <div data-testid={dataTestIds.login.secondFactorEmailForm.wrapper}>
      <Code>
        <Input
          data-testid={dataTestIds.login.secondFactorEmailForm.codeInput}
          disabled={isSubmitting || isValidating}
          placeholder="Code"
        />
      </Code>

      <Submit>
        <button data-testid={dataTestIds.login.common.loginButton} disabled={isSubmitting || isValidating}>
          Login
        </button>
      </Submit>

      <Resend>
        <button
          data-testid={dataTestIds.login.secondFactorEmailForm.resendCodeButton}
          disabled={isSubmitting || isValidating}>
          Resend code
        </button>
      </Resend>

      {errors && errors.length > 0 && (
        <div data-testid={dataTestIds.common.errors}>
          {errors.map(error => (
            <div key={error.id}>{getErrorMessage(error)}</div>
          ))}
        </div>
      )}
    </div>
  )
}

function EmailVerificationForm({
  Code,
  Submit,
  Resend,
  errors,
  isSubmitting,
  isValidating,
}: verificationFlow.EmailVerificationFormProps) {
  return (
    <div data-testid={dataTestIds.login.emailVerificationForm.wrapper}>
      <div>
        Zanim się zalogujesz, musisz zweryfikować swój adres e-mail. Sprawdź swoją skrzynkę odbiorczą i kliknij w link,
        aby zweryfikować swój adres e-mail.
      </div>

      <Code>
        <Input
          data-testid={dataTestIds.login.emailVerificationForm.codeInput}
          disabled={isSubmitting || isValidating}
          placeholder="Code"
        />
      </Code>

      <Submit>
        <button
          data-testid={dataTestIds.login.emailVerificationForm.submitButton}
          disabled={isSubmitting || isValidating}>
          Verify
        </button>
      </Submit>

      <Resend>
        <button
          data-testid={dataTestIds.login.emailVerificationForm.resendButton}
          disabled={isSubmitting || isValidating}>
          Resend code
        </button>
      </Resend>

      {errors && errors.length > 0 && (
        <div data-testid={dataTestIds.common.errors}>
          {errors.map(error => (
            <div key={error.id}>{getErrorMessage(error)}</div>
          ))}
        </div>
      )}
    </div>
  )
}
