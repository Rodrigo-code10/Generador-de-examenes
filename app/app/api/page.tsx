import { QuizService } from "@/modules/quiz/quiz.service";
import { getUser } from "@/modules/auth/session";
import Link from "next/link";
import Selection from "./Selection";

export default async function QuizPage() {
  const user = await getUser();
  const topics = await QuizService.getUniqueTopics();

  return (
    <div className="bg-surface text-on-surface font-body min-h-screen flex flex-col overflow-x-hidden relative">
      
      {/* Efectos de Brillo Ambiental */}
      <div className="fixed top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[radial-gradient(circle_at_center,rgba(129,236,255,0.15)_0%,transparent_70%)] pointer-events-none z-0"></div>
      <div className="fixed bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[radial-gradient(circle_at_center,rgba(129,236,255,0.15)_0%,transparent_70%)] pointer-events-none z-0"></div>

      {/* BOTÓN DE PERFIL EN LA ESQUINA SUPERIOR DERECHA */}
      <nav className="absolute top-4 right-4 sm:top-8 sm:right-8 z-50">
        <Link href="/api/users" title="Ir a mi perfil" className="group block">
          <div className="relative p-px rounded-full bg-outline-variant/30 group-hover:bg-linear-to-tr group-hover:from-primary group-hover:to-secondary transition-all duration-500 shadow-2xl">
            <div className="bg-surface-container-highest rounded-full pl-4 pr-1 py-1 flex items-center gap-3 backdrop-blur-md border border-white/5">
              <div className="flex flex-col items-end md:flex">
                <span className="text-[9px] font-black uppercase tracking-[0.15em] text-primary leading-none mb-1">Mi Perfil</span>
                <span className="text-xs font-bold text-white/80 leading-none">{user?.name || 'Usuario'}</span>
              </div>
              <div className="w-10 h-10 rounded-full bg-surface-container-low flex items-center justify-center border border-outline-variant/20 group-hover:border-primary/50 transition-colors">
                <span className="material-symbols-outlined text-primary text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                  person
                </span>
              </div>
            </div>
          </div>
        </Link>
      </nav>

      <main className="relative z-10 grow flex flex-col items-center justify-center px-6 py-20 max-w-4xl mx-auto w-full">
        
        {/* Cabecera Central */}
        <div className="mb-12 text-center">
          <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center rounded-2xl bg-surface-container-highest shadow-[0_0_30px_rgba(129,236,255,0.2)] border border-outline-variant/20">
            <span className="material-symbols-outlined text-primary text-4xl">
              quiz
            </span>
          </div>
          <h1 className="font-headline text-4xl sm:text-6xl font-black text-white italic tracking-tighter mb-2">
            QUIZ MASTER
          </h1>
          <p className="text-on-surface-variant font-bold tracking-[0.2em] uppercase text-[10px] opacity-70">
            Elige tu próximo desafío
          </p>
        </div>

        {/* Componente de selección (Temas de la BD + Límite) */}
        <Selection topicsFromDb={topics} />

      </main>

      {/* Decoración inferior */}
      <div className="fixed bottom-0 left-0 w-full h-px bg-linear-to-r from-transparent via-primary/20 to-transparent"></div>
    </div>
  );
}