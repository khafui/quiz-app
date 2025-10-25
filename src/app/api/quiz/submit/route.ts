import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
// import {getAuth} from "@clerk/nextjs/server";
import { currentUser } from '@clerk/nextjs/server';


/**
 * POST payload:
 * {
 *   answers: [
 *     { questionId, selectedOptionIds: [string,...] },
 *     ...
 *   ],
 *   scoringMode: 'exact' | 'partial' // optional, default 'exact'
 * }
 */
// export async function POST(req: Request) {
//   const  user  = await currentUser();
//   const userId = user?.id;
//   console.log("userId: ", user)
//
//   const body = await req.json();
//   const { answers, scoringMode = 'exact' } = body;
//
//   if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
//   if (!Array.isArray(answers) || answers.length === 0) {
//     return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
//   }
//
//   let totalScore = 0;
//   let correctCount = 0;
//   const perQuestion = [];
//
//   for (const ans of answers) {
//     const q = await prisma.question.findUnique({ where: { id: ans.questionId } });
//     if (!q) {
//       perQuestion.push({ questionId: ans.questionId, correct: false, reason: 'Question not found' });
//       continue;
//     }
//
//     const correctSet = new Set(q.correctIds || []);
//     const selected = Array.isArray(ans.selectedOptionIds) ? ans.selectedOptionIds : (ans.selectedOptionId ? [ans.selectedOptionId] : []);
//     const selectedSet = new Set(selected);
//
//     if (scoringMode === 'exact') {
//       let isEqual = true;
//       if (correctSet.size !== selectedSet.size) isEqual = false;
//       else {
//         for (const id of correctSet) {
//           if (!selectedSet.has(id)) { isEqual = false; break; }
//         }
//       }
//       if (isEqual) {
//         totalScore += 1;
//         correctCount++;
//       }
//       perQuestion.push({ questionId: q.id, correct: isEqual });
//     } else {
//       const truePositives = Array.from(selectedSet).filter(id => correctSet.has(id)).length;
//       const falsePositives = Array.from(selectedSet).filter(id => !correctSet.has(id)).length;
//       const denom = correctSet.size || 1;
//       const pts = Math.max(0, (truePositives - falsePositives) / denom);
//       totalScore += pts;
//       const isCorrect = pts === 1;
//       if (isCorrect) correctCount++;
//       perQuestion.push({ questionId: q.id, partialScore: pts, correct: isCorrect });
//     }
//   }
//
//   const total = answers.length;
//   const scorePercent = (totalScore / total) * 100;
//
//   const result = await prisma.quizResult.create({
//     data: { userId, total, correct: correctCount, score: scorePercent }
//   });
//
//   return NextResponse.json({ result, correct: correctCount, total, score: scorePercent, details: perQuestion });
// }

// export async function POST(req: Request) {
//   try {
//     const user = await currentUser();
//     const userId = user?.id;
//
//     if (!userId)
//       return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
//
//     const body = await req.json();
//     const { answers, scoringMode = 'exact' } = body;
//
//     if (!Array.isArray(answers) || answers.length === 0) {
//       return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
//     }
//
//     let totalScore = 0;
//     let correctCount = 0;
//     const perQuestion: any[] = [];
//     let quizId: string | null = null;
//
//     for (const ans of answers) {
//       const q = await prisma.question.findUnique({
//         where: { id: ans.questionId },
//       });
//
//       if (!q) {
//         perQuestion.push({
//           questionId: ans.questionId,
//           correct: false,
//           reason: 'Question not found',
//         });
//         continue;
//       }
//
//       if (!quizId) quizId = q.quizId;
//
//       const correctSet = new Set(q.correctIds || []);
//       const selected = Array.isArray(ans.selectedOptionIds)
//           ? ans.selectedOptionIds
//           : [];
//       const selectedSet = new Set(selected);
//
//       if (scoringMode === 'exact') {
//         let isEqual = true;
//         if (correctSet.size !== selectedSet.size) isEqual = false;
//         else {
//           for (const id of correctSet) {
//             if (!selectedSet.has(id)) {
//               isEqual = false;
//               break;
//             }
//           }
//         }
//         if (isEqual) {
//           totalScore += 1;
//           correctCount++;
//         }
//         perQuestion.push({ questionId: q.id, correct: isEqual });
//       } else {
//         const truePositives = Array.from(selectedSet).filter((id) =>
//             correctSet.has(id)
//         ).length;
//         const falsePositives = Array.from(selectedSet).filter(
//             (id) => !correctSet.has(id)
//         ).length;
//         const denom = correctSet.size || 1;
//         const pts = Math.max(0, (truePositives - falsePositives) / denom);
//         totalScore += pts;
//         const isCorrect = pts === 1;
//         if (isCorrect) correctCount++;
//         perQuestion.push({ questionId: q.id, partialScore: pts, correct: isCorrect });
//       }
//     }
//
//     const total = answers.length;
//     const scorePercent = (totalScore / total) * 100;
//
//     // ✅ Save result without "details"
//     const result = await prisma.quizResult.create({
//       data: {
//         userId,
//         quizId: quizId || '',
//         total,
//         correct: correctCount,
//         score: scorePercent,
//       },
//     });
//
//     // ✅ Return computed details to frontend only
//     return NextResponse.json({
//       result,
//       correct: correctCount,
//       total,
//       score: scorePercent,
//       details: perQuestion,
//     });
//   } catch (error: any) {
//     console.error('Error submitting quiz:', error);
//     return NextResponse.json(
//         { error: 'Internal Server Error', details: error.message },
//         { status: 500 }
//     );
//   }
// }


