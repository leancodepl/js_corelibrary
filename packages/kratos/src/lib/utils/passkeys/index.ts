import { traitPrefix } from "../../flows/registration/config"

function isPasskeySupported() {
    return !!window.PublicKeyCredential
}

type PasskeyCredentialOptions = {
    publicKey: {
        rp: {
            name: string
            id: string
        }
        user: PublicKeyCredentialUserEntityJSON
        challenge: string
        pubKeyCredParams: PublicKeyCredentialParameters[]
        timeout: number
        authenticatorSelection: {
            authenticatorAttachment: AuthenticatorAttachment
            requireResidentKey: boolean
            residentKey: ResidentKeyRequirement
            userVerification: UserVerificationRequirement
        }
    }
}

type PasskeyChallenge = {
    publicKey: {
        challenge: string
        timeout: number
        rpId: string
        userVerification: UserVerificationRequirement
    }
}

type PasskeyCreateData = {
    credentialOptions: PasskeyCredentialOptions
    displayNameFieldName: string
}

type PasskeySettingsCreateData = PasskeyCredentialOptions

function base64urlDecode(value: string) {
    return Uint8Array.from(atob(value.replaceAll("-", "+").replaceAll("_", "/")), function (c) {
        return c.charCodeAt(0)
    })
}

function base64urlEncode(value: ArrayBuffer) {
    return btoa(String.fromCharCode(...new Uint8Array(value)))
        .replaceAll("+", "-")
        .replaceAll("/", "_")
        .replaceAll("=", "")
}

function safeStringifyCredential(credential: Credential | null) {
    if (!credential) return undefined
    if (!(credential instanceof PublicKeyCredential)) return undefined
    if (!(credential.response instanceof AuthenticatorAttestationResponse)) return undefined

    return JSON.stringify({
        id: credential.id,
        rawId: base64urlEncode(credential.rawId),
        type: credential.type,
        response: {
            attestationObject: base64urlEncode(credential.response.attestationObject),
            clientDataJSON: base64urlEncode(credential.response.clientDataJSON),
        },
    })
}

export async function passkeyLoginInit(passkeyChallengeString: string, signal?: AbortSignal) {
    const passkeyChallenge = JSON.parse(passkeyChallengeString) as PasskeyChallenge

    if (!isPasskeySupported()) return undefined
    if (!window.PublicKeyCredential.isConditionalMediationAvailable) return undefined
    if (!(await window.PublicKeyCredential.isConditionalMediationAvailable())) return undefined

    try {
        const credential = await navigator.credentials.get({
            mediation: "conditional",
            signal,
            publicKey: {
                challenge: base64urlDecode(passkeyChallenge.publicKey.challenge),
                timeout: passkeyChallenge.publicKey.timeout,
                rpId: passkeyChallenge.publicKey.rpId,
                userVerification: passkeyChallenge.publicKey.userVerification,
            },
        })

        if (!credential) return undefined
        if (!(credential instanceof PublicKeyCredential)) return undefined
        if (!(credential.response instanceof AuthenticatorAssertionResponse)) return undefined

        return JSON.stringify({
            id: credential.id,
            rawId: base64urlEncode(credential.rawId),
            type: credential.type,
            response: {
                authenticatorData: base64urlEncode(credential.response.authenticatorData),
                clientDataJSON: base64urlEncode(credential.response.clientDataJSON),
                signature: base64urlEncode(credential.response.signature),
                userHandle: credential.response.userHandle
                    ? base64urlEncode(credential.response.userHandle)
                    : undefined,
            },
        })
    } catch {
        return undefined
    }
}

export async function passkeyLogin(passkeyChallengeString: string, signal?: AbortSignal) {
    const passkeyChallenge = JSON.parse(passkeyChallengeString) as PasskeyChallenge

    try {
        const credential = await navigator.credentials.get({
            signal,
            publicKey: {
                challenge: base64urlDecode(passkeyChallenge.publicKey.challenge),
                timeout: passkeyChallenge.publicKey.timeout,
                rpId: passkeyChallenge.publicKey.rpId,
                userVerification: passkeyChallenge.publicKey.userVerification,
            },
        })

        if (!credential) return undefined
        if (!(credential instanceof PublicKeyCredential)) return undefined
        if (!(credential.response instanceof AuthenticatorAssertionResponse)) return undefined

        return JSON.stringify({
            id: credential.id,
            rawId: base64urlEncode(credential.rawId),
            type: credential.type,
            response: {
                authenticatorData: base64urlEncode(credential.response.authenticatorData),
                clientDataJSON: base64urlEncode(credential.response.clientDataJSON),
                signature: base64urlEncode(credential.response.signature),
                userHandle: credential.response.userHandle
                    ? base64urlEncode(credential.response.userHandle)
                    : undefined,
            },
        })
    } catch {
        return undefined
    }
}

export async function passkeyRegister(
    passkeyChallengeString: string,
    signal?: AbortSignal,
    traits?: Record<string, boolean | string>,
) {
    const { credentialOptions: passkeyChallenge, displayNameFieldName } = JSON.parse(
        passkeyChallengeString,
    ) as PasskeyCreateData

    const displayNameTraitName = displayNameFieldName.startsWith(traitPrefix)
        ? displayNameFieldName.slice(traitPrefix.length)
        : displayNameFieldName

    const displayName = typeof traits?.[displayNameTraitName] === "string" ? traits[displayNameTraitName] : ""

    try {
        const credential = await navigator.credentials.create({
            signal,
            publicKey: {
                challenge: base64urlDecode(passkeyChallenge.publicKey.challenge),
                timeout: passkeyChallenge.publicKey.timeout,
                rp: {
                    id: passkeyChallenge.publicKey.rp.id,
                    name: passkeyChallenge.publicKey.rp.name,
                },
                user: {
                    id: base64urlDecode(passkeyChallenge.publicKey.user.id),
                    name: displayName,
                    displayName: displayName,
                },
                pubKeyCredParams: passkeyChallenge.publicKey.pubKeyCredParams,
            },
        })

        return safeStringifyCredential(credential)
    } catch {
        return undefined
    }
}

export async function passkeySettingsRegister(passkeyChallengeString: string, signal?: AbortSignal) {
    const passkeyChallenge = JSON.parse(passkeyChallengeString) as PasskeySettingsCreateData

    try {
        const credential = await navigator.credentials.create({
            signal,
            publicKey: {
                challenge: base64urlDecode(passkeyChallenge.publicKey.challenge),
                timeout: passkeyChallenge.publicKey.timeout,
                rp: {
                    id: passkeyChallenge.publicKey.rp.id,
                    name: passkeyChallenge.publicKey.rp.name,
                },
                user: {
                    id: base64urlDecode(passkeyChallenge.publicKey.user.id),
                    name: passkeyChallenge.publicKey.user.name,
                    displayName: passkeyChallenge.publicKey.user.displayName,
                },
                pubKeyCredParams: passkeyChallenge.publicKey.pubKeyCredParams,
            },
        })

        return safeStringifyCredential(credential)
    } catch {
        return undefined
    }
}
