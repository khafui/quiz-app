// import { NextResponse } from 'next/server';
// import { prisma } from '@/lib/prisma';
// import { auth } from '@clerk/nextjs/server';
//
// export async function POST(req: Request) {
//   const { userId } = auth();
//   const body = await req.json();
//   const { rows } = body;
//   if (!Array.isArray(rows) || rows.length === 0) {
//     return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
//   }
//
//   const created = [];
//   for (const r of rows) {
//     const { text, isMultiple=false, options, correctIndexes=[] } = r;
//     if (!text || !Array.isArray(options) || options.length < 2) continue;
//     const q = await prisma.question.create({
//       data: {
//         text,
//         isMultiple,
//         createdBy: userId || undefined,
//         options: { create: options.map((o:any)=>({ text: o.text })) }
//       },
//       include: { options: true }
//     });
//     const msrc/apped = [];
//     for (const idx of correctIndexes) {
//       if (typeof idx === 'number' && q.options[idx]) msrc/apped.push(q.options[idx].id);
//     }
//     if (msrc/apped.length) {
//       await prisma.question.update({ where: { id: q.id }, data: { correctIds: msrc/apped } });
//     }
//     created.push(q);
//   }
//
//   return NextResponse.json({ createdCount: created.length });
// }


// import { NextResponse } from 'next/server';
// import { prisma } from '@/lib/prisma';
// import { auth } from '@clerk/nextjs/server';
//
// export async function POST(req: Request) {
//   const { userId } = auth();
//   const { courseId, title, description, questions } = await req.json();
//
//   if (!courseId || !title || !Array.isArray(questions) || questions.length === 0) {
//     return NextResponse.json({ error: 'Invalid request data' }, { status: 400 });
//   }
//
//   const quiz = await prisma.quiz.create({
//     data: {
//       title,
//       description,
//       courseId,
//       createdBy: userId || undefined,
//     },
//   });
//
//   const created = [];
//
//   for (const q of questions) {
//     const { text, isMultiple = false, options, correctIndexes = [] } = q;
//     if (!text || !Array.isArray(options) || options.length < 2) continue;
//
//     const question = await prisma.question.create({
//       data: {
//         text,
//         isMultiple,
//         quizId: quiz.id,
//         createdBy: userId || undefined,
//         options: { create: options.map((o: any) => ({ text: o.text })) },
//       },
//       include: { options: true },
//     });
//
//     const mapped = [];
//     for (const idx of correctIndexes) {
//       if (typeof idx === 'number' && question.options[idx]) {
//         mapped.push(question.options[idx].id);
//       }
//     }
//
//     if (mapped.length) {
//       await prisma.question.update({
//         where: { id: question.id },
//         data: { correctIds: mapped },
//       });
//     }
//
//     created.push(question);
//   }
//
//   return NextResponse.json({ quiz, createdCount: created.length });
// }


// ===
// import { NextResponse } from 'next/server';
// import { prisma } from '@/lib/prisma';
// import { auth } from '@clerk/nextjs/server';
//
// export async function POST(req: Request) {
//   try {
//     const { userId } = auth();
//     const { courseId, title, description, questions } = await req.json();
//
//     if (!courseId || !title || !Array.isArray(questions) || questions.length === 0) {
//       return NextResponse.json({ error: 'Invalid request data' }, { status: 400 });
//     }
//
//     // Create quiz
//     const quiz = await prisma.quiz.create({
//       data: {
//         title,
//         description,
//         courseId,
//         createdBy: userId || undefined,
//       },
//     });
//
//     let createdCount = 0;
//
//     // Loop through uploaded questions
//     for (const q of questions) {
//       const { text, isMultiple = false, options, correctIndexes = [] } = q;
//       if (!text || !Array.isArray(options) || options.length < 2) continue;
//
//       // Create question with options
//       const question = await prisma.question.create({
//         data: {
//           text,
//           isMultiple,
//           quizId: quiz.id,
//           createdBy: userId || undefined,
//           options: { create: options.map((o: any) => ({ text: o.text })) },
//         },
//         include: { options: true },
//       });
//
//       // Map indexes to created option IDs
//       const mappedCorrectIds = correctIndexes
//           .map((i: number) => question.options[i]?.id)
//           .filter(Boolean);
//
//       if (mappedCorrectIds.length) {
//         await prisma.question.update({
//           where: { id: question.id },
//           data: { correctIds: mappedCorrectIds },
//         });
//       }
//
//       createdCount++;
//     }
//
//     return NextResponse.json({
//       message: 'Bulk upload successful',
//       quiz,
//       createdCount,
//     });
//   } catch (error: any) {
//     console.error('Bulk upload error:', error);
//     return NextResponse.json(
//         { error: error.message || 'Failed to upload questions' },
//         { status: 500 }
//     );
//   }
// }


