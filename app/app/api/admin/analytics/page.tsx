import { getAdminStats } from "@/modules/analytics/analytics.actions";

export default async function AnalyticsPage() {
  const data = await getAdminStats();

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      {/* HEADER DINÁMICO */}
      <header className="relative">
        <div className="flex items-center gap-4 mb-2">
           <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20">
              <span className="material-symbols-outlined text-primary text-3xl">analytics</span>
           </div>
           <div>
              <h1 className="text-4xl font-black text-white tracking-tighter italic">ANALYTICS <span className="text-primary font-light">HUB</span></h1>
              <p className="text-on-surface-variant text-xs font-bold uppercase tracking-[0.2em]">Rendimiento de la plataforma en tiempo real</p>
           </div>
        </div>
      </header>
      
      {/* TARJETAS PRINCIPALES (STAT CARDS) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
          title="Usuarios Registrados" 
          value={data.totalUsers} 
          icon="group" 
          gradient="from-blue-500 to-cyan-400" 
        />
        <StatCard 
          title="Exámenes Completados" 
          value={data.totalAttempts} 
          icon="history_edu" 
          gradient="from-purple-600 to-pink-500" 
        />
        <StatCard 
          title="Promedio Global" 
          value={`${Math.round(data.avgScore)}%`} 
          icon="star" 
          gradient="from-emerald-500 to-teal-400" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* RANKING DE ESTUDIANTES */}
        <section className="bg-surface-container-low p-8 rounded-3xl border border-outline-variant/20 backdrop-blur-md relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
            <span className="material-symbols-outlined text-8xl text-white">workspace_premium</span>
          </div>

          <h2 className="text-xl font-black mb-8 text-white flex items-center gap-3">
            <span className="w-2 h-8 bg-primary rounded-full"></span>
            TOP ESTUDIANTES
          </h2>

          <div className="space-y-4 relative z-10">
            {data.leaderboard.map((user, index) => (
              <div key={index} className="flex items-center justify-between p-4 rounded-2xl bg-surface-container-highest/40 border border-white/5 hover:border-primary/30 hover:bg-surface-container-high transition-all group/item">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-sm shadow-lg ${
                    index === 0 ? 'bg-linear-to-br from-yellow-400 to-orange-500 text-black' : 
                    index === 1 ? 'bg-slate-300 text-black' :
                    index === 2 ? 'bg-orange-700 text-white' : 'bg-surface-container-low text-on-surface-variant'
                  }`}>
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-black text-white text-sm uppercase tracking-wide group-hover/item:text-primary transition-colors">{user.name}</p>
                    <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-widest">{user.totalExams} exámenes completados</p>
                  </div>
                </div>
                <div className="text-right">
                   <span className="text-xl font-black text-primary tracking-tighter">{user.avgScore}%</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* DISTRIBUCIÓN POR TEMAS */}
        <section className="bg-surface-container-low p-8 rounded-3xl border border-outline-variant/20 backdrop-blur-md">
          <h2 className="text-xl font-black mb-8 text-white flex items-center gap-3">
            <span className="w-2 h-8 bg-secondary rounded-full"></span>
            PREGUNTAS POR TEMA
          </h2>

          <div className="space-y-6">
            {data.questionsByTopic.map((item) => {
              const maxVal = Math.max(...data.questionsByTopic.map(t => t._count._all));
              const percentage = (item._count._all / maxVal) * 100;

              return (
                <div key={item.topic} className="space-y-2">
                  <div className="flex justify-between items-end px-1">
                    <span className="font-black text-xs text-white uppercase tracking-[0.15em]">{item.topic}</span>
                    <span className="font-bold text-xs text-secondary">{item._count._all} <span className="opacity-50 text-[10px]">PREGUNTAS</span></span>
                  </div>
                  
                  {/* BARRA DE PROGRESO CYBER */}
                  <div className="w-full bg-surface-container-highest h-3 rounded-full p-0.5 border border-white/5">
                    <div 
                      className="bg-linear-to-r from-secondary/50 to-secondary h-full rounded-full shadow-[0_0_10px_rgba(129,236,255,0.2)] transition-all duration-1000 ease-out" 
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

      </div>
    </div>
  );
}

function StatCard({ title, value, gradient, icon }: any) {
  return (
    <div className="bg-surface-container-low p-6 rounded-3xl border border-outline-variant/10 relative overflow-hidden group hover:scale-[1.02] transition-all duration-300 shadow-xl">
      {/* Fondo decorativo con el icono gigante */}
      <span className="material-symbols-outlined absolute -right-2 -bottom-2 text-8xl text-white opacity-[0.03] group-hover:opacity-[0.07] transition-opacity">
        {icon}
      </span>

      <div className="relative z-10 flex flex-col gap-4">
        <div className={`w-12 h-12 rounded-2xl bg-linear-to-br ${gradient} flex items-center justify-center text-black shadow-lg`}>
          <span className="material-symbols-outlined font-bold">{icon}</span>
        </div>
        
        <div>
          <p className="text-[10px] text-on-surface-variant uppercase font-black tracking-[0.2em] mb-1">{title}</p>
          <p className="text-4xl font-black text-white tracking-tighter italic">{value}</p>
        </div>
      </div>

      {/* Glow inferior */}
      <div className={`absolute bottom-0 left-0 w-full h-1 bg-linear-to-r ${gradient} opacity-30`}></div>
    </div>
  );
}