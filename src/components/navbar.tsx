'use client';
import Link from 'next/link';
import {useUser, SignedIn, SignedOut, SignInButton, SignOutButton, UserButton} from '@clerk/nextjs';
import { useEffect, useState } from 'react';
import {
  Dialog,
  DialogPanel,
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Popover,
  PopoverButton,
  PopoverGroup,
  PopoverPanel,
} from '@headlessui/react'
import {
  Bars3Icon,
  ChartPieIcon,
  CursorArrowRaysIcon,
  FingerPrintIcon,
  SquaresPlusIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline'
import { ChevronDownIcon, PhoneIcon, PlayCircleIcon, RectangleGroupIcon } from '@heroicons/react/20/solid'


export default function Navbar() {
  const { user } = useUser();
  const [role, setRole] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // console.log("user: ", user)


  useEffect(() => {
    if (user) setRole((user.publicMetadata as any)?.role || 'USER');
    fetch('/api/sync-user', {
      method: 'POST',
    }).catch((err) => console.error('Failed to sync user:', err));
  }, [user]);

  return (
    <header className=" border-b h-16">
      <div className="max-w-7xl mx-auto p-4 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <Link href="/" className="text-lg font-semibold">MCQ App</Link>
          {/*<SignedIn>*/}
          {/*  {role === 'ADMIN' ? (*/}
          {/*    <Link href="/admin" className="text-sm text-slate-600">Admin</Link>*/}
          {/*  ) : (*/}
          {/*    <Link href="/user" className="text-sm text-slate-600">Quizzes</Link>*/}
          {/*  )}*/}
          {/*</SignedIn>*/}
        </div>

        <div className="flex lg:flex-1 lg:justify-end cursor-pointer">
          <SignedIn>
            <div className="flex items-center gap-2">
              {/*<span className="text-sm text-slate-700 hidden md:inline">{user?.emailAddresses?.[0]?.emailAddress}</span>*/}
              <span className="text-sm text-slate-700 hidden md:inline ">{user ? <span>{user.fullName}</span> : null}</span>
              <div className="cursor-pointer">
                {/*<SignOutButton />*/}
              </div>
              <UserButton />
            </div>
          </SignedIn>
          <SignedOut>
            {/*<SignInButton />*/}
            <Link href='/sign-in' className="cursor-pointer">Sign In</Link>
          </SignedOut>
        </div>
      </div>
    </header>
  );
}
