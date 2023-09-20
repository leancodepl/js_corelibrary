/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback } from "react";
import { useToast } from "@chakra-ui/react";
import { AxiosError } from "axios";

export function useHandleFlowError({
    resetFlow,
    onSessionAlreadyAvailable,
}: {
    resetFlow: (newFlowId?: string) => void;
    onSessionAlreadyAvailable?: () => void;
}) {
    const toast = useToast();

    return useCallback(
        async (err: AxiosError<any>) => {
            switch (err.response?.data.error?.id) {
                case "session_aal2_required":
                    // 2FA is enabled and enforced, but user did not perform 2fa yet!
                    window.location.href = (err.response.data as any).redirect_browser_to;
                    return;
                case "session_already_available":
                    onSessionAlreadyAvailable?.();
                    return;
                case "session_refresh_required":
                    // We need to re-authenticate to perform this action
                    window.location.href = (err.response.data as any).redirect_browser_to;
                    return;
                case "self_service_flow_return_to_forbidden":
                    toast({ title: "Podany adres jest nieprawidłowy", status: "error" });
                    resetFlow();
                    return;
                case "self_service_flow_expired":
                    // The flow expired, let's request a new one.
                    toast({ title: "Twoja sesja wygasła. Wypełnij formularz ponownie", status: "error" });
                    resetFlow();
                    return;
                case "self_service_flow_replaced":
                    resetFlow((err.response.data as any).use_flow_id);
                    return;
                case "security_csrf_violation":
                    toast({
                        title: "Zostały wykryte nieprawidłowości bezpieczeństwa. Wypełnij formularz ponownie",
                        status: "error",
                    });
                    resetFlow();
                    return;
                case "security_identity_mismatch":
                    // The requested item was intended for someone else. Let's request a new flow...
                    resetFlow();
                    return;
                case "browser_location_change_required":
                    // Ory Kratos asked us to point the user to this URL.
                    window.location.href = (err.response.data as any).redirect_browser_to;
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
