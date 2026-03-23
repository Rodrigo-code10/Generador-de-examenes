import { prisma } from "@/lib/prisma";
import { StartAttemptSchema, SubmitAnswerSchema, FinishAttemptSchema } from "./quiz.schema";

export const QuizService = {
  async getUniqueTopics() {
    const topics = await prisma.question.findMany({
      distinct: ['topic'],
      select: {
        topic: true,
      },
    });
    // Retornamos un array de strings: ["Ciencia", "Historia", ...]
    return topics.map(t => t.topic);
  },

  async startAttempt(input: unknown) {
    const { userId, topic, questionIds } = StartAttemptSchema.parse(input);

    return await prisma.attempt.create({
      data: {
        userId,
        topic,
        status: "IN_PROGRESS",
        questions: {
          create: questionIds.map(id => ({ questionId: id }))
        }
      }
    });
  },

  async submitAnswer(input: unknown) {
    const { attemptId, questionId, selectedOptionId } = SubmitAnswerSchema.parse(input);

    // Verificamos que la opción pertenezca a la pregunta
    const option = await prisma.option.findFirst({
      where: { id: selectedOptionId, questionId }
    });

    if (!option) throw new Error("Opción no válida para esta pregunta.");

    return await prisma.answer.create({
      data: {
        attemptId,
        questionId,
        selectedOptionId,
        Correct: option.Correct
      }
    });
  },

  async finishAttempt(input: unknown) {
    const { attemptId } = FinishAttemptSchema.parse(input);

    const answers = await prisma.answer.findMany({
      where: { attemptId }
    });

    const totalQuestions = await prisma.attemptQuestion.count({
      where: { attemptId }
    });

    const correctAnswers = answers.filter(a => a.Correct).length;

    // Evitamos división por cero y calculamos score
    const score = totalQuestions > 0 ? (correctAnswers / totalQuestions) * 100 : 0;

    return await prisma.attempt.update({
      where: { id: attemptId },
      data: {
        status: "COMPLETED",
        score: score
      }
    });
  },

  async getExistingAttempt(attemptId: string) {
    const attempt = await prisma.attempt.findUnique({
      where: { id: attemptId },
      include: {
        questions: {
          include: {
            question: { include: { options: true } }
          }
        },
        answers: { select: { questionId: true } }
      }
    });

    if (!attempt) throw new Error("El intento de examen no existe.");
    if (attempt.status === "COMPLETED") throw new Error("Este examen ya fue finalizado.");

    const answeredIds = attempt.answers.map(a => a.questionId);
    const remainingQuestions = attempt.questions
      .filter(aq => !answeredIds.includes(aq.questionId))
      .map(aq => aq.question);

    return {
      attemptId: attempt.id,
      topic: attempt.topic,
      questions: remainingQuestions.map(q => ({
        id: q.id,
        questionText: q.questionText,
        options: q.options.map(o => ({ id: o.id, text: o.text }))
      }))
    };
  },

  async getAttemptStats(attemptId: string) {
    const answers = await prisma.answer.findMany({
      where: { attemptId },
      select: { Correct: true }
    });

    const totalQuestions = await prisma.attemptQuestion.count({
      where: { attemptId }
    });

    return {
      initialScore: answers.filter(a => a.Correct).length,
      totalQuestions: totalQuestions,
      answeredCount: answers.length
    };
  }

};