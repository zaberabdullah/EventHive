import { z } from "zod";
import { EVENT_CATEGORIES } from "@/types";

export const registerSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(60, "Name must be under 60 characters"),
  email: z.string().trim().toLowerCase().email("Enter a valid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password needs at least one uppercase letter")
    .regex(/[0-9]/, "Password needs at least one number"),
});

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email("Enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

export const createEventSchema = z.object({
  title: z.string().trim().min(3, "Title must be at least 3 characters").max(100, "Title must be under 100 characters"),
  shortDescription: z.string().trim().min(10, "Short description must be at least 10 characters").max(160, "Short description must be under 160 characters"),
  fullDescription: z.string().trim().min(30, "Full description must be at least 30 characters").max(4000, "Full description must be under 4000 characters"),
  category: z.enum(EVENT_CATEGORIES, { errorMap: () => ({ message: "Choose a category" }) }),
  image: z.string().trim().url("Enter a valid image URL").optional().or(z.literal("")),
  date: z.string().min(1, "Date is required"),
  time: z.string().min(1, "Time is required"),
  venue: z.string().trim().min(2, "Venue is required"),
  city: z.string().trim().min(2, "City is required"),
  price: z.coerce.number().min(0, "Price can't be negative"),
  capacity: z.coerce.number().int().min(1, "Capacity must be at least 1"),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type CreateEventInput = z.infer<typeof createEventSchema>;

export function flattenZodError(error: z.ZodError): Record<string, string> {
  const out: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = issue.path[0]?.toString() ?? "form";
    if (!out[key]) out[key] = issue.message;
  }
  return out;
}
