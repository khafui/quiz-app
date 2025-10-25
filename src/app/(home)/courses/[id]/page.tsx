'use client';
import React, { useEffect, useState } from 'react';
import {redirect, useRouter} from 'next/navigation';
import { IQuiz} from "@/types/types";
import HomeCard from "@/components/HomeCard";
// import {currentUser} from "@clerk/nextjs/server";
import { useUser } from '@clerk/nextjs';

export default function TakeQuiz({ params }: { params: { id: string } }) {
  // const { id } = params;
  const { id } = React.use(params);
  const [quizzes, setQuizzes] = useState<IQuiz[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState<any>(null);
  const [scoringMode, setScoringMode] = useState<'exact'|'partial'>('exact');
  const router = useRouter();
   const {user} = useUser()

   // console.log("user id: ", user)

  // if (!user) redirect('/sign-in');


  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`/api/courses/${id}`);
        const data = await res.json();

        // ✅ Extract quizzes from the returned course object
        if (res.ok && data?.quizzes) {
          setQuizzes(data.quizzes);
        } else {
          setQuizzes([]);
        }
      } catch (error) {
          console.error("Error fetching quizzes:", error);
        setQuizzes([]);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  // console.log("quiz: ", quizzes)


  // function toggleSelect(optionId: string) {
  //   if (!quizzes) return;
  //   if (quizzes.isMultiple) {
  //     setSelectedIds(prev => prev.includes(optionId) ? prev.filter(id => id !== optionId) : [...prev, optionId]);
  //   } else {
  //     setSelectedIds([optionId]);
  //   }
  // }

  // async function submit() {
  //   if (!selectedIds.length) return alert('Please select an option');
  //   const payload = {
  //     answers: [{ questionId: q.id, selectedOptionIds: selectedIds }],
  //     scoringMode
  //   };
  //   const res = await fetch('/api/quiz/submit', {
  //     method: 'POST',
  //     headers: { 'Content-Type': 'src/application/json' },
  //     body: JSON.stringify(payload)
  //   });
  //   const data = await res.json();
  //   console.log("ans: ", data)
  //
  //   if (res.ok) setResult(data);
  //   else alert('Error submitting quiz');
  // }

  if (loading) return <p>Loading...</p>;

  return (
    <div className="md:p-6">
      <div className="mt-6 grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))]">
        {quizzes.length > 0 ? quizzes.map((quiz: IQuiz) => (
            <HomeCard
                key={quiz.id}
                name={quiz.title}
                image={quiz.image!}
                description={quiz.description!}
                link={`/quiz/${quiz.id}?courseId=${quiz.courseId}`}
            />
        )): (<p>No data.</p>)}
      </div>
    </div>
  );
}
