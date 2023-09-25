import { createContext, ReactNode, useContext } from "react";
import {
    ErrorValidation,
    ErrorValidationRecovery,
    ErrorValidationVerification,
    InfoNodeLabel,
    InfoSelfServiceLogin,
    InfoSelfServiceRecovery,
    InfoSelfServiceRegistration,
    InfoSelfServiceSettings,
    InfoSelfServiceVerification,
    isUiNodeInputAttributes,
} from "@leancodepl/kratos";
import { UiNodeInputAttributes, UiNodeTextAttributes, UiText } from "@ory/kratos-client";

type UiMessageProps = {
    text?: UiText;
    attributes?: UiNodeInputAttributes | UiNodeTextAttributes;
};

export function UiMessage({ text, attributes }: UiMessageProps) {
    const customUiMessage = useContext(customUiMessageContext);

    return <>{uiMessageRenderer({ attributes, customUiMessage, text })}</>;
}

export function uiMessageRenderer({
    text,
    attributes,
    customUiMessage,
}: UiMessageProps & { customUiMessage?: CustomUiMessage }): ReactNode {
    if (customUiMessage) {
        return customUiMessage({ attributes, text, uiMessage: uiMessageContent });
    }

    return uiMessageContent({ attributes, text });
}

// https://pkg.go.dev/github.com/ory/kratos/text#pkg-types
function uiMessageContent({ text: uiText, attributes }: UiMessageProps): ReactNode {
    if (!uiText) return null;

    const { id, text, context } = uiText;

    switch (id) {
        case InfoSelfServiceLogin.InfoSelfServiceLogin:
            return "Zaloguj się";
        case InfoSelfServiceLogin.InfoSelfServiceLoginWith:
            return "Zaloguj z ";
        case InfoSelfServiceLogin.InfoSelfServiceLoginReAuth:
            return "Prosimy, potwierdź tę akcję weryfikując swoją tożsamość";
        case InfoSelfServiceLogin.InfoSelfServiceLoginMFA:
            return "Wypełnij kolejny krok logowania";
        case InfoSelfServiceLogin.InfoSelfServiceLoginVerify:
            return "Zweryfikuj";
        case InfoSelfServiceLogin.InfoSelfServiceLoginTOTPLabel:
            return "Kod uwierzytelnienia";
        case InfoSelfServiceLogin.InfoLoginLookupLabel:
            return "Kod przywracania";
        case InfoSelfServiceLogin.InfoSelfServiceLoginWebAuthn:
            return "Wprowadź kod bezpieczeństwa";
        case InfoSelfServiceLogin.InfoLoginTOTP:
            return "Potwierdź i zaloguj się";
        case InfoSelfServiceLogin.InfoLoginLookup:
            return "Wprowadź kod przywracania";
        case InfoSelfServiceLogin.InfoSelfServiceLoginContinueWebAuthn:
            return "Kontynuuj z kodem bezpieczeństwa";
        case InfoSelfServiceLogin.InfoSelfServiceLoginWebAuthnPasswordless:
            return "Przygotuj swoje urządzenie (np. klucz bezpieczeństwa, skaner biometryczny) i kliknij przycisk Kontynuuj";
        case InfoSelfServiceLogin.InfoSelfServiceLoginContinue:
            return "Kontynuuj";

        case InfoSelfServiceRegistration.InfoSelfServiceRegistration:
            return "Zarejestruj się";
        case InfoSelfServiceRegistration.InfoSelfServiceRegistrationWith:
            return "Zarejestruj z";
        case InfoSelfServiceRegistration.InfoSelfServiceRegistrationContinue:
            return "Kontynuuj";
        case InfoSelfServiceRegistration.InfoSelfServiceRegistrationRegisterWebAuthn:
            return "Zarejestruj się z kluczem bezpieczeństwa";

        case InfoSelfServiceSettings.InfoSelfServiceSettingsUpdateSuccess:
            return "Zmiany zostały zapisane";
        case InfoSelfServiceSettings.InfoSelfServiceSettingsUpdateLinkOidc:
            return "Połącz konto";
        case InfoSelfServiceSettings.InfoSelfServiceSettingsUpdateUnlinkOidc:
            return "Odłącz konto";
        case InfoSelfServiceSettings.InfoSelfServiceSettingsUpdateUnlinkTOTP:
            return "Wyłącz weryfikację dwuetapową";
        case InfoSelfServiceSettings.InfoSelfServiceSettingsTOTPSecretLabel:
            return "Jeśli nie możesz użyć kodu QR, podaj w aplikacji ten klucz aktywacyjny:";
        case InfoSelfServiceRecovery.InfoSelfServiceRecoverySuccessful:
            return "Udało Ci się odzyskać dostęp do konta. Zmień swoje hasło w poniższym formularzu.";
        case InfoSelfServiceRecovery.InfoSelfServiceRecoveryEmailSent:
            return "Na podany adres e-mail wysłaliśmy Ci wiadomość z linkiem do resetowania hasła.";
        case InfoSelfServiceRecovery.InfoSelfServiceRecoveryEmailWithCodeSent:
            return "Na podany przez Ciebie adres email wysłaliśmy wiadomość zawierającą kod do odzyskiwania konta.";

        case InfoNodeLabel.InfoNodeLabelInputPassword:
            return "Hasło";
        case InfoNodeLabel.InfoNodeLabelGenerated:
            if (attributes && isUiNodeInputAttributes(attributes)) {
                switch (attributes.name) {
                    case "traits.email":
                        return "E-mail";
                    case "traits.regulations_accepted":
                        return "Zaakceptuj regulamin i politykę prywatności";
                }
            }
            break;
        case InfoNodeLabel.InfoNodeLabelSave:
            return "Zapisz";
        case InfoNodeLabel.InfoNodeLabelID:
            return "Identyfikator";
        case InfoNodeLabel.InfoNodeLabelSubmit:
            return "Potwierdź";
        case InfoNodeLabel.InfoNodeLabelVerifyOTP:
            return "Kod potwierdzający";
        case InfoNodeLabel.InfoNodeLabelEmail:
            return "E-mail";
        case InfoNodeLabel.InfoNodeLabelResendOTP:
            return "Wyślij kod ponownie";
        case InfoNodeLabel.InfoNodeLabelContinue:
            return "Kontynuuj";
        case InfoNodeLabel.InfoNodeLabelRecoveryCode:
            return "Kod potwierdzający";
        case InfoNodeLabel.InfoNodeLabelVerificationCode:
            return "Kod potwierdzający";

        case InfoSelfServiceVerification.InfoSelfServiceVerificationEmailSent:
            return "Wiadomość e-mail z linkiem weryfikacyjnym została wysłana na podany przez Ciebie adres";
        case InfoSelfServiceVerification.InfoSelfServiceVerificationSuccessful:
            return "Twój adres e-mail został potwierdzony";
        case InfoSelfServiceVerification.InfoSelfServiceVerificationEmailWithCodeSent:
            return "Wiadomość e-mail z kodem weryfikacyjnym została wysłana na podany przez Ciebie adres";

        case ErrorValidation.ErrorValidationGeneric:
            if (attributes && isUiNodeInputAttributes(attributes)) {
                switch (attributes.name) {
                    case "traits.regulations_accepted":
                        return "Musisz potwierdzić Regulamin i Politykę prywatności";
                }
            }

            switch (uiText.text) {
                case "The request was submitted too often. Please request another code.":
                    return "Niepoprawny kod został wpisany zbyt wiele razy. Podaj email ponownie, aby wygenerować nowy kod";
            }

            return "Pole ma niepoprawny format";
        case ErrorValidation.ErrorValidationRequired:
            return "To pole jest wymagane";
        case ErrorValidation.ErrorValidationMinLength:
            return context && "expected_length" in context
                ? `Wymagane jest minimum ${context.expected_length} znaków`
                : null;
        case ErrorValidation.ErrorValidationInvalidFormat:
            return "Niepoprawny format danych";
        case ErrorValidation.ErrorValidationPasswordPolicyViolation:
            return "Min. 8 znaków. Nie może być na liście haseł, które wyciekły";
        case ErrorValidation.ErrorValidationInvalidCredentials:
            return "Nieprawidłowy adres e-mail lub hasło";
        case ErrorValidation.ErrorValidationDuplicateCredentials:
            return "Konto z takimi danymi logowania już istnieje";
        case ErrorValidation.ErrorValidationTOTPVerifierWrong:
            return "Podany kod weryfikacyjny jest nieprawidłowy";
        case ErrorValidation.ErrorValidationIdentifierMissing:
            return "Nie znaleziono żadnych danych logowania";
        case ErrorValidation.ErrorValidationAddressNotVerified:
            return "Potwierdź swój adres e-mail";
        case ErrorValidation.ErrorValidationNoTOTPDevice:
            return "Nie wykryto żadnego urządzenia TOTP do uwierzytelnienia";
        case ErrorValidation.ErrorValidationLookupAlreadyUsed:
            return "Kod przywracania został już wykorzystany";
        case ErrorValidation.ErrorValidationNoWebAuthnDevice:
            return "Nie wykryto żadnego urządzenia do uwierzytelnienia";
        case ErrorValidation.ErrorValidationNoLookup:
            return "Nie posiadasz ustawionych kodów przywracania";
        case ErrorValidation.ErrorValidationSuchNoWebAuthnUser:
            return "Takie konto nie istnieje lub nie ma jeszcze ustawionych kodów uwierzytelnienia";
        case ErrorValidation.ErrorValidationLookupInvalid:
            return "Kod przywracania jest niepoprawny";

        case ErrorValidationRecovery.ErrorValidationRecoveryRetrySuccess:
            return "Zapytanie zostało już wysłane poprawnie i nie może zostać powtórzone";
        case ErrorValidationRecovery.ErrorValidationRecoveryStateFailure:
            return "Wystąpił błąd w trakcie przywracania. Spróbuj ponownie";
        case ErrorValidationRecovery.ErrorValidationRecoveryMissingRecoveryToken:
            return "Kod jest nieprawidłowy";
        case ErrorValidationRecovery.ErrorValidationRecoveryTokenInvalidOrAlreadyUsed:
            return "Kod jest nieprawidłowy lub został już wykorzystany";
        case ErrorValidationRecovery.ErrorValidationRecoveryFlowExpired:
            return "Kod wygasł";
        case ErrorValidationRecovery.ErrorValidationRecoveryCodeInvalidOrAlreadyUsed:
            return "Kod jest nieprawidłowy lub został już wykorzystany";

        case ErrorValidationVerification.ErrorValidationVerificationTokenInvalidOrAlreadyUsed:
            return "Kod jest nieprawidłowy lub został już wykorzystany";
        case ErrorValidationVerification.ErrorValidationVerificationRetrySuccess:
            return "Zapytanie zostało już wysłane poprawnie i nie może zostać powtórzone";
        case ErrorValidationVerification.ErrorValidationVerificationStateFailure:
            return "Wystąpił błąd w trakcie weryfikacji. Spróbuj ponownie";
        case ErrorValidationVerification.ErrorValidationVerificationMissingVerificationToken:
            return "Kod jest nieprawidłowy";
        case ErrorValidationVerification.ErrorValidationVerificationFlowExpired:
            return "Link wygasł";
        case ErrorValidationVerification.ErrorValidationVerificationCodeInvalidOrAlreadyUsed:
            return "Podany kod jest niepoprawny lub został już użyty. Spróbuj ponownie";
    }

    // eslint-disable-next-line react/jsx-no-useless-fragment
    return <>{text}</>;
}

export type CustomUiMessageParams = {
    text?: UiText;
    attributes?: UiNodeInputAttributes | UiNodeTextAttributes;
    uiMessage: typeof uiMessageContent;
};

export type CustomUiMessage = (params: CustomUiMessageParams) => ReactNode;

const customUiMessageContext = createContext<CustomUiMessage | undefined>(undefined);

type CustomGetMessageProviderProps = {
    uiMessage?: CustomUiMessage;
    children?: ReactNode;
};

export function CustomGetMessageProvider({ uiMessage, children }: CustomGetMessageProviderProps) {
    // eslint-disable-next-line react/jsx-no-useless-fragment
    if (!uiMessage) return <>{children}</>;

    return <customUiMessageContext.Provider value={uiMessage}>{children}</customUiMessageContext.Provider>;
}

export function useCustomUiMessageContext() {
    return useContext(customUiMessageContext);
}
