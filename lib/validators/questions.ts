import { z } from "zod";

export const questionSchema = z.object({
  question: z.string().trim().min(8, "Question must be at least 8 characters.").max(500, "Question is too long."),
  authorName: z.string().trim().min(2, "Name must be at least 2 characters.").max(80).nullable().optional(),
});

export const answerSchema = z.object({
  answer: z.string().trim().min(4, "Answer must be at least 4 characters.").max(1000, "Answer is too long."),
  authorName: z.string().trim().min(2, "Name must be at least 2 characters.").max(80).nullable().optional(),
});
