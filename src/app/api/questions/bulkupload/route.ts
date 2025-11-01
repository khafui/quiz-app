// import { NextResponse } from 'next/server';
// import { prisma } from '@/lib/prisma';
// import { auth } from '@clerk/nextjs/server';
//
// export async function POST(req: Request) {
//     try {
//         const { userId } = auth();
//         const { courseId, title, description, questions } = await req.json();
//
//         if (!courseId || !title || !Array.isArray(questions) || questions.length === 0) {
//             return NextResponse.json({ error: 'Invalid request data' }, { status: 400 });
//         }
//
//         // 1️⃣ Create the Quiz
//         const quiz = await prisma.quiz.create({
//             data: {
//                 title,
//                 description,
//                 courseId,
//                 createdBy: userId || undefined,
//             },
//         });
//
//         let createdCount = 0;
//
//         // 2️⃣ Create each Question + Options
//         for (const q of questions) {
//             const { text, isMultiple = false, options, correctIndexes = [] } = q;
//
//             if (!text || !Array.isArray(options) || options.length < 2) continue;
//
//             const question = await prisma.question.create({
//                 data: {
//                     text,
//                     isMultiple,
//                     quizId: quiz.id,
//                     createdBy: userId || undefined,
//                     options: { create: options.map((o: any) => ({ text: o.text })) },
//                 },
//                 include: { options: true },
//             });
//
//             const mappedIds = correctIndexes
//                 .map((i: number) => question.options[i]?.id)
//                 .filter(Boolean);
//
//             if (mappedIds.length) {
//                 await prisma.question.update({
//                     where: { id: question.id },
//                     data: { correctIds: mappedIds },
//                 });
//             }
//
//             createdCount++;
//         }
//
//         return NextResponse.json({
//             message: 'Bulk upload successful',
//             createdCount,
//             quiz,
//         });
//     } catch (error: any) {
//         console.error('Bulk upload error:', error);
//         return NextResponse.json(
//             { error: error.message || 'Failed to upload questions' },
//             { status: 500 }
//         );
//     }
// }


// import { NextResponse } from 'next/server';
// import { prisma } from '@/lib/prisma';
// import { currentUser } from '@clerk/nextjs/server';
//
// async function syncUser() {
//     const user = await currentUser();
//     if (!user) return null;
//
//     let dbUser = await prisma.user.findUnique({ where: { clerkId: user.id } });
//     if (!dbUser) {
//         dbUser = await prisma.user.create({
//             data: {
//                 clerkId: user.id,
//                 email: user.emailAddresses[0].emailAddress,
//                 name: `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim(),
//             },
//         });
//     }
//     return dbUser;
// }
//
//
// export async function POST(req: Request) {
//     try {
//         // const user = await currentUser();
//
//         const user = await syncUser();
//
//         const { courseId, title, description, questions } = await req.json();
//
//         if (!user) {
//             return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
//         }
//         if (!courseId || !title || !Array.isArray(questions) || questions.length === 0) {
//             return NextResponse.json({ error: 'Invalid request data' }, { status: 400 });
//         }
//
//         // ✅ Step 1: Create Quiz
//         const quiz = await prisma.quiz.create({
//             data: {
//                 title,
//                 description,
//                 courseId,
//                 createdAt: new Date(),
//                 createdBy: user.id,
//             },
//         });
//
//         let createdCount = 0;
//
//         // ✅ Step 2: Loop through each question
//         for (const q of questions) {
//             const { text, isMultiple = false, options = [], correctIndexes = [] } = q;
//
//             if (!text || options.length < 2) continue;
//
//             // Ensure options are formatted correctly
//             const formattedOptions = options.map((opt: any) =>
//                 typeof opt === 'string' ? { text: opt.trim() } : opt
//             );
//
//             // ✅ Step 3: Create question with options
//             const question = await prisma.question.create({
//                 data: {
//                     text,
//                     isMultiple,
//                     quizId: quiz.id,
//                     createdBy: user.id,
//                     options: {
//                         create: formattedOptions,
//                     },
//                 },
//                 include: { options: true },
//             });
//
//             // ✅ Step 4: Map correctIndexes → option IDs
//             const correctIds = correctIndexes
//                 .map((i: number) => question.options[i]?.id)
//                 .filter(Boolean);
//
//             if (correctIds.length > 0) {
//                 await prisma.question.update({
//                     where: { id: question.id },
//                     data: { correctIds },
//                 });
//             }
//
//             createdCount++;
//         }
//
//         return NextResponse.json({
//             message: '✅ Bulk upload successful',
//             createdCount,
//             quiz,
//         });
//     } catch (error: any) {
//         console.error('Bulk upload error:', error);
//         return NextResponse.json(
//             { error: error.message || 'Failed to upload quiz and questions' },
//             { status: 500 }
//         );
//     }
// }


// import { NextResponse } from "next/server";
// import { prisma } from "@/lib/prisma";
// import { parse } from "csv-parse/sync";
// import {currentUser} from "@clerk/nextjs/server";


// async function syncUser() {
//     const user = await currentUser();
//     if (!user) return null;
//
//     let dbUser = await prisma.user.findUnique({ where: { clerkId: user.id } });
//     if (!dbUser) {
//         dbUser = await prisma.user.create({
//             data: {
//                 clerkId: user.id,
//                 email: user.emailAddresses[0].emailAddress,
//                 name: `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim(),
//             },
//         });
//     }
//     return dbUser;
// }

