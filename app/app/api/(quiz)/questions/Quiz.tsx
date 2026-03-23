"use client";
import { useState, useEffect } from "react";
import { saveAnswer, finishQuiz } from "@/modules/quiz/quiz.actions";

interface Props {
  initialQuestions: any[];
  attemptId: string;
  initialScore?: number;
  totalQuestions?: number;
  answeredCount?: number;
}

export default function Quiz({
  initialQuestions,
  attemptId,
  initialScore = 0,
  totalQuestions = 0,
  answeredCount = 0
}: Props) {
  const [mounted, setMounted] = useState(false);
  const [currentIdx, setCurrentIdx] = useState(0);

  const [score, setScore] = useState(initialScore);
  const [isFinished, setIsFinished] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const globalQuestionNumber = answeredCount + currentIdx + 1;
  const totalInQuiz = totalQuestions || initialQuestions.length;

  const handleAnswer = async (optionId: string) => {
    if (isLoading) return;
    setIsLoading(true);

    const questionId = initialQuestions[currentIdx].id;
    const res = await saveAnswer({ attemptId, questionId, optionId });

    if (res.Correct) setScore(s => s + 1);

    if (currentIdx + 1 < initialQuestions.length) {
      setCurrentIdx(i => i + 1);
      setIsLoading(false);
    } else {
      try {
        await finishQuiz(attemptId);
        setIsFinished(true);
      } catch (error) {
        console.error("Error al finalizar:", error);
        setIsFinished(true);
      } finally {
        setIsLoading(false);
      }
    }
  };

  if (isFinished) return (
    <div className="p-10 text-center bg-black border border-gray-800 rounded-xl shadow-2xl">
      <h2 className="text-2xl font-bold text-white uppercase italic">¡Quiz Completado!</h2>

      <p className="text-xl text-gray-400 mt-4">
        Puntaje Final: <span className="font-black text-blue-500">{score} / {totalInQuiz}</span>
      </p>
      <button
        onClick={() => window.location.href = "/api/users"}
        className="mt-8 px-8 py-3 bg-blue-600 text-white font-black rounded-lg hover:bg-blue-700 transition-all uppercase text-xs tracking-widest"
      >
        Volver a mi Perfil
      </button>
    </div>
  );

  const currentQ = initialQuestions[currentIdx];

  return (
    <div className="max-w-2xl mx-auto p-8 border border-gray-800 rounded-2xl shadow-2xl bg-black text-white">
      <div className="mb-6 flex justify-between items-center text-[10px] uppercase font-black tracking-widest text-gray-500">
        <span>
          Pregunta <span className="text-blue-500">{globalQuestionNumber}</span> de {totalInQuiz}
        </span>
        {isLoading && <span className="animate-pulse text-blue-500">Sincronizando...</span>}
      </div>

      <div className="w-full bg-gray-900 h-1.5 rounded-full mb-8 overflow-hidden">
        <div
          className="bg-blue-600 h-full rounded-full transition-all duration-500 ease-out shadow-[0_0_10px_rgba(37,99,235,0.5)]"
          style={{ width: `${(globalQuestionNumber / totalInQuiz) * 100}%` }}
        />
      </div>

      <h3 className="text-xl font-bold mb-8 leading-relaxed italic">{currentQ.questionText}</h3>

      <div className="space-y-3">
        {currentQ.options.map((opt: any) => (
          <button
            key={opt.id}
            disabled={isLoading}
            onClick={() => handleAnswer(opt.id)}
            className="w-full text-left p-5 rounded-xl border border-gray-800 bg-gray-900/50 text-gray-300 hover:bg-blue-600 hover:text-white hover:border-blue-500 disabled:opacity-50 transition-all outline-none font-medium text-sm group flex justify-between items-center"
          >
            {opt.text}
            <span className="opacity-0 group-hover:opacity-100 transition-opacity text-xs">→</span>
          </button>
        ))}
      </div>
    </div>
  );
}