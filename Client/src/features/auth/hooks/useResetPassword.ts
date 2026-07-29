import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import { resetPassword } from "../api/auth.api";
import type { ResetPasswordPayload } from "../auth.types";

export function useResetPassword() {
    return useMutation({
        mutationFn: (payload: ResetPasswordPayload) =>
            resetPassword(payload),

        onSuccess: (data) => {
            toast.success(
                data.message || "Password reset successfully."
            );
        },

        onError: (error: Error) => {
            toast.error(
                error.message || "Failed to reset password."
            );
        },
    });
}