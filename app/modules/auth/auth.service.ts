import bcrypt from "bcrypt"
import { RegisterInput, LoginInput } from "./auth.schema"
import { prisma } from "@/lib/prisma"
import { Role } from "@prisma/client";

export async function registerUser(data: RegisterInput) {
  const { name, email, password } = data

  // Verificar si existe
  const existing = await prisma.user.findUnique({
    where: { email },
  })

  if (existing) {
    throw new Error("Usuario existente")
  }

  // Hash
  const hashedPassword = await bcrypt.hash(password, 10)

  // Crear
  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  })

  return user
}


export async function loginUser(data: LoginInput) {
  const { email, password } = data

  const user = await prisma.user.findUnique({
    where: { email },
  })

  if (!user) throw new Error("No existe Usuario")

  const isValid = await bcrypt.compare(password, user.password)

  if (!isValid) throw new Error("Incorrecta la contrasena")

  return user
}


export const AuthService = {
  // Obtener todos los usuarios con conteo de intentos
  async findAllUsers() {
    return await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        _count: {
          select: { attempts: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
  },

  // Cambiar el rol de un usuario
  async updateRole(userId: string, newRole: Role) {
    return await prisma.user.update({
      where: { id: userId },
      data: { role: newRole }
    });
  },

  // Buscar un usuario específico (útil para validaciones)
  async findById(id: string) {
    return await prisma.user.findUnique({
      where: { id },
      select: { id: true, role: true, name: true }
    });
  }
};

