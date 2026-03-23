'use client'
import { useActionState } from 'react'
import { handleRegistro } from '@/modules/auth/auth.actions'
import Link from 'next/link'

export default function RegistroForm() {
  // Inicializamos el estado del formulario
  const [state, formAction, isPending] = useActionState(handleRegistro, { error: null })

  return (
    <main className="flex-grow pt-24 pb-12 px-8 w-full max-w-md mx-auto relative">
      {/* Decoración visual de fondo */}
      <div className="absolute -top-10 -left-10 w-40 h-40 bg-primary/10 rounded-full blur-[80px] pointer-events-none"></div>

      {/* Hero Section */}
      <section className="mb-12">
        <h2 className="font-headline text-5xl font-extrabold tracking-tighter mb-2 leading-none">
          Crear   
          <span className="text-primary drop-shadow-[0_0_15px_rgba(129,236,255,0.4)]">  Cuenta</span>
        </h2>
        <p className="text-on-surface-variant font-medium text-sm tracking-wide">
          Únete a la liga de conocimiento.
        </p>
      </section>

      {/* Formulario */}
      <form action={formAction} className="space-y-6" >
        
        {/* Input: Nombre */}
        <div className="space-y-2">
          <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant ml-1">
            Nombre completo
          </label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <span className="material-symbols-outlined text-on-surface-variant group-focus-within:text-primary transition-colors">person</span>
            </div>
            <input 
              name="name"
              required
              placeholder="Juan Pérez"
              className="w-full bg-surface-container-low border-none focus:ring-2 focus:ring-primary/40 rounded-DEFAULT h-14 pl-12 text-on-surface placeholder:text-neutral-700 transition-all"
            />
          </div>
        </div>

        {/* Input: Email */}
        <div className="space-y-2">
          <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant ml-1">
            Correo electrónico
          </label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <span className="material-symbols-outlined text-on-surface-variant group-focus-within:text-primary transition-colors">mail</span>
            </div>
            <input 
              name="email"
              type="email"
              required
              placeholder="usuario@dominio.com"
              className="w-full bg-surface-container-low border-none focus:ring-2 focus:ring-primary/40 rounded-DEFAULT h-14 pl-12 text-on-surface placeholder:text-neutral-700 transition-all"
            />
          </div>
        </div>

        {/* Input: Contraseña */}
        <div className="space-y-2">
          <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant ml-1">
            Contraseña
          </label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <span className="material-symbols-outlined text-on-surface-variant group-focus-within:text-primary transition-colors">lock</span>
            </div>
            <input 
              name="password"
              type="password"
              required
              placeholder="••••••••"
              className="w-full bg-surface-container-low border-none focus:ring-2 focus:ring-primary/40 rounded-DEFAULT h-14 pl-12 text-on-surface placeholder:text-neutral-700 transition-all"
            />
          </div>
        </div>

        {/* Mensaje de Error (Si existe) */}
        {state?.error && (
          <div className="bg-error-container/20 border border-error/50 p-3 rounded-lg flex items-center gap-2 text-error text-sm">
            <span className="material-symbols-outlined text-sm">error</span>
            {state.error}
          </div>
        )}

        {/* Botón de Registro */}
        <div className="pt-4">
          <button 
            type="submit"
            disabled={isPending}
            className="w-full h-16 bg-gradient-to-r from-primary to-secondary rounded-full text-on-primary-fixed font-headline font-extrabold text-lg flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(129,236,255,0.3)] active:scale-[0.98] transition-all hover:brightness-110 disabled:opacity-50 disabled:grayscale"
          >
            {isPending ? "Procesando..." : "Registrar"}
            {!isPending && <span className="material-symbols-outlined">arrow_forward</span>}
          </button>
        </div>
      </form>

      {/* Navegación Secundaria */}
      <div className="mt-10 text-center">
        <p className="text-on-surface-variant text-sm font-medium">
          ¿Ya tienes una cuenta? 
          <Link href="/api/login" className="text-primary font-bold ml-1 hover:underline underline-offset-4">
            Inicia sesión
          </Link>
        </p>
      </div>
    </main>
  )
}