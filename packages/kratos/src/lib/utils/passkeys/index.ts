import { traitPrefix } from "../traits"
import {
  createCredential,
  getCredential,
  trySafeStringifyExistingCredential,
  trySafeStringifyNewCredential,
} from "./credential"
import { base64urlDecode, base64urlEncode } from "./helpers"
import { PasskeyChallengeOptions, PasskeyCreateData, PasskeySettingsCreateData } from "./types"

function isPasskeySupported() {
  return !!window.PublicKeyCredential
}

export async function passkeyLoginInit(passkeyChallengeString: string, signal?: AbortSignal) {
  const passkeyChallenge = JSON.parse(passkeyChallengeString) as PasskeyChallengeOptions

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
        userHandle: credential.response.userHandle ? base64urlEncode(credential.response.userHandle) : undefined,
      },
    })
  } catch {
    return undefined
  }
}

export async function passkeyLogin(passkeyChallengeString: string, signal?: AbortSignal) {
  const challengeOptions = JSON.parse(passkeyChallengeString) as PasskeyChallengeOptions

  try {
    return trySafeStringifyExistingCredential(
      await getCredential({
        challengeOptions,
        signal,
      }),
    )
  } catch {
    return undefined
  }
}

export async function passkeyRegister(
  passkeyChallengeString: string,
  signal?: AbortSignal,
  traits?: Record<string, boolean | string>,
) {
  const { credentialOptions, displayNameFieldName } = JSON.parse(passkeyChallengeString) as PasskeyCreateData

  const displayNameTraitName = displayNameFieldName.startsWith(traitPrefix)
    ? displayNameFieldName.slice(traitPrefix.length)
    : displayNameFieldName

  const displayName = typeof traits?.[displayNameTraitName] === "string" ? traits[displayNameTraitName] : ""

  try {
    return trySafeStringifyNewCredential(
      await createCredential({
        credentialOptions,
        signal,
        userName: displayName,
        userDisplayName: displayName,
      }),
    )
  } catch {
    return undefined
  }
}

export async function passkeySettingsRegister(passkeyChallengeString: string, signal?: AbortSignal) {
  const credentialOptions = JSON.parse(passkeyChallengeString) as PasskeySettingsCreateData

  try {
    return trySafeStringifyNewCredential(
      await createCredential({
        credentialOptions,
        signal,
        userName: credentialOptions.publicKey.user.name,
        userDisplayName: credentialOptions.publicKey.user.displayName,
      }),
    )
  } catch {
    return undefined
  }
}
