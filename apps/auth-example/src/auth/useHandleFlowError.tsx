import { useCallback } from "react";
import { useToast } from "@chakra-ui/react";
import { ErrorID } from "@leancodepl/auth";
import { AxiosError } from "axios";

export type FlowErrorResponse = {
    error?: {
        id?: ErrorID;
    };
    redirect_browser_to: string;
    use_flow_id?: string;
};

export function useHandleFlowError({
    resetFlow,
    onSessionAlreadyAvailable,
}: {
    resetFlow: (newFlowId?: string) => void;
    onSessionAlreadyAvailable?: () => void;
}) {
    const toast = useToast();

    return useCallback(
        async (err: AxiosError<FlowErrorResponse>) => {
            switch (err.response?.data.error?.id) {
                case ErrorID.ErrIDHigherAALRequired:
                    // 2FA is enabled and enforced, but user did not perform 2fa yet!
                    window.location.href = err.response.data.redirect_browser_to;
                    return;
                case ErrorID.ErrIDAlreadyLoggedIn:
                    onSessionAlreadyAvailable?.();
                    return;
                case ErrorID.ErrIDNeedsPrivilegedSession:
                    // We need to re-authenticate to perform this action
                    window.location.href = err.response.data.redirect_browser_to;
                    return;
                case ErrorID.ErrIDRedirectURLNotAllowed:
                    toast({ title: "Podany adres jest nieprawidłowy", status: "error" });
                    resetFlow();
                    return;
                case ErrorID.ErrIDSelfServiceFlowExpired:
                    // The flow expired, let's request a new one.
                    toast({ title: "Twoja sesja wygasła. Wypełnij formularz ponownie", status: "error" });
                    resetFlow();
                    return;
                case ErrorID.ErrIDSelfServiceFlowReplaced:
                    resetFlow(err.response.data.use_flow_id);
                    return;
                case ErrorID.ErrIDCSRF:
                    toast({
                        title: "Zostały wykryte nieprawidłowości bezpieczeństwa. Wypełnij formularz ponownie",
                        status: "error",
                    });
                    resetFlow();
                    return;
                case ErrorID.ErrIDInitiatedBySomeoneElse:
                    // The requested item was intended for someone else. Let's request a new flow...
                    resetFlow();
                    return;
                case ErrorID.ErrIDSelfServiceBrowserLocationChangeRequiredError:
                    // Ory Kratos asked us to point the user to this URL.
                    window.location.href = err.response.data.redirect_browser_to;
                    return;
            }

            switch (err.response?.status) {
                case 401:
                case 410:
                    resetFlow();
                    return;
            }

            return Promise.reject(err);
        },
        [onSessionAlreadyAvailable, resetFlow, toast],
    );
}
