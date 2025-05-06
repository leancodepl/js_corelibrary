function isPasskeySupported() {
    return !!window.PublicKeyCredential
}

type PasskeyChallenge = {
    publicKey: {
        challenge: string
        timeout: number
        rpId: string
        userVerification: UserVerificationRequirement
    }
}
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

export async function passkeyLoginInit(passkeyChallengeString: string, signal?: AbortSignal) {
    const passkeyChallenge = JSON.parse(passkeyChallengeString) as PasskeyChallenge

    if (!isPasskeySupported()) return undefined
    if (!window.PublicKeyCredential.isConditionalMediationAvailable) return undefined
    if (!(await window.PublicKeyCredential.isConditionalMediationAvailable())) return undefined

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
}
export async function passkeyLogin(passkeyChallengeString: string, signal?: AbortSignal) {
    const passkeyChallenge = JSON.parse(passkeyChallengeString) as PasskeyChallenge

    const credential = await navigator.credentials.get({
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
}

// ;(function () {
//     function __oryWebAuthnBufferDecode(value) {
//         return Uint8Array.from(atob(value.replaceAll("-", "+").replaceAll("_", "/")), function (c) {
//             return c.charCodeAt(0)
//         })
//     }

//     function __oryWebAuthnBufferEncode(value) {
//         return btoa(String.fromCharCode.apply(null, new Uint8Array(value)))
//             .replaceAll("+", "-")
//             .replaceAll("/", "_")
//             .replaceAll("=", "")
//     }

//     function __oryPasskeyRegistration() {
//         const dataEl = document.getElementsByName("passkey_create_data")[0]
//         const resultEl = document.getElementsByName("passkey_register")[0]

//         if (!dataEl || !resultEl) {
//             console.debug("__oryPasskeyRegistration: mandatory fields not found")
//             return
//         }

//         const createData = JSON.parse(dataEl.value)

//         // Fetch display name from field value
//         const displayNameFieldName = createData.displayNameFieldName
//         const displayName = dataEl.closest("form").querySelector("[name='" + displayNameFieldName + "']").value

//         const opts = createData.credentialOptions
//         opts.publicKey.user.name = displayName
//         opts.publicKey.user.displayName = displayName
//         opts.publicKey.user.id = __oryWebAuthnBufferDecode(opts.publicKey.user.id)
//         opts.publicKey.challenge = __oryWebAuthnBufferDecode(opts.publicKey.challenge)

//         if (opts.publicKey.excludeCredentials) {
//             opts.publicKey.excludeCredentials = opts.publicKey.excludeCredentials.map(function (value) {
//                 return {
//                     ...value,
//                     id: __oryWebAuthnBufferDecode(value.id),
//                 }
//             })
//         }

//         navigator.credentials
//             .create(opts)
//             .then(function (credential) {
//                 resultEl.value = JSON.stringify({
//                     id: credential.id,
//                     rawId: __oryWebAuthnBufferEncode(credential.rawId),
//                     type: credential.type,
//                     response: {
//                         attestationObject: __oryWebAuthnBufferEncode(credential.response.attestationObject),
//                         clientDataJSON: __oryWebAuthnBufferEncode(credential.response.clientDataJSON),
//                     },
//                 })

//                 resultEl.closest("form").submit()
//             })
//             .catch(err => {
//                 console.error(err)
//             })
//     }

//     function __oryPasskeySettingsRegistration() {
//         const dataEl = document.getElementsByName("passkey_create_data")[0]
//         const resultEl = document.getElementsByName("passkey_settings_register")[0]

//         if (!dataEl || !resultEl) {
//             console.debug("__oryPasskeySettingsRegistration: mandatory fields not found")
//             return
//         }

//         const opt = JSON.parse(dataEl.value)

//         opt.publicKey.user.id = __oryWebAuthnBufferDecode(opt.publicKey.user.id)
//         opt.publicKey.challenge = __oryWebAuthnBufferDecode(opt.publicKey.challenge)

//         if (opt.publicKey.excludeCredentials) {
//             opt.publicKey.excludeCredentials = opt.publicKey.excludeCredentials.map(function (value) {
//                 return {
//                     ...value,
//                     id: __oryWebAuthnBufferDecode(value.id),
//                 }
//             })
//         }

//         navigator.credentials
//             .create(opt)
//             .then(function (credential) {
//                 resultEl.value = JSON.stringify({
//                     id: credential.id,
//                     rawId: __oryWebAuthnBufferEncode(credential.rawId),
//                     type: credential.type,
//                     response: {
//                         attestationObject: __oryWebAuthnBufferEncode(credential.response.attestationObject),
//                         clientDataJSON: __oryWebAuthnBufferEncode(credential.response.clientDataJSON),
//                     },
//                 })

//                 resultEl.closest("form").submit()
//             })
//             .catch(err => {
//                 console.error(err)
//             })
//     }
// })()
