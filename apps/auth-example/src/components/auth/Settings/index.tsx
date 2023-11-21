import { Spinner } from "@chakra-ui/react";
import { UserSettingsCard, useSettingsFlow } from "@leancodepl/kratos";
import { settingsRoute } from "../../../app/routes";
import { kratosClient } from "../../../auth/ory";
import { Redirect } from "../../common/Redirect";

export function Settings() {
    const { flow, submit } = useSettingsFlow({
        kratosClient,
        settingsRoute,
        params: {
            settingsRoute,
        },
    });

    if (!flow) return <Spinner size="xl" />;

    const flowSettingsRoute = new URL(flow.request_url).searchParams.get("settingsRoute");

    // Redirect to correct settings page if we are not on the correct one
    if (flowSettingsRoute && flowSettingsRoute !== settingsRoute) {
        return <Redirect path={`${flowSettingsRoute}?flow=${flow.id}`} />;
    }

    return (
        <>
            <h2>Lookup secret</h2>
            <UserSettingsCard flow={flow} flowType="lookupSecret" onSubmit={submit} />

            <h2>Oidc</h2>
            <UserSettingsCard flow={flow} flowType="oidc" onSubmit={submit} />

            <h2>Password</h2>
            <UserSettingsCard flow={flow} flowType="password" onSubmit={submit} />

            <h2>Profile</h2>
            <UserSettingsCard flow={flow} flowType="profile" onSubmit={submit} />

            <h2>Totp</h2>
            <UserSettingsCard flow={flow} flowType="totp" onSubmit={submit} />

            <h2>Webauthn</h2>
            <UserSettingsCard includeScripts flow={flow} flowType="webauthn" onSubmit={submit} />
        </>
    );
}
