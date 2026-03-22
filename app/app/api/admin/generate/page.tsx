"use client";
import { useState } from "react";
import { adminGenerateQuestions } from "@/modules/questions/questions.actions";

export default function AIGeneratorPage() {
  const [topic, setTopic] = useState("");
  const [amount, setAmount] = useState(5); // Este es el 'amount' (cantidad)
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!topic) return alert("Escribe un tema");
    
    setLoading(true);
    const result = await adminGenerateQuestions(topic, amount);

    if (result.success) {
      alert(`Se añadieron ${result.count} preguntas de ${topic} al banco.`);
      setTopic(""); // Limpiamos el input
    } else {
      alert(result.error);
    }
    setLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto p-8">
      <h1 className="text-3xl font-black mb-2 text-black">Generador IA</h1>
      <p className="text-gray-500 mb-8">Crea contenido para el banco de preguntas automáticamente.</p>

      <div className="bg-white p-8 rounded-3xl border shadow-sm space-y-6">
        {/* INPUT DEL TEMA */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase text-gray-400">Tema</label>
          <input 
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="Ej: Programación en Python"
            className="w-full p-4 bg-gray-50 border rounded-2xl text-black outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* SELECT DE CANTIDAD (AMOUNT) */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase text-gray-400">¿Cuántas preguntas?</label>
          <select 
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            className="w-full p-4 bg-gray-50 border rounded-2xl text-black outline-none"
          >
            <option value={5}>Generar 5 preguntas</option>
            <option value={10}>Generar 10 preguntas</option>
            <option value={15}>Generar 15 preguntas</option>
          </select>
        </div>

        {/* BOTÓN DE ACCIÓN */}
        <button 
          onClick={handleGenerate}
          disabled={loading || !topic}
          className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black hover:bg-blue-700 transition-all disabled:opacity-50"
        >
          {loading ? "Generando... espera un momento" : "Generar y Guardar"}
        </button>
      </div>
    </div>
  );
}