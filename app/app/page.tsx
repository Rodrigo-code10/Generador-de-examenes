import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-surface text-on-surface flex flex-col items-center justify-center px-6 relative overflow-hidden">
      
      {/* Decoración de fondo (Glows) */}
      <div className="absolute top-[-10%] left-[-10%] w-72 h-72 bg-primary/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-72 h-72 bg-secondary/10 rounded-full blur-[120px] pointer-events-none"></div>

      {/* Contenedor Principal */}
      <div className="max-w-2xl w-full text-center z-10">
        
        {/* Título Principal */}
        <h1 className="font-headline text-5xl md:text-70 font-extrabold tracking-tighter leading-none mb-6">
          Bienvenido a 
          <br></br>
          <span className="text-primary drop-shadow-[0_0_20px_rgba(129,236,255,0.4)]">
            Generador-examenes
          </span>
        </h1>

        {/* Instrucciones */}
        <div className="bg-surface-container-low border border-outline-variant/30 p-6 rounded-2xl mb-10 text-left shadow-xl backdrop-blur-sm">
          <h3 className="text-secondary font-bold uppercase tracking-widest text-xs mb-3 flex items-center gap-2">
            <span className="material-symbols-outlined text-sm">info</span>
            Instrucciones
          </h3>
          <ul className="space-y-3 text-on-surface-variant text-sm md:text-base">
            <li className="flex gap-3">
              <span className="text-primary font-bold">01.</span>
              Para poder acceder a nuestro generador de examenes usted necesita iniciar sesion, no obstante si aun no tiene cuenta puede 
              registrarse mediante el uso del boton registrarse.
            </li>
            <li className="flex gap-3">
              <span className="text-primary font-bold">02.</span>
              Una vez iniciado sesion podra entrar a su perfil donde podra apreciar los examenes que ya ha realizado y generar algun otro
               eligiendo el tema y la cantidad de preguntas.
            </li>
            <li className="flex gap-3">
              <span className="text-primary font-bold">03.</span>
              Responde las preguntas y compite por el puntaje más alto de la liga.
            </li>
          </ul>
        </div>

        {/* Botones de Acción */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            href="/api/register" 
            className="h-14 px-8 bg-gradient-to-r from-primary to-secondary rounded-full text-on-primary-fixed font-headline font-extrabold text-lg flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(129,236,255,0.2)] active:scale-[0.98] transition-all hover:brightness-110"
          >
            Registrarse
            <span className="material-symbols-outlined">rocket_launch</span>
          </Link>

          <Link 
            href="/api/login" 
            className="h-14 px-8 bg-surface-container-high border border-outline-variant rounded-full text-white font-headline font-bold text-lg flex items-center justify-center gap-2 hover:bg-surface-bright active:scale-[0.98] transition-all"
          >
            iniciar sesion
          </Link>
        </div>
      </div>

      {/* Footer sutil */}
      <p className="absolute bottom-8 text-on-surface-variant text-xs tracking-widest uppercase opacity-50">
        Powered by Google Gemini API
      </p>
    </main>
  );
}