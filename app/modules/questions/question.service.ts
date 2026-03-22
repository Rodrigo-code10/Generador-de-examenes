import { prisma } from "@/lib/prisma";
import { GetQuestionsInput, CreateQuestionInput } from "./questions.schema";

export const QuestionsService = {
  async getQuestions(params: GetQuestionsInput) {
    const { limit, topic } = params;

    const allIds = await prisma.question.findMany({
      where: topic ? { topic } : {},
      select: { id: true },
    });

    if (allIds.length === 0) return [];

    const shuffledIds = allIds      //Da preguntas randoms
      .sort(() => Math.random() - 0.5)
      .slice(0, limit)
      .map((q) => q.id);

    return await prisma.question.findMany({
      where: { id: { in: shuffledIds } },
      include: { options: true },
    });
  },

  async createQuestion(data: CreateQuestionInput) {
    return await prisma.question.create({
      data: {
        questionText: data.questionText,
        topic: data.topic,
        options: {
          create: data.options.map(opt => ({
            text: opt.text,
            Correct: opt.Correct
          })),
        },
      },
    });
  }
};