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
    <div className="p-8 bg-white min-h-screen text-black font-sans">
      <header className="mb-8">
        <h1 className="text-4xl font-black tracking-tighter">Usuarios</h1>
        <p className="text-gray-400">Total en plataforma: {users.length}</p>
      </header>

      {/* Gráfica de Barras Proporcional */}
      <section className="mb-12">
        <h2 className="text-xs font-bold text-gray-400 uppercase mb-4">Actividad 30 días</h2>
        <div className="flex items-end gap-1 h-32 border-b border-gray-100 pb-2">
          {chartData.map((day: GrowthStat) => (
            <div key={day.date} className="flex-1 group relative h-full flex flex-col justify-end">
              <div 
                className="bg-blue-600 hover:bg-blue-400 transition-all rounded-t-sm"
                style={{ height: `${(day.usuarios / maxUsers) * 100}%`, minHeight: '2px' }}
              />
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 scale-0 group-hover:scale-100 transition-all bg-black text-white text-[10px] px-2 py-1 rounded">
                {day.usuarios}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Tabla de Gestión */}
      <div className="border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 text-[10px] text-gray-400 uppercase font-bold">
              <th className="p-4">Usuario</th>
              <th className="p-4">Rol</th>
              <th className="p-4">Exámenes</th>
              <th className="p-4 text-right">Acción</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="p-4">
                  <div className="font-bold text-sm">{user.name}</div>
                  <div className="text-xs text-gray-400">{user.email}</div>
                </td>
                <td className="p-4">
                  <span className={`text-[10px] font-black px-2 py-0.5 rounded ${
                    user.role === 'ADMIN' ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-500'
                  }`}>
                    {user.role}
                  </span>
                </td>
                <td className="p-4 text-xs font-mono text-gray-400">
                  {user._count.attempts}
                </td>
                <td className="p-4 text-right">
                  <RoleToggleButton userId={user.id} currentRole={user.role} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}