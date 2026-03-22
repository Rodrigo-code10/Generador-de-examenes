"use client";
import { useState } from "react";
import { 
  deleteQuestion, 
  updateQuestionAction, 
  createQuestionAction 
} from "@/modules/questions/questions.actions";

export default function QuestionAdminContent({ grouped }: { grouped: any }) {
  const [openTopic, setOpenTopic] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [isPending, setIsPending] = useState(false);

  // Función genérica para manejar el guardado (Crear o Editar)
  const handleSave = async (data: any, id?: string) => {
    setIsPending(true);
    try {
      if (id) {
        //Requiere 2 argumentos
        await updateQuestionAction(id, data);
        setEditingId(null);
      } else {
        // Requiere 1 argumento
        await createQuestionAction(data);
        setIsAdding(false);
      }
    } catch (error: any) {
      alert("Error al guardar: " + error.message);
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="space-y-6">
      <button 
        onClick={() => setIsAdding(true)}
        disabled={isPending}
        className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition w-full md:w-auto disabled:opacity-50"
      >
        {isAdding ? "Escribiendo nueva pregunta..." : "+ Agregar Nueva Pregunta Manual"}
      </button>

      {/* MODAL DE CREACIÓN */}
      {isAdding && (
        <div className="border-2 border-dashed border-blue-200 rounded-2xl p-2 bg-blue-50/30">
          <QuestionForm 
            isPending={isPending}
            onClose={() => setIsAdding(false)} 
            onSubmit={(data: any) => handleSave(data)} // Sin ID = Crear
          />
        </div>
      )}

      {/* LISTADO POR TEMAS */}
      {Object.entries(grouped).map(([topic, questions]: any) => (
        <div key={topic} className="border rounded-2xl bg-white overflow-hidden shadow-sm">
          <button 
            onClick={() => setOpenTopic(openTopic === topic ? null : topic)}
            className="w-full flex justify-between items-center p-5 bg-gray-50 hover:bg-gray-100 transition"
          >
            <div className="flex items-center gap-3">
               <span className="font-black uppercase tracking-wider text-blue-600">{topic}</span>
            </div>
            <span className="text-gray-400 font-bold">{openTopic === topic ? "▲" : "▼"} ({questions.length})</span>
          </button>

          {openTopic === topic && (
            <div className="p-5 grid grid-cols-1 gap-4 bg-white">
              {questions.map((q: any) => (
                <div key={q.id}>
                  {editingId === q.id ? (
                    <QuestionForm 
                      initialData={q} 
                      isPending={isPending}
                      onClose={() => setEditingId(null)}
                      onSubmit={(data: any) => handleSave(data, q.id)} // Con ID = Editar
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
  );
}

// --- TARJETA DE VISTA ---
function QuestionCard({ q, onEdit, onDelete }: any) {
  return (
    <div className="border rounded-xl p-4 flex justify-between items-start bg-white hover:border-blue-200 transition group">
      <div className="flex-1">
        <p className="font-bold text-gray-800 mb-3 leading-snug">{q.questionText}</p>
        <div className="flex flex-wrap gap-2">
          {q.options.map((opt: any) => (
            <span key={opt.id} className={`text-[10px] px-2 py-1 rounded-md border ${opt.Correct ? "bg-green-50 border-green-200 text-green-700 font-bold" : "bg-gray-50 border-gray-100 text-gray-400"}`}>
              {opt.Correct && " "} {opt.text}
            </span>
          ))}
        </div>
      </div>
      <div className="flex gap-4 ml-4 opacity-0 group-hover:opacity-100 transition-opacity">
        <button onClick={onEdit} className="text-blue-600 text-xs font-bold hover:bg-blue-50 px-2 py-1 rounded">Editar</button>
        <button onClick={() => confirm("¿Seguro que quieres borrar esta pregunta? Se borrarán sus respuestas asociadas.") && onDelete()} className="text-red-500 text-xs font-bold hover:bg-red-50 px-2 py-1 rounded">Eliminar</button>
      </div>
    </div>
  );
}

// Formulario
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
    <div className="bg-white p-6 rounded-xl border-2 border-blue-600 shadow-xl space-y-4 animate-in fade-in zoom-in duration-200">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
           <label className="text-xs font-black text-gray-400 uppercase">Pregunta</label>
           <textarea 
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm h-24" 
            placeholder="¿Cuál es la capital de...?"
            value={questionText} 
            onChange={(e) => setQuestionText(e.target.value)}
          />
        </div>
        <div className="space-y-2">
           <label className="text-xs font-black text-gray-400 uppercase">Tema / Categoría</label>
           <input 
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm" 
            placeholder="Ej: Geografía"
            value={topic} 
            onChange={(e) => setTopic(e.target.value)}
          />
        </div>
      </div>
      
      <div className="space-y-3">
        <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Opciones de Respuesta</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {options.map((opt: any, i: number) => (
            <div key={i} className={`flex items-center gap-3 p-3 border rounded-xl transition-all ${opt.Correct ? 'border-green-500 bg-green-50' : 'bg-gray-50'}`}>
              <input 
                type="radio" 
                name="correct-option"
                checked={opt.Correct} 
                onChange={() => {
                  const newOpts = options.map((o: any, idx: number) => ({ ...o, Correct: idx === i }));
                  setOptions(newOpts);
                }}
                className="w-4 h-4 accent-green-600 cursor-pointer"
              />
              <input 
                className="flex-1 bg-transparent text-sm outline-none font-medium" 
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

      <div className="flex justify-end gap-3 pt-4 border-t">
        <button onClick={onClose} disabled={isPending} className="px-6 py-2 text-gray-400 font-bold hover:text-gray-600 transition disabled:opacity-0">Cancelar</button>
        <button 
          onClick={() => onSubmit({ questionText, topic, options })}
          disabled={isPending || !questionText || !topic}
          className="px-8 py-2 bg-blue-600 text-white rounded-xl font-black text-sm hover:bg-blue-700 shadow-lg shadow-blue-200 transition disabled:opacity-50"
        >
          {isPending ? "Guardando..." : "Confirmar y Guardar"}
        </button>
      </div>
    </div>
  );
}