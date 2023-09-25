import { useEffect, useMemo, useState } from "react";
import { Flex, Stack, Text } from "@chakra-ui/react";
import { CustomUiMessageParams, InfoSelfServiceSettings, isUiNodeInputAttributes } from "@leancodepl/auth";
import { SettingsFlow, UiNodeGroupEnum } from "@ory/kratos-client";
import { mfaSettingsRoute } from "../../../../app/routes";
import { Flow, useSettingsFlow } from "../../../../auth";
import { kratosClient } from "../../../../auth/ory";
import { displayGlobalMessages } from "../../../../auth/ui/messages/displayGlobalMessages";

const totpFlowOnly = [UiNodeGroupEnum.Totp];

export function TwoFactorAuthenticationToggle() {
    const [prevIs2FAEnabled, setPrevIs2FAEnabled] = useState<boolean>();

    const { flow, submit } = useSettingsFlow({
        kratosClient,
        settingsRoute: mfaSettingsRoute,
    });

    const is2FAEnabled = getIs2FAEnabled(flow);
    const customUiMessage = useMemo(() => mkCustomUiMessage(is2FAEnabled), [is2FAEnabled]);

    if (prevIs2FAEnabled !== is2FAEnabled) {
        setPrevIs2FAEnabled(is2FAEnabled);
    }

    useEffect(() => {
        if (!flow?.ui.messages) return;

        displayGlobalMessages(flow.ui.messages, customUiMessage);
    }, [customUiMessage, flow]);

    return (
        <Stack>
            <Flex align="center" gap="4">
                <Text>{is2FAEnabled ? "Weryfikacja dwuetapowa włączona" : "Weryfikacja dwuetapowa wyłączona"}</Text>
            </Flex>
            {flow && <Flow hideGlobalMessages flow={flow} nodesWrapper={Stack} only={totpFlowOnly} onSubmit={submit} />}
        </Stack>
    );
}

function mkCustomUiMessage(is2FAEnabled: boolean) {
    return ({ uiMessage, attributes, text }: CustomUiMessageParams) => {
        switch (text?.id) {
            case InfoSelfServiceSettings.InfoSelfServiceSettingsUpdateSuccess:
                return is2FAEnabled
                    ? "Udało się włączyć weryfikację dwuetapową"
                    : "Udało się wyłączyć weryfikację dwuetapową";
        }

        return uiMessage({ attributes, text });
    };
}

export function getIs2FAEnabled(settingsFlow?: SettingsFlow) {
    return !!settingsFlow?.ui.nodes.some(
        node => isUiNodeInputAttributes(node.attributes) && node.attributes.name === "totp_unlink",
    );
}
