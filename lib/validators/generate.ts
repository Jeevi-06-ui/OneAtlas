import { z } from "zod";

export const generateAppInputSchema = z.object({
  prompt: z
    .string()
    .trim()
    .min(12, "Describe the app in at least 12 characters.")
    .max(1200, "Keep the prompt under 1200 characters."),
  templateSlug: z
    .string()
    .trim()
    .min(2, "Template slug is required when provided.")
    .max(120)
    .optional(),
});
