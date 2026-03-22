import { getAdminStats } from "@/modules/analytics/analytics.actions";

export default async function AnalyticsPage() {
  const data = await getAdminStats();

  return (
    <div className="p-8 space-y-8 bg-gray-50 min-h-screen">
      <header>
        <h1 className="text-4xl font-black text-black tracking-tight">Analytics Dashboard</h1>
        <p className="text-gray-500">Rendimiento global de la plataforma en tiempo real.</p>
      </header>
      
      {/* TARJETAS PRINCIPALES */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="Usuarios Registrados" value={data.totalUsers} color="border-blue-500" />
        <StatCard title="Exámenes Completados" value={data.totalAttempts} color="border-green-500"/>
        <StatCard title="Promedio Global" value={`${data.avgScore}%`} color="border-purple-500"/>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* TOP 5 RANKING (Leaderboard) */}
        <section className="bg-white p-6 rounded-2xl shadow-sm border">
          <h2 className="text-xl font-bold mb-6 text-black flex items-center gap-2">
            Top Estudiantes (Promedio)
          </h2>
          <div className="space-y-4">
            {data.leaderboard.map((user, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-xl bg-gray-50 hover:bg-blue-50 transition">
                <div className="flex items-center gap-4">
                  <span className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                    index === 0 ? 'bg-yellow-400 text-white' : 'bg-gray-200 text-gray-600'
                  }`}>
                    {index + 1}
                  </span>
                  <div>
                    <p className="font-bold text-black text-sm">{user.name}</p>
                    <p className="text-[10px] text-gray-400 uppercase font-bold">{user.totalExams} exámenes hechos</p>
                  </div>
                </div>
                <span className="text-lg font-black text-blue-600">{user.avgScore}%</span>
              </div>
            ))}
          </div>
        </section>

        {/* DISTRIBUCIÓN POR TEMAS */}
        <section className="bg-white p-6 rounded-2xl shadow-sm border">
          <h2 className="text-xl font-bold mb-6 text-black flex items-center gap-2">
            <span>📊</span> Preguntas por Tema
          </h2>
          <div className="space-y-4">
            {data.questionsByTopic.map((item) => (
              <div key={item.topic} className="space-y-1">
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium text-gray-700">{item.topic}</span>
                  <span className="font-bold text-gray-900">{item._count._all} q.</span>
                </div>
                {/* Barra de progreso visual */}
                <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                  <div 
                    className="bg-blue-500 h-full rounded-full" 
                    style={{ width: `${(item._count._all / Math.max(...data.questionsByTopic.map(t => t._count._all))) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}

function StatCard({ title, value, color, icon }: any) {
  return (
    <div className={`bg-white p-6 rounded-2xl shadow-sm border-l-8 ${color} flex justify-between items-center`}>
      <div>
        <p className="text-xs text-gray-400 uppercase font-black tracking-widest mb-1">{title}</p>
        <p className="text-4xl font-black text-black">{value}</p>
      </div>
      <span className="text-4xl opacity-20">{icon}</span>
    </div>
  );
}