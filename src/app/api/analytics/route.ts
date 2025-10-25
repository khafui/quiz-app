import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const [questionCount, quizCount, avgObj] = await Promise.all([
    prisma.question.count(),
    prisma.quizResult.count(),
    prisma.quizResult.aggregate({ _avg: { score: true } })
  ]);

  const top = await prisma.quizResult.groupBy({
    by: ['userId'],
    _avg: { score: true },
    _count: { _all: true },
    orderBy: { _avg: { score: 'desc' } },
    take: 10
  });

  const leaderboard = top.map(t => ({
    userId: t.userId,
    averageScore: t._avg.score ?? 0,
    attempts: t._count._all
  }));

  return NextResponse.json({
    totals: {
      questions: questionCount,
      quizzes: quizCount,
      averageScore: (avgObj._avg.score ?? 0)
    },
    leaderboard
  });
}
