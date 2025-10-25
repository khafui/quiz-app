'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
// import {currentUser} from "@clerk/nextjs/server";

export default function TakeQuiz({ params }: { params: { id: string } }) {
  const { id } = React.use(params);
  const [q, setQ] = useState<any>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [result, setResult] = useState<any>(null);
  const [scoringMode, setScoringMode] = useState<'exact'|'partial'>('exact');
  const router = useRouter();
   // const user = currentUser()

   // console.log("user id: ", user)


  useEffect(() => {
    (async () => {
      const res = await fetch(`/api/questions/${id}`);
      const data = await res.json();
      setQ(data);
    })();
  }, [id]);

  // function toggleSelect(optionId: string) {
  //   if (!q) return;
  //   if (q.isMultiple) {
  //     setSelectedIds(prev => prev.includes(optionId) ? prev.filter(id => id !== optionId) : [...prev, optionId]);
  //   } else {
  //     setSelectedIds([optionId]);
  //   }
  // }

  function toggleSelect(optionId: string) {
    if (!q) return;
    if (q.isMultiple) {
      setSelectedIds((prev) =>
          prev.includes(optionId)
              ? prev.filter((id) => id !== optionId)
              : [...prev, optionId]
      );
    } else {
      setSelectedIds([optionId]);
    }
  }

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

  async function submit() {
    if (!selectedIds.length) return alert('Please select an option');
    const payload = {
      answers: [{ questionId: q.id, selectedOptionIds: selectedIds }],
      scoringMode,
    };

    try {
      const res = await fetch('/api/quiz/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }, // ✅ fixed typo
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data?.error || 'Error submitting quiz');
      setResult(data);
    } catch (err) {
      console.error(err);
      alert('Error submitting quiz');
    }
  }

  if (!q) return <p>Loading...</p>;

  return (
    // <div className="bg-white p-6 rounded shadow">
    //   <h2 className="text-lg font-medium mb-4">{q.text}</h2>
    //
    //   <div className="mb-4">
    //     <label className="text-sm mr-3">Scoring:</label>
    //     <label className="mr-2"><input type="radio" checked={scoringMode==='exact'} onChange={()=>setScoringMode('exact')} /> Exact</label>
    //     <label><input type="radio" checked={scoringMode==='partial'} onChange={()=>setScoringMode('partial')} /> Partial</label>
    //   </div>
    //
    //   <div className="space-y-2 mb-4">
    //     {q.options.map((o: any) => (
    //       <label key={o.id} className="flex items-center gap-3">
    //         <input
    //           type={q.isMultiple ? 'checkbox' : 'radio'}
    //           name="opt"
    //           checked={selectedIds.includes(o.id)}
    //           onChange={() => toggleSelect(o.id)}
    //         />
    //         <span>{o.text}</span>
    //       </label>
    //     ))}
    //   </div>
    //
    //   {!result ? (
    //     <div className="flex gap-2">
    //       <button onClick={submit} className="rounded bg-slate-800 text-white px-3 py-1">Submit</button>
    //       <button onClick={() => router.push('/user')} className="rounded border px-3 py-1">Back</button>
    //     </div>
    //   ) : (
    //     <div className="p-4 border rounded">
    //       <p className="mb-2">Score: {result.score.toFixed(0)}%</p>
    //       <p>{result.correct} / {result.total} correct</p>
    //       <div className="mt-3">
    //         <button onClick={() => router.push('/user')} className="rounded border px-3 py-1">Back to quizzes</button>
    //       </div>
    //     </div>
    //   )}
    // </div>

      <div className="bg-white p-6 rounded shadow max-w-xl mx-auto mt-6">
        <h2 className="text-lg font-medium mb-4">{q.text}</h2>

        <div className="mb-4">
          <label className="text-sm mr-3">Scoring:</label>
          <label className="mr-2">
            <input
                type="radio"
                checked={scoringMode === 'exact'}
                onChange={() => setScoringMode('exact')}
            />{' '}
            Exact
          </label>
          <label>
            <input
                type="radio"
                checked={scoringMode === 'partial'}
                onChange={() => setScoringMode('partial')}
            />{' '}
            Partial
          </label>
        </div>

        {/* ✅ Safe check for options */}
        <div className="space-y-2 mb-4">
          {Array.isArray(q?.options) && q.options.length > 0 ? (
              q.options.map((o: any) => (
                  <label key={o.id} className="flex items-center gap-3">
                    <input
                        type={q.isMultiple ? 'checkbox' : 'radio'}
                        name="opt"
                        checked={selectedIds.includes(o.id)}
                        onChange={() => toggleSelect(o.id)}
                    />
                    <span>{o.text}</span>
                  </label>
              ))
          ) : (
              <p>No options available</p>
          )}
        </div>

        {!result ? (
            <div className="flex gap-2">
              <button
                  onClick={submit}
                  className="rounded bg-slate-800 text-white px-3 py-1"
              >
                Submit
              </button>
              <button
                  onClick={() => router.push('/user')}
                  className="rounded border px-3 py-1"
              >
                Back
              </button>
            </div>
        ) : (
            <div className="p-4 border rounded">
              <p className="mb-2">Score: {result.score?.toFixed(0) ?? 0}%</p>
              <p>
                {result.correct ?? 0} / {result.total ?? 0} correct
              </p>
              <div className="mt-3">
                <button
                    onClick={() => router.push('/user')}
                    className="rounded border px-3 py-1"
                >
                  Back to quizzes
                </button>
              </div>
            </div>
        )}
      </div>
  );
}
