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
  const limit = params.limit ? parseInt(params.limit) : 5;

  if (!attemptId && !topic) {
    redirect("/api");
  }

  let quizData: QuizData;

  try {
    if (attemptId) {
      quizData = await getExistingQuiz(attemptId) as QuizData;
    } else {
      quizData = await startNewQuiz(topic, limit) as QuizData;
    }

    if (!quizData || !quizData.questions || quizData.questions.length === 0) {
      throw new Error("No se encontraron preguntas.");
    }
  } catch (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-4 text-center">
        <div className="w-16 h-16 bg-red-900/20 border border-red-500/50 rounded-full flex items-center justify-center mb-6 text-red-500">
           <span className="text-3xl">!</span>
        </div>
        <p className="text-xl font-black italic uppercase tracking-tighter">¡Vaya! No pudimos cargar el examen.</p>
        <p className="text-gray-500 mb-8 mt-2 text-sm">Asegúrate de que el tema sea válido o intenta con menos preguntas.</p>
        <Link href="/api/generate" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all">
          Intentar de nuevo
        </Link>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-black py-12 px-4 selection:bg-blue-500 selection:text-white">
      <div className="container mx-auto max-w-3xl">
        <header className="text-center mb-12 animate-in fade-in slide-in-from-top-4 duration-700">
          <h1 className="text-4xl md:text-5xl font-black text-white capitalize italic tracking-tighter">
             Examen de <span className="text-blue-500">{quizData.topic}</span>
          </h1>
          <p className="text-gray-500 mt-3 text-xs font-black uppercase tracking-[0.3em]">
            {quizData.questions.length} preguntas diseñadas por IA
          </p>
        </header>

        <div className="relative">
          {/* Brillo sutil de fondo */}
          <div className="absolute inset-0 bg-blue-600/5 blur-[100px] rounded-full pointer-events-none" />
          
          <Quiz
            key={quizData.attemptId}
            initialQuestions={quizData.questions}
            attemptId={quizData.attemptId}
            initialScore={quizData.initialScore || 0}
            totalQuestions={quizData.questions.length}
            answeredCount={quizData.answeredCount || 0}
          />
        </div>

        <footer className="mt-12 text-center">
           <p className="text-[9px] font-black text-gray-700 uppercase tracking-[0.5em]">
             Session ID: {quizData.attemptId.split('-')[0]}
           </p>
        </footer>
      </div>
    </main>
  );
}