import { getUser } from "@/modules/auth/session";
import { redirect } from "next/navigation";
import Link from "next/link";
import { handleLogout } from "@/modules/auth/auth.actions";
import { UsersServiceOne } from "@/modules/users/users.service";

export default async function ProfilePage() {
  const session = await getUser();
  if (!session) redirect("/api/login");

  const profile = await UsersServiceOne.getUserProfile(session.id);

  if (!profile) return <div className="text-white p-10">Usuario no encontrado</div>;

  return (
    <main className="min-h-screen bg-surface text-on-surface p-6 pb-20">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Cabecera de Perfil */}
        <section className="bg-surface-container-low p-6 rounded-2xl border border-outline-variant/30 flex justify-between items-center shadow-lg">
          <div>
            <h1 className="font-headline text-3xl font-black text-white leading-tight">
              {profile.name}
            </h1>
            <p className="text-on-surface-variant font-medium">{profile.email}</p>
          </div>

          <div className="flex items-center gap-3">
            {/* BOTÓN HOME AÑADIDO AQUÍ */}
            <Link 
              href="/api" 
              className="bg-surface-container-highest text-primary px-5 py-2.5 rounded-xl font-bold hover:bg-primary/10 transition-all border border-primary/20 flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-xl">home</span>
              Inicio
            </Link>

            <form action={handleLogout}>
              <button className="bg-error-container/10 text-error px-5 py-2.5 rounded-xl font-bold hover:bg-error-container/20 transition-all border border-error/20 flex items-center gap-2">
                <span className="material-symbols-outlined text-xl">logout</span>
                Cerrar Sesión
              </button>
            </form>
          </div>
        </section>

        {/* Banner Generador AI */}
        <section className="bg-linear-to-r from-blue-600 to-primary/60 p-8 rounded-3xl text-white shadow-2xl relative overflow-hidden group">
          <div className="relative z-10">
            <h2 className="font-headline text-2xl font-black mb-2">Generador AI</h2>
            <p className="mb-6 opacity-90 max-w-sm text-sm">
              Crea un examen personalizado usando el poder de Gemini AI para medir tus conocimientos.
            </p>
            <Link 
              href="/api/generate" 
              className="bg-white text-blue-700 px-8 py-3 rounded-full font-black text-sm uppercase tracking-wider shadow-xl hover:scale-105 transition-transform inline-flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-lg">psychology</span>
              Generar con Gemini
            </Link>
          </div>
          {/* Decoración de fondo */}
          <div className="absolute right-[-10%] top-[-20%] w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none group-hover:bg-white/20 transition-all duration-700"></div>
        </section>

        {/* Sección de Exámenes */}
        <section>
          <div className="flex items-center gap-3 mb-6">
             <span className="material-symbols-outlined text-primary">history</span>
             <h2 className="font-headline text-2xl font-bold text-white tracking-tight">Mis Exámenes</h2>
          </div>

          <div className="grid gap-4">
            {profile.attempts.length === 0 && (
              <div className="text-center p-12 bg-surface-container-lowest border border-dashed border-outline-variant/40 rounded-3xl text-on-surface-variant italic">
                Aún no has realizado ningún examen.
              </div>
            )}
            
            {profile.attempts.map((attempt) => (
              <div 
                key={attempt.id} 
                className="bg-surface-container-low p-5 rounded-2xl border border-outline-variant/20 flex justify-between items-center group hover:bg-surface-bright transition-all"
              >
                <div className="space-y-1">
                  <p className="font-headline font-bold text-xl text-white capitalize">
                    {attempt.topic}
                  </p>
                  <div className="flex items-center gap-2 text-on-surface-variant text-xs font-bold uppercase tracking-widest">
                    <span className="material-symbols-outlined text-xs">calendar_today</span>
                    {new Date(attempt.createdAt).toLocaleDateString()}
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  {attempt.status === "COMPLETED" ? (
                    <div className="flex flex-col items-end">
                      <span className={`text-2xl font-black tracking-tighter ${Number(attempt.score) >= 70 ? 'text-primary' : 'text-error'}`}>
                        {Math.round(Number(attempt.score))}/100
                      </span>
                      <span className="text-[10px] uppercase font-bold text-on-surface-variant opacity-50 tracking-widest">
                        Puntaje final
                      </span>
                    </div>
                  ) : (
                    <Link 
                      href={`/api/questions?id=${attempt.id}`} 
                      className="bg-primary/10 text-primary border border-primary/20 px-5 py-2 rounded-xl text-sm font-black hover:bg-primary hover:text-on-primary-fixed transition-all animate-pulse flex items-center gap-2"
                    >
                      CONTINUAR
                      <span className="material-symbols-outlined text-sm">arrow_forward</span>
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}