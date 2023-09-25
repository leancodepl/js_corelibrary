import { Spinner, Stack } from "@chakra-ui/react";
import { UiNodeGroupEnum } from "@ory/kratos-client";
import { settingsRoute } from "../../../app/routes";
import { Flow, useSettingsFlow } from "../../../auth";
import { kratosClient } from "../../../auth/ory";
import Redirect from "../../common/Redirect";

const settingsFlowOnly = [UiNodeGroupEnum.Password];

export default function Settings() {
    const { flow, submit } = useSettingsFlow({
        kratosClient,
        settingsRoute,
    });

    if (!flow) return <Spinner size="xl" />;

    const flowSettingsRoute = new URL(flow.request_url).searchParams.get("settingsRoute");

    // Redirect to correct settings page if we are not on the correct one
    if (flowSettingsRoute && flowSettingsRoute !== settingsRoute) {
        return <Redirect path={`${flowSettingsRoute}?flow=${flow.id}`} />;
    }

    return <Flow flow={flow} nodesWrapper={Stack} only={settingsFlowOnly} onSubmit={submit} />;
}
