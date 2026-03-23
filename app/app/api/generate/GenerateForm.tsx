"use client";
import { useState } from "react";
import { generateAndStartQuiz } from "@/modules/ia/ia.actions";

export default function GenerateForm() {
    const [topic, setTopic] = useState("");
    const [limit, setLimit] = useState(5);
    const [loading, setLoading] = useState(false);

    const handleGenerate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!topic || loading) return;

        setLoading(true);
        try {
            // Llamamos a la acción
            await generateAndStartQuiz(topic, limit);
            // Si llega aquí, el redirect ya se encargó de todo
        } catch (error: any) {
            // Solo mostramos alerta si NO es un error de redirect de Next.js
            if (error.message !== "NEXT_REDIRECT") {
                console.error(error);
                alert("Hubo un problema al crear el examen.");
                setLoading(false);
            }
        }
    };

    return (
        <form onSubmit={handleGenerate} className="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-md border border-gray-100">
            <div className="text-center mb-8">
                <h1 className="text-3xl font-black text-black mb-2">IA Quiz</h1>
                <p className="text-gray-500 font-medium">Gemini creará un examen único para ti.</p>
            </div>

            <div className="space-y-4">
                <div>
                    <label className="text-xs font-bold text-gray-400 uppercase ml-1">¿De qué quieres el examen?</label>
                    <input
                        type="text"
                        placeholder="Ej: React, Historia, Cocina..."
                        className="w-full p-4 border-2 border-gray-50 rounded-2xl bg-gray-50 text-black outline-none focus:border-blue-500 transition-all"
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                        disabled={loading}
                    />
                </div>

                <div>
                    <label className="text-xs font-bold text-gray-400 uppercase ml-1">Número de preguntas</label>
                    <select
                        value={limit}
                        onChange={(e) => setLimit(Number(e.target.value))}
                        disabled={loading}
                        className="w-full p-4 border-2 border-gray-50 rounded-2xl bg-gray-50 text-black outline-none focus:border-blue-500 transition-all appearance-none"
                    >
                        <option value={5}>5 Preguntas</option>
                        <option value={10}>10 Preguntas</option>
                        <option value={15}>15 Preguntas</option>
                    </select>
                </div>

                <button
                    type="submit"
                    disabled={loading || !topic}
                    className="w-full bg-blue-600 text-white p-4 rounded-2xl font-black text-lg hover:bg-blue-700 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:hover:scale-100 shadow-xl shadow-blue-100"
                >
                    {loading ? (
                        <span className="flex items-center justify-center gap-2">
                            <span className="animate-spin text-xl">⏳</span> Preparando...
                        </span>
                    ) : "Empezar Examen"}
                </button>
            </div>
        </form>
    );
}