// ===


// app/api/quizzes/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
// import { auth } from '@clerk/nextjs/server';
import { currentUser } from '@clerk/nextjs/server';
import { parse } from 'csv-parse/sync';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  try {
    // const { userId } = auth();
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const contentType = req.headers.get('content-type') || '';

    let courseId: string;
    let title: string;
    let description: string;
    let questions: any[] = [];

    // Handle CSV uploads (multipart/form-data)
    if (contentType.includes('multipart/form-data')) {
      const formData = await req.formData();
      const file = formData.get('file') as File;
      courseId = formData.get('courseId') as string;
      title = formData.get('title') as string;
      description = (formData.get('description') as string) || '';

      if (!file) {
        return NextResponse.json({ error: 'No CSV file uploaded' }, { status: 400 });
      }

      const text = await file.text();
      const records = parse(text, {
        columns: true,
        skip_empty_lines: true,
        trim: true,
      });

      questions = records.map((row: any) => ({
        text: row.text?.trim(),
        isMultiple: row.isMultiple?.toLowerCase() === 'true',
        options: (row.options || '')
            .split('|')
            .map((opt: string) => ({ text: opt.trim() }))
            .filter((o: any) => o.text.length > 0),
        correctIndexes: (row.correctIndexes || '')
            .split('|')
            .map((i: string) => parseInt(i.trim(), 10))
            .filter((n: number) => !isNaN(n)),
      }));
    }
    // Handle manual JSON submissions
    else if (contentType.includes('application/json')) {
      const body = await req.json();
      courseId = body.courseId;
      title = body.title;
      description = body.description || '';
      questions = body.questions || [];
    } else {
      return NextResponse.json({ error: 'Unsupported content type' }, { status: 415 });
    }

    // Validate input
    if (!courseId || !title || !Array.isArray(questions) || questions.length === 0) {
      return NextResponse.json({ error: 'Invalid input data' }, { status: 400 });
    }

    // Create quiz
    const quiz = await prisma.quiz.create({
      data: {
        title,
        description,
        courseId,
      },
    });

    let createdCount = 0;

    // Loop through and create each question
    for (const q of questions) {
      if (!q.text || !Array.isArray(q.options) || q.options.length < 2) continue;

      const question = await prisma.question.create({
        data: {
          text: q.text,
          isMultiple: q.isMultiple ?? false,
          quizId: quiz.id,
          options: { create: q.options.map((o: any) => ({ text: o.text })) },
        },
        include: { options: true },
      });

      const correctIds =
          q.correctIndexes
              ?.map((idx: number) => question.options[idx]?.id)
              .filter((id: string | undefined) => !!id) || [];

      if (correctIds.length) {
        await prisma.question.update({
          where: { id: question.id },
          data: { correctIds },
        });
      }

      createdCount++;
    }

    return NextResponse.json({
      message: 'Quiz created successfully',
      quiz,
      createdCount,
    });
  } catch (error: any) {
    console.error('Error creating quiz:', error);
    return NextResponse.json(
        { error: error.message || 'Internal server error' },
        { status: 500 }
    );
  }
}
