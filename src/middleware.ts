import { clerkMiddleware } from '@clerk/nextjs/server';

export default clerkMiddleware();

export const config = {
    matcher: [
        '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
        // Protect all routes under /user, adjust as needed
        '/(dashboard)/admin(.*)',
        '/(dashboard)/user(.*)',
        '/api/(.*)',
    ],
};