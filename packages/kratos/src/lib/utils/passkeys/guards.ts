export function isPublicKeyCredential(credential: Credential): credential is PublicKeyCredential {
  return (
    "type" in credential &&
    credential.type === "public-key" &&
    "id" in credential &&
    "rawId" in credential &&
    "response" in credential
  )
}

export function isAttestationResponse(response: AuthenticatorResponse): response is AuthenticatorAttestationResponse {
  return "attestationObject" in response && "clientDataJSON" in response
}

export function isAssertionResponse(response: AuthenticatorResponse): response is AuthenticatorAssertionResponse {
  return "authenticatorData" in response && "clientDataJSON" in response && "signature" in response
}
