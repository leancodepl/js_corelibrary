import { useCallback } from "react";
import { useToast } from "@chakra-ui/react";
import { ErrorId, ResponseError } from "@leancodepl/auth";

export type FlowErrorResponse = {
    error?: {
        id?: ErrorId;
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
        async (err: ResponseError<FlowErrorResponse>) => {
            switch (err.response?.data.error?.id) {
                case ErrorId.ErrIDHigherAALRequired:
                    // 2FA is enabled and enforced, but user did not perform 2fa yet!
                    window.location.href = err.response.data.redirect_browser_to;
                    return;
                case ErrorId.ErrIDAlreadyLoggedIn:
                    onSessionAlreadyAvailable?.();
                    return;
                case ErrorId.ErrIDNeedsPrivilegedSession:
                    // We need to re-authenticate to perform this action
                    window.location.href = err.response.data.redirect_browser_to;
                    return;
                case ErrorId.ErrIDRedirectURLNotAllowed:
                    toast({ title: "Podany adres jest nieprawidłowy", status: "error" });
                    resetFlow();
                    return;
                case ErrorId.ErrIDSelfServiceFlowExpired:
                    // The flow expired, let's request a new one.
                    toast({ title: "Twoja sesja wygasła. Wypełnij formularz ponownie", status: "error" });
                    resetFlow();
                    return;
                case ErrorId.ErrIDSelfServiceFlowReplaced:
                    resetFlow(err.response.data.use_flow_id);
                    return;
                case ErrorId.ErrIDCSRF:
                    toast({
                        title: "Zostały wykryte nieprawidłowości bezpieczeństwa. Wypełnij formularz ponownie",
                        status: "error",
                    });
                    resetFlow();
                    return;
                case ErrorId.ErrIDInitiatedBySomeoneElse:
                    // The requested item was intended for someone else. Let's request a new flow...
                    resetFlow();
                    return;
                case ErrorId.ErrIDSelfServiceBrowserLocationChangeRequiredError:
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
