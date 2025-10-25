import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@clerk/nextjs/server';

export async function GET(req) {
  const url = new URL(req.url);
  const search = url.searchParams.get('q') || '';
  const page = parseInt(url.searchParams.get('page')||'1',10) || 1;
  const limit = parseInt(url.searchParams.get('limit')||'10',10) || 10;
  const skip = (page - 1) * limit;

  const where = search ? {
    OR: [
      { text: { contains: search, mode: 'insensitive' } },
      { options: { some: { text: { contains: search, mode: 'insensitive' }}}}
    ]
  } : undefined;

  const [items, total] = await Promise.all([
    prisma.question.findMany({
      where,
      include: { options: true },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit
    }),
    prisma.question.count({ where })
  ]);

  return NextResponse.json({ items, total, page, limit });
}

// export async function POST(req: Request) {
//   const { userId } = auth();
//   const body = await req.json();
//   const { text, isMultiple = false, options, correctIndexes = [] } = body;
//
//   if (!text || !Array.isArray(options) || options.length < 2) {
//     return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
//   }
//
//   const created = await prisma.question.create({
//     data: {
//       text,
//       isMultiple,
//       createdBy: userId || undefined,
//       options: { create: options.map((o: any) => ({ text: o.text })) }
//     },
//     include: { options: true }
//   });
//
//   const mappedCorrectIds = [];
//   for (const idx of correctIndexes) {
//     if (typeof idx === 'number' && created.options[idx]) mappedCorrectIds.push(created.options[idx].id);
//   }
//
//   if (mappedCorrectIds.length) {
//     const updated = await prisma.question.update({
//       where: { id: created.id },
//       data: { correctIds: mappedCorrectIds }
//     });
//     return NextResponse.json(await prisma.question.findUnique({ where: { id: updated.id }, include: { options: true } }));
//   }
//
//   return NextResponse.json(created);
// }


export async function POST(req: Request) {
  const { userId } = auth();
  const body = await req.json();
  const { text, isMultiple = false, options, correctIndexes = [], quizId } = body;

  if (!quizId) {
    return NextResponse.json({ error: 'quizId is required' }, { status: 400 });
  }

  const created = await prisma.question.create({
    data: {
      text,
      isMultiple,
      quizId,
      createdBy: userId || undefined,
      options: { create: options.map((o: any) => ({ text: o.text })) },
    },
    include: { options: true },
  });

  const correctIds = correctIndexes
      .map((idx: number) => created.options[idx]?.id)
      .filter(Boolean);

  if (correctIds.length) {
    await prisma.question.update({
      where: { id: created.id },
      data: { correctIds },
    });
  }

  return NextResponse.json(created);
}

