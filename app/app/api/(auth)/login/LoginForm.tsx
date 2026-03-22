'use client'
import { useActionState } from "react"
import { handleLogin } from "@/modules/auth/auth.actions"

export default function LoginForm() {
  const [state, formAction] = useActionState(handleLogin, null)

  return (
    <form action={formAction}>
      <input name="email" placeholder="email" />
      <input name="password" placeholder="password" />
      {state?.error && <p>{state.error}</p>}
      <button>Login</button>
    </form>
  )
}