// export async function POST(req: Request) {
//   try {
//     const clerkUser = await currentUser();
//     if (!clerkUser) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
//
//     // 🔍 Find the local DB user by Clerk ID
//     const dbUser = await prisma.user.findUnique({
//       where: { clerkId: clerkUser.id },
//     });
//
//     if (!dbUser)
//       return NextResponse.json(
//           { error: 'User not found in database' },
//           { status: 404 }
//       );
//
//     const body = await req.json();
//     const { answers, scoringMode = 'exact' } = body;
//
//     if (!Array.isArray(answers) || answers.length === 0) {
//       return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
//     }
//
//     let totalScore = 0;
//     let correctCount = 0;
//     const perQuestion: any[] = [];
//     let quizId: string | null = null;
//
//     for (const ans of answers) {
//       const q = await prisma.question.findUnique({
//         where: { id: ans.questionId },
//       });
//
//       if (!q) {
//         perQuestion.push({
//           questionId: ans.questionId,
//           correct: false,
//           reason: 'Question not found',
//         });
//         continue;
//       }
//
//       if (!quizId) quizId = q.quizId;
//
//       const correctSet = new Set(q.correctIds || []);
//       const selectedSet = new Set(ans.selectedOptionIds || []);
//
//       if (scoringMode === 'exact') {
//         const isEqual =
//             correctSet.size === selectedSet.size &&
//             [...correctSet].every((id) => selectedSet.has(id));
//
//         if (isEqual) {
//           totalScore += 1;
//           correctCount++;
//         }
//
//         perQuestion.push({ questionId: q.id, correct: isEqual });
//       } else {
//         const truePositives = [...selectedSet].filter((id) =>
//             correctSet.has(id)
//         ).length;
//         const falsePositives = [...selectedSet].filter(
//             (id) => !correctSet.has(id)
//         ).length;
//         const denom = correctSet.size || 1;
//         const pts = Math.max(0, (truePositives - falsePositives) / denom);
//         totalScore += pts;
//         const isCorrect = pts === 1;
//         if (isCorrect) correctCount++;
//         perQuestion.push({
//           questionId: q.id,
//           partialScore: pts,
//           correct: isCorrect,
//         });
//       }
//     }
//
//     const total = answers.length;
//     const scorePercent = (totalScore / total) * 100;
//
//     // ✅ Use dbUser.id instead of Clerk userId
//     const result = await prisma.quizResult.create({
//       data: {
//         userId: dbUser.id,
//         quizId: quizId || '',
//         total,
//         correct: correctCount,
//         score: scorePercent,
//       },
//     });
//
//     return NextResponse.json({
//       result,
//       correct: correctCount,
//       total,
//       score: scorePercent,
//       details: perQuestion,
//     });
//   } catch (error: any) {
//     console.error('Error submitting quiz:', error);
//     return NextResponse.json(
//         { error: 'Internal Server Error', details: error.message },
//         { status: 500 }
//     );
//   }
// }


