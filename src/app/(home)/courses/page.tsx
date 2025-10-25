'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import HomeCard from "@/components/HomeCard";
import {ICourse} from "../../../types/types";

export default function CoursesPage() {
    const [courses, setCourses] = useState<any[]>([]);

    useEffect(() => {
        fetch('/api/courses')
            .then((res) => res.json())
            .then(setCourses);
    }, []);

    // console.log("courses: ", courses)



    // <Link
    //     key={course.id}
    //     href={`/courses/${course.id}`}
    //     className="p-4 border rounded-lg hover:bg-gray-50"
    // >
    {/*<img src={course.image} alt={course.name} className="rounded-lg mb-2" />*/}
    {/*<h2 className="font-semibold">{course.name}</h2>*/}
    {/*<p className="text-sm text-gray-600">{course.description}</p>*/}
    // </Link>
    return (
        <div className="md:p-6">
            <h1 className="text-2xl font-bold mb-4">Courses</h1>
            {/*<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">*/}
            <div className="mt-6 grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-2">
                {courses.map((course: ICourse) => (
                        <HomeCard
                            key={course.id}
                            name={course.name}
                            image={course.image!}
                            description={course.description!}
                            link={`/courses/${course.id}`}
                        />
                ))}
            </div>
        </div>
    );
}
