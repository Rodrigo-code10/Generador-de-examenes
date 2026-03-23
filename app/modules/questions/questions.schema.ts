import { z } from "zod";

// Esquema para CREAR una pregunta (Admin)
export const CreateQuestionSchema = z.object({
  questionText: z.string().min(5, "La pregunta es muy corta"),
  topic: z.string().min(2, "El tema debe tener al menos 2 caracteres"),
  options: z
    .array(
      z.object({
        text: z.string().min(1, "La opción no puede estar vacía"),
        Correct: z.boolean(),
      })
    )
    .min(2, "Debes incluir al menos 2 opciones")
    .refine(
      (opts) => opts.some((o) => o.Correct),
      "Debe haber al menos una opción correcta"
    ),
});

export type CreateQuestionInput = z.infer<typeof CreateQuestionSchema>;


// Esquema para FILTRAR preguntas (Juego/API)
export const GetQuestionsSchema = z.object({
  limit: z.coerce
    .number()
    .int()
    .positive()
    .max(50, "Máximo 50 preguntas por tanda")
    .default(10),
  topic: z.string().min(2, "Tema inválido").optional(),
});

export type GetQuestionsInput = z.infer<typeof GetQuestionsSchema>;

// Esquema para RESPONDER una pregunta
export const SubmitAnswerSchema = z.object({
  attemptId: z.uuid("ID de intento inválido"),
  questionId: z.uuid("ID de pregunta inválido"),
  selectedOptionId: z.uuid("ID de opción inválido"),
});

export type SubmitAnswerInput = z.infer<typeof SubmitAnswerSchema>;