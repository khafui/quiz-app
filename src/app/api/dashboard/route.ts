import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { currentUser } from '@clerk/nextjs/server';

export async function GET() {
    const user = await currentUser();
    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Find matching user in DB
    const dbUser = await prisma.user.findUnique({
        where: { clerkId: user.id },
    });

    if (!dbUser) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // === ADMIN DASHBOARD ===
    if (dbUser.role === 'ADMIN') {
        const [totalCourses, totalQuizzes, totalUsers, quizResults, courseStats] =
            await Promise.all([
                prisma.course.count(),
                prisma.quiz.count(),
                prisma.user.count(),
                prisma.quizResult.findMany({
                    take: 5,
                    orderBy: { createdAt: 'desc' },
                    include: { quiz: true, user: true },
                }),
                prisma.courseStat.findMany({
                    include: { course: true },
                }),
            ]);

        const averageScore =
            courseStats.length > 0
                ? courseStats.reduce((sum, c) => sum + (c.averageScore || 0), 0) /
                courseStats.length
                : 0;

        const attempts = courseStats.reduce((sum, c) => sum + c.attempts, 0);

        const topCourses = courseStats
            .filter((c) => c.averageScore !== null)
            .sort((a, b) => (b.averageScore || 0) - (a.averageScore || 0))
            .slice(0, 5)
            .map((c) => ({
                name: c.course.name,
                avgScore: Number(c.averageScore?.toFixed(2) || 0),
            }));

        const recentResults = quizResults.map((r) => ({
            quiz: r.quiz.title,
            score: r.score,
            user: r.user.name || r.user.email,
            date: new Date(r.createdAt).toLocaleDateString(),
        }));

        return NextResponse.json({
            role: 'ADMIN',
            totalCourses,
            totalQuizzes,
            totalUsers,
            averageScore,
            attempts,
            topCourses,
            recentResults,
        });
    }

    // === USER DASHBOARD ===
    const [courseStats, quizResults] = await Promise.all([
        prisma.courseStat.findMany({
            where: { userId: dbUser.id },
            include: { course: true },
        }),
        prisma.quizResult.findMany({
            where: { userId: dbUser.id },
            orderBy: { createdAt: 'desc' },
            include: { quiz: true },
            take: 5,
        }),
    ]);

    const totalCourses = courseStats.length;
    const totalQuizzes = quizResults.length;
    const averageScore =
        courseStats.length > 0
            ? courseStats.reduce((sum, c) => sum + (c.averageScore || 0), 0) /
            courseStats.length
            : 0;

    const attempts = courseStats.reduce((sum, c) => sum + c.attempts, 0);

    const topCourses = courseStats
        .filter((c) => c.averageScore !== null)
        .sort((a, b) => (b.averageScore || 0) - (a.averageScore || 0))
        .slice(0, 5)
        .map((c) => ({
            name: c.course.name,
            avgScore: Number(c.averageScore?.toFixed(2) || 0),
        }));

    const recentResults = quizResults.map((r) => ({
        quiz: r.quiz.title,
        score: r.score,
        date: new Date(r.createdAt).toLocaleDateString(),
    }));

    return NextResponse.json({
        role: 'USER',
        totalCourses,
        totalQuizzes,
        averageScore,
        attempts,
        topCourses,
        recentResults,
    });
}
