'use client'
import { useActionState } from 'react'
import { handleRegistro } from '@/modules/auth/auth.actions'

export default function RegistroForm() {
  const [state, formAction] = useActionState(handleRegistro, { error: null })

  return (
    <form action={formAction} style={{ display: "flex", flexDirection: "column", gap: 10, maxWidth: 300 }}>
      <h2>Registro</h2>

      <input name="name" placeholder="Nombre" required />
      <input name="email" type="email" placeholder="Correo electrónico" required />
      <input name="password" type="password" placeholder="Contraseña" required />

      {state?.error && <p style={{ color: 'red', fontSize: '0.9rem' }}>{state.error}</p>}

      <button type="submit">Crear Cuenta</button>
    </form>
  )
}
