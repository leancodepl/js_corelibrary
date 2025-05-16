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

const { RegistrationFlow, LoginFlow, LogoutButton } = mkKratos(traitsConfig)

export { RegistrationFlow, LoginFlow, LogoutButton }
export type AuthTraitsConfig = typeof traitsConfig
