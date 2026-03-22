import { getUser } from "@/modules/auth/session";
import { redirect } from "next/navigation";
import Link from "next/link";
import { handleLogout } from "@/modules/auth/auth.actions";
import { UsersServiceOne } from "@/modules/users/users.service";

export default async function ProfilePage() {
  const session = await getUser();
  if (!session) redirect("/api/login");

  const profile = await UsersServiceOne.getUserProfile(session.id);

  if (!profile) return <div>Usuario no encontrado</div>;

  return (
    <main className="max-w-4xl mx-auto p-6 space-y-8 text-black">
      <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">{profile.name}</h1>
          <p className="text-gray-500">{profile.email}</p>
        </div>
        <form action={handleLogout}>
          <button className="bg-red-50 text-red-600 px-4 py-2 rounded-lg font-medium hover:bg-red-100 transition">
            Cerrar Sesión
          </button>
        </form>
      </section>

      <section className="bg-blue-600 p-6 rounded-2xl text-white shadow-lg">
        <h2 className="text-xl font-bold mb-2">Generador AI</h2>
        <p className="mb-4 opacity-90">Crea un examen personalizado usando Gemini AI.</p>
        <Link 
          href="/api/generate" 
          className="bg-white text-blue-600 px-6 py-2 rounded-full font-bold inline-block hover:scale-105 transition"
        >
          Generar con Gemini
        </Link>
      </section>

      <section>
        <h2 className="text-xl font-bold mb-4">Mis Exámenes</h2>
        <div className="grid gap-4">
          {profile.attempts.length === 0 && <p className="text-gray-400">Aún no has realizado ningún examen.</p>}
          
          {profile.attempts.map((attempt) => (
            <div key={attempt.id} className="bg-white p-4 rounded-xl border flex justify-between items-center">
              <div>
                <p className="font-semibold text-lg">{attempt.topic}</p>
                <p className="text-sm text-gray-400">
                  {new Date(attempt.createdAt).toLocaleDateString()}
                </p>
              </div>

              <div className="text-right">
                {attempt.status === "COMPLETED" ? (
                  <span className={`text-xl font-bold ${Number(attempt.score) >= 70 ? 'text-green-600' : 'text-orange-500'}`}>
                    {Math.round(Number(attempt.score))}/100
                  </span>
                ) : (
                  <Link 
                  href={`/api/questions?id=${attempt.id}`} 
                  className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm font-bold hover:bg-yellow-200"
                >
                  Continuar examen ({attempt.answers.length} respondidas) ➔
                </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}