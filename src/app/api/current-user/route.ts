import { NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
    const user = await currentUser();

    if (!user) {
        return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const dbUser = await prisma.user.findUnique({
        where: { clerkId: user.id },
    });

    return NextResponse.json({
        id: user.id,
        email: user.emailAddresses[0]?.emailAddress,
        dbUser,
    });
}
