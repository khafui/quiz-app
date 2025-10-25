// 'use client';
// import { useState, useEffect } from 'react';
// import { useRouter } from 'next/navigation';
//
// type OptionLocal = { id?: string; text: string };
//
// export default function QuestionForm({ question }: { question?: any }) {
//   const router = useRouter();
//   const [text, setText] = useState(question?.text || '');
//   const [isMultiple, setIsMultiple] = useState<boolean>(question?.isMultiple ?? false);
//   const [options, setOptions] = useState<OptionLocal[]>(
//     () => question?.options?.length ? question.options.map((o: any) => ({ id: o.id, text: o.text })) : [{ text: '' }, { text: '' }]
//   );
//   const [correctFlags, setCorrectFlags] = useState<boolean[]>(
//     () => {
//       if (!question) return options.map(() => false);
//       const flags = options.map((_, i) => (question.correctIds || []).includes(question.options[i]?.id || '') );
//       return flags;
//     }
//   );
//
//   useEffect(() => {
//     setCorrectFlags(prev => {
//       if (prev.length === options.length) return prev;
//       const next = options.map((_, i) => prev[i] ?? false);
//       return next;
//     });
//   }, [options.length]);
//
//   function addOption() {
//     setOptions(prev => [...prev, { text: '' }]);
//   }
//   function removeOption(index: number) {
//     setOptions(prev => prev.filter((_, i) => i !== index));
//   }
//   function updateOptionText(index: number, value: string) {
//     setOptions(prev => prev.map((o, i) => i === index ? { ...o, text: value } : o));
//   }
//   function toggleCorrect(index: number) {
//     setCorrectFlags(prev => {
//       if (!isMultiple) {
//         return prev.map((_, i) => i === index);
//       }
//       const next = [...prev];
//       next[index] = !next[index];
//       return next;
//     });
//   }
//
//   async function handleSubmit(e: React.FormEvent) {
//     e.preventDefault();
//     const correctIndexes = correctFlags
//       .map((flag, i) => flag ? i : -1)
//       .filter(i => i !== -1);
//
//     if (options.length < 2) {
//       alert('Provide at least 2 options');
//       return;
//     }
//     if (correctIndexes.length === 0) {
//       alert('Mark at least one correct option');
//       return;
//     }
//
//     const payload = {
//       text,
//       isMultiple,
//       options: options.map(o => ({ text: o.text })),
//       correctIndexes
//     };
//
//     const method = question ? 'PUT' : 'POST';
//     const url = question ? `/api/questions/${question.id}` : '/api/questions';
//
//     const res = await fetch(url, {
//       method,
//       headers: { 'Content-Type': 'src/application/json' },
//       body: JSON.stringify(payload)
//     });
//
//     if (!res.ok) {
//       const err = await res.json().catch(() => ({ message: 'Unknown error' }));
//       alert('Error: ' + (err?.error || err?.message || 'Saving question failed'));
//       return;
//     }
//
//     router.push('/admin');
//   }
//
//   return (
//     <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow max-w-3xl">
//       <div className="mb-4">
//         <label className="block text-sm font-medium mb-1">Question</label>
//         <textarea className="w-full border rounded p-2" value={text} onChange={e => setText(e.target.value)} />
//       </div>
//
//       <div className="mb-3 flex items-center gap-3">
//         <label className="flex items-center gap-2">
//           <input type="checkbox" checked={isMultiple} onChange={e => setIsMultiple(e.target.checked)} />
//           <span className="text-sm">Allow multiple answers</span>
//         </label>
//       </div>
//
//       <div className="mb-4">
//         <label className="block text-sm font-medium mb-2">Options</label>
//         <div className="space-y-2">
//           {options.map((opt, i) => (
//             <div key={i} className="flex items-center gap-2">
//               <input
//                 type={isMultiple ? 'checkbox' : 'radio'}
//                 name="correct"
//                 checked={!!correctFlags[i]}
//                 onChange={() => toggleCorrect(i)}
//               />
//               <input
//                 className="flex-1 border rounded p-2"
//                 value={opt.text}
//                 onChange={e => updateOptionText(i, e.target.value)}
//                 placeholder={`Option ${i + 1}`}
//               />
//               <button
//                 type="button"
//                 onClick={() => removeOption(i)}
//                 className="text-red-600 text-sm"
//               >
//                 Remove
//               </button>
//             </div>
//           ))}
//         </div>
//
//         <div className="mt-2">
//           <button type="button" onClick={addOption} className="text-sm text-blue-600">+ Add option</button>
//         </div>
//       </div>
//
//       <div className="flex gap-2">
//         <button type="submit" className="rounded bg-slate-800 text-white px-3 py-1">Save</button>
//         <button type="button" onClick={() => router.push('/admin')} className="rounded border px-3 py-1">Cancel</button>
//       </div>
//     </form>
//   );
// }


