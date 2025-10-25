'use server'
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// export async function GET(_: Request, { params }: { params: { id: string } }) {
//     const q = await prisma.course.findUnique({ where: { id: params.id } });
//     if (!q) return NextResponse.json({ error: 'Not found' }, { status: 404 });
//     return NextResponse.json(q);
// }

export async function GET(_: Request, { params }: { params: { id: string } }) {
    try {
        const course = await prisma.course.findUnique({
            where: { id: params.id },
            include: {
                quizzes: true,
                courseStats: true,
            },
        });

        if (!course) {
            return NextResponse.json({ error: 'Not found' }, { status: 404 });
        }

        return NextResponse.json(course);
    } catch (error) {
        console.error('Error fetching course:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}



// UPDATE /api/courses/:id
export async function PUT(req: Request, { params }: { params: { id: string } }) {
    try {
        const body = await req.json();
        const { title, description, image } = body;

        const updatedCourse = await prisma.course.update({
            where: { id: params.id },
            data: { name: title, description, image },
        });

        return NextResponse.json(updatedCourse);
    } catch (error) {
        console.error('Error updating course:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}


// DELETE /api/courses/:id
export async function DELETE(_: Request, { params }: { params: { id: string } }) {
    try {
        await prisma.course.delete({
            where: { id: params.id },
        });

        return NextResponse.json({ message: 'Course deleted successfully' });
    } catch (error) {
        console.error('Error deleting course:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
