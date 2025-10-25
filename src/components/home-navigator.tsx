'use client'
import React, {useEffect, useState} from 'react'
import { useUser } from '@clerk/nextjs';
import Link from "next/link";

const HomeNavigator = () => {
    const [isAdmin, setIsAdmin] = useState<boolean>(false);
    const {user} = useUser()
    useEffect(() => {
        ;(async () => {
            try {
                if(!user) return setIsAdmin(false)

                const res = await fetch('/api/sync-user', { method: 'GET' })
                const data = await res.json()
                setIsAdmin(data?.user?.role === 'ADMIN')
            } catch (error) {
                console.error('Error fetching user:', error)
            }
        })() // <-- this is what actually calls the async function
    }, [user])

    return (
        <div className="flex gap-x-4">
            {/*<Link href="/courses" className="rounded bg-slate-800 text-white px-3 py-1">Take Quizzes</Link>*/}
            <Link href="/courses" className="shad-primary-btn">Take Quizzes</Link>
            {/*{isAdmin && */}
                <Link href="/admin" className="rounded border-2 border-border font-semibold hover:border-primary px-3 py-2">Dashboard</Link>
            {/* }*/}
        </div>
    )
}
export default HomeNavigator
