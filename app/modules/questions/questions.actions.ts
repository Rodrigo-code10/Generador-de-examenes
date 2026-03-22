"use server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { CreateQuestionInput, CreateQuestionSchema } from "./questions.schema";
import { QuestionsService } from "./question.service";
import { AIService } from "../ia/ia.service";

export async function getQuestionsWithDetails() {
    const questions = await prisma.question.findMany({
        include: {
            options: true,
            _count: { select: { attempts: true } }
        },
        orderBy: { topic: "asc" }
    });

    return questions.reduce((acc: any, q) => {
        const topicKey = q.topic.trim().toUpperCase();
        if (!acc[topicKey]) acc[topicKey] = [];
        acc[topicKey].push(q);
        return acc;
    }, {});
}

export async function deleteQuestion(id: string) {
    try {
        await prisma.$transaction(async (tx) => {
            //Borrar respuestas de usuarios que usaron esta pregunta
            await tx.answer.deleteMany({ where: { questionId: id } });

            //Borrar la relación en la tabla intermedia de intentos
            await tx.attemptQuestion.deleteMany({ where: { questionId: id } });

            // Borrar las opciones 
            await tx.option.deleteMany({ where: { questionId: id } });

            //Finalmente borrar la pregunta
            await tx.question.delete({ where: { id } });
        });

        revalidatePath("/api/admin/questions");
    } catch (error) {
        console.error("Error al borrar la pregunta:", error);
        throw new Error("No se pudo eliminar la pregunta porque tiene datos vinculados.");
    }
}


export async function updateQuestionAction(id: string, data: CreateQuestionInput) {

    const normalizedTopic = data.topic.trim().toUpperCase();

    const validated = CreateQuestionSchema.parse({
        ...data,
        topic: normalizedTopic
    });

    try {
        await prisma.$transaction(async (tx) => {
            // ELIMINAR DEPENDENCIAS EN ORDEN (De lo más específico a lo más general)

            // Borrar respuestas que usaron las opciones de esta pregunta
            await tx.answer.deleteMany({
                where: { questionId: id }
            });

            // Borrar la relación de esta pregunta en los intentos (AttemptQuestion)
            await tx.attemptQuestion.deleteMany({
                where: { questionId: id }
            });

            // Borrar opciones viejas
            await tx.option.deleteMany({
                where: { questionId: id }
            });

            // Actualizar preguntas y hacer nuevas opciones
            await tx.question.update({
                where: { id },
                data: {
                    questionText: validated.questionText,
                    topic: validated.topic,
                    options: {
                        create: validated.options // Prisma crea los nuevos IDs automáticamente
                    }
                }
            });
        });

        revalidatePath("/api/admin/questions");
    } catch (error) {
        console.error("Error detallado en transacción:", error);
        throw new Error("No se pudo actualizar la pregunta. Es posible que tenga registros activos vinculados.");
    }
}


export async function createQuestionAction(data: CreateQuestionInput) {
    // Validamos los datos 
    const normalizedTopic = data.topic.trim().toUpperCase();

    const validated = CreateQuestionSchema.parse({
        ...data,
        topic: normalizedTopic
    });

    try {
        // Llamamos al servicio para crear en la DB
        await QuestionsService.createQuestion(validated);

        // Refrescamos la ruta para que aparezca la nueva pregunta
        revalidatePath("/api/admin/questions");
    } catch (error) {
        console.error("Error al crear pregunta:", error);
        throw new Error("Error interno al crear la pregunta.");
    }
}


export async function adminGenerateQuestions(topic: string, amount: number) {
    try {
      console.log(`Solicitando ${amount} preguntas sobre: ${topic}`);
      
      // Llamada a la IA
      const aiQuestions = await AIService.generateQuestions(topic, amount);
  
      if (!aiQuestions || aiQuestions.length === 0) {
        return { success: false, error: "La IA no devolvió resultados." };
      }
  
      await prisma.$transaction(async (tx) => {
        for (const q of aiQuestions) {
          await tx.question.create({
            data: {
              questionText: q.questionText,
              topic: topic.trim().toUpperCase(), // Normalizamos para que se agrupen bien
              options: {
                create: q.options.map((o: any) => ({
                  text: o.text,
                  Correct: o.Correct,
                })),
              },
            },
          });
        }
      });
  
      revalidatePath("/api/admin/questions");
      revalidatePath("/api/admin/analytics");
  
      console.log(`Guardadas ${aiQuestions.length} preguntas con éxito.`);
      return { success: true, count: aiQuestions.length };
  
    } catch (error: any) {
      console.error("Error en la base de datos:", error);
      return { 
        success: false, 
        error: error.message || "Error al insertar en la base de datos." 
      };
    }
  }