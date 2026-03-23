import ForgeForm from "./ForgeForm";

export default function AIGeneratorPage() {
  return (
    <div className="max-w-5xl mx-auto space-y-10 py-6">
      
      {/* HEADER: Solo estructura y texto (Server side) */}
      <header className="flex flex-col gap-2 border-l-4 border-primary pl-6">
        <div className="flex items-center gap-2">
           <span className="material-symbols-outlined text-primary text-4xl">psychology</span>
           <h1 className="text-4xl font-black text-white italic tracking-tighter">
             IA
           </h1>
        </div>
      </header>

      {/* COMPONENTE DE CLIENTE: El formulario dinámico */}
      <ForgeForm />

      {/* FOOTER: Solo estructura y texto (Server side) */}
      <footer className="pt-8 border-t border-outline-variant/10 flex justify-between items-center opacity-20">
        <span className="text-[9px] font-black tracking-[0.2em] uppercase italic">Admin Panel Access Restricted</span>
        <div className="flex gap-4">
           <span className="text-[9px] font-black uppercase tracking-[0.2em]">Prisma DB</span>
           <span className="text-[9px] font-black uppercase tracking-[0.2em]">OpenAI/Gemini</span>
        </div>
      </footer>
    </div>
  );
}