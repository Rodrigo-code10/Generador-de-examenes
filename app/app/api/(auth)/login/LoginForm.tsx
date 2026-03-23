'use client'
import { useActionState } from "react"
import { handleLogin } from "@/modules/auth/auth.actions"

export default function LoginForm() {
  const [state, formAction] = useActionState(handleLogin, null)


  return (
    //contenedor principal
    <div className="bg-surface text-on-surface font-body min-h-screen flex flex-col overflow-x-hidden relative">

      {/* Efectos de Brillo Ambiental (Glow) */}
      <div className="fixed top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[radial-gradient(circle_at_center,rgba(129,236,255,0.15)_0%,transparent_70%)] pointer-events-none z-0"></div>
      <div className="fixed bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[radial-gradient(circle_at_center,rgba(129,236,255,0.15)_0%,transparent_70%)] pointer-events-none z-0"></div>

      <main className="relative z-10 grow flex flex-col items-center justify-center px-6 sm:px-8 py-12 max-w-md mx-auto w-full">

        {/* Cabecera / Branding */}
        <div className="mb-8 sm:mb-12 text-center">
          <div className="w-20 h-20 mx-auto mb-6 flex items-center justify-center rounded-2xl bg-surface-container-highest shadow-[0_0_30px_rgba(129,236,255,0.2)] border border-outline-variant/20">
            <span className="material-symbols-outlined text-primary text-5xl" style={{ fontVariationSettings: "'FILL' 1" }}>
              quiz
            </span>
          </div>
          <h1 className="font-headline text-3xl sm:text-4xl font-extrabold ...">
            Bienvenido de nuevo
          </h1>
          <p className="text-on-surface-variant font-medium">Ingresa para continuar tu racha</p>
        </div>
        <form action={formAction} className="w-full space-y-5 sm:space-y-6">
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant ml-1">
              Email
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <span className="material-symbols-outlined text-on-surface-variant text-xl">alternate_email</span>
              </div>
              <input
                name="email"
                type="email"
                required
                className="w-full bg-surface-container-low border-none focus:ring-2 focus:ring-primary/40 text-on-surface placeholder:text-outline h-14 pl-12 pr-4 rounded-xl transition-all"
                placeholder="nombre@ejemplo.com"
              />
            </div>
          </div>

          {/* Campo Password */}
          <div className="space-y-2">
            <div className="flex justify-between items-center ml-1">
              <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant">
                Contraseña
              </label>
            </div>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <span className="material-symbols-outlined text-on-surface-variant text-xl">lock</span>
              </div>
              <input
                name="password"
                type="text"//text
                required
                className="w-full bg-surface-container-low border-none focus:ring-2 focus:ring-primary/40 text-on-surface placeholder:text-outline h-14 pl-12 pr-4 rounded-xl transition-all"
                placeholder="••••••••"
              />
            </div>
          </div>
          {state?.error && <p>{state.error}</p>}
          <div className="pt-4 flex justify-center">
            <button
              type="submit"
              className="w-full sm:w-64 h-14 bg-linear-to-br from-primary to-secondary rounded-full text-on-primary-fixed font-bold text-lg shadow-[0_10px_30px_rgba(0,210,255,0.3)] hover:shadow-[0_15px_40px_rgba(129,236,255,0.4)] active:scale-95 transition-all duration-300"
              >
              Login
            </button>
          </div>
        </form>
      </main>

      {/* Línea decorativa inferior */}
      <div className="fixed bottom-0 left-0 w-full h-1 bg-linear-to-r from-transparent via-primary/30 to-transparent"></div>
    </div>
  )
}
