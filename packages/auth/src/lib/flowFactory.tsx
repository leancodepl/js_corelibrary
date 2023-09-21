import { ComponentType, ReactNode, useEffect, useMemo } from "react";
import {
    LoginFlow,
    RecoveryFlow,
    RegistrationFlow,
    SettingsFlow,
    VerificationFlow,
    UiNode,
    UiNodeGroupEnum,
    UiText,
} from "@ory/kratos-client";
import { set } from "lodash";
import { DeepPartial, FieldValues, FormProvider, useForm } from "react-hook-form";
import { NodeFactoryProps, nodeFactory } from "./node";
import { CustomGetMessageProvider, CustomUiMessage } from "./types/uiMessage";
import { getNodeId } from "./utils/getNodeId";
import { isUiNodeInputAttributes } from "./utils/typeGuards";

export type FlowFactoryProps = {
    displayGlobalMessages: (messages: UiText[], customUiMessage?: CustomUiMessage) => void;
    customGetMessageProvider: CustomGetMessageProvider;
} & NodeFactoryProps;

type FlowProps<T> = {
    flow: LoginFlow | RegistrationFlow | SettingsFlow | VerificationFlow | RecoveryFlow;
    only?: UiNodeGroupEnum[];
    except?: string[];
    onSubmit: (values: T) => void;
    hideGlobalMessages?: boolean;
    UiMessage?: CustomUiMessage;
    nodesWrapper?: ComponentType<{ children: ReactNode }>;
};

export function flowFactory({
    displayGlobalMessages,
    nodeComponents,
    customGetMessageProvider: CustomGetMessageProvider,
}: FlowFactoryProps) {
    const Node = nodeFactory({ nodeComponents });

    return function Flow<T extends FieldValues>({
        flow,
        only,
        except,
        onSubmit,
        UiMessage,
        hideGlobalMessages,
        // eslint-disable-next-line react/jsx-no-useless-fragment
        nodesWrapper: NodesWrapper = ({ children }) => <>{children}</>,
    }: FlowProps<T>) {
        const nodes = useMemo(() => {
            let nodes = flow?.ui.nodes ?? [];

            if (only) {
                nodes = nodes.filter(({ group }) => group === "default" || only.includes(group));
            }

            if (except) {
                nodes = nodes.filter(({ attributes }) =>
                    isUiNodeInputAttributes(attributes) ? !except.includes(attributes.name) : true,
                );
            }

            return nodes;
        }, [except, flow?.ui.nodes, only]);

        const methods = useForm<T>({
            defaultValues: getDefaultValues<T>(nodes),
        });

        const { reset, handleSubmit } = methods;

        useEffect(() => reset(getDefaultValues<T>(nodes)), [reset, nodes]);

        useEffect(() => {
            if (!flow.ui.messages || hideGlobalMessages) return;

            displayGlobalMessages(flow.ui.messages, UiMessage);
        }, [UiMessage, flow.ui.messages, hideGlobalMessages]);

        return (
            <CustomGetMessageProvider uiMessage={UiMessage}>
                <FormProvider {...methods}>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <NodesWrapper>
                            {nodes.map((node, k) => (
                                <Node key={`${getNodeId(node)}-${k}`} disabled={false} node={node} />
                            ))}
                        </NodesWrapper>
                    </form>
                </FormProvider>
            </CustomGetMessageProvider>
        );
    };
}

function getDefaultValues<T>(nodes: UiNode[]) {
    return nodes.reduce((prev, node) => {
        const { attributes } = node;

        if (!isUiNodeInputAttributes(attributes)) return prev;

        set(prev, attributes.name, attributes.value ?? (attributes.type !== "checkbox" ? "" : false));

        return prev;
    }, {} as DeepPartial<T>);
}
