'use server'

import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { currentUser } from '@clerk/nextjs/server'

// GET /api/questions/quiz/[quizId]
export async function GET(_: Request, { params }: { params: { quizId: string } }) {
    try {
        const { quizId } = params

        const questions = await prisma.question.findMany({
            where: { quizId },
            include: { options: true },
            orderBy: { createdAt: 'asc' },
        })

        if (!questions || questions.length === 0) {
            return NextResponse.json({ message: 'No questions found for this quiz' }, { status: 404 })
        }

        return NextResponse.json(questions)
    } catch (error) {
        console.error('Error fetching questions by quizId:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
