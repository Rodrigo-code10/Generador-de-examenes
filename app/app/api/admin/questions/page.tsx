import { protectAdmin } from "@/modules/auth/auth.actions";
import { getQuestionsWithDetails } from "@/modules/questions/questions.actions";
import QuestionAdminContent from "./QuestionContent";

export default async function AdminQuestionsPage() {
  await protectAdmin(); 
  const grouped = await getQuestionsWithDetails();

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      {/* HEADER ESTRATÉGICO */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-l-4 border-primary pl-6">
        <div>
          <h1 className="text-4xl font-black text-white italic tracking-tighter">
            BANCO DE <span className="text-primary font-light">CONOCIMIENTO</span>
          </h1>
          <p className="text-on-surface-variant text-xs font-bold uppercase tracking-[0.2em] mt-1">
            Gestión integral de reactivos y categorías
          </p>
        </div>
        
        <div className="flex items-center gap-2 bg-surface-container-high px-4 py-2 rounded-xl border border-outline-variant/20">
          <span className="material-symbols-outlined text-primary text-sm">database</span>
          <span className="text-[10px] font-black text-white uppercase tracking-widest">
            {Object.keys(grouped).length} Temas Activos
          </span>
        </div>
      </header>

      {/* CONTENIDO INTERACTIVO */}
      <QuestionAdminContent grouped={grouped} />
    </div>
  );
}