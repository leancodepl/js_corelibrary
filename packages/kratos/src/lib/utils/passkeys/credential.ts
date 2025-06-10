import { base64urlDecode, base64urlEncode } from "./helpers"
import { PasskeyCredentialOptions } from "./types"

export function trySafeStringifyCredential(credential: Credential | null) {
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
    passkeyChallenge,
    signal,
    userName,
    userDisplayName,
}: {
    passkeyChallenge: PasskeyCredentialOptions
    userName: string
    userDisplayName: string
    signal?: AbortSignal
}) {
    return await navigator.credentials.create({
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
                name: userName,
                displayName: userDisplayName,
            },
            pubKeyCredParams: passkeyChallenge.publicKey.pubKeyCredParams,
        },
    })
}
