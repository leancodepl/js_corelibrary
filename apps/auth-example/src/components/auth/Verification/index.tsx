import { useCallback, useMemo } from "react"
import { useNavigate } from "react-router"
import { useSearchParams } from "react-router-dom"
import { Spinner } from "@chakra-ui/react"
import { parseSearchParams } from "apps/auth-example/src/utils/parseSearchParams"
import { useVerificationFlow, VerificationCard } from "@leancodepl/kratos"
import { loginRoute } from "../../../app/routes"
import { kratosClient } from "../../../auth/ory"

export function Verification() {
    const nav = useNavigate()

    const [searchParams, updateSearchParams] = useSearchParams()

    const { flow, submit } = useVerificationFlow({
        kratosClient,
        onVerified: useCallback(() => nav(loginRoute), [nav]),
        searchParams: useMemo(() => parseSearchParams(searchParams), [searchParams]),
        updateSearchParams,
    })

    if (!flow) return <Spinner />

    return <VerificationCard flow={flow} onSubmit={submit} />
}
