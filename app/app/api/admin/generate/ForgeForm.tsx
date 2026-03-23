"use client";
import { useState } from "react";
import { adminGenerateQuestions } from "@/modules/questions/questions.actions";

export default function ForgeForm() {
  const [topic, setTopic] = useState("");
  const [amount, setAmount] = useState(5);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error', msg: string } | null>(null);

  const handleGenerate = async () => {
    if (!topic) return;
    setLoading(true);
    setStatus(null);
    
    try {
      const result = await adminGenerateQuestions(topic, amount);
      if (result.success) {
        setStatus({ 
          type: 'success', 
          msg: `¡Éxito! Añadidas ${result.count} preguntas de "${topic}".` 
        });
        setTopic(""); 
      } else {
        setStatus({ type: 'error', msg: result.error || "Error al generar" });
      }
    } catch (error) {
      setStatus({ type: 'error', msg: "Fallo de conexión con la IA" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
      {/* COLUMNA 1: CONFIGURACIÓN */}
      <div className="bg-surface-container-low p-8 rounded-[2.5rem] border border-outline-variant/10 backdrop-blur-md space-y-8 shadow-2xl">
        <div className="flex items-center gap-2 mb-2">
          <span className="material-symbols-outlined text-primary">settings</span>
          <h2 className="text-sm font-black text-white uppercase tracking-widest">Configuración</h2>
        </div>

        <div className="space-y-4">
          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant ml-1">Tema del Banco</label>
          <input 
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="Ej: React Server Components..."
            className="w-full px-6 py-5 bg-surface-container-highest/50 border border-outline-variant/20 rounded-2xl text-white outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/5 transition-all font-medium"
          />
        </div>

        <div className="space-y-4">
          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant ml-1">Cantidad a generar</label>
          <div className="flex gap-3">
            {[5, 10, 15].map((val) => (
              <button
                key={val}
                type="button"
                onClick={() => setAmount(val)}
                className={`flex-1 py-4 rounded-2xl font-black transition-all border-2 ${
                  amount === val 
                  ? 'bg-primary border-primary text-black shadow-lg shadow-primary/20 scale-105' 
                  : 'bg-surface-container-highest border-transparent text-on-surface-variant hover:border-outline-variant/30'
                }`}
              >
                {val}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* COLUMNA 2: ACCIÓN Y ESTADO */}
      <div className="space-y-6">
        <div className="bg-surface-container-highest/30 p-8 rounded-[2.5rem] border border-dashed border-outline-variant/30 flex flex-col items-center text-center space-y-6">
          <div className={`w-20 h-20 rounded-full flex items-center justify-center transition-all duration-500 ${loading ? 'animate-pulse bg-primary/10' : 'bg-surface-container-low'}`}>
            <span className={`material-symbols-outlined text-4xl ${loading ? 'text-primary' : 'text-on-surface-variant'}`}>
              {loading ? 'memory' : 'auto_awesome'}
            </span>
          </div>

          <div className="space-y-2 text-balance">
            <h3 className="text-xl font-bold text-white">Motor IA Listo</h3>
            <p className="text-sm text-on-surface-variant px-4">
              Se generarán preguntas con 4 opciones y su respectiva respuesta correcta.
            </p>
          </div>

          <button 
            onClick={handleGenerate}
            disabled={loading || !topic}
            className="w-full py-5 bg-linear-to-r from-primary to-secondary rounded-2xl text-black font-black text-lg shadow-xl hover:shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-20 disabled:grayscale"
          >
            {loading ? "GENERANDO..." : "LANZAR GENERACIÓN"}
          </button>
        </div>

        {status && (
          <div className={`p-6 rounded-4xl border flex items-start gap-4 animate-in slide-in-from-top-2 duration-300 ${
            status.type === 'success' 
            ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
            : 'bg-error/10 border-error/20 text-error'
          }`}>
            <span className="material-symbols-outlined mt-1">
              {status.type === 'success' ? 'verified' : 'warning'}
            </span>
            <div className="space-y-1 text-left">
              <p className="font-black text-xs uppercase tracking-widest italic">Reporte</p>
              <p className="text-sm font-bold opacity-90 leading-tight">{status.msg}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}