// 'use client';
// import { useEffect, useState } from 'react';
// import { useRouter } from 'next/navigation';
//
// type OptionLocal = { id?: string; text: string };
// type Course = { id: string; name: string };
// type Quiz = { id: string; title: string };
//
// export default function QuestionForm({ question }: { question?: any }) {
//   const router = useRouter();
//
//   const [text, setText] = useState(question?.text || '');
//   const [isMultiple, setIsMultiple] = useState<boolean>(question?.isMultiple ?? false);
//   const [options, setOptions] = useState<OptionLocal[]>(() =>
//       question?.options?.length
//           ? question.options.map((o: any) => ({ id: o.id, text: o.text }))
//           : [{ text: '' }, { text: '' }]
//   );
//   const [correctFlags, setCorrectFlags] = useState<boolean[]>(() =>
//       question
//           ? options.map((_, i) =>
//               (question.correctIds || []).includes(question.options[i]?.id || '')
//           )
//           : options.map(() => false)
//   );
//
//   const [courses, setCourses] = useState<Course[]>([]);
//   const [quizzes, setQuizzes] = useState<Quiz[]>([]);
//   const [selectedCourse, setSelectedCourse] = useState<string>('');
//   const [selectedQuiz, setSelectedQuiz] = useState<string>('');
//
//   // Load all courses
//   useEffect(() => {
//     (async () => {
//       const res = await fetch('/api/courses');
//       const data = await res.json();
//       setCourses(data || []);
//     })();
//   }, []);
//
//   // Load quizzes for selected course
//   useEffect(() => {
//     if (!selectedCourse) return;
//     (async () => {
//       const res = await fetch(`/api/courses/${selectedCourse}/quizzes`);
//       const data = await res.json();
//       setQuizzes(data || []);
//     })();
//   }, [selectedCourse]);
//
//   useEffect(() => {
//     setCorrectFlags((prev) => {
//       if (prev.length === options.length) return prev;
//       const next = options.map((_, i) => prev[i] ?? false);
//       return next;
//     });
//   }, [options.length]);
//
//   function addOption() {
//     setOptions((prev) => [...prev, { text: '' }]);
//   }
//
//   function removeOption(index: number) {
//     setOptions((prev) => prev.filter((_, i) => i !== index));
//   }
//
//   function updateOptionText(index: number, value: string) {
//     setOptions((prev) => prev.map((o, i) => (i === index ? { ...o, text: value } : o)));
//   }
//
//   function toggleCorrect(index: number) {
//     setCorrectFlags((prev) => {
//       if (!isMultiple) return prev.map((_, i) => i === index);
//       const next = [...prev];
//       next[index] = !next[index];
//       return next;
//     });
//   }
//
//   async function handleSubmit(e: React.FormEvent) {
//     e.preventDefault();
//
//     if (!selectedCourse || !selectedQuiz) {
//       alert('Please select a course and quiz.');
//       return;
//     }
//
//     const correctIndexes = correctFlags
//         .map((flag, i) => (flag ? i : -1))
//         .filter((i) => i !== -1);
//
//     if (options.length < 2) {
//       alert('Provide at least 2 options');
//       return;
//     }
//
//     if (correctIndexes.length === 0) {
//       alert('Mark at least one correct option');
//       return;
//     }
//
//     const payload = {
//       text,
//       isMultiple,
//       options: options.map((o) => ({ text: o.text })),
//       correctIndexes,
//       quizId: selectedQuiz,
//     };
//
//     const method = question ? 'PUT' : 'POST';
//     const url = question ? `/api/questions/${question.id}` : '/api/questions';
//
//     const res = await fetch(url, {
//       method,
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify(payload),
//     });
//
//     if (!res.ok) {
//       const err = await res.json().catch(() => ({ message: 'Unknown error' }));
//       alert('Error: ' + (err?.error || err?.message || 'Saving question failed'));
//       return;
//     }
//
//     router.push('/admin');
//   }
//
//   return (
//       <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow max-w-3xl space-y-4">
//         {/* COURSE SELECT */}
//         <div>
//           <label className="block text-sm font-medium mb-1">Select Course</label>
//           <select
//               value={selectedCourse}
//               onChange={(e) => {
//                 setSelectedCourse(e.target.value);
//                 setSelectedQuiz('');
//               }}
//               className="border rounded p-2 w-full"
//           >
//             <option value="">-- Choose Course --</option>
//             {courses.map((c) => (
//                 <option key={c.id} value={c.id}>
//                   {c.name}
//                 </option>
//             ))}
//           </select>
//         </div>
//
//         {/* QUIZ SELECT */}
//         {selectedCourse && (
//             <div>
//               <label className="block text-sm font-medium mb-1">Select Quiz</label>
//               <select
//                   value={selectedQuiz}
//                   onChange={(e) => setSelectedQuiz(e.target.value)}
//                   className="border rounded p-2 w-full"
//               >
//                 <option value="">-- Choose Quiz --</option>
//                 {quizzes.map((q) => (
//                     <option key={q.id} value={q.id}>
//                       {q.title}
//                     </option>
//                 ))}
//               </select>
//             </div>
//         )}
//
//         {/* QUESTION TEXT */}
//         <div>
//           <label className="block text-sm font-medium mb-1">Question</label>
//           <textarea
//               className="w-full border rounded p-2"
//               value={text}
//               onChange={(e) => setText(e.target.value)}
//           />
//         </div>
//
//         {/* MULTIPLE CHOICE TOGGLE */}
//         <div className="flex items-center gap-3">
//           <label className="flex items-center gap-2">
//             <input
//                 type="checkbox"
//                 checked={isMultiple}
//                 onChange={(e) => setIsMultiple(e.target.checked)}
//             />
//             <span className="text-sm">Allow multiple answers</span>
//           </label>
//         </div>
//
//         {/* OPTIONS */}
//         <div>
//           <label className="block text-sm font-medium mb-2">Options</label>
//           <div className="space-y-2">
//             {options.map((opt, i) => (
//                 <div key={i} className="flex items-center gap-2">
//                   <input
//                       type={isMultiple ? 'checkbox' : 'radio'}
//                       name="correct"
//                       checked={!!correctFlags[i]}
//                       onChange={() => toggleCorrect(i)}
//                   />
//                   <input
//                       className="flex-1 border rounded p-2"
//                       value={opt.text}
//                       onChange={(e) => updateOptionText(i, e.target.value)}
//                       placeholder={`Option ${i + 1}`}
//                   />
//                   <button
//                       type="button"
//                       onClick={() => removeOption(i)}
//                       className="text-red-600 text-sm"
//                   >
//                     Remove
//                   </button>
//                 </div>
//             ))}
//           </div>
//
//           <button
//               type="button"
//               onClick={addOption}
//               className="text-sm text-blue-600 mt-2"
//           >
//             + Add option
//           </button>
//         </div>
//
//         <div className="flex gap-2">
//           <button type="submit" className="rounded bg-slate-800 text-white px-3 py-1">
//             Save
//           </button>
//           <button
//               type="button"
//               onClick={() => router.push('/admin')}
//               className="rounded border px-3 py-1"
//           >
//             Cancel
//           </button>
//         </div>
//       </form>
//   );
// }