// export const POST = async (req: Request) => {
//     // const user = await currentUser();
//     // if (!user) {
//     //     return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
//     // }
//
//     const clerkUser = await currentUser();
//     if (!clerkUser) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
//
//     // Find corresponding User record
//     const user = await prisma.user.findUnique({
//         where: { clerkId: clerkUser.id },
//     });
//
//     if (!user) {
//         return NextResponse.json({ error: 'User not found in database' }, { status: 404 });
//     }
//
//     try {
//         const formData = await req.formData();
//         const file = formData.get("file") as File;
//         const title = formData.get("title") as string;
//         const description = formData.get("description") as string;
//         const courseId = formData.get("courseId") as string;
//         const createdBy = user.id as string;
//
//         if (!file || !title || !courseId) {
//             return NextResponse.json(
//                 { error: "Missing file, title, or courseId" },
//                 { status: 400 }
//             );
//         }
//
//         // ✅ Read CSV file
//         const buffer = Buffer.from(await file.arrayBuffer());
//         const csvData = parse(buffer.toString(), {
//             columns: true,
//             skip_empty_lines: true,
//             trim: true,
//         });
//
//         // ✅ Step 1: Create the quiz
//         const quiz = await prisma.quiz.create({
//             data: {
//                 title,
//                 description,
//                 courseId,
//             },
//         });
//
//         // ✅ Step 2: Process and create questions + options
//         for (const row of csvData) {
//             const text = row.text?.trim();
//             const isMultiple = row.isMultiple?.toLowerCase() === "true";
//             const options = row.options?.split("|").map((opt: string) => opt.trim());
//             const correctIndexes = row.correctIndexes
//                 ?.split("|")
//                 .map((idx: string) => parseInt(idx.trim()))
//                 .filter((n: number) => !isNaN(n));
//
//             if (!text || !options || options.length === 0) continue;
//
//             // Create question with related options
//             await prisma.question.create({
//                 data: {
//                     text,
//                     isMultiple,
//                     correctIds: correctIndexes?.map(String) ?? [],
//                     quizId: quiz.id,
//                     // createdBy: createdBy,
//                     options: {
//                         create: options.map((opt) => ({ text: opt })),
//                     },
//                 },
//             });
//         }
//
//         return NextResponse.json({
//             message: "Quiz and questions uploaded successfully",
//             quizId: quiz.id,
//         });
//     } catch (error: any) {
//         console.error("Bulk upload error:", error);
//         return NextResponse.json(
//             { error: error.message || "Failed to process CSV" },
//             { status: 500 }
//         );
//     }
// };


import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { parse } from "csv-parse/sync";
import { currentUser } from "@clerk/nextjs/server";

export const POST = async (req: Request) => {
    try {
        const clerkUser = await currentUser();
        if (!clerkUser)
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        // Find or ensure DB user exists
        const user = await prisma.user.findUnique({
            where: { clerkId: clerkUser.id },
        });
        if (!user)
            return NextResponse.json({ error: "User not found in database" }, { status: 404 });

        const formData = await req.formData();
        const file = formData.get("file") as File;
        const title = formData.get("title") as string;
        const description = (formData.get("description") as string) || "";
        const courseId = formData.get("courseId") as string;

        if (!file || !title || !courseId) {
            return NextResponse.json(
                { error: "Missing file, title, or courseId" },
                { status: 400 }
            );
        }

        // ✅ Read and parse CSV
        const buffer = Buffer.from(await file.arrayBuffer());
        const csvData = parse(buffer.toString(), {
            columns: true,
            skip_empty_lines: true,
            trim: true,
        });

        // ✅ Step 1: Create the quiz
        const quiz = await prisma.quiz.create({
            data: {
                title,
                description,
                courseId,
            },
        });

        let createdCount = 0;

        // ✅ Step 2: Loop through CSV rows → create questions
        for (const row of csvData) {
            const text = row.text?.trim();
            const isMultiple = row.isMultiple?.toLowerCase() === "true";
            const options = (row.options || "")
                .split("|")
                .map((opt: string) => opt.trim())
                .filter((opt: string) => opt.length > 0);

            const correctIndexes = (row.correctIndexes || "")
                .split("|")
                .map((idx: string) => parseInt(idx.trim(), 10))
                .filter((n: number) => !isNaN(n));

            if (!text || options.length < 2) continue;

            // ✅ Step 3: Create question + options
            const question = await prisma.question.create({
                data: {
                    text,
                    isMultiple,
                    quizId: quiz.id,
                    // createdBy: user.id,
                    options: {
                        create: options.map((opt) => ({ text: opt })),
                    },
                },
                include: { options: true },
            });

            // ✅ Step 4: Match correctIndexes → option IDs
            const correctIds = correctIndexes
                .map((i: number) => question.options[i]?.id)
                .filter(Boolean);

            if (correctIds.length > 0) {
                await prisma.question.update({
                    where: { id: question.id },
                    data: { correctIds },
                });
            }

            createdCount++;
        }

        return NextResponse.json({
            message: "✅ Quiz and questions uploaded successfully",
            quizId: quiz.id,
            createdCount,
        });
    } catch (error: any) {
        console.error("Bulk upload error:", error);
        return NextResponse.json(
            { error: error.message || "Failed to process CSV upload" },
            { status: 500 }
        );
    }
};
