'use client';

import { useState } from 'react';
import {usePathname, useRouter} from 'next/navigation';
import Link from 'next/link';
import {
    LayoutDashboard,
    BookOpen,
    ChevronDown,
    HelpCircle,
    Settings,
    LogOut,
    Menu,
} from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {useClerk} from "@clerk/nextjs";

export default function AdminLayoutClient({
                                              children,
                                              role,
                                              userEmail,
                                          }: {
    children: React.ReactNode;
    role: 'ADMIN' | 'USER';
    userEmail?: string;
}) {
    const pathname = usePathname();
    const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);
    const [mobileOpen, setMobileOpen] = useState(false);
    const { signOut } = useClerk()
    const router = useRouter();

    const navLinks = [
        { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
        ...(role === 'ADMIN'
            ? [
                {
                    label: 'Courses',
                    icon: BookOpen,
                    // submenu: [
                    //     { label: 'All Courses', href: '/admin/course' },
                    //     // { label: 'Add New', href: '/admin/courses/new' },
                    // ],
                    href: '/admin/course'
                },
            ]
            : []),
        { label: 'Quizzes', href: '/admin/quizzes', icon: HelpCircle },
        // { label: 'Settings', href: '/admin/settings', icon: Settings },
    ];

    const SidebarContent = (
        <div className="flex flex-col h-full bg-white border-r">
            <div className="flex items-center justify-center py-4 border-b cursor-pointer"
            onClick={() => router.push('/')}
            >
                <h2 className="text-xl font-semibold">MCQ App</h2>
            </div>

            <nav className="flex-1 overflow-y-auto p-2 space-y-1">
                {navLinks.map(({ label, href, icon: Icon, submenu }) => (
                    <div key={label}>
                        {submenu ? (
                            <>
                                <button
                                    onClick={() =>
                                        setOpenSubmenu(openSubmenu === label ? null : label)
                                    }
                                    className={cn(
                                        'flex items-center justify-between w-full px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 transition-all'
                                    )}
                                >
                                    <div className="flex items-center gap-3">
                                        {Icon && <Icon className="w-4 h-4" />}
                                        {label}
                                    </div>
                                    <ChevronDown
                                        className={cn(
                                            'w-4 h-4 transition-transform',
                                            openSubmenu === label ? 'rotate-180' : ''
                                        )}
                                    />
                                </button>

                                {openSubmenu === label && (
                                    <div className="ml-8 mt-1 flex flex-col gap-1">
                                        {submenu.map((item) => (
                                            <Link
                                                key={item.href}
                                                href={item.href}
                                                className={cn(
                                                    'block px-3 py-2 text-sm rounded-md hover:bg-gray-100 text-gray-600',
                                                    pathname === item.href && 'bg-gray-100 font-medium'
                                                )}
                                            >
                                                {item.label}
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </>
                        ) : (
                            <Link
                                href={href!}
                                className={cn(
                                    'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors',
                                    pathname === href && 'bg-gray-100'
                                )}
                            >
                                {Icon && <Icon className="w-4 h-4" />}
                                {label}
                            </Link>
                        )}
                    </div>
                ))}
            </nav>

            <div className="border-t p-4">
                <Button
                    onClick={() => {
                        signOut()
                        router.push('/sign-in')
                    }}
                    variant="ghost"
                    className="flex items-center gap-2 w-full text-gray-700 hover:bg-gray-100"
                >
                    <LogOut className="w-4 h-4" /> Logout
                </Button>
            </div>
        </div>
    );

    return (
        <div className="flex min-h-screen bg-gray-50">
            {/* Desktop Sidebar */}
            <aside className="hidden md:flex w-64 flex-col">{SidebarContent}</aside>

            {/* Mobile Sidebar */}
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
                <SheetTrigger asChild>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-4 left-4 md:hidden"
                    >
                        <Menu className="w-5 h-5" />
                    </Button>
                </SheetTrigger>
                <SheetContent side="left" className="p-0 w-64">
                    {SidebarContent}
                </SheetContent>
            </Sheet>

            {/* Main Content */}
            <main className="flex-1 p-6 md:ml-0 mt-12 md:mt-0 bg-gray-50">
                {/*<header className="flex items-center justify-between mb-6">*/}
                {/*    <h1 className="text-2xl font-bold">Admin Dashboard</h1>*/}
                {/*    {userEmail && <p className="text-gray-500 text-sm">{userEmail}</p>}*/}
                {/*</header>*/}
                {children}
            </main>
        </div>
    );
}
