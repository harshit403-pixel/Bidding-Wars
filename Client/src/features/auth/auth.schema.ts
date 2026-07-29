import { z } from "zod";

export const loginSchema = z.object({
    email: z.email("Please enter a valid email"),
    password: z
        .string()
        .min(6, "Password must be at least 6 characters"),
});

export const registerSchema = z.object({
    name: z
        .string()
        .min(3, "Name must be at least 3 characters")
        .max(50, "Name is too long"),

    email: z.email("Please enter a valid email"),

    password: z
        .string()
        .min(6, "Password must be at least 6 characters"),
});
export const forgotPasswordSchema = z.object({
    email: z
        .email("Please enter a valid email address"),
});

export const resetPasswordSchema = z
    .object({
        password: z
            .string()
            .min(8, "Password must be at least 8 characters"),

        confirmPassword: z.string(),
    })
    .refine(
        (data) => data.password === data.confirmPassword,
        {
            message: "Passwords do not match",
            path: ["confirmPassword"],
        },
    );

export type LoginFormData = z.infer<typeof loginSchema>;

export type RegisterFormData = z.infer<typeof registerSchema>;

export type ForgotPasswordFormData = z.infer<
    typeof forgotPasswordSchema
>;

export type ResetPasswordFormData = z.infer<
    typeof resetPasswordSchema
>;