import { protectAdmin } from "@/modules/auth/auth.actions";
import { getQuestionsWithDetails } from "@/modules/questions/questions.actions";
import QuestionContent from "./QuestionContent";


export default async function AdminQuestionsPage() {
  await protectAdmin(); 
  const grouped = await getQuestionsWithDetails();

  return (
    <div className="p-6 space-y-10 text-black max-w-5xl mx-auto">
      <header className="border-b pb-6">
        <h1 className="text-4xl font-black tracking-tight">Banco de Preguntas</h1>
        <p className="text-gray-500">Organiza, edita y crea el conocimiento de tu plataforma.</p>
      </header>

      <QuestionContent grouped={grouped} />
    </div>
  );
}