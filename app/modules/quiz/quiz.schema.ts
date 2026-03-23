import { z } from "zod";

export const StartAttemptSchema = z.object({
  userId: z.string(),
  topic: z.string().min(2),
  questionIds: z.array(z.string()).min(1, "El juego debe tener al menos una pregunta"),
});

export const SubmitAnswerSchema = z.object({
  attemptId: z.string(),
  questionId: z.string(),
  selectedOptionId: z.string(),
});

export const FinishAttemptSchema = z.object({
  attemptId: z.string(),
});

export type StartAttemptInput = z.infer<typeof StartAttemptSchema>;
export type SubmitAnswerInput = z.infer<typeof SubmitAnswerSchema>;