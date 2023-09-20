import { AxiosError } from "axios";

export type UseHandleFlowError = (props: {
    resetFlow: (newFlowId?: string) => void;
    onSessionAlreadyAvailable?: (() => void) | undefined;
}) => (err: AxiosError<unknown>) => Promise<unknown>;
