import { handleLogout } from "@/modules/auth/auth.actions";
import Link from "next/link";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-surface text-on-surface font-body min-h-screen flex overflow-hidden relative">
      
      {/* Efectos de Brillo Ambiental de fondo */}
      <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[radial-gradient(circle_at_center,rgba(129,236,255,0.08)_0%,transparent_70%)] pointer-events-none z-0"></div>
      <div className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[radial-gradient(circle_at_center,rgba(129,236,255,0.08)_0%,transparent_70%)] pointer-events-none z-0"></div>

      {/* Sidebar - Estilo Glassmorphism */}
      <aside className="w-72 bg-surface-container-low border-r border-outline-variant/20 hidden md:flex flex-col relative z-10 backdrop-blur-xl">
        
        {/* Logo / Branding */}
        <div className="p-8 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-linear-to-br from-primary to-secondary flex items-center justify-center shadow-[0_0_20px_rgba(129,236,255,0.3)]">
              <span className="material-symbols-outlined text-black font-bold">shield_person</span>
            </div>
            <h2 className="text-2xl font-black text-white tracking-tighter italic">
              QUIZ <span className="text-primary font-light">ADMIN</span>
            </h2>
          </div>
        </div>

        {/* Navegación */}
        <nav className="flex-1 px-4 space-y-2">
          <p className="text-[10px] font-black text-on-surface-variant uppercase px-4 mb-4 tracking-[0.2em] opacity-50">General</p>
          
          <Link href="/api/admin/analytics" className="flex items-center gap-4 p-3.5 rounded-2xl hover:bg-surface-container-high text-on-surface-variant hover:text-primary font-bold transition-all group">
            <span className="material-symbols-outlined group-hover:scale-110 transition">analytics</span>
            Analíticas
          </Link>
          
          <Link href="/api/admin/users" className="flex items-center gap-4 p-3.5 rounded-2xl hover:bg-surface-container-high text-on-surface-variant hover:text-primary font-bold transition-all group">
            <span className="material-symbols-outlined group-hover:scale-110 transition">group</span>
            Usuarios
          </Link>
          
          <Link href="/api/admin/questions" className="flex items-center gap-4 p-3.5 rounded-2xl hover:bg-surface-container-high text-on-surface-variant hover:text-primary font-bold transition-all group">
            <span className="material-symbols-outlined group-hover:scale-110 transition">quiz</span>
            Banco de Preguntas
          </Link>

          <div className="pt-8">
            <p className="text-[10px] font-black text-on-surface-variant uppercase px-4 mb-4 tracking-[0.2em] opacity-50">Herramientas IA</p>
            <Link href="/api/admin/generate" className="flex items-center justify-center gap-3 p-4 rounded-2xl bg-linear-to-r from-primary to-secondary text-black font-black shadow-[0_10px_20px_rgba(0,210,255,0.2)] hover:shadow-[0_15px_30px_rgba(129,236,255,0.3)] hover:scale-[1.02] transition-all group">
              <span className="material-symbols-outlined animate-pulse">psychology</span>
              Generar Preguntas
            </Link>
          </div>
        </nav>

        {/* Botón Cerrar Sesión */}
        <div className="p-6 border-t border-outline-variant/10">
          <form action={handleLogout}>
            <button className="flex items-center gap-4 w-full p-4 rounded-2xl text-error font-bold hover:bg-error/10 transition-all group">
              <span className="material-symbols-outlined group-hover:rotate-180 transition-transform duration-500">logout</span>
              Cerrar Sesión
            </button>
          </form>
        </div>
      </aside>

      {/* Contenido Principal */}
      <main className="flex-1 relative z-10 overflow-y-auto">
        {/* Header de la página actual (opcional, para dar aire) */}
        <header className="h-20 border-b border-outline-variant/10 flex items-center px-8 bg-surface/50 backdrop-blur-md sticky top-0 z-20">
           <div className="flex items-center gap-2 text-on-surface-variant">
              <span className="text-xs font-bold uppercase tracking-widest">Panel de Control</span>
              <span className="text-xs">/</span>
              <span className="text-xs font-bold text-primary uppercase tracking-widest">Dashboard</span>
           </div>
        </header>

        <div className="p-8 lg:p-12">
          <div className="max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
            {children}
          </div>
        </div>
      </main>

      {/* Decoración de línea inferior */}
      <div className="fixed bottom-0 left-0 w-full h-px bg-linear-to-r from-transparent via-primary/20 to-transparent"></div>
    </div>
  );
}