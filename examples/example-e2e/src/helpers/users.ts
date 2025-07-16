import { faker } from "@faker-js/faker"
import { Configuration, IdentityApi } from "packages/kratos/src/lib/kratos"

export const generateEmail = () =>
    faker.internet.email({
        provider: "tmpmail.leancode.dev",
    })

export const generatePassword = () =>
    faker.internet.password({
        length: 12,
    })

export const generateFirstName = () => faker.person.firstName()

export const generateLastName = () => faker.person.lastName()

export const generateUserData = () => ({
    email: generateEmail(),
    password: generatePassword(),
    firstName: generateFirstName(),
    lastName: generateLastName(),
})

const api = new IdentityApi(
    new Configuration({
        basePath: "http://localhost:34434",
    }),
)

export const registerUser = async ({
    email,
    password,
    firstName,
    verified = true,
}: {
    email: string
    password: string
    firstName: string
    verified?: boolean
}) => {
    await api.createIdentity({
        createIdentityBody: {
            credentials: {
                password: {
                    config: {
                        password,
                    },
                },
            },
            recovery_addresses: [
                {
                    id: faker.string.uuid(),
                    created_at: new Date(),
                    updated_at: new Date(),
                    value: email,
                    via: "string",
                },
            ],
            state: "active",
            traits: {
                email,
                regulations_accepted: true,
                given_name: firstName,
            },
            verifiable_addresses: [
                {
                    created_at: new Date(),
                    status: "sent",
                    updated_at: new Date(),
                    value: email,
                    verified,
                    verified_at: verified ? new Date() : undefined,
                    via: "email",
                },
            ],
            schema_id: "user",
        },
    })
}
