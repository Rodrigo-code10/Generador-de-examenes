"use server"
import { redirect } from "next/navigation"
import { registerUser, loginUser, AuthService } from "./auth.service"
import { RegisterSchema, LoginSchema } from "./auth.schema"
import { createToken } from "./tokens"
import { cookies } from "next/headers"
import { getUser } from "./session"
import { revalidatePath } from "next/cache";
import { Role } from "@prisma/client";


export async function handleRegistro(prevState: any, formData: FormData) {
  const raw = Object.fromEntries(formData.entries())
  const parsed = RegisterSchema.safeParse(raw)

  if (!parsed.success) {
    return { error: "Datos inválidos" }
  }

  try {
    await registerUser(parsed.data)
  } catch (error: any) {
    return { error: error.message }
  }

  redirect("/api/login")
}

export async function handleLogin(prevState: any, formData: FormData) {
  const raw = Object.fromEntries(formData.entries())
  const parsed = LoginSchema.safeParse(raw)

  if (!parsed.success) {
    return { error: "Datos inválidos" }
  }

  try {
    const user = await loginUser(parsed.data)

    const token = await createToken({ userId: user.id })

    const cookieStore = await cookies()

    cookieStore.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/api",
    })

  } catch (error: any) {
    return { error: error.message }
  }

  redirect("/api/login")
}

export async function handleLogout() {
  const cookieStore = await cookies()
  cookieStore.delete("token")

  redirect("/api")
}


export async function protectAdmin() {
  const user = await getUser();

  // Si no hay usuario o su rol no es ADMIN, para afuera
  if (!user || user.role !== "ADMIN") {
    redirect("/api");
  }

  return user;
}

export async function toggleAdminRoleAction(userId: string, currentRole: Role) {
  const admin = await getUser();

  console.log("INTENTO DE CAMBIO DE ROL POR:", admin?.email, "ROL:", admin?.role);

  if (!admin || admin.role !== "ADMIN") {
    throw new Error(`Acceso denegado: Tu rol actual es ${admin?.role || 'Invitado'}`);
  }

  const newRole = currentRole === Role.ADMIN ? Role.USER : Role.ADMIN;
  await AuthService.updateRole(userId, newRole);

  revalidatePath("/api/admin/users");
}


export async function getAllUsers() {
  try {
    // Validamos quién pide la información
    const currentUser = await getUser();

    //Si no hay usuario o no es ADMIN, bloqueamos el acceso
    if (!currentUser || currentUser.role !== Role.ADMIN) {
      throw new Error("No tienes permisos para ver la lista de usuarios.");
    }

    //Llamamos al servicio que toca la base de datos directamente
    const users = await AuthService.findAllUsers();

    return users;
  } catch (error) {
    console.error("Error en getAllUsers:", error);
    return [];
  }
}