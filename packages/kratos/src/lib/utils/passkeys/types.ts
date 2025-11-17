export type PasskeyCredentialOptions = {
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

export type PasskeyChallengeOptions = {
  publicKey: {
    challenge: string
    timeout: number
    rpId: string
    userVerification: UserVerificationRequirement
  }
}

export type PasskeyCreateData = {
  credentialOptions: PasskeyCredentialOptions
  displayNameFieldName: string
}

export type PasskeySettingsCreateData = PasskeyCredentialOptions
