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


import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@clerk/nextjs/server';

export async function POST(req: Request) {
  const { userId } = auth();
  const { courseId, title, description, questions } = await req.json();

  if (!courseId || !title || !Array.isArray(questions) || questions.length === 0) {
    return NextResponse.json({ error: 'Invalid request data' }, { status: 400 });
  }

  const quiz = await prisma.quiz.create({
    data: {
      title,
      description,
      courseId,
      createdBy: userId || undefined,
    },
  });

  const created = [];

  for (const q of questions) {
    const { text, isMultiple = false, options, correctIndexes = [] } = q;
    if (!text || !Array.isArray(options) || options.length < 2) continue;

    const question = await prisma.question.create({
      data: {
        text,
        isMultiple,
        quizId: quiz.id,
        createdBy: userId || undefined,
        options: { create: options.map((o: any) => ({ text: o.text })) },
      },
      include: { options: true },
    });

    const mapped = [];
    for (const idx of correctIndexes) {
      if (typeof idx === 'number' && question.options[idx]) {
        mapped.push(question.options[idx].id);
      }
    }

    if (mapped.length) {
      await prisma.question.update({
        where: { id: question.id },
        data: { correctIds: mapped },
      });
    }

    created.push(question);
  }

  return NextResponse.json({ quiz, createdCount: created.length });
}
