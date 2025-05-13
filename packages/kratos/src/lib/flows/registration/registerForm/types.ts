export enum InputFields {
    Password = "password",
    PasswordConfirmation = "password_confirmation",
}

export type TraitsBase = {
    [key in string]: boolean | string | undefined
}
