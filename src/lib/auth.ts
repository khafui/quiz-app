import { currentUser } from '@clerk/nextjs/server';

export async function getCurrentUserPublicMetadata() {
  const user = await currentUser();
  return user?.publicMetadata || null;
}

export async function getCurrentUserId() {
  const user = await currentUser();
  return user?.id || null;
}
