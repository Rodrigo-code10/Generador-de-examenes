import { handleLogout } from "@/modules/auth/auth.actions";
import Link from "next/link";


export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r hidden md:flex flex-col">
        <div className="p-8">
          <h2 className="text-2xl font-black text-blue-600 tracking-tighter">QUIZ </h2>
        </div>

        <nav className="flex-1 px-4 space-y-1">
          <p className="text-[10px] font-bold text-gray-400 uppercase px-3 mb-2 tracking-widest">General</p>
          <Link href="/api/admin/analytics" className="flex items-center gap-3 p-3 rounded-xl hover:bg-blue-50 text-gray-700 font-bold transition-all group">
            <span className="group-hover:scale-110 transition">📊</span> Analíticas
          </Link>
          <Link href="/api/admin/users" className="flex items-center gap-3 p-3 rounded-xl hover:bg-blue-50 text-gray-700 font-bold transition-all group">
            <span className="group-hover:scale-110 transition">👥</span> Usuarios
          </Link>
          <Link href="/api/admin/questions" className="flex items-center gap-3 p-3 rounded-xl hover:bg-blue-50 text-gray-700 font-bold transition-all group">
            <span className="group-hover:scale-110 transition">📝</span> Banco de Preguntas
          </Link>

          <div className="pt-6">
            <p className="text-[10px] font-bold text-gray-400 uppercase px-3 mb-2 tracking-widest">Herramientas IA</p>
            <Link href="/api/admin/generate" className="flex items-center gap-3 p-3 rounded-xl bg-linear-to-r from-blue-600 to-indigo-600 text-white font-bold shadow-lg shadow-blue-100 hover:shadow-blue-200 transition-all group"> Generar Preguntas
            </Link>
          </div>
        </nav>

        {/* Botón Cerrar Sesión */}
        <div className="p-4 border-t">
          <form action={handleLogout}>
            <button className="flex items-center gap-3 w-full p-3 rounded-xl text-red-500 font-bold hover:bg-red-50 transition-colors"> Cerrar Sesión
            </button>
          </form>
        </div>
      </aside>

      {/* Contenido Principal */}
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}