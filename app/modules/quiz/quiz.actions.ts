"use server"
import { getUser } from "../auth/session";
import { QuestionsService } from "../questions/question.service";
import { QuizService } from "./quiz.service";

export async function startNewQuiz(topic: string, limit: number) {
    const user = await getUser();
    console.log("Usuario encontrado", user)
    if (!user) throw new Error("Debes iniciar sesión para jugar");

    // Pasamos objetos para que GetQuestionsSchema pueda validarlo
    const questions = await QuestionsService.getQuestions({ topic, limit });

    if (questions.length === 0) {
        throw new Error("No hay preguntas disponibles para este tema");
    }

    const questionIds = questions.map(q => q.id);
    const attempt = await QuizService.startAttempt({ userId: user.id, topic, questionIds });

    return {
        attemptId: attempt.id,
        topic: attempt.topic,
        questions: questions.map(q => ({
            id: q.id,
            questionText: q.questionText,
            options: q.options.map(o => ({ id: o.id, text: o.text }))
        }))
    };
}

export async function saveAnswer(data: { attemptId: string, questionId: string, optionId: string }) {
    const user = await getUser();
    if (!user) throw new Error("No autorizado");


    const answer = await QuizService.submitAnswer({
        attemptId: data.attemptId,
        questionId: data.questionId,
        selectedOptionId: data.optionId
    });

    return { Correct: answer.Correct };
}


export async function finishQuiz(attemptId: string) {
    const user = await getUser();
    if (!user) throw new Error("No autorizado");
    return await QuizService.finishAttempt({ attemptId });
}


export async function getExistingQuiz(attemptId: string) {
    const user = await getUser();
    if (!user) throw new Error("No autorizado");

    const quizData = await QuizService.getExistingAttempt(attemptId);
    
    const stats = await QuizService.getAttemptStats(attemptId);

    // Devolvemos todo unido
    return {
        ...quizData,      // attemptId, topic, questions (restantes)
        ...stats          // initialScore, totalQuestions, answeredCount
    };
}








