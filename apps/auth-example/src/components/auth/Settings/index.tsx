import { useMemo } from "react"
import { useLocation, useNavigate } from "react-router"
import { Spinner } from "@chakra-ui/react"
import { UserSettingsCard, useSettingsFlow } from "@leancodepl/kratos"
import { settingsRoute } from "../../../app/routes"
import { kratosClient } from "../../../auth/ory"
import { parseSearchParams } from "../../../utils/parseSearchParams"
import { Redirect } from "../../common/Redirect"

export function Settings() {
    const { search } = useLocation()
    const nav = useNavigate()

    const { flow, submit } = useSettingsFlow({
        kratosClient,
        params: {
            settingsRoute,
        },
        searchParams: useMemo(() => parseSearchParams(search), [search]),
        updateSearchParams: searchParams => nav(`${settingsRoute}?${new URLSearchParams(searchParams)}`),
    })

    if (!flow) return <Spinner size="xl" />

    const flowSettingsRoute = new URL(flow.request_url).searchParams.get("settingsRoute")

    // Redirect to correct settings page if we are not on the correct one
    if (flowSettingsRoute && flowSettingsRoute !== settingsRoute) {
        return <Redirect path={`${flowSettingsRoute}?flow=${flow.id}`} />
    }

    return (
        <>
            <h2>Lookup secret</h2>
            <UserSettingsCard flow={flow} flowType="lookup_secret" onSubmit={submit} />

            <h2>Oidc</h2>
            <UserSettingsCard flow={flow} flowType="oidc" onSubmit={submit} />

            <h2>Password</h2>
            <UserSettingsCard flow={flow} flowType="password" onSubmit={submit} />

            <h2>Profile</h2>
            <UserSettingsCard flow={flow} flowType="profile" onSubmit={submit} />

            <h2>Totp</h2>
            <UserSettingsCard flow={flow} flowType="totp" onSubmit={submit} />

            <h2>Passkey</h2>
            <UserSettingsCard flow={flow} flowType="passkey" onSubmit={submit} />
        </>
    )
}
