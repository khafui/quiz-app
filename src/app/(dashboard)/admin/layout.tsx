// import {  currentUser } from '@clerk/nextjs/server';
// import { redirect } from 'next/navigation';
//
// export default async function AdminLayout({ children }: { children: React.ReactNode }) {
//   // const { userId } = auth();
//   const user = await currentUser();
//   //   console.log("user: ", user)
//
//
//     if (!user?.id || (user?.publicMetadata as any)?.role !== 'ADMIN') {
//     redirect('/sign-in');
//   }
//
//   return (
//     <div className="min-h-screen">
//       <header className="bg-white border-b p-4">
//         <div className="max-w-5xl mx-auto flex justify-between items-center">
//           <h2 className="text-lg font-semibold">Admin Dashboard</h2>
//         </div>
//       </header>
//       <div className="max-w-5xl mx-auto p-6">
//         {children}
//       </div>
//     </div>
//   );
// }

// import { currentUser } from '@clerk/nextjs/server';
// // import {useUser} from "@clerk/nextjs";
// import { redirect } from 'next/navigation';
// import { prisma } from '@/lib/prisma';
//
// export default async function AdminLayout({ children }: { children: React.ReactNode }) {
//     const user = await currentUser();
//     // const { user } = useUser();
//     // console.log("user: ", user)
//     // console.log("user: ", user?.publicMetadata.role)
//
//
//     //|| (user.publicMetadata as any)?.role !== 'ADMIN'
//     if (!user?.id ) {
//         redirect('/');
//     }
//
//     const dbUser = await prisma.user.findUnique({
//         where: { clerkId: user.id },
//     });
//
//     // console.log("dbUser: ", dbUser)
//
//     if (!dbUser || dbUser.role !== 'ADMIN') redirect('/');
//
//
//     return (
//         <div className="min-h-screen">
//             <header className="bg-white border-b p-4">
//                 <div className="max-w-5xl mx-auto flex justify-between items-center">
//                     <h2 className="text-lg font-semibold">Admin Dashboard</h2>
//                 </div>
//             </header>
//             <div className="max-w-5xl mx-auto p-6">{children}</div>
//         </div>
//     );
// }


// import { currentUser } from '@clerk/nextjs/server';
// import { redirect } from 'next/navigation';
// import { prisma } from '@/lib/prisma';
// import Link from 'next/link';
// import { cn } from '@/lib/utils';
// import {
//     LayoutDashboard,
//     BookOpen,
//     HelpCircle,
//     Settings,
//     LogOut,
// } from 'lucide-react';
// import {
//     Sidebar,
//     SidebarContent,
//     SidebarHeader,
//     SidebarFooter,
//     SidebarMenuItem,
// } from '@/components/ui/sidebar';
// import { Button } from '@/components/ui/button';
//
// const navLinks = [
//     { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
//     { href: '/admin/courses', label: 'Courses', icon: BookOpen },
//     { href: '/admin/quizzes', label: 'Quizzes', icon: HelpCircle },
//     { href: '/admin/settings', label: 'Settings', icon: Settings },
// ];
//
// export default async function AdminLayout({
//                                               children,
//                                           }: {
//     children: React.ReactNode;
// }) {
//     const user = await currentUser();
//     if (!user?.id) redirect('/');
//
//     const dbUser = await prisma.user.findUnique({
//         where: { clerkId: user.id },
//     });
//
//     if (!dbUser || dbUser.role !== 'ADMIN') redirect('/');
//
//     return (
//         <div className="flex min-h-screen bg-gray-50">
//             {/* Sidebar */}
//             <aside className="hidden md:flex flex-col w-64 border-r bg-white">
//                 <SidebarHeader>
//                     <div className="flex items-center justify-center py-4 border-b">
//                         <h2 className="text-xl font-semibold">Admin Panel</h2>
//                     </div>
//                 </SidebarHeader>
//
//                 <SidebarContent>
//                     <nav className="flex flex-col gap-1 p-2">
//                         {navLinks.map(({ href, label, icon: Icon }) => (
//                             <SidebarMenuItem key={href} href={href}>
//                                 <Link
//                                     href={href}
//                                     className={cn(
//                                         'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100',
//                                         'transition-colors duration-150 ease-in-out'
//                                     )}
//                                 >
//                                     <Icon className="w-4 h-4" />
//                                     {label}
//                                 </Link>
//                             </SidebarMenuItem>
//                         ))}
//                     </nav>
//                 </SidebarContent>
//
//                 <SidebarFooter className="p-4 border-t mt-auto">
//                     <form action="/sign-out" method="post">
//                         <Button
//                             variant="ghost"
//                             className="flex items-center gap-2 w-full text-gray-700 hover:bg-gray-100"
//                         >
//                             <LogOut className="w-4 h-4" /> Logout
//                         </Button>
//                     </form>
//                 </SidebarFooter>
//             </aside>
//
//             {/* Main Content */}
//             <main className="flex-1 p-6">
//                 <header className="flex items-center justify-between mb-6">
//                     <h1 className="text-2xl font-bold">Admin Dashboard</h1>
//                     <p className="text-gray-500 text-sm">{user.emailAddresses[0]?.emailAddress}</p>
//                 </header>
//                 <div>{children}</div>
//             </main>
//         </div>
//     );
// }


