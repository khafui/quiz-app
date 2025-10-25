import Link from 'next/link';
// import { currentUser } from '@clerk/nextjs/server';

export const revalidate = 0;

export default async function UserDashboard() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ''}/api/questions`, { cache: 'no-store' });
  const questions = await res.json();
    // const user = await currentUser()
    // console.log("user: ", user)


    return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Available Quizzes</h1>
      <div className="grid gap-4">
        {questions.items?.map((q: any) => (
          <div key={q.id} className="bg-white p-4 rounded border">
            <p className="font-medium">{q.text}</p>
            <div className="mt-3">
              <Link href={`/user/${q.id}`} className="text-sm text-blue-600">Take Quiz</Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
