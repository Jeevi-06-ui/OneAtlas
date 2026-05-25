import { z } from "zod";

export const editAppInputSchema = z.object({
  instruction: z
    .string()
    .trim()
    .min(3, "Enter a mutation instruction.")
    .max(500, "Keep instructions under 500 characters."),
});