// 'use client';
//
// import { useState } from 'react';
// import { usePathname } from 'next/navigation';
//
// import Link from 'next/link';
// import {
//     LayoutDashboard,
//     BookOpen,
//     ChevronDown,
//     HelpCircle,
//     Settings,
//     LogOut,
//     Menu,
// } from 'lucide-react';
// import {
//     Sheet,
//     SheetContent,
//     SheetTrigger,
// } from '@/components/ui/sheet';
// import { Button } from '@/components/ui/button';
// import { cn } from '@/lib/utils';
//
// const navLinks = [
//     {
//         label: 'Dashboard',
//         href: '/admin',
//         icon: LayoutDashboard,
//     },
//     {
//         label: 'Courses',
//         icon: BookOpen,
//         submenu: [
//             { label: 'All Courses', href: '/admin/courses' },
//             { label: 'Add New', href: '/admin/courses/new' },
//         ],
//     },
//     {
//         label: 'Quizzes',
//         href: '/admin/quizzes',
//         icon: HelpCircle,
//     },
//     {
//         label: 'Settings',
//         href: '/admin/settings',
//         icon: Settings,
//     },
// ];
//
// export default function AdminLayout({
//                                         children,
//                                     }: {
//     children: React.ReactNode;
// }) {
//     const pathname = usePathname();
//     const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);
//     const [mobileOpen, setMobileOpen] = useState(false);
//
//     //     const user = await currentUser();
//     // if (!user?.id) redirect('/');
//     //
//     // const dbUser = await prisma.user.findUnique({
//     //     where: { clerkId: user.id },
//     // });
//
//     const SidebarContent = (
//         <div className="flex flex-col h-full bg-white border-r">
//             <div className="flex items-center justify-center py-4 border-b">
//                 <h2 className="text-xl font-semibold">Admin Panel</h2>
//             </div>
//
//             <nav className="flex-1 overflow-y-auto p-2 space-y-1">
//                 {navLinks.map(({ label, href, icon: Icon, submenu }) => (
//                     <div key={label}>
//                         {submenu ? (
//                             <>
//                                 <button
//                                     onClick={() =>
//                                         setOpenSubmenu(openSubmenu === label ? null : label)
//                                     }
//                                     className={cn(
//                                         'flex items-center justify-between w-full px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 transition-all',
//                                     )}
//                                 >
//                                     <div className="flex items-center gap-3">
//                                         {Icon && <Icon className="w-4 h-4" />}
//                                         {label}
//                                     </div>
//                                     <ChevronDown
//                                         className={cn(
//                                             'w-4 h-4 transition-transform',
//                                             openSubmenu === label ? 'rotate-180' : ''
//                                         )}
//                                     />
//                                 </button>
//
//                                 {openSubmenu === label && (
//                                     <div className="ml-8 mt-1 flex flex-col gap-1">
//                                         {submenu.map((item) => (
//                                             <Link
//                                                 key={item.href}
//                                                 href={item.href}
//                                                 className={cn(
//                                                     'block px-3 py-2 text-sm rounded-md hover:bg-gray-100 text-gray-600',
//                                                     pathname === item.href && 'bg-gray-100 font-medium'
//                                                 )}
//                                             >
//                                                 {item.label}
//                                             </Link>
//                                         ))}
//                                     </div>
//                                 )}
//                             </>
//                         ) : (
//                             <Link
//                                 href={href!}
//                                 className={cn(
//                                     'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors',
//                                     pathname === href && 'bg-gray-100'
//                                 )}
//                             >
//                                 {Icon && <Icon className="w-4 h-4" />}
//                                 {label}
//                             </Link>
//                         )}
//                     </div>
//                 ))}
//             </nav>
//
//             <div className="border-t p-4">
//                 <Button
//                     variant="ghost"
//                     className="flex items-center gap-2 w-full text-gray-700 hover:bg-gray-100"
//                 >
//                     <LogOut className="w-4 h-4" /> Logout
//                 </Button>
//             </div>
//         </div>
//     );
//
//     return (
//         <div className="flex min-h-screen">
//             {/* Desktop Sidebar */}
//             <aside className="hidden md:flex w-64 flex-col">{SidebarContent}</aside>
//
//             {/* Mobile Sidebar */}
//             <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
//                 <SheetTrigger asChild>
//                     <Button
//                         variant="ghost"
//                         size="icon"
//                         className="absolute top-4 left-4 md:hidden"
//                     >
//                         <Menu className="w-5 h-5" />
//                     </Button>
//                 </SheetTrigger>
//                 <SheetContent side="left" className="p-0 w-64">
//                     {SidebarContent}
//                 </SheetContent>
//             </Sheet>
//
//             {/* Main Content */}
//             <main className="flex-1 p-6 md:ml-0 mt-12 md:mt-0 bg-gray-50">
//                 {children}
//             </main>
//         </div>
//     );
// }

import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import AdminLayoutClient from "@/components/admin-client-layout";


export default async function AdminLayout({
                                              children,
                                          }: {
    children: React.ReactNode;
}) {
    const user = await currentUser();
    if (!user?.id) redirect('/');

    const dbUser = await prisma.user.findUnique({
        where: { clerkId: user.id },
    });

    const role = dbUser?.role || 'USER'; // default to USER

    return (
        <AdminLayoutClient
            role={role}
            userEmail={user.emailAddresses[0]?.emailAddress}
        >
            {children}
        </AdminLayoutClient>
    );
}
