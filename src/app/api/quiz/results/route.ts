import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@clerk/nextjs/server';

export async function GET() {
  const { userId } = auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const results = await prisma.quizResult.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' }
  });

  return NextResponse.json(results);
}
