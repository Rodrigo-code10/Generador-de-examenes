"use client";
import { useState } from "react";
import { deleteQuestion, updateQuestionAction, createQuestionAction } from "@/modules/questions/questions.actions";

export default function QuestionAdminContent({ grouped }: { grouped: any }) {
  const [openTopic, setOpenTopic] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [isPending, setIsPending] = useState(false);

  const handleSave = async (data: any, id?: string) => {
    setIsPending(true);
    try {
      if (id) {
        await updateQuestionAction(id, data);
        setEditingId(null);
      } else {
        await createQuestionAction(data);
        setIsAdding(false);
      }
    } catch (error: any) {
      alert("Error crítico: " + error.message);
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* BOTÓN AGREGAR */}
      <button 
        onClick={() => setIsAdding(true)}
        disabled={isPending}
        className="group relative w-full md:w-auto px-8 py-4 bg-surface-container-high border border-primary/30 rounded-2xl overflow-hidden hover:border-primary transition-all active:scale-95 disabled:opacity-50"
      >
        <div className="relative z-10 flex items-center justify-center gap-3">
          <span className="material-symbols-outlined text-primary group-hover:rotate-90 transition-transform">add</span>
          <span className="font-black text-sm text-white uppercase tracking-widest">
            {isAdding ? "Configurando Nueva Pregunta" : "Nueva Entrada Manual"}
          </span>
        </div>
        <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
      </button>

      {/* MODAL DE CREACIÓN */}
      {isAdding && (
        <div className="p-0.5 rounded-[2.5rem] bg-linear-to-r from-primary/50 to-secondary/50 shadow-2xl animate-in zoom-in-95">
          <QuestionForm 
            isPending={isPending}
            onClose={() => setIsAdding(false)} 
            onSubmit={(data: any) => handleSave(data)}
          />
        </div>
      )}

      {/* LISTADO POR TEMAS ACORDEÓN */}
      <div className="space-y-4">
        {Object.entries(grouped).map(([topic, questions]: any) => (
          <div key={topic} className="bg-surface-container-low rounded-3xl border border-outline-variant/10 overflow-hidden backdrop-blur-md">
            <button 
              onClick={() => setOpenTopic(openTopic === topic ? null : topic)}
              className="w-full flex justify-between items-center p-6 hover:bg-white/2 transition-all"
            >
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center border border-primary/20">
                  <span className="material-symbols-outlined text-primary text-sm">folder_open</span>
                </div>
                <span className="font-black uppercase tracking-[0.2em] text-white text-sm italic">{topic}</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-[10px] font-black text-on-surface-variant bg-surface-container-highest px-3 py-1 rounded-full border border-white/5">
                  {questions.length} ITEMS
                </span>
                <span className={`material-symbols-outlined text-primary transition-transform duration-500 ${openTopic === topic ? 'rotate-180' : ''}`}>
                  expand_more
                </span>
              </div>
            </button>

            {openTopic === topic && (
              <div className="p-6 pt-0 grid grid-cols-1 gap-4 animate-in slide-in-from-top-4">
                {questions.map((q: any) => (
                  <div key={q.id}>
                    {editingId === q.id ? (
                      <QuestionForm 
                        initialData={q} 
                        isPending={isPending}
                        onClose={() => setEditingId(null)}
                        onSubmit={(data: any) => handleSave(data, q.id)}
                      />
                    ) : (
                      <QuestionCard 
                        q={q} 
                        onEdit={() => setEditingId(q.id)} 
                        onDelete={() => deleteQuestion(q.id)}
                      />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// --- TARJETA DE VISTA ---
function QuestionCard({ q, onEdit, onDelete }: any) {
  return (
    <div className="group bg-surface-container-highest/30 border border-outline-variant/10 rounded-2xl p-5 flex justify-between items-center hover:border-primary/30 transition-all">
      <div className="space-y-3 flex-1">
        <p className="font-bold text-white leading-relaxed text-sm">{q.questionText}</p>
        <div className="flex flex-wrap gap-2">
          {q.options.map((opt: any) => (
            <span key={opt.id} className={`text-[9px] px-3 py-1 rounded-full border uppercase font-black tracking-tighter transition-all ${
              opt.Correct 
              ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.1)]" 
              : "bg-surface-container-low border-white/5 text-on-surface-variant/50"
            }`}>
              {opt.text}
            </span>
          ))}
        </div>
      </div>
      <div className="flex gap-2 ml-6 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
        <button onClick={onEdit} className="w-9 h-9 flex items-center justify-center rounded-xl bg-primary/10 text-primary hover:bg-primary hover:text-black transition-all">
          <span className="material-symbols-outlined text-sm">edit</span>
        </button>
        <button onClick={() => confirm("¿Eliminar registro permanente?") && onDelete()} className="w-9 h-9 flex items-center justify-center rounded-xl bg-error/10 text-error hover:bg-error hover:text-white transition-all">
          <span className="material-symbols-outlined text-sm">delete</span>
        </button>
      </div>
    </div>
  );
}

// --- FORMULARIO DE EDICIÓN/CREACIÓN ---
function QuestionForm({ initialData, onClose, onSubmit, isPending }: any) {
  const [questionText, setQuestionText] = useState(initialData?.questionText || "");
  const [topic, setTopic] = useState(initialData?.topic || "");
  const [options, setOptions] = useState(initialData?.options || [
    { text: "", Correct: true },
    { text: "", Correct: false },
    { text: "", Correct: false },
    { text: "", Correct: false }
  ]);

  return (
    <div className="bg-surface-container-low p-8 rounded-4xl border border-outline-variant/20 shadow-2xl space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-2">
           <label className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Enunciado de la Pregunta</label>
           <textarea 
            className="w-full p-4 bg-surface-container-highest border border-outline-variant/30 rounded-2xl text-white outline-none focus:border-primary transition-all text-sm h-32 resize-none" 
            placeholder="Escriba la pregunta aquí..."
            value={questionText} 
            onChange={(e) => setQuestionText(e.target.value)}
          />
        </div>
        <div className="space-y-2">
           <label className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Categoría</label>
           <input 
            className="w-full p-4 bg-surface-container-highest border border-outline-variant/30 rounded-2xl text-white outline-none focus:border-primary transition-all text-sm font-bold italic" 
            placeholder="Ej: CIENCIA"
            value={topic} 
            onChange={(e) => setTopic(e.target.value)}
          />
        </div>
      </div>
      
      <div className="space-y-4">
        <p className="text-[10px] font-black text-on-surface-variant uppercase tracking-[0.2em] border-b border-outline-variant/10 pb-2">Configuración de Respuestas</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {options.map((opt: any, i: number) => (
            <div key={i} className={`flex items-center gap-4 p-4 border rounded-2xl transition-all ${opt.Correct ? 'border-emerald-500/50 bg-emerald-500/5 shadow-[0_0_15px_rgba(16,185,129,0.05)]' : 'bg-surface-container-highest border-white/5'}`}>
              <input 
                type="radio" 
                name="correct-option"
                checked={opt.Correct} 
                onChange={() => {
                  const newOpts = options.map((o: any, idx: number) => ({ ...o, Correct: idx === i }));
                  setOptions(newOpts);
                }}
                className="w-5 h-5 accent-emerald-500 cursor-pointer"
              />
              <input 
                className="flex-1 bg-transparent text-sm outline-none font-bold text-white placeholder:text-on-surface-variant/30" 
                placeholder={`Opción ${i + 1}`}
                value={opt.text} 
                onChange={(e) => {
                  const newOpts = [...options];
                  newOpts[i].text = e.target.value;
                  setOptions(newOpts);
                }}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end gap-4 pt-6 border-t border-outline-variant/10">
        <button onClick={onClose} disabled={isPending} className="px-6 py-2 text-on-surface-variant font-black text-xs uppercase hover:text-white transition">Cancelar</button>
        <button 
          onClick={() => onSubmit({ questionText, topic, options })}
          disabled={isPending || !questionText || !topic}
          className="px-10 py-3 bg-linear-to-r from-primary to-secondary text-black rounded-xl font-black text-xs uppercase shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all disabled:opacity-20"
        >
          {isPending ? "Sincronizando..." : "Guardar Cambios"}
        </button>
      </div>
    </div>
  );
}