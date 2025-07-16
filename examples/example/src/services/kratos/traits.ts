export const traitsConfig = {
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

export type AuthTraitsConfig = typeof traitsConfig
