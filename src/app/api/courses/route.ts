import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
    const courses = await prisma.course.findMany({
        select: {
            id: true,
            name: true,
            description: true,
            image: true,
        },
    });
    return NextResponse.json(courses);
}



export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { name, description, image } = body;

        if (!name) {
            return NextResponse.json({ error: 'Course name is required' }, { status: 400 });
        }

        const newCourse = await prisma.course.create({
            data: {
                name,
                description,
                image,
            },
        });

        return NextResponse.json(newCourse, { status: 201 });
    } catch (error) {
        console.error('Error creating course:', error);
        return NextResponse.json({ error: 'Failed to create course' }, { status: 500 });
    }
}