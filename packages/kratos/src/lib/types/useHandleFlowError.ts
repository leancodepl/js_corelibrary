import { AxiosError } from "axios";

export type UseHandleFlowError = (props: {
    resetFlow: (newFlowId?: string) => void;
    onSessionAlreadyAvailable?: () => void;
}) => (err: AxiosError) => Promise<unknown>;
