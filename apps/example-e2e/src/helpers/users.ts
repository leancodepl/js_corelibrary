export const generateUserData = () => ({
    email: `user_${Date.now()}@tmpmail.leancode.dev`,
    password: "dupaDupa1!",
    firstName: "John",
    lastName: "Doe",
})

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
    await fetch("http://localhost:34434/admin/identities", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            credentials: {
                password: {
                    config: {
                        password,
                    },
                },
            },
            recovery_addresses: [
                {
                    created_at: "2019-08-24T14:15:22Z",
                    updated_at: "2019-08-24T14:15:22Z",
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
                    created_at: "2014-01-01T23:28:56.782Z",
                    status: "string",
                    updated_at: "2014-01-01T23:28:56.782Z",
                    value: email,
                    verified,
                    verified_at: "2019-08-24T14:15:22Z",
                    via: "email",
                },
            ],
        }),
    })
}
