"use server";
import { prisma } from "@/lib/prisma";

export async function getAdminStats() {
  const [totalUsers, completedAttempts, questionsByTopic, globalScoreGroup] = await Promise.all([
    prisma.user.count(),
    prisma.attempt.count({ where: { status: 'COMPLETED' } }),
    prisma.question.groupBy({
      by: ['topic'],
      _count: { _all: true },
    }),
    // Calculamos el promedio global de todos los intentos completados
    prisma.attempt.aggregate({
      where: { status: 'COMPLETED' },
      _avg: { score: true }
    })
  ]);

  // Agrupamos intentos por usuario y sacamos su promedio personal
  const leaderboard = await prisma.attempt.groupBy({
    by: ['userId'],
    where: { status: 'COMPLETED' },
    _avg: { score: true },
    _count: { _all: true },
    orderBy: {
      _avg: { score: 'desc' }
    },
    take: 5,
  });

  // Traemos los nombres de esos usuarios del ranking
  const leaderboardWithNames = await Promise.all(
    leaderboard.map(async (entry) => {
      const user = await prisma.user.findUnique({
        where: { id: entry.userId },
        select: { name: true }
      });
      return {
        name: user?.name || "Anónimo",
        avgScore: Math.round(entry._avg.score || 0),
        totalExams: entry._count._all
      };
    })
  );

  return {
    totalUsers,
    totalAttempts: completedAttempts,
    avgScore: Math.round(globalScoreGroup._avg.score || 0),
    questionsByTopic: questionsByTopic.sort((a, b) => b._count._all - a._count._all),
    leaderboard: leaderboardWithNames
  };
}