import { ComponentType, ReactNode, useCallback } from "react"
import * as Slot from "@radix-ui/react-slot"
import { CommonButtonProps, getCsrfToken } from "../../../../utils"
import { useGetRegistrationFlow, useUpdateRegistrationFlow } from "../../hooks"

type OidcProps = {
  children: ReactNode
  provider: string
}

export function Oidc({ children, provider }: OidcProps) {
  const { mutate: updateRegistrationFlow } = useUpdateRegistrationFlow()
  const { data: registrationFlow } = useGetRegistrationFlow()

  const signIn = useCallback(() => {
    if (!registrationFlow) return

    updateRegistrationFlow({
      method: "oidc",
      csrf_token: getCsrfToken(registrationFlow),
      provider,
    })
  }, [registrationFlow, updateRegistrationFlow, provider])

  const Comp: ComponentType<CommonButtonProps> = Slot.Root

  return (
    <Comp type="button" onClick={signIn}>
      {children}
    </Comp>
  )
}

type SpecificOidcProps = {
  children: ReactNode
}

export function Apple({ children }: SpecificOidcProps) {
  return <Oidc provider="apple">{children}</Oidc>
}

export function Facebook({ children }: SpecificOidcProps) {
  return <Oidc provider="facebook">{children}</Oidc>
}

export function Google({ children }: SpecificOidcProps) {
  return <Oidc provider="google">{children}</Oidc>
}
