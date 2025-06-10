import { base64urlDecode, base64urlEncode } from "./helpers"
import { PasskeyChallengeOptions, PasskeyCredentialOptions } from "./types"

export function trySafeStringifyNewCredential(credential: Credential | null) {
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

export async function createCredential({
    credentialOptions,
    signal,
    userName,
    userDisplayName,
}: {
    credentialOptions: PasskeyCredentialOptions
    userName: string
    userDisplayName: string
    signal?: AbortSignal
}) {
    return await navigator.credentials.create({
        signal,
        publicKey: {
            challenge: base64urlDecode(credentialOptions.publicKey.challenge),
            timeout: credentialOptions.publicKey.timeout,
            rp: {
                id: credentialOptions.publicKey.rp.id,
                name: credentialOptions.publicKey.rp.name,
            },
            user: {
                id: base64urlDecode(credentialOptions.publicKey.user.id),
                name: userName,
                displayName: userDisplayName,
            },
            pubKeyCredParams: credentialOptions.publicKey.pubKeyCredParams,
        },
    })
}

export function trySafeStringifyExistingCredential(credential: Credential | null) {
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
            userHandle: credential.response.userHandle ? base64urlEncode(credential.response.userHandle) : undefined,
        },
    })
}

export async function getCredential({
    challengeOptions,
    signal,
}: {
    challengeOptions: PasskeyChallengeOptions
    signal?: AbortSignal
}) {
    return await navigator.credentials.get({
        signal,
        publicKey: {
            challenge: base64urlDecode(challengeOptions.publicKey.challenge),
            timeout: challengeOptions.publicKey.timeout,
            rpId: challengeOptions.publicKey.rpId,
            userVerification: challengeOptions.publicKey.userVerification,
        },
    })
}
