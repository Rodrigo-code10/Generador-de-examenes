"use client";
import { useState } from "react";
import { toggleAdminRoleAction } from "@/modules/auth/auth.actions";

export default function RoleToggleButton({ userId, currentRole }: { userId: string, currentRole: string }) {
  const [loading, setLoading] = useState(false);

  const handleToggle = async () => {
    if (!confirm(`¿Estás seguro de cambiar el rol de este usuario?`)) return;
    
    setLoading(true);
    try {
      await toggleAdminRoleAction(userId, currentRole as any);
    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      className={`px-4 py-2 rounded-xl font-bold text-sm transition-all disabled:opacity-50 ${
        currentRole === "ADMIN" 
        ? "border border-red-200 text-red-600 hover:bg-red-50" 
        : "bg-black text-white hover:bg-gray-800"
      }`}
    >
      {loading ? "Procesando..." : currentRole === "ADMIN" ? "Quitar Admin" : "Hacer Admin"}
    </button>
  );
}