export const generatePassword = (length = 12) => {
    const lowLettersCharset = "abcdefghijklmnopqrstuvwxyz"
    const highLettersCharset = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    const numbersCharset = "0123456789"
    const specialCharsCharset = "!@#$%^&*()_+[]{}|;:,.<>?`~"

    const allChars = lowLettersCharset + highLettersCharset + numbersCharset + specialCharsCharset

    if (length < 4) {
        throw new Error("Password length must be at least 4 to include all character types.")
    }

    const getRandomChar = (charset: string) => charset[Math.floor(Math.random() * charset.length)]

    // Ensure at least one character from each charset
    const passwordChars = [
        getRandomChar(lowLettersCharset),
        getRandomChar(highLettersCharset),
        getRandomChar(numbersCharset),
        getRandomChar(specialCharsCharset),
    ]

    // Fill the rest with random characters from all charsets
    for (let i = 4; i < length; i++) {
        passwordChars.push(getRandomChar(allChars))
    }

    // Shuffle the result to avoid predictable positions
    for (let i = passwordChars.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[passwordChars[i], passwordChars[j]] = [passwordChars[j], passwordChars[i]]
    }

    return passwordChars.join("")
}

export const generateEmail = () => `user_${Date.now()}@tmpmail.leancode.dev`
export const generateFirstName = () => `FirstName_${Date.now()}`
export const generateLastName = () => `LastName_${Date.now()}`

export const generateUserData = () => ({
    email: generateEmail(),
    password: generatePassword(),
    firstName: generateFirstName(),
    lastName: generateLastName(),
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
