'use server'
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth, currentUser } from '@clerk/nextjs/server';

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const q = await prisma.question.findUnique({ where: { id: params.id }, include: { options: true } });
  if (!q) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(q);
}


export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const  user  = await currentUser();
  const userId = user?.id;

  console.log("user: ", user)
  console.log("userId: ", userId)


  const body = await req.json();
  const { text, isMultiple = false, options, correctIndexes = [] } = body;

  if (!text || !Array.isArray(options) || options.length < 2) {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
  }

  await prisma.option.deleteMany({ where: { questionId: params.id } });

  const updated = await prisma.question.update({
    where: { id: params.id },
    data: {
      text,
      isMultiple,
      updatedAt: new Date(),
      options: { create: options.map((o: any) => ({ text: o.text })) }
    },
    include: { options: true }
  });

  const mappedCorrectIds = [];
  for (const idx of correctIndexes) {
    if (typeof idx === 'number' && updated.options[idx]) mappedCorrectIds.push(updated.options[idx].id);
  }

  const final = await prisma.question.update({
    where: { id: updated.id },
    data: { correctIds: mappedCorrectIds }
  });

  return NextResponse.json(await prisma.question.findUnique({ where: { id: final.id }, include: { options: true } }));
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  await prisma.question.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
