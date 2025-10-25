// import { NextResponse } from 'next/server';
// import { prisma } from '@/lib/prisma';
// import { currentUser } from '@clerk/nextjs/server';
//
// export async function POST() {
//   const user = await currentUser();
//   if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
//
//   const existingUser = await prisma.user.findUnique({
//     where: { clerkId: user.id },
//   });
//
//   if (!existingUser) {
//     // Create a new record in your DB
//     await prisma.user.create({
//       data: {
//         clerkId: user.id,
//         email: user.emailAddresses[0].emailAddress,
//         name: `${user.firstName || ''} ${user.lastName || ''}`.trim(),
//         role: (user.publicMetadata as any)?.role || 'USER',
//       },
//     });
//   }
//
//   const clerkId = user.id;
//   const email = user.emailAddresses?.[0]?.emailAddress || null;
//   const role = (user.publicMetadata as any)?.role || 'USER';
//   const name = `${user.firstName || ''} ${user.lastName || ''}`.trim();
//
//   const upserted = await prisma.user.upsert({
//     where: { clerkId },
//     update: { email, role, updatedAt: new Date() },
//     create: { clerkId, email, name, role }
//   });
//
//   return NextResponse.json({ ok: true, user: upserted });

// }
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { currentUser } from '@clerk/nextjs/server';

export async function GET(){
  const user = await currentUser();

  if(user) {
    const existingUser = await prisma.user.findUnique({
      where: {clerkId: user.id}
    });
    return NextResponse.json({ok: true, user: existingUser});
  }
}

export async function POST() {
  const user = await currentUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const existingUser = await prisma.user.findUnique({
    where: { clerkId: user.id },
  });

  // Only create the user if it doesn't exist
  if (!existingUser) {
    const newUser = await prisma.user.create({
      data: {
        clerkId: user.id,
        email: user.emailAddresses?.[0]?.emailAddress || null,
        name: `${user.firstName || ''} ${user.lastName || ''}`.trim(),
        role: (user.publicMetadata as any)?.role || 'USER',
      },
    });
    return NextResponse.json({ ok: true, user: newUser });
  }

  // If user exists, just return it
  return NextResponse.json({ ok: true, user: existingUser });
}
