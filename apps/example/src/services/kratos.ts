import { mkKratos } from "@leancodepl/kratos"

const traitsConfig = {
    Email: {
        trait: "email",
        type: "string",
    },
    GivenName: {
        trait: "given_name",
        type: "string",
    },
    RegulationsAccepted: {
        trait: "regulations_accepted",
        type: "boolean",
    },
} as const

const { RegistrationFlow, LoginFlow, useLogout } = mkKratos(traitsConfig)

export { RegistrationFlow, LoginFlow, useLogout }
export type AuthTraitsConfig = typeof traitsConfig
