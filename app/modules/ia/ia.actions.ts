"use server"
import { AIService } from "./ia.service"; 
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { getUser } from "@/modules/auth/session";

export async function generateAndStartQuiz(topic: string, limit: number) {
  let attemptId = "";

  try {
    const user = await getUser();
    if (!user) throw new Error("No autorizado");

    // Llamamos a Gemini con el límite elegido
    const aiQuestions = await AIService.generateQuestions(topic, limit);

    const attempt = await prisma.$transaction(async (tx) => {
      const createdQuestions = await Promise.all(
        aiQuestions.map((q: any) =>
          tx.question.create({
            data: {
              questionText: q.questionText,
              topic: topic,
              options: {
                create: q.options.map((o: any) => ({
                  text: o.text,
                  Correct: o.Correct,
                })),
              },
            },
          })
        )
      );

      return tx.attempt.create({
        data: {
          userId: user.id,
          topic: topic,
          status: "IN_PROGRESS",
          questions: {
            create: createdQuestions.map((q) => ({ questionId: q.id })),
          },
        },
      });
    });

    attemptId = attempt.id;
  } catch (error) {
    console.error("Error en generateAndStartQuiz:", error);
    throw error; 
  }

  // Redirección fuera del try/catch
  redirect(`/api/questions?id=${attemptId}`);
}