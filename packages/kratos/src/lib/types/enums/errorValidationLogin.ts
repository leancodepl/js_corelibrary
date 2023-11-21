// https://pkg.go.dev/github.com/ory/kratos/text#pkg-types

export enum ErrorValidationLogin {
    ErrorValidationLogin = 4010000,
    ErrorValidationLoginFlowExpired = 4010001,
    ErrorValidationLoginNoStrategyFound = 4010002,
    ErrorValidationRegistrationNoStrategyFound = 4010003,
    ErrorValidationSettingsNoStrategyFound = 4010004,
    ErrorValidationRecoveryNoStrategyFound = 4010005,
    ErrorValidationVerificationNoStrategyFound = 4010006,
}
