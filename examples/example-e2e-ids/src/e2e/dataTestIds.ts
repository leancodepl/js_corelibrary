export const dataTestIds = {
    pageLayout: {
        wrapper: "wrapper",
    },

    common: {
        input: {
            errors: "input-errors",
        },

        checkbox: {
            errors: "checkbox-errors",
        },

        errors: "errors",
    },

    userInfoHeader: {
        header: "header",
        headerLoading: "header-loading",
        headerNotLoggedIn: "header-not-logged-in",
        headerLoggedIn: "header-logged-in",
        logoutButton: "logout-button",
    },

    identity: {
        page: "identity-page",
        loading: "loading-message",
        notLoggedIn: "not-logged-in-message",
        userId: "user-id",
        email: "email",
        firstName: "first-name",
    },

    login: {
        page: "login-page",

        common: {
            loginButton: "login-button",
        },

        chooseMethodForm: {
            wrapper: "choose-method-form",
            existingIdentifier: "existing-identifier",
            identifierInput: "identifier-input",
            passwordInput: "password-input",
            forgotPasswordLink: "forgot-password-link",
            googleButton: "google-button",
            appleButton: "apple-button",
            facebookButton: "facebook-button",
            passkeyButton: "passkey-button",
        },

        secondFactorForm: {
            wrapper: "second-factor-form",
            totpInput: "totp-input",
            loginButton: "login-button",
            continueWithEmailButton: "continue-with-email-button",
        },

        secondFactorEmailForm: {
            wrapper: "second-factor-email-form",
            codeInput: "second-factor-code-input",
            resendCodeButton: "resend-code-button",
        },

        emailVerificationForm: {
            wrapper: "email-verification-form",
            codeInput: "email-verification-code-input",
            submitButton: "email-verification-button",
            resendButton: "email-verification-resend-button",
        },
    },

    recovery: {
        page: "recovery-page",

        emailForm: {
            wrapper: "email-form",
            emailInput: "email-input",
            submitButton: "email-submit-button",
        },

        codeForm: {
            wrapper: "code-form",
            codeInput: "code-input",
            submitButton: "code-submit-button",
        },

        newPasswordForm: {
            wrapper: "new-password-form",
            newPasswordInput: "new-password-input",
            newPasswordConfirmationInput: "new-password-confirmation-input",
            submitButton: "new-password-submit-button",
        },
    },

    registration: {
        page: "registration-page",
        alreadyLoggedIn: "already-logged-in",

        common: {
            registerButton: "register-button",
        },

        traitsForm: {
            wrapper: "traits-form",
            emailInput: "email-input",
            givenNameInput: "given-name-input",
            regulationsCheckbox: "regulations-checkbox",
            registerButton: "register-button",
            googleButton: "google-signup-button",
            appleButton: "apple-signup-button",
            facebookButton: "facebook-signup-button",
        },

        chooseMethodForm: {
            wrapper: "choose-method-form",
            returnButton: "return-button",
            passwordInput: "password-input",
            passwordConfirmationInput: "password-confirmation-input",
            registerButton: "register-button",
            passkeyButton: "passkey-signup-button",
        },

        emailVerificationForm: {
            wrapper: "email-verification-form",
            codeInput: "email-verification-code-input",
            submitButton: "email-verification-submit-button",
            resendButton: "email-verification-resend-button",
        },
    },

    settings: {
        page: "settings-page",
        loading: "settings-loading",
        notLoggedIn: "settings-not-logged-in",

        traitsForm: {
            wrapper: "traits-form",
            loading: "traits-form-loading",
            emailVerificationRequiredInfo: "email-verification-required-info",
            emailInput: "email-input",
            givenNameInput: "given-name-input",
            updateButton: "traits-form-update-button",
            errors: "traits-form-errors",
        },

        newPasswordForm: {
            wrapper: "new-password-form",
            loading: "new-password-form-loading",
            passwordInput: "new-password-input",
            passwordConfirmationInput: "new-password-confirmation-input",
            submitButton: "new-password-form-submit-button",
            errors: "new-password-form-errors",
        },

        passkeysForm: {
            wrapper: "passkeys-form",
            loading: "passkeys-form-loading",
            addNewButton: "add-new-passkey-button",
            existingPasskeys: "existing-passkeys",
            existingPasskey: "existing-passkey",
            removeButton: "remove-passkey-button",
        },

        totpForm: {
            wrapperLinked: "totp-form-linked",
            wrapperUnlinked: "totp-form-unlinked",
            loading: "totp-form-loading",
            secretKey: "totp-secret-key",
            codeInput: "totp-code-input",
            verifyButton: "verify-totp-button",
            unlinkButton: "unlink-totp-button",
            errors: "totp-form-errors",
        },

        oidcForm: {
            wrapper: "oidc-form",
            appleButton: "apple-oidc-button",
            facebookButton: "facebook-oidc-button",
            googleButton: "google-oidc-button",
        },
    },

    verification: {
        page: "verification-page",

        emailVerificationForm: {
            wrapper: "email-verification-form",
            codeInput: "verification-code-input",
            submitButton: "verify-button",
            resendButton: "resend-code-button",
        },
    },
}
