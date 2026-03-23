import { getAllUsers, protectAdmin } from "@/modules/auth/auth.actions";
import { UsersService, GrowthStat } from "@/modules/users/users.service";
import RoleToggleButton from "./RoleToggleButton";

export default async function AdminUsersPage() {
  await protectAdmin();

  const [users, chartData] = await Promise.all([
    getAllUsers(),
    UsersService.getUserGrowthStats()
  ]);

  const maxUsers = Math.max(...chartData.map(d => d.usuarios), 1);

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      
      {/* HEADER E INFORMACIÓN RÁPIDA */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
              <span className="material-symbols-outlined text-primary">group</span>
            </div>
            <h1 className="text-4xl font-black text-white italic tracking-tighter">USUARIOS</h1>
          </div>
          <p className="text-on-surface-variant text-xs font-bold uppercase tracking-[0.2em]">Gestión de accesos y roles de la plataforma</p>
        </div>

        <div className="bg-surface-container-high px-6 py-3 rounded-2xl border border-outline-variant/20">
           <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-1 text-center md:text-right">Base de datos</p>
           <p className="text-2xl font-black text-white italic tracking-tighter">{users.length} <span className="text-xs font-light not-italic opacity-50">REGISTRADOS</span></p>
        </div>
      </header>

      {/* GRÁFICA DE ACTIVIDAD (ESTILO ECUALIZADOR) */}
      <section className="bg-surface-container-low p-8 rounded-[2.5rem] border border-outline-variant/10 backdrop-blur-md">
        <div className="flex items-center justify-between mb-8">
           <h2 className="text-[10px] font-black text-on-surface-variant uppercase tracking-[0.3em]">Crecimiento últimos 30 días</h2>
           <span className="text-[10px] font-bold text-primary px-3 py-1 bg-primary/10 rounded-full border border-primary/20">LIVE DATA</span>
        </div>
        
        <div className="flex items-end gap-1.5 h-32 border-b border-outline-variant/20 pb-2 overflow-x-auto no-scrollbar">
          {chartData.map((day: GrowthStat) => (
            <div key={day.date} className="flex-1 min-w-3 group relative h-full flex flex-col justify-end">
              {/* Barra con Glow al hacer Hover */}
              <div 
                className="bg-linear-to-t from-primary to-secondary opacity-60 group-hover:opacity-100 transition-all rounded-t-sm shadow-[0_0_15px_rgba(0,210,255,0)] group-hover:shadow-[0_0_15px_rgba(0,210,255,0.4)]"
                style={{ height: `${(day.usuarios / maxUsers) * 100}%`, minHeight: '4px' }}
              />
              
              {/* Tooltip con diseño de burbuja */}
              <div className="absolute -top-10 left-1/2 -translate-x-1/2 scale-0 group-hover:scale-100 transition-all bg-white text-black font-black text-[10px] px-2 py-1 rounded shadow-xl z-20 pointer-events-none">
                {day.usuarios}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* TABLA DE GESTIÓN (ESTILO CRISTAL) */}
      <div className="bg-surface-container-low rounded-4xlborder border-outline-variant/10 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-high/50 text-[10px] text-on-surface-variant uppercase font-black tracking-widest border-b border-outline-variant/10">
                <th className="p-6">Identidad</th>
                <th className="p-6 text-center">Privilegios</th>
                <th className="p-6 text-center">Actividad</th>
                <th className="p-6 text-right">Comandos</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/5">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-white/2 transition-colors group">
                  {/* Avatar e Info */}
                  <td className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-surface-container-highest flex items-center justify-center border border-outline-variant/20 group-hover:border-primary/50 transition-all">
                        <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary transition-colors">person</span>
                      </div>
                      <div>
                        <div className="font-black text-white text-sm uppercase tracking-wide italic">{user.name}</div>
                        <div className="text-xs text-on-surface-variant/70">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  
                  {/* Rol */}
                  <td className="p-6 text-center">
                    <span className={`text-[9px] font-black px-3 py-1 rounded-full border tracking-widest ${
                      user.role === 'ADMIN' 
                      ? 'bg-primary/10 border-primary/30 text-primary shadow-[0_0_10px_rgba(0,210,255,0.1)]' 
                      : 'bg-surface-container-highest border-outline-variant/20 text-on-surface-variant/50'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  
                  {/* Contador de intentos */}
                  <td className="p-6 text-center">
                    <div className="flex flex-col items-center">
                      <span className="text-lg font-black text-white italic tracking-tighter">{user._count.attempts}</span>
                      <span className="text-[9px] font-bold text-on-surface-variant/40 uppercase tracking-tighter">Exámenes</span>
                    </div>
                  </td>
                  
                  {/* Acción (Botón de cambio de rol) */}
                  <td className="p-6 text-right">
                    <div className="flex justify-end scale-90 origin-right group-hover:scale-100 transition-transform">
                      <RoleToggleButton userId={user.id} currentRole={user.role} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}