/* eslint-disable @typescript-eslint/no-explicit-any */
import { createContext, ReactNode, useContext } from "react";
import { isUiNodeInputAttributes } from "@leancodepl/auth";
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
        case 1010001: // InfoSelfServiceLogin
            return "Zaloguj się";
        case 1010002: // InfoSelfServiceLoginWith
            return "Zaloguj z ";
        case 1010003: // InfoSelfServiceLoginReAuth
            return "Prosimy, potwierdź tę akcję weryfikując swoją tożsamość";
        case 1010004: // InfoSelfServiceLoginMFA
            return "Wypełnij kolejny krok logowania";
        case 1010005: // InfoSelfServiceLoginVerify
            return "Zweryfikuj";
        case 1010006: // InfoSelfServiceLoginTOTPLabel
            return "Kod uwierzytelnienia";
        case 1010007: // InfoLoginLookupLabel
            return "Kod przywracania";
        case 1010008: // InfoSelfServiceLoginWebAuthn
            return "Wprowadź kod bezpieczeństwa";
        case 1010009: // InfoLoginTOTP
            return "Potwierdź i zaloguj się";
        case 1010010: // InfoLoginLookup
            return "Wprowadź kod przywracania";
        case 1010011: // InfoSelfServiceLoginContinueWebAuthn
            return "Kontynuuj z kodem bezpieczeństwa";
        case 1010012: // InfoSelfServiceLoginWebAuthnPasswordless
            return "Przygotuj swoje urządzenie (np. klucz bezpieczeństwa, skaner biometryczny) i kliknij przycisk Kontynuuj";
        case 1010013: // InfoSelfServiceLoginContinue
            return "Kontynuuj";

        case 1040001: // InfoSelfServiceRegistration
            return "Zarejestruj się";
        case 1040002: // InfoSelfServiceRegistrationWith
            return "Zarejestruj z";
        case 1040003: // InfoSelfServiceRegistrationContinue
            return "Kontynuuj";
        case 1040004: // InfoSelfServiceRegistrationRegisterWebAuthn
            return "Zarejestruj się z kluczem bezpieczeństwa";

        case 1050001: // InfoSelfServiceSettingsUpdateSuccess
            return "Zmiany zostały zapisane";
        case 1050002: // InfoSelfServiceSettingsUpdateLinkOidc
            return "Połącz konto";
        case 1050003: // InfoSelfServiceSettingsUpdateUnlinkOidc
            return "Odłącz konto";
        case 1050004: // InfoSelfServiceSettingsUpdateUnlinkTOTP
            return "Wyłącz weryfikację dwuetapową";
        case 1050017: // InfoSelfServiceSettingsTOTPSecretLabel
            return "Jeśli nie możesz użyć kodu QR, podaj w aplikacji ten klucz aktywacyjny:";
        case 1060001: // InfoSelfServiceRecoverySuccessful
            return "Udało Ci się odzyskać dostęp do konta. Zmień swoje hasło w poniższym formularzu.";
        case 1060002: // InfoSelfServiceRecoveryEmailSent
            return "Na podany adres e-mail wysłaliśmy Ci wiadomość z linkiem do resetowania hasła.";
        case 1060003: // InfoSelfServiceRecoveryEmailWithCodeSent
            return "Na podany przez Ciebie adres email wysłaliśmy wiadomość zawierającą kod do odzyskiwania konta.";

        case 1070001: // InfoNodeLabelInputPassword
            return "Hasło";
        case 1070002: // InfoNodeLabelGenerated
            if (attributes && isUiNodeInputAttributes(attributes)) {
                switch (attributes.name) {
                    case "traits.email":
                        return "E-mail";
                    case "traits.regulations_accepted":
                        return "Zaakceptuj regulamin i politykę prywatności";
                }
            }
            break;
        case 1070003: // InfoNodeLabelSave
            return "Zapisz";
        case 1070004: // InfoNodeLabelID
            return "Identyfikator";
        case 1070005: // InfoNodeLabelSubmit
            return "Potwierdź";
        case 1070006: // InfoNodeLabelVerifyOTP
            return "Kod potwierdzający";
        case 1070007: // InfoNodeLabelEmail
            return "E-mail";
        case 1070008: // InfoNodeLabelResendOTP
            return "Wyślij kod ponownie";
        case 1070009: // InfoNodeLabelContinue
            return "Kontynuuj";
        case 1070010: // InfoNodeLabelRecoveryCode
            return "Kod potwierdzający";
        case 1070011: // InfoNodeLabelVerificationCode
            return "Kod potwierdzający";

        case 1080001: // InfoSelfServiceVerificationEmailSent
            return "Wiadomość e-mail z linkiem weryfikacyjnym została wysłana na podany przez Ciebie adres";
        case 1080002: // InfoSelfServiceVerificationSuccessful
            return "Twój adres e-mail został potwierdzony";
        case 1080003: // InfoSelfServiceVerificationEmailWithCodeSent
            return "Wiadomość e-mail z kodem weryfikacyjnym została wysłana na podany przez Ciebie adres";

        case 4000001: // ErrorValidationGeneric
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
        case 4000002: // ErrorValidationRequired
            return "To pole jest wymagane";
        case 4000003: // ErrorValidationMinLength
            return context && "expected_length" in context
                ? `Wymagane jest minimum ${context.expected_length} znaków`
                : null;
        case 4000004: // ErrorValidationInvalidFormat
            return "Niepoprawny format danych";
        case 4000005: // ErrorValidationPasswordPolicyViolation
            return "Min. 8 znaków. Nie może być na liście haseł, które wyciekły";
        case 4000006: // ErrorValidationInvalidCredentials
            return "Nieprawidłowy adres e-mail lub hasło";
        case 4000007: // ErrorValidationDuplicateCredentials
            return "Konto z takimi danymi logowania już istnieje";
        case 4000008: // ErrorValidationTOTPVerifierWrong
            return "Podany kod weryfikacyjny jest nieprawidłowy";
        case 4000009: // ErrorValidationIdentifierMissing
            return "Nie znaleziono żadnych danych logowania";
        case 4000010: // ErrorValidationAddressNotVerified
            return "Potwierdź swój adres e-mail";
        case 4000011: // ErrorValidationNoTOTPDevice
            return "Nie wykryto żadnego urządzenia TOTP do uwierzytelnienia";
        case 4000012: // ErrorValidationLookupAlreadyUsed
            return "Kod przywracania został już wykorzystany";
        case 4000013: // ErrorValidationNoWebAuthnDevice
            return "Nie wykryto żadnego urządzenia do uwierzytelnienia";
        case 4000014: // ErrorValidationNoLookup
            return "Nie posiadasz ustawionych kodów przywracania";
        case 4000015: // ErrorValidationSuchNoWebAuthnUser
            return "Takie konto nie istnieje lub nie ma jeszcze ustawionych kodów uwierzytelnienia";
        case 4000016: // ErrorValidationLookupInvalid
            return "Kod przywracania jest niepoprawny";

        case 4060001: // ErrorValidationRecoveryRetrySuccess
            return "Zapytanie zostało już wysłane poprawnie i nie może zostać powtórzone";
        case 4060002: // ErrorValidationRecoveryStateFailure
            return "Wystąpił błąd w trakcie przywracania. Spróbuj ponownie";
        case 4060003: // ErrorValidationRecoveryMissingRecoveryToken
            return "Kod jest nieprawidłowy";
        case 4060004: // ErrorValidationRecoveryTokenInvalidOrAlreadyUsed
            return "Kod jest nieprawidłowy lub został już wykorzystany";
        case 4060005: // ErrorValidationRecoveryFlowExpired
            return "Kod wygasł";
        case 4060006: // ErrorValidationRecoveryCodeInvalidOrAlreadyUsed
            return "Kod jest nieprawidłowy lub został już wykorzystany";

        case 4070001: // ErrorValidationVerificationTokenInvalidOrAlreadyUsed
            return "Kod jest nieprawidłowy lub został już wykorzystany";
        case 4070002: // ErrorValidationVerificationRetrySuccess
            return "Zapytanie zostało już wysłane poprawnie i nie może zostać powtórzone";
        case 4070003: // ErrorValidationVerificationStateFailure
            return "Wystąpił błąd w trakcie weryfikacji. Spróbuj ponownie";
        case 4070004: // ErrorValidationVerificationMissingVerificationToken
            return "Kod jest nieprawidłowy";
        case 4070005: // ErrorValidationVerificationFlowExpired
            return "Link wygasł";
        case 4070006: // ErrorValidationVerificationCodeInvalidOrAlreadyUsed
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
