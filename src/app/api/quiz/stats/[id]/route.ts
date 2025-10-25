import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/quiz/stats/:quizId?userId=<optional>
export async function GET(request: Request, { params }: { params: { id: string } }) {
    const id = params.id;
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    try {
        // 🧠 If userId is provided, return that user's quiz stats
        if (userId) {
            const userStat = await prisma.quizResult.findMany({
                where: { id, userId },
            });

            if (!userStat || userStat.length === 0) {
                return NextResponse.json(
                    { message: 'No stats found for this user', attempts: 0, averageScore: 0 },
                    { status: 200 }
                );
            }

            // Compute user-level analytics
            const totalAttempts = userStat.length;
            const averageScore =
                userStat.reduce((sum, r) => sum + (r.score || 0), 0) / totalAttempts;

            return NextResponse.json({
                userId,
                id,
                totalAttempts,
                averageScore: parseFloat(averageScore.toFixed(2)),
            });
        }

        // 📊 Otherwise, return overall stats for all users for this quiz
        const allStats = await prisma.quizResult.findMany({
            where: { quizId },
        });

        if (!allStats || allStats.length === 0) {
            return NextResponse.json(
                { message: 'No stats found', averageScore: 0, attemptsCount: 0, topPerformer: null },
                { status: 200 }
            );
        }

        const totalAttempts = allStats.length;
        const averageScore =
            allStats.reduce((sum, r) => sum + (r.score || 0), 0) / totalAttempts;

        // Find the top performer (highest score)
        const topPerformer = allStats.reduce((best, current) =>
            (current.score || 0) > (best.score || 0) ? current : best
        );

        return NextResponse.json({
            quizId,
            totalAttempts,
            averageScore: parseFloat(averageScore.toFixed(2)),
            topPerformer: {
                userId: topPerformer.userId,
                score: topPerformer.score,
            },
        });
    } catch (error) {
        console.error('Error fetching quiz stats:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
