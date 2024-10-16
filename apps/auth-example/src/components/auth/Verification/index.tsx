import { useCallback, useMemo } from "react"
import { useLocation, useNavigate } from "react-router"
import { Spinner } from "@chakra-ui/react"
import { parseSearchParams } from "apps/auth-example/src/utils/parseSearchParams"
import { useVerificationFlow, VerificationCard } from "@leancodepl/kratos"
import { loginRoute, verificationRoute } from "../../../app/routes"
import { kratosClient } from "../../../auth/ory"

export function Verification() {
    const { search } = useLocation()
    const nav = useNavigate()

    const { flow, submit } = useVerificationFlow({
        kratosClient,
        onVerified: useCallback(() => nav(loginRoute), [nav]),
        searchParams: useMemo(() => parseSearchParams(search), [search]),
        updateSearchParams: searchParams => nav(`${verificationRoute}?${new URLSearchParams(searchParams)}`),
    })

    if (!flow) return <Spinner />

    return <VerificationCard flow={flow} onSubmit={submit} />
}
