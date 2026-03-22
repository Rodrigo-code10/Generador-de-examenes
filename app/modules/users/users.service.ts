import { prisma } from "@/lib/prisma";
import { Role } from "@prisma/client";

export interface GrowthStat {
  date: string;
  usuarios: number;
}

export const UsersServiceOne = {
  async getUserProfile(userId: string) {
    return await prisma.user.findUnique({
      where: { id: userId },
      select: {
        name: true,
        email: true,
        attempts: {
          orderBy: { createdAt: 'desc' },
          include: {
            answers: true,
            _count: {
              select: { questions: true } // Para saber cuántas preguntas tenía el examen
            }
          }
        }
      }
    });
  }
};

export const UsersService = {
  // Obtener todos los usuarios con conteo de intentos
  async findAllUsers() {
    return await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        _count: { select: { attempts: true } }
      },
      orderBy: { createdAt: 'desc' }
    });
  },

  // Gráfica de crecimiento 
  async getUserGrowthStats(): Promise<GrowthStat[]> {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const users = await prisma.user.findMany({
      where: { createdAt: { gte: thirtyDaysAgo } },
      select: { createdAt: true },
      orderBy: { createdAt: 'asc' }
    });

    const stats = users.reduce((acc: Record<string, number>, user) => {
      const date = user.createdAt.toISOString().split('T')[0];
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(stats).map(([date, count]) => ({
      date,
      usuarios: count as number
    }));
  },

  // Actualizar Rol
  async updateRole(userId: string, newRole: Role) {
    return await prisma.user.update({
      where: { id: userId },
      data: { role: newRole }
    });
  }
};