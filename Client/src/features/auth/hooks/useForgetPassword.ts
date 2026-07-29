import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import { forgotPassword } from "../api/auth.api";
import type { ForgotPasswordPayload } from "../auth.types";

export function useForgotPassword() {
    return useMutation({
        mutationFn: (payload: ForgotPasswordPayload) =>
            forgotPassword(payload),

        onSuccess: (data) => {
            toast.success(
                data.message || "Password reset link sent successfully."
            );
        },

        onError: (error: Error) => {
            toast.error(
                error.message || "Failed to send password reset link."
            );
        },
    });
}