'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

type Option = { text: string };
type Question = {
  text: string;
  isMultiple: boolean;
  options: Option[];
  correctIndexes: number[];
};

type Course = { id: string; name: string };

export default function QuestionForm() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [quizTitle, setQuizTitle] = useState('');
  const [quizDescription, setQuizDescription] = useState('');
  const [questions, setQuestions] = useState<Question[]>([
    { text: '', isMultiple: false, options: [{ text: '' }, { text: '' }], correctIndexes: [] },
  ]);
  const [status, setStatus] = useState('');
  const router = useRouter();

  useEffect(() => {
    (async () => {
      const res = await fetch('/api/courses');
      const data = await res.json();
      setCourses(data || []);
    })();
  }, []);

  const addQuestion = () => {
    setQuestions([
      ...questions,
      { text: '', isMultiple: false, options: [{ text: '' }, { text: '' }], correctIndexes: [] },
    ]);
  };

  const removeQuestion = (index: number) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const handleOptionChange = (qIndex: number, oIndex: number, value: string) => {
    const updated = [...questions];
    updated[qIndex].options[oIndex].text = value;
    setQuestions(updated);
  };

  const addOption = (qIndex: number) => {
    const updated = [...questions];
    updated[qIndex].options.push({ text: '' });
    setQuestions(updated);
  };

  const toggleCorrect = (qIndex: number, oIndex: number) => {
    const updated = [...questions];
    const q = updated[qIndex];
    if (q.correctIndexes.includes(oIndex)) {
      q.correctIndexes = q.correctIndexes.filter((i) => i !== oIndex);
    } else {
      if (!q.isMultiple) q.correctIndexes = [oIndex];
      else q.correctIndexes.push(oIndex);
    }
    setQuestions(updated);
  };

  const handleSubmit = async () => {
    if (!selectedCourse || !quizTitle || !questions.length) {
      alert('Please fill all required fields.');
      return;
    }

    setStatus('Creating quiz and adding questions...');

    const res = await fetch('/api/questions/bulk', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        courseId: selectedCourse,
        title: quizTitle,
        description: quizDescription,
        questions,
      }),
    });

    if (res.ok) {
      const data = await res.json();
      setStatus(`✅ Created quiz "${data.quiz.title}" with ${data.createdCount} questions.`);
      setQuizTitle('');
      setQuizDescription('');
      setQuestions([
        { text: '', isMultiple: false, options: [{ text: '' }, { text: '' }], correctIndexes: [] },
      ]);
      router.refresh();
    } else {
      const err = await res.json().catch(() => ({ error: 'Unknown' }));
      setStatus(`❌ Failed: ${err.error}`);
    }
  };

  return (
      <div className="bg-white p-6 rounded shadow space-y-6">
        <h3 className="font-semibold text-lg">Create New Quiz (Manual)</h3>

        {/* COURSE SELECT */}
        <div>
          <label className="block text-sm font-medium mb-1">Select Course</label>
          <select
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              className="border rounded p-2 w-full"
          >
            <option value="">-- Choose Course --</option>
            {courses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
            ))}
          </select>
        </div>

        {/* QUIZ INFO */}
        <div>
          <label className="block text-sm font-medium mb-1">Quiz Title</label>
          <input
              value={quizTitle}
              onChange={(e) => setQuizTitle(e.target.value)}
              className="border rounded p-2 w-full"
              placeholder="Enter quiz title"
          />

          <label className="block text-sm font-medium mt-3 mb-1">Description</label>
          <textarea
              value={quizDescription}
              onChange={(e) => setQuizDescription(e.target.value)}
              className="border rounded p-2 w-full"
              rows={3}
              placeholder="Short description of the quiz"
          />
        </div>

        {/* QUESTIONS SECTION */}
        <div className="space-y-6">
          {questions.map((q, qIndex) => (
              <div key={qIndex} className="border p-4 rounded space-y-3">
                <div className="flex justify-between items-center">
                  <h4 className="font-medium">Question {qIndex + 1}</h4>
                  {questions.length > 1 && (
                      <button
                          type="button"
                          className="text-red-500 cursor-pointer text-sm"
                          onClick={() => removeQuestion(qIndex)}
                      >
                        Remove
                      </button>
                  )}
                </div>

                <textarea
                    value={q.text}
                    onChange={(e) => {
                      const updated = [...questions];
                      updated[qIndex].text = e.target.value;
                      setQuestions(updated);
                    }}
                    placeholder="Enter question text"
                    className="border rounded p-2 w-full"
                />

                <label className="flex items-center gap-2">
                  <input
                      type="checkbox"
                      checked={q.isMultiple}
                      onChange={(e) => {
                        const updated = [...questions];
                        updated[qIndex].isMultiple = e.target.checked;
                        setQuestions(updated);
                      }}
                  />
                  <span className="text-sm">Allow multiple correct answers</span>
                </label>

                <div className="space-y-2">
                  {q.options.map((o, oIndex) => (
                      <div key={oIndex} className="flex items-center gap-2">
                        <input
                            type="text"
                            value={o.text}
                            onChange={(e) => handleOptionChange(qIndex, oIndex, e.target.value)}
                            placeholder={`Option ${oIndex + 1}`}
                            className="border rounded p-2 flex-1"
                        />
                        <input
                            type="checkbox"
                            checked={q.correctIndexes.includes(oIndex)}
                            onChange={() => toggleCorrect(qIndex, oIndex)}
                        />
                        <span className="text-xs text-slate-600">Correct</span>
                      </div>
                  ))}
                  <button
                      type="button"
                      className="text-primary cursor-pointer text-sm"
                      onClick={() => addOption(qIndex)}
                  >
                    + Add Option
                  </button>
                </div>
              </div>
          ))}
        </div>

        <div className="flex justify-between items-center">
          <button
              type="button"
              onClick={addQuestion}
              className="shad-primary-outline-btn cursor-pointer rounded px-3 py-1"
          >
            + Add Another Question
          </button>

          <button
              type="button"
              onClick={handleSubmit}
              className="shad-primary-btn cursor-pointer text-white px-4 py-2 rounded"
          >
            Submit Quiz
          </button>
        </div>

        <div className="text-sm mt-2">{status}</div>
      </div>
  );
}
