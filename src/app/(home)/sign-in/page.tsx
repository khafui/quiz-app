'use client';
import React from 'react'
import {SignIn} from "@clerk/nextjs";

const Page = () => {
    return (
        <div className="flex justify-center items-center h-screen">
            <SignIn />
        </div>
    )
}
export default Page
