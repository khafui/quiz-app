'use client';
import { useEffect, useState } from 'react';
import {UserButton} from "@clerk/nextjs";

const Banner = ({ title }: { title: string }) => {
    const [activeUser, setActiveUser] = useState<any>(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await fetch('/api/current-user');
                if (!res.ok) throw new Error('Failed to fetch user');
                const data = await res.json();
                setActiveUser(data);
            } catch (err) {
                console.error(err);
                window.location.href = '/'; // redirect on client
            }
        };

        fetchUser();
    }, []);

    return (
        <div>
            <header className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold">{title}</h1>
                <div className="flex items-center gap-2">
                    {activeUser && (
                        <p className="hidden md:inline text-gray-500 text-sm">
                            {activeUser?.email}
                        </p>
                    )}
                    <UserButton />
                </div>
            </header>
        </div>
    );
};

export default Banner;
