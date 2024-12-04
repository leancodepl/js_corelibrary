// https://pkg.go.dev/github.com/ory/kratos/text#pkg-types

export enum ErrorValidationLogin {
    ErrorValidationLogin = 4010000,
    ErrorValidationLoginFlowExpired = 4010001,
    ErrorValidationLoginNoStrategyFound = 4010002,
    ErrorValidationRegistrationNoStrategyFound = 4010003,
    ErrorValidationSettingsNoStrategyFound = 4010004,
    ErrorValidationRecoveryNoStrategyFound = 4010005,
    ErrorValidationVerificationNoStrategyFound = 4010006,
    ErrorValidationLoginRetrySuccess = 4010007,
    ErrorValidationLoginCodeInvalidOrAlreadyUsed = 4010008,
    ErrorValidationLoginLinkedCredentialsDoNotMatch = 4010009,
    ErrorValidationLoginAddressUnknown = 4010010,
}
