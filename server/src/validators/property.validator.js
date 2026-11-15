import { z } from "zod";

export const createPropertySchema = z.object({
    title: z.string().trim().min(3, "Title must be at least 3 characters"),

    description: z.string().trim().min(10, "Description must be at least 10 characters"),

    price: z.coerce.number().min(0, "Price cannot be negative"),

    location: z.string().trim().min(1, "Location is required"),

    propertyType: z.enum(["house", "apartment", "land"]),

    bedrooms: z.coerce.number().int().min(0).optional(),

    bathrooms: z.coerce.number().int().min(0).optional(),

    images: z.array(z.string().url()).optional()
});