export async function POST(req: Request) {
  try {
    const clerkUser = await currentUser();
    if (!clerkUser)
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const dbUser = await prisma.user.findUnique({
      where: { clerkId: clerkUser.id },
    });

    if (!dbUser)
      return NextResponse.json(
          { error: 'User not found in database' },
          { status: 404 }
      );

    const body = await req.json();
    const { answers, scoringMode = 'exact' } = body;

    if (!Array.isArray(answers) || answers.length === 0) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }

    let totalScore = 0;
    let correctCount = 0;
    const perQuestion: any[] = [];
    let quizId: string | null = null;

    for (const ans of answers) {
      const q = await prisma.question.findUnique({
        where: { id: ans.questionId },
      });

      if (!q) {
        perQuestion.push({
          questionId: ans.questionId,
          correct: false,
          reason: 'Question not found',
        });
        continue;
      }

      if (!quizId) quizId = q.quizId;

      // --- Ensure both sides are arrays of strings ---
      const correctIds = Array.isArray(q.correctIds)
          ? q.correctIds
          : q.correctIds
              ? [q.correctIds]
              : [];
      const selectedIds = Array.isArray(ans.selectedOptionIds)
          ? ans.selectedOptionIds
          : ans.selectedOptionId
              ? [ans.selectedOptionId]
              : [];

      const correctSet = new Set(correctIds);
      const selectedSet = new Set(selectedIds);

      console.log('Question:', q.id);
      console.log('Correct IDs:', correctIds);
      console.log('Selected IDs:', selectedIds);

      if (scoringMode === 'exact') {
        // ✅ Must match exactly
        const isEqual =
            correctSet.size === selectedSet.size &&
            [...correctSet].every((id) => selectedSet.has(id));

        if (isEqual) {
          totalScore += 1;
          correctCount++;
        }

        perQuestion.push({ questionId: q.id, correct: isEqual });
      } else {
        // ✅ Partial scoring (optional mode)
        const truePositives = [...selectedSet].filter((id) =>
            correctSet.has(id)
        ).length;
        const falsePositives = [...selectedSet].filter(
            (id) => !correctSet.has(id)
        ).length;
        const denom = correctSet.size || 1;
        const pts = Math.max(0, (truePositives - falsePositives) / denom);
        totalScore += pts;
        const isCorrect = pts === 1;
        if (isCorrect) correctCount++;
        perQuestion.push({
          questionId: q.id,
          partialScore: pts,
          correct: isCorrect,
        });
      }
    }

    const total = answers.length;
    const scorePercent = (totalScore / total) * 100;

    console.log('Total:', total);
    console.log('Correct count:', correctCount);
    console.log('Score percent:', scorePercent);

    const result = await prisma.quizResult.create({
      data: {
        userId: dbUser.id,
        quizId: quizId || '',
        total,
        correct: correctCount,
        score: scorePercent,
      },
    });

    const quiz = await prisma.quiz.findUnique({
      where: { id: quizId! },
      include: { course: true },
    });

    if (quiz?.courseId) {
      const courseId = quiz.courseId;

      // ✅ Update or create CourseStat record
      await prisma.courseStat.upsert({
        where: {
          userId_courseId: {
            userId: dbUser.id,
            courseId,
          },
        },
        update: {
          attempts: { increment: 1 },
          completed: { increment: 1 },
          lastAttempt: new Date(),
          averageScore: {
            set: await calculateNewAverage(dbUser.id, courseId),
          },
        },
        create: {
          userId: dbUser.id,
          courseId,
          attempts: 1,
          completed: 1,
          averageScore: scorePercent,
          lastAttempt: new Date(),
        },
      });
    }

    return NextResponse.json({
      result,
      correct: correctCount,
      total,
      score: scorePercent,
      details: perQuestion,
    });
  } catch (error: any) {
    console.error('Error submitting quiz:', error);
    return NextResponse.json(
        { error: 'Internal Server Error', details: error.message },
        { status: 500 }
    );
  }
}



async function calculateNewAverage(userId: string, courseId: string) {
  const allResults = await prisma.quizResult.findMany({
    where: {
      userId,
      quiz: { courseId },
    },
  });

  if (allResults.length === 0) return 0;
  const totalScore = allResults.reduce((acc, r) => acc + r.score, 0);
  return totalScore / allResults.length;
}