import { traitPrefix } from "../../flows/registration/config"
import { createCredential, trySafeStringifyCredential } from "./credential"
import { base64urlDecode, base64urlEncode } from "./helpers"
import { PasskeyChallenge, PasskeyCreateData, PasskeySettingsCreateData } from "./types"

function isPasskeySupported() {
    return !!window.PublicKeyCredential
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
        const credential = await createCredential({
            passkeyChallenge,
            signal,
            userName: displayName,
            userDisplayName: displayName,
        })

        return trySafeStringifyCredential(credential)
    } catch {
        return undefined
    }
}

export async function passkeySettingsRegister(passkeyChallengeString: string, signal?: AbortSignal) {
    const passkeyChallenge = JSON.parse(passkeyChallengeString) as PasskeySettingsCreateData

    try {
        const credential = await createCredential({
            passkeyChallenge,
            signal,
            userName: passkeyChallenge.publicKey.user.name,
            userDisplayName: passkeyChallenge.publicKey.user.displayName,
        })

        return trySafeStringifyCredential(credential)
    } catch {
        return undefined
    }
}
