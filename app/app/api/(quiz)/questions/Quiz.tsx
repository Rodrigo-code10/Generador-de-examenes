"use client";
import { useState, useEffect } from "react";
import { saveAnswer, finishQuiz } from "@/modules/quiz/quiz.actions";

interface Props {
  initialQuestions: any[];
  attemptId: string;
  // Propiedades nuevas para manejar la continuación
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

  // El score no empieza en 0, empieza con lo que ya ganó el usuario
  const [score, setScore] = useState(initialScore);
  const [isFinished, setIsFinished] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Evita errores de hidratación por extensiones del navegador
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

    // Sumamos al score acumulado
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
    <div className="p-10 text-center bg-white rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold text-black">¡Quiz Completado!</h2>

      <p className="text-xl text-gray-700 mt-2">
        Puntaje Final: <span className="font-bold text-blue-600">{score} / {totalInQuiz}</span>
      </p>
      <button
        onClick={() => window.location.href = "/api"}
        className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
      >
        Volver a mi Perfil
      </button>
    </div>
  );

  const currentQ = initialQuestions[currentIdx];

  return (
    <div className="max-w-2xl mx-auto p-6 border rounded-xl shadow-lg bg-white text-black">
      <div className="mb-4 flex justify-between items-center text-sm text-gray-400">
        <span>
          Pregunta <span className="text-black font-bold">{globalQuestionNumber}</span> de {totalInQuiz}
        </span>
        {isLoading && <span className="animate-pulse text-blue-500">Guardando...</span>}
      </div>

      <div className="w-full bg-gray-100 h-2 rounded-full mb-6">
        <div
          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
          style={{ width: `${(globalQuestionNumber / totalInQuiz) * 100}%` }}
        />
      </div>

      <h3 className="text-xl font-semibold mb-6">{currentQ.questionText}</h3>

      <div className="space-y-3">
        {currentQ.options.map((opt: any) => (
          <button
            key={opt.id}
            disabled={isLoading}
            onClick={() => handleAnswer(opt.id)}
            className="w-full text-left p-4 rounded-lg border hover:bg-blue-50 hover:border-blue-300 disabled:opacity-50 transition-all focus:ring-2 focus:ring-blue-500 outline-none"
          >
            {opt.text}
          </button>
        ))}
      </div>
    </div>
  );
}