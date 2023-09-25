// https://pkg.go.dev/github.com/ory/kratos/text#pkg-types

export enum ErrorValidationRecovery {
    ErrorValidationRecovery = 4060000,
    ErrorValidationRecoveryRetrySuccess = 4060001,
    ErrorValidationRecoveryStateFailure = 4060002,
    ErrorValidationRecoveryMissingRecoveryToken = 4060003,
    ErrorValidationRecoveryTokenInvalidOrAlreadyUsed = 4060004,
    ErrorValidationRecoveryFlowExpired = 4060005,
    ErrorValidationRecoveryCodeInvalidOrAlreadyUsed = 4060006,
}
