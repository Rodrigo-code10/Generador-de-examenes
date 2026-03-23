'use client'
import { useState } from "react"
import { useRouter } from "next/navigation"

// Diccionario para asignar iconos/colores automáticamente según el nombre del tema
const THEME_MAP: Record<string, { icon: string, color: string }> = {
  ciencia: { icon: 'science', color: 'from-blue-500 to-cyan-400' },
  historia: { icon: 'history_edu', color: 'from-orange-500 to-yellow-400' },
  tecnologia: { icon: 'terminal', color: 'from-purple-500 to-pink-400' },
  default: { icon: 'quiz', color: 'from-primary/60 to-secondary/60' }
};

export default function Selection({ topicsFromDb }: { topicsFromDb: string[] }) {
  const router = useRouter();
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [limit, setLimit] = useState(5);

  const handleStart = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedTopic) {
      router.push(`/api/questions?topic=${selectedTopic}&limit=${limit}`);
    }
  };

  return (
    <form onSubmit={handleStart} className="w-full space-y-12">
      
      {/* 1. Grid de Temas (Vienen de la BD) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {topicsFromDb.map((topic) => {
          const config = THEME_MAP[topic] || THEME_MAP.default;
          
          return (
            <button
              key={topic}
              type="button"
              onClick={() => setSelectedTopic(topic)}
              className={`p-5 rounded-2xl border transition-all duration-300 flex flex-col items-center gap-3 
                ${selectedTopic === topic 
                  ? 'bg-surface-container-high border-primary shadow-[0_0_20px_rgba(129,236,255,0.3)] scale-105' 
                  : 'bg-surface-container-low border-outline-variant/20 hover:border-outline-variant'
                }`}
            >
              <div className={`w-12 h-12 rounded-xl bg-linear-to-br ${config.color} flex items-center justify-center text-white shadow-lg`}>
                <span className="material-symbols-outlined text-2xl">{config.icon}</span>
              </div>
              <span className="font-bold text-xs uppercase tracking-widest text-center">
                {topic}
              </span>
            </button>
          );
        })}
      </div>

      {/* 2. Selector de Límite (Solo aparece al elegir un tema) */}
      <div className={`space-y-8 transition-all duration-500 transform ${selectedTopic ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}`}>
        
        <div className="bg-surface-container-low/50 border border-outline-variant/20 p-8 rounded-3xl text-center backdrop-blur-md">
          <label className="block text-xs font-black uppercase tracking-[0.2em] text-on-surface-variant mb-6">
            ¿Cuántas preguntas quieres?
          </label>
          
          <div className="flex justify-center items-center gap-4 sm:gap-8">
            {[5, 10, 15, 20].map((num) => (
              <button
                key={num}
                type="button"
                onClick={() => setLimit(num)}
                className={`w-14 h-14 rounded-full font-black transition-all border-2 
                  ${limit === num 
                    ? 'bg-primary border-primary text-black shadow-[0_0_15px_rgba(129,236,255,0.5)] scale-110' 
                    : 'bg-transparent border-outline-variant/30 text-on-surface-variant hover:border-primary/50'
                  }`}
              >
                {num}
              </button>
            ))}
          </div>
        </div>

        {/* 3. Botón Final */}
        <div className="flex justify-center">
          <button
            type="submit"
            className="w-full sm:w-80 h-16 bg-linear-to-br from-primary to-secondary rounded-full text-black font-black text-xl shadow-[0_10px_40px_rgba(0,210,255,0.3)] hover:shadow-[0_15px_50px_rgba(129,236,255,0.5)] active:scale-95 transition-all duration-300"
          >
            GENERAR EXAMEN
          </button>
        </div>
      </div>
    </form>
  );
}