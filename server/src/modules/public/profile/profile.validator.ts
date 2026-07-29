import { z } from "zod";

export const updateProfileSchema = z.object({
    name: z.string().trim().min(3).max(50).optional(),

    bio: z.string().trim().max(300).optional(),

    avatar: z.string().url().optional(),

    phone: z.string().trim().min(10).max(15).optional(),
});