import { AxiosError } from "axios";
import { ErrorId } from "./enums/errorId";

export type FlowErrorResponse = {
    error?: {
        id?: ErrorId;
    };
    redirect_browser_to: string;
    use_flow_id?: string;
};

export type UseHandleFlowError = (props: {
    resetFlow: (newFlowId?: string) => void;
    onSessionAlreadyAvailable?: () => void;
}) => (err: AxiosError<FlowErrorResponse>) => Promise<unknown>;
