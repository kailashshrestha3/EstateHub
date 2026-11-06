import z from "zod";

export const registerSchema = z.object({
    username: z
        .string()
        .trim()
        .min(3, "Username must be at least 3 characters long"),
    email: z
        .string()
        .trim()
        .email("Please provide a valid email")
        .toLowerCase()
        .min(3, "Email must be at least 3 characters long"),
    password: z
        .string()
        .trim()
        .min(6, "Password must be at least 6 characters long"),
});

export const loginSchema = z.object({
    email: z
        .string()
        .trim()
        .toLowerCase()
        .email("Please provide a valid email"),

    password: z
        .string()
        .min(1, "Password is required"),
});
