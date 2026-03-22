import { z } from "zod"

// Para crear un nuevo examen/quiz
export const CreateAttemptSchema = z.object({
  topic: z.string().min(1),
  questionIds: z.array(z.string()).min(1),
})

export type CreateAttemptInput = z.infer<typeof CreateAttemptSchema>