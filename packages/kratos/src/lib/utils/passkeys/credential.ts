import { isAssertionResponse, isAttestationResponse, isPublicKeyCredential } from "./guards"
import { base64urlDecode, base64urlEncode } from "./helpers"
import { PasskeyChallengeOptions, PasskeyCredentialOptions } from "./types"

export function trySafeStringifyNewCredential(credential: Credential | null) {
  if (!credential || !isPublicKeyCredential(credential)) return

  const { response, id, rawId } = credential

  if (!isAttestationResponse(response)) return

  return JSON.stringify({
    id: id,
    rawId: base64urlEncode(rawId),
    type: credential.type,
    response: {
      attestationObject: base64urlEncode(response.attestationObject),
      clientDataJSON: base64urlEncode(response.clientDataJSON),
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
  if (!credential || !isPublicKeyCredential(credential)) return

  const { response, id, rawId } = credential

  if (!isAssertionResponse(response)) return

  const { userHandle, authenticatorData, clientDataJSON, signature } = response

  return JSON.stringify({
    id: id,
    rawId: base64urlEncode(rawId),
    type: credential.type,
    response: {
      authenticatorData: base64urlEncode(authenticatorData),
      clientDataJSON: base64urlEncode(clientDataJSON),
      signature: base64urlEncode(signature),
      userHandle: userHandle ? base64urlEncode(userHandle) : undefined,
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
