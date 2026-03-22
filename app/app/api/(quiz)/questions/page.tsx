import { startNewQuiz, getExistingQuiz } from "@/modules/quiz/quiz.actions";
import { redirect } from "next/navigation";
import { getUser } from "@/modules/auth/session";
import Quiz from "./Quiz";
import Link from "next/link";

export const dynamic = "force-dynamic";

interface QuizData {
  attemptId: string;
  topic: string;
  questions: any[];
  initialScore?: number;
  totalQuestions?: number;
  answeredCount?: number;
}

export default async function QuizPage({ searchParams }: { searchParams: Promise<any> }) {
  const user = await getUser();
  if (!user) redirect("/api/login");

  const params = await searchParams;
  
  const attemptId = params.attemptId || params.id;
  const topic = params.topic;
  // Leemos el limit de la URL, si no existe usamos 5
  const limit = params.limit ? parseInt(params.limit) : 5;

  if (!attemptId && !topic) {
    redirect("/api");
  }

  let quizData: QuizData;

  try {
    if (attemptId) {
      // Cargar examen que ya está en la DB
      quizData = await getExistingQuiz(attemptId) as QuizData;
    } else {
      // Generar uno nuevo desde cero (Ej: /quiz?topic=Matematicas&limit=3)
      quizData = await startNewQuiz(topic, limit) as QuizData;
    }

    if (!quizData || !quizData.questions || quizData.questions.length === 0) {
      throw new Error("No se encontraron preguntas.");
    }
  } catch (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-black p-4 text-center">
        <p className="text-xl font-semibold text-red-600">¡Vaya! No pudimos cargar el examen.</p>
        <p className="text-gray-500 mb-4">Asegúrate de que el tema sea válido o intenta con menos preguntas.</p>
        <Link href="/api/generate" className="bg-blue-600 text-white px-6 py-2 rounded-lg">
          Intentar de nuevo
        </Link>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-3xl">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-extrabold text-gray-900 capitalize">
             Examen de {quizData.topic}
          </h1>
          <p className="text-gray-500 mt-2">
            {quizData.questions.length} preguntas diseñadas por IA
          </p>
        </header>

        <Quiz
          key={quizData.attemptId}
          initialQuestions={quizData.questions}
          attemptId={quizData.attemptId}
          initialScore={quizData.initialScore || 0}
          totalQuestions={quizData.questions.length}
          answeredCount={quizData.answeredCount || 0}
        />
      </div>
    </main>
  );
}