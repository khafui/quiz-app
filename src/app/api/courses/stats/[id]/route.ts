// 'use server'
//
// import { NextResponse } from 'next/server';
// import { prisma } from '@/lib/prisma';
//
// // GET /api/course/stats/:courseId?userId=<optional>
// export async function GET(request: Request, { params }: { params: { id: string } }) {
//     const courseId = params.id;
//     const { searchParams } = new URL(request.url);
//     const userId = searchParams.get('userId');
//
//     try {
//         // 🧍‍♂️ If userId is provided → fetch that user's stats for this course
//         if (userId) {
//             const stat = await prisma.courseStat.findUnique({
//                 where: { userId_courseId: { userId, courseId } },
//                 include: { user: true, course: true },
//             });
//
//             if (!stat) {
//                 return NextResponse.json(
//                     { message: 'No course stats found for this user', attempts: 0, completed: 0, averageScore: 0 },
//                     { status: 200 }
//                 );
//             }
//
//             return NextResponse.json(stat);
//         }
//
//         // 👥 Otherwise → fetch all users’ stats for this course
//         const stats = await prisma.courseStat.findMany({
//             where: { courseId },
//             include: { user: true },
//         });
//
//         if (stats.length === 0) {
//             return NextResponse.json({ message: 'No course stats found', totalUsers: 0 }, { status: 200 });
//         }
//
//         // 📊 Compute course-level analytics
//         const totalUsers = stats.length;
//         const totalAttempts = stats.reduce((sum, s) => sum + (s.attempts || 0), 0);
//         const totalCompleted = stats.reduce((sum, s) => sum + (s.completed || 0), 0);
//         const averageScore =
//             totalUsers > 0
//                 ? stats.reduce((sum, s) => sum + (s.averageScore || 0), 0) / totalUsers
//                 : 0;
//
//         // 🏆 Find top performer (highest average score)
//         const topPerformer = stats.reduce((best, current) =>
//             (current.averageScore || 0) > (best.averageScore || 0) ? current : best
//         );
//
//         return NextResponse.json({
//             courseId,
//             totalUsers,
//             totalAttempts,
//             totalCompleted,
//             averageScore: parseFloat(averageScore.toFixed(2)),
//             topPerformer: {
//                 userId: topPerformer.userId,
//                 name: topPerformer.user.name ?? topPerformer.user.email,
//                 averageScore: topPerformer.averageScore,
//             },
//             stats,
//         });
//     } catch (error) {
//         console.error('Error fetching course stats:', error);
//         return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
//     }
// }

'use server'

import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { currentUser } from '@clerk/nextjs/server'

// GET /api/courses/stats/:courseId
export async function GET(request: Request, { params }: { params: { id: string } }) {
    try {
        const courseId = params.id
        const clerkUser = await currentUser()

        if (!clerkUser)
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

        // Find local DB user
        const dbUser = await prisma.user.findUnique({
            where: { clerkId: clerkUser.id },
        })

        if (!dbUser)
            return NextResponse.json({ error: 'User not found in database' }, { status: 404 })

        // Find course stat for this user and course
        const stat = await prisma.courseStat.findUnique({
            where: {
                userId_courseId: {
                    userId: dbUser.id,
                    courseId,
                },
            },
        })

        // If none found, return default zero values
        if (!stat) {
            return NextResponse.json({
                message: 'No course stats found for this user',
                attempts: 0,
                completed: 0,
                averageScore: 0,
            })
        }

        return NextResponse.json({
            attempts: stat.attempts,
            completed: stat.completed,
            averageScore: stat.averageScore ?? 0,
            lastAttempt: stat.lastAttempt,
        })
    } catch (error: any) {
        console.error('Error fetching course stats:', error)
        return NextResponse.json(
            { error: 'Internal Server Error', details: error.message },
            { status: 500 },
        )
    }
}

