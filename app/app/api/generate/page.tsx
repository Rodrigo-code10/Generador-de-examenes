import GenerateForm from "./GenerateForm";

export default function GeneratePage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-[#f8faff] p-4">
      {/* Decoración de fondo opcional */}
      <div className="absolute inset-0 overflow-hidden -z-10">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-blue-50 rounded-full blur-3xl opacity-50" />
        <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-indigo-50 rounded-full blur-3xl opacity-50" />
      </div>

      <GenerateForm />
    </main>
  );
}