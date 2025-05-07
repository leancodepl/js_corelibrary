export enum InputFields {
    Password = "password",
}

export type TraitsBase = {
    [key in string]: boolean | string | undefined
}
