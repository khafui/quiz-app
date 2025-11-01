// 'use client';
// import React, { useEffect, useState } from 'react';
// import { useRouter } from 'next/navigation';
//
// export default function QuizTest({ params }: { params: { id: string } }) {
//     const { id } = params;
//     const [questions, setQuestions] = useState<any[]>([]);
//     const [answers, setAnswers] = useState<{ [key: string]: string[] }>({});
//     const [result, setResult] = useState<any>(null);
//     const [scoringMode, setScoringMode] = useState<'exact' | 'partial'>('exact');
//     const router = useRouter();
//     const [showResults, setShowResults] = useState<boolean>(false)
//
//     useEffect(() => {
//         (async () => {
//             try {
//                 const res = await fetch(`/api/questions/quiz/${id}`);
//                 const data = await res.json();
//                 if (res.ok) setQuestions(data);
//                 else setQuestions([]);
//             } catch (err) {
//                 console.error('Error loading quiz questions:', err);
//             }
//         })();
//     }, [id]);
//
//     function toggleSelect(questionId: string, optionId: string, isMultiple: boolean) {
//         setAnswers((prev) => {
//             const selected = prev[questionId] || [];
//             if (isMultiple) {
//                 return {
//                     ...prev,
//                     [questionId]: selected.includes(optionId)
//                         ? selected.filter((id) => id !== optionId)
//                         : [...selected, optionId],
//                 };
//             } else {
//                 return { ...prev, [questionId]: [optionId] };
//             }
//         });
//     }
//
//     async function submit() {
//         if (Object.keys(answers).length === 0)
//             return alert('Please answer at least one question');
//
//         const payload = {
//             quizId: id, // ✅ include quizId here
//             answers: Object.entries(answers).map(([questionId, selectedOptionIds]) => ({
//                 questionId,
//                 selectedOptionIds,
//             })),
//             scoringMode,
//         };
//
//         try {
//             const res = await fetch('/api/quiz/submit', {
//                 method: 'POST',
//                 headers: { 'Content-Type': 'application/json' },
//                 body: JSON.stringify(payload),
//             });
//
//             const data = await res.json();
//             if (!res.ok) throw new Error(data?.error || 'Error submitting quiz');
//             setResult(data);
//             setShowResults(false);
//         } catch (err) {
//             console.error(err);
//             alert('Error submitting quiz');
//         }
//     }
//
//     if (!questions.length) return <p className="text-center mt-10">Loading questions...</p>;
//
//     if(showResults){
//         return (
//             <div className="p-4 border rounded text-center">
//                 <p className="mb-2">Score: {result.score?.toFixed(0) ?? 0}%</p>
//                 <p>
//                     {result.correct ?? 0} / {result.total ?? 0} correct
//                 </p>
//                 <div className="mt-3">
//                     <button onClick={() => {
//                         router.back();
//                         setShowResults(false);
//                     }} className="rounded border px-3 py-1">
//                         Back to quizzes
//                     </button>
//                 </div>
//             </div>
//         )
//     }
//
//
//     return (
//         <div className="bg-white p-6 rounded shadow max-w-2xl mx-auto mt-6 space-y-6">
//             <div className="mb-4">
//                 <label className="text-sm mr-3">Scoring:</label>
//                 <label className="mr-2">
//                     <input
//                         type="radio"
//                         checked={scoringMode === 'exact'}
//                         onChange={() => setScoringMode('exact')}
//                     />{' '}
//                     Exact
//                 </label>
//                 <label>
//                     <input
//                         type="radio"
//                         checked={scoringMode === 'partial'}
//                         onChange={() => setScoringMode('partial')}
//                     />{' '}
//                     Partial
//                 </label>
//             </div>
//
//             {questions.map((q) => (
//                 <div key={q.id} className="border p-4 rounded">
//                     <h3 className="font-medium mb-2">{q.text}</h3>
//
//                     <div className="space-y-2">
//                         {Array.isArray(q.options) && q.options.length > 0 ? (
//                             q.options.map((o: any) => (
//                                 <label key={o.id} className="flex items-center gap-2">
//                                     <input
//                                         type={q.isMultiple ? 'checkbox' : 'radio'}
//                                         name={q.id}
//                                         checked={answers[q.id]?.includes(o.id) || false}
//                                         onChange={() => toggleSelect(q.id, o.id, q.isMultiple)}
//                                     />
//                                     <span>{o.text}</span>
//                                 </label>
//                             ))
//                         ) : (
//                             <p>No options available</p>
//                         )}
//                     </div>
//                 </div>
//             ))}
//                 <div className="flex gap-2 justify-center">
//                     <button onClick={submit} className="rounded bg-slate-800 text-white px-4 py-2">
//                         Submit
//                     </button>
//                     <button onClick={() => router.back()} className="rounded border px-4 py-2">
//                         Back
//                     </button>
//                 </div>
//         </div>
//     );
// }

// 'use client';
// import React, { useEffect, useState } from 'react';
// import { useRouter } from 'next/navigation';
//
// export default function QuizTest({ params }: { params: { id: string } }) {
//     const { id } = params;
//     const [questions, setQuestions] = useState<any[]>([]);
//     const [answers, setAnswers] = useState<{ [key: string]: string[] }>({});
//     const [flags, setFlags] = useState<{ [key: string]: boolean }>({});
//     const [currentPage, setCurrentPage] = useState(0);
//     const [result, setResult] = useState<any>(null);
//     const [scoringMode, setScoringMode] = useState<'exact' | 'partial'>('exact');
//     const [showResults, setShowResults] = useState<boolean>(false);
//     const router = useRouter();
//
//     // Fetch questions
//     useEffect(() => {
//         (async () => {
//             try {
//                 const res = await fetch(`/api/questions/quiz/${id}`);
//                 const data = await res.json();
//                 if (res.ok) setQuestions(data);
//                 else setQuestions([]);
//             } catch (err) {
//                 console.error('Error loading quiz questions:', err);
//             }
//         })();
//     }, [id]);
//
//     // Handle answer selection
//     function toggleSelect(questionId: string, optionId: string, isMultiple: boolean) {
//         setAnswers((prev) => {
//             const selected = prev[questionId] || [];
//             if (isMultiple) {
//                 return {
//                     ...prev,
//                     [questionId]: selected.includes(optionId)
//                         ? selected.filter((id) => id !== optionId)
//                         : [...selected, optionId],
//                 };
//             } else {
//                 return { ...prev, [questionId]: [optionId] };
//             }
//         });
//     }
//
//     // Flag/unflag a question
//     function toggleFlag(questionId: string) {
//         setFlags((prev) => ({
//             ...prev,
//             [questionId]: !prev[questionId],
//         }));
//     }
//
//     // Submit quiz
//     async function submit() {
//         const unanswered = questions.filter((q) => !answers[q.id]);
//         const flagged = Object.keys(flags).filter((id) => flags[id]);
//
//         if (unanswered.length > 0 || flagged.length > 0) {
//             const confirmSubmit = window.confirm(
//                 `You have ${unanswered.length} unanswered question(s) and ${flagged.length} flagged question(s).\n\nAre you sure you want to submit?`
//             );
//             if (!confirmSubmit) return;
//         }
//
//         const payload = {
//             quizId: id,
//             answers: Object.entries(answers).map(([questionId, selectedOptionIds]) => ({
//                 questionId,
//                 selectedOptionIds,
//             })),
//             scoringMode,
//         };
//
//         try {
//             const res = await fetch('/api/quiz/submit', {
//                 method: 'POST',
//                 headers: { 'Content-Type': 'application/json' },
//                 body: JSON.stringify(payload),
//             });
//
//             const data = await res.json();
//             if (!res.ok) throw new Error(data?.error || 'Error submitting quiz');
//             setResult(data);
//             setShowResults(true);
//         } catch (err) {
//             console.error(err);
//             alert('Error submitting quiz');
//         }
//     }
//
//     if (!questions.length)
//         return <p className="text-center mt-10 text-gray-500">Loading questions...</p>;
//
//     if (showResults) {
//         return (
//             <div className="p-6 border rounded text-center bg-white max-w-lg mx-auto mt-8 shadow">
//                 <h2 className="text-xl font-semibold mb-3">Quiz Results</h2>
//                 <p className="mb-2 text-gray-700">Score: {result.score?.toFixed(0) ?? 0}%</p>
//                 <p className="text-gray-700">
//                     {result.correct ?? 0} / {result.total ?? 0} correct
//                 </p>
//                 <div className="mt-4">
//                     <button
//                         onClick={() => router.back()}
//                         className="rounded bg-slate-800 text-white px-4 py-2"
//                     >
//                         Back to Quizzes
//                     </button>
//                 </div>
//             </div>
//         );
//     }
//
//     const currentQuestion = questions[currentPage];
//     const totalQuestions = questions.length;
//     const isLastQuestion = currentPage === totalQuestions - 1;
//
//     return (
//         <div className="bg-white p-6 rounded shadow max-w-2xl mx-auto mt-10 space-y-6">
//             {/* Header */}
//             <div className="flex justify-between items-center">
//                 <h2 className="text-lg font-semibold text-gray-800">
//                     Question {currentPage + 1} of {totalQuestions}
//                 </h2>
//
//                 <button
//                     onClick={() => toggleFlag(currentQuestion.id)}
//                     className={`text-sm px-3 py-1 rounded border ${
//                         flags[currentQuestion.id]
//                             ? 'bg-yellow-100 text-yellow-700 border-yellow-300'
//                             : 'text-gray-600 border-gray-300'
//                     }`}
//                 >
//                     {flags[currentQuestion.id] ? '🚩 Flagged' : 'Flag question'}
//                 </button>
//             </div>
//
//             {/* Question Card */}
//             <div
//                 className={`border p-4 rounded-lg ${
//                     flags[currentQuestion.id] ? 'bg-yellow-50' : 'bg-sky-50'
//                 }`}
//             >
//                 <h3 className="font-medium mb-3">{currentQuestion.text}</h3>
//                 <div className="space-y-2">
//                     {currentQuestion.options.map((o: any) => (
//                         <label key={o.id} className="flex items-center gap-2 cursor-pointer">
//                             <input
//                                 type={currentQuestion.isMultiple ? 'checkbox' : 'radio'}
//                                 name={currentQuestion.id}
//                                 checked={answers[currentQuestion.id]?.includes(o.id) || false}
//                                 onChange={() =>
//                                     toggleSelect(currentQuestion.id, o.id, currentQuestion.isMultiple)
//                                 }
//                             />
//                             <span>{o.text}</span>
//                         </label>
//                     ))}
//                 </div>
//             </div>
//
//             {/* Navigation */}
//             <div className="flex justify-between mt-6">
//                 <button
//                     disabled={currentPage === 0}
//                     onClick={() => setCurrentPage((p) => p - 1)}
//                     className={`px-4 py-2 rounded border ${
//                         currentPage === 0 ? 'opacity-50 cursor-not-allowed' : ''
//                     }`}
//                 >
//                     Previous page
//                 </button>
//
//                 {!isLastQuestion ? (
//                     <button
//                         onClick={() => setCurrentPage((p) => p + 1)}
//                         className="px-4 py-2 rounded bg-blue-600 text-white"
//                     >
//                         Next page
//                     </button>
//                 ) : (
//                     <button
//                         onClick={submit}
//                         className="px-4 py-2 rounded bg-green-600 text-white"
//                     >
//                         Submit
//                     </button>
//                 )}
//             </div>
//
//             {/* Pagination Dots */}
//             <div className="flex justify-center space-x-2 mt-4">
//                 {questions.map((_, idx) => (
//                     <div
//                         key={idx}
//                         onClick={() => setCurrentPage(idx)}
//                         className={`w-3 h-3 rounded-full cursor-pointer ${
//                             idx === currentPage
//                                 ? 'bg-blue-600'
//                                 : flags[questions[idx].id]
//                                     ? 'bg-yellow-400'
//                                     : 'bg-gray-300'
//                         }`}
//                     />
//                 ))}
//             </div>
//
//             <div className="text-center text-sm text-gray-500 mt-2">
//                 {currentPage + 1} / {totalQuestions}
//             </div>
//         </div>
//     );
// }
//


// 'use client';
// import React, { useEffect, useState } from 'react';
// import { useRouter } from 'next/navigation';
//
// export default function QuizTest({ params }: { params: { id: string } }) {
//     const { id } = params;
//     const [questions, setQuestions] = useState<any[]>([]);
//     const [answers, setAnswers] = useState<{ [key: string]: string[] }>({});
//     const [flags, setFlags] = useState<{ [key: string]: boolean }>({});
//     const [currentPage, setCurrentPage] = useState(0);
//     const [result, setResult] = useState<any>(null);
//     const [scoringMode, setScoringMode] = useState<'exact' | 'partial'>('exact');
//     const [showResults, setShowResults] = useState<boolean>(false);
//     const router = useRouter();
//
//     const QUESTIONS_PER_PAGE = 10;
//
//     // Fetch questions
//     useEffect(() => {
//         (async () => {
//             try {
//                 const res = await fetch(`/api/questions/quiz/${id}`);
//                 const data = await res.json();
//                 if (res.ok) setQuestions(data);
//                 else setQuestions([]);
//             } catch (err) {
//                 console.error('Error loading quiz questions:', err);
//             }
//         })();
//     }, [id]);
//
//     // Handle answer selection
//     function toggleSelect(questionId: string, optionId: string, isMultiple: boolean) {
//         setAnswers((prev) => {
//             const selected = prev[questionId] || [];
//             if (isMultiple) {
//                 return {
//                     ...prev,
//                     [questionId]: selected.includes(optionId)
//                         ? selected.filter((id) => id !== optionId)
//                         : [...selected, optionId],
//                 };
//             } else {
//                 return { ...prev, [questionId]: [optionId] };
//             }
//         });
//     }
//
//     // Flag/unflag a question
//     function toggleFlag(questionId: string) {
//         setFlags((prev) => ({
//             ...prev,
//             [questionId]: !prev[questionId],
//         }));
//     }
//
//     // Submit quiz
//     async function submit() {
//         const unanswered = questions.filter((q) => !answers[q.id]);
//         const flagged = Object.keys(flags).filter((id) => flags[id]);
//
//         if (unanswered.length > 0 || flagged.length > 0) {
//             const confirmSubmit = window.confirm(
//                 `You have ${unanswered.length} unanswered question(s) and ${flagged.length} flagged question(s).\n\nAre you sure you want to submit?`
//             );
//             if (!confirmSubmit) return;
//         }
//
//         const payload = {
//             quizId: id,
//             answers: Object.entries(answers).map(([questionId, selectedOptionIds]) => ({
//                 questionId,
//                 selectedOptionIds,
//             })),
//             scoringMode,
//         };
//
//         try {
//             const res = await fetch('/api/quiz/submit', {
//                 method: 'POST',
//                 headers: { 'Content-Type': 'application/json' },
//                 body: JSON.stringify(payload),
//             });
//
//             const data = await res.json();
//             if (!res.ok) throw new Error(data?.error || 'Error submitting quiz');
//             setResult(data);
//             setShowResults(true);
//         } catch (err) {
//             console.error(err);
//             alert('Error submitting quiz');
//         }
//     }
//
//     if (!questions.length)
//         return <p className="text-center mt-10 text-gray-500">Loading questions...</p>;
//
//     if (showResults) {
//         return (
//             <div className="p-6 border rounded text-center bg-white max-w-lg mx-auto mt-8 shadow">
//                 <h2 className="text-xl font-semibold mb-3">Quiz Results</h2>
//                 <p className="mb-2 text-gray-700">Score: {result.score?.toFixed(0) ?? 0}%</p>
//                 <p className="text-gray-700">
//                     {result.correct ?? 0} / {result.total ?? 0} correct
//                 </p>
//                 <div className="mt-4">
//                     <button
//                         onClick={() => router.back()}
//                         className="rounded bg-slate-800 text-white px-4 py-2"
//                     >
//                         Back to Quizzes
//                     </button>
//                 </div>
//             </div>
//         );
//     }
//
//     // Pagination setup
//     const totalPages = Math.ceil(questions.length / QUESTIONS_PER_PAGE);
//     const startIndex = currentPage * QUESTIONS_PER_PAGE;
//     const currentQuestions = questions.slice(startIndex, startIndex + QUESTIONS_PER_PAGE);
//
//     return (
//         <div className="bg-white p-6 rounded  max-w-3xl mx-auto mt-10 space-y-6">
//             {/* Scoring Mode Selector */}
//             {/*<div className="flex gap-4 items-center mb-4">*/}
//             {/*    <label className="text-sm font-medium">Scoring Mode:</label>*/}
//             {/*    <label>*/}
//             {/*        <input*/}
//             {/*            type="radio"*/}
//             {/*            checked={scoringMode === 'exact'}*/}
//             {/*            onChange={() => setScoringMode('exact')}*/}
//             {/*        />{' '}*/}
//             {/*        Exact*/}
//             {/*    </label>*/}
//             {/*    <label>*/}
//             {/*        <input*/}
//             {/*            type="radio"*/}
//             {/*            checked={scoringMode === 'partial'}*/}
//             {/*            onChange={() => setScoringMode('partial')}*/}
//             {/*        />{' '}*/}
//             {/*        Partial*/}
//             {/*    </label>*/}
//             {/*</div>*/}
//
//             {/* Render Questions */}
//             {currentQuestions.map((q, index) => (
//                 <div
//                     key={q.id}
//                     className={`border p-4 rounded-lg ${
//                         flags[q.id] ? 'bg-yellow-50' : 'bg-sky-50'
//                     }`}
//                 >
//                     <div className="flex justify-between items-center mb-2">
//                         <h3 className="font-semibold text-gray-800">
//                             Question {startIndex + index + 1}: {q.text}
//                         </h3>
//                         <button
//                             onClick={() => toggleFlag(q.id)}
//                             className={`text-sm px-3 py-1 rounded border ${
//                                 flags[q.id]
//                                     ? 'bg-yellow-100 text-yellow-700 border-yellow-300'
//                                     : 'text-gray-600 border-gray-300'
//                             }`}
//                         >
//                             {flags[q.id] ? '🚩 Flagged' : 'Flag question'}
//                         </button>
//                     </div>
//
//                     <div className="space-y-2">
//                         {q.options.map((o: any) => (
//                             <label
//                                 key={o.id}
//                                 className="flex items-center gap-2 cursor-pointer"
//                             >
//                                 <input
//                                     type={q.isMultiple ? 'checkbox' : 'radio'}
//                                     name={q.id}
//                                     checked={answers[q.id]?.includes(o.id) || false}
//                                     onChange={() =>
//                                         toggleSelect(q.id, o.id, q.isMultiple)
//                                     }
//                                 />
//                                 <span>{o.text}</span>
//                             </label>
//                         ))}
//                     </div>
//                 </div>
//             ))}
//
//             {/* Pagination Controls */}
//             <div className="flex justify-between items-center mt-6">
//                 <button
//                     disabled={currentPage === 0}
//                     onClick={() => setCurrentPage((p) => p - 1)}
//                     className={`px-4 py-2 rounded border ${
//                         currentPage === 0 ? 'opacity-50 cursor-not-allowed' : ''
//                     }`}
//                 >
//                     Previous
//                 </button>
//
//                 {currentPage < totalPages - 1 ? (
//                     <button
//                         onClick={() => setCurrentPage((p) => p + 1)}
//                         className="px-4 py-2 rounded bg-blue-600 text-white"
//                     >
//                         Next
//                     </button>
//                 ) : (
//                     <button
//                         onClick={submit}
//                         className="px-4 py-2 rounded bg-green-600 text-white"
//                     >
//                         Submit
//                     </button>
//                 )}
//             </div>
//
//             {/* Pagination Dots */}
//             <div className="flex justify-center space-x-2 mt-4">
//                 {Array.from({ length: totalPages }).map((_, idx) => (
//                     <div
//                         key={idx}
//                         onClick={() => setCurrentPage(idx)}
//                         className={`w-3 h-3 rounded-full cursor-pointer ${
//                             idx === currentPage
//                                 ? 'bg-blue-600'
//                                 : 'bg-gray-300 hover:bg-gray-400'
//                         }`}
//                     />
//                 ))}
//             </div>
//
//             <div className="text-center text-sm text-gray-500 mt-2">
//                 Page {currentPage + 1} of {totalPages}
//             </div>
//         </div>
//     );
// }


//====

'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { useSearchParams } from 'next/navigation'
import LoadingButton from "@/components/LoadingButton";
import {Loader2} from "lucide-react";
import {Button} from "@/components/ui/button";

export default function QuizTest({ params }: { params: { id: string } }) {
    const { id } = params;
    const searchParams = useSearchParams()
    const courseId = searchParams.get('courseId')
    const [questions, setQuestions] = useState<any[]>([]);
    const [answers, setAnswers] = useState<{ [key: string]: string[] }>({});
    const [flags, setFlags] = useState<{ [key: string]: boolean }>({});
    const [currentPage, setCurrentPage] = useState(0);
    const [result, setResult] = useState<any>(null);
    const [scoringMode, setScoringMode] = useState<'exact' | 'partial'>('exact');
    const [showResults, setShowResults] = useState<boolean>(false);
    const [showStats, setShowStats] = useState<boolean>(false);
    const [stats, setStats] = useState<{ attempts: number; completed: number } | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [disabled, setDisabled] = useState<boolean>(false);

    const router = useRouter();
    const { user } = useUser();
    const QUESTIONS_PER_PAGE = 10;

    // ✅ Check if user already started this quiz in current session
    useEffect(() => {
        const hasStarted = sessionStorage.getItem(`quizStarted-${id}`);
        if (!hasStarted) {
            setShowStats(true); // show stats before starting
            fetchStats();
        } else {
            fetchQuestions();
        }
    }, [id]);

    // ✅ Fetch stats before starting quiz
    async function fetchStats() {
        try {
            if( !user ) return;

            const res = await fetch(`/api/courses/stats/${courseId}`);
            const data = await res.json();
            // console.log("res: ", data)

            if (res.ok) setStats(data);
            else setStats({ attempts: 0, completed: 0 });
        } catch (err) {
            console.error('Error loading quiz stats:', err);
            setStats({ attempts: 0, completed: 0 });
        }
    }

    // ✅ Fetch quiz questions
    async function fetchQuestions() {
        try {
            const res = await fetch(`/api/questions/quiz/${id}`);
            const data = await res.json();
            if (res.ok) setQuestions(data);
            else setQuestions([]);
        } catch (err) {
            console.error('Error loading quiz questions:', err);
        }
    }

    // ✅ When user clicks "Start Quiz"
    function startQuiz() {
        sessionStorage.setItem(`quizStarted-${id}`, 'true');
        setShowStats(false);
        fetchQuestions();
    }

    // ✅ When user exits, clear session
    function handleExit() {
        sessionStorage.removeItem(`quizStarted-${id}`);
        if(showResults){
            router.push('/courses')
        }else {
            router.back();
        }
    }

    // Handle answer selection
    function toggleSelect(questionId: string, optionId: string, isMultiple: boolean) {
        setAnswers((prev) => {
            const selected = prev[questionId] || [];
            if (isMultiple) {
                return {
                    ...prev,
                    [questionId]: selected.includes(optionId)
                        ? selected.filter((id) => id !== optionId)
                        : [...selected, optionId],
                };
            } else {
                return { ...prev, [questionId]: [optionId] };
            }
        });
    }

    // Flag/unflag a question
    function toggleFlag(questionId: string) {
        setFlags((prev) => ({
            ...prev,
            [questionId]: !prev[questionId],
        }));
    }

    // Submit quiz
    async function submit() {
        setLoading(true)
        setDisabled(true)
        const unanswered = questions.filter((q) => !answers[q.id]);
        const flagged = Object.keys(flags).filter((id) => flags[id]);

        if (unanswered.length > 0 || flagged.length > 0) {
            const confirmSubmit = window.confirm(
                `You have ${unanswered.length} unanswered question(s) and ${flagged.length} flagged question(s).\n\nAre you sure you want to submit?`
            );
            if (!confirmSubmit) {
                setLoading(false)
                setDisabled(false)
                return;
            }
        }

        const payload = {
            quizId: id,
            answers: Object.entries(answers).map(([questionId, selectedOptionIds]) => ({
                questionId,
                selectedOptionIds,
            })),
            scoringMode,
        };

        try {
            const res = await fetch('/api/quiz/submit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            const data = await res.json();
            setLoading(false)
            setDisabled(false)
            if (!res.ok) throw new Error(data?.error || 'Error submitting quiz');
            setResult(data);
            setShowResults(true);
        } catch (err) {
            console.error(err);
            alert('Error submitting quiz');
        }
    }

    // ✅ Show Stats Screen before starting
    // if (showStats) {
    //     return (
    //         <div className="p-6 border rounded bg-white max-w-md mx-auto mt-10 text-center shadow">
    //             <h2 className="text-2xl font-semibold mb-4 text-gray-800">Quiz Overview</h2>
    //             {stats ? (
    //                 <>
    //                     <p className="text-gray-700 mb-2">Attempts: <b>{stats.attempts}</b></p>
    //                     <p className="text-gray-700 mb-4">Completed: <b>{stats.completed}</b></p>
    //                 </>
    //             ) : (
    //                 <p className="text-gray-500 mb-4">Loading stats...</p>
    //             )}
    //             <button
    //                 onClick={startQuiz}
    //                 className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700"
    //             >
    //                 Start Quiz
    //             </button>
    //             <div className="mt-4">
    //                 <button
    //                     onClick={handleExit}
    //                     className="text-sm text-gray-600 underline"
    //                 >
    //                     Exit
    //                 </button>
    //             </div>
    //         </div>
    //     );
    // }


    if (showStats) {
        return (
            <div className="p-6 border rounded bg-white max-w-md mx-auto mt-10 text-center shadow">
                <h2 className="text-2xl font-semibold mb-4">Course Progress</h2>

                {stats ? (
                    <>
                        <p className="text-gray-700 mb-2">
                            <strong>Attempts:</strong> {stats.attempts ?? 0}
                        </p>
                        <p className="text-gray-700 mb-2">
                            <strong>Completed:</strong> {stats.completed ?? 0}
                        </p>
                    </>
                ) : (
                    <p className="text-gray-500 mb-4">Loading your progress...</p>
                )}

                <div className="mt-6 flex justify-center gap-3">
                    <Button
                        onClick={startQuiz}
                        // className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                        className="shad-primary-btn"
                    >
                        Start Quiz
                    </Button>

                    <Button
                        // variant="outline"
                        onClick={handleExit}
                        // className="px-4 py-2 border rounded hover:bg-gray-50"
                        className="shad-primary-outline-btn"
                    >
                        Back
                    </Button>
                </div>
            </div>
        );
    }

    if (!questions.length)
        return <p className="text-center mt-10 text-gray-500">Loading questions...</p>;

    if (showResults) {
        return (
            <div className="p-6 border rounded text-center bg-white max-w-lg mx-auto mt-8 shadow">
                <h2 className="text-xl font-semibold mb-3">Quiz Results</h2>
                <p className="mb-2 text-gray-700">Score: {result.score?.toFixed(0) ?? 0}%</p>
                <p className="text-gray-700">
                    {result.correct ?? 0} / {result.total ?? 0} correct
                </p>
                <div className="mt-4">
                    <button
                        onClick={handleExit}
                        className="rounded bg-slate-800 text-white px-4 py-2"
                    >
                        Back to Quizzes
                    </button>
                </div>
            </div>
        );
    }

    // Pagination setup
    const totalPages = Math.ceil(questions.length / QUESTIONS_PER_PAGE);
    const startIndex = currentPage * QUESTIONS_PER_PAGE;
    const currentQuestions = questions.slice(startIndex, startIndex + QUESTIONS_PER_PAGE);

    return (
        <div className="bg-white p-6 rounded max-w-3xl mx-auto mt-10 space-y-6">
            {currentQuestions.map((q, index) => (
                <div
                    key={q.id}
                    className={`border p-4 rounded-lg ${
                        flags[q.id] ? 'bg-yellow-50' : 'bg-sky-50'
                    }`}
                >
                    <div className="flex justify-between items-center mb-2">
                        <h3 className="font-semibold text-gray-800">
                            Question {startIndex + index + 1}: {q.text}
                        </h3>
                        <button
                            onClick={() => toggleFlag(q.id)}
                            className={`text-sm px-3 py-1 rounded border ${
                                flags[q.id]
                                    ? 'bg-yellow-100 text-yellow-700 border-yellow-300'
                                    : 'text-gray-600 border-gray-300'
                            }`}
                        >
                            {flags[q.id] ? '🚩 Flagged' : 'Flag question'}
                        </button>
                    </div>

                    <div className="space-y-2">
                        {q.options.map((o: any) => (
                            <label
                                key={o.id}
                                className="flex items-center gap-2 cursor-pointer"
                            >
                                <input
                                    type={q.isMultiple ? 'checkbox' : 'radio'}
                                    name={q.id}
                                    checked={answers[q.id]?.includes(o.id) || false}
                                    onChange={() =>
                                        toggleSelect(q.id, o.id, q.isMultiple)
                                    }
                                />
                                <span>{o.text}</span>
                            </label>
                        ))}
                    </div>
                </div>
            ))}

            {/* Pagination Controls */}
            <div className="flex justify-between items-center mt-6">
                <button
                    disabled={currentPage === 0}
                    onClick={() => setCurrentPage((p) => p - 1)}
                    className={`px-4 py-2 rounded border ${
                        currentPage === 0 ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                >
                    Previous
                </button>

                {currentPage < totalPages - 1 ? (
                    <button
                        onClick={() => setCurrentPage((p) => p + 1)}
                        className="px-4 py-2 rounded bg-blue-600 text-white"
                    >
                        Next
                    </button>
                ) : (
                    <button
                        disabled={disabled}
                        onClick={submit}
                        className="px-4 py-2 flex items-center gap-2 rounded shad-primary-btn text-white"
                    >
                        {loading && <Loader2 className="size-5 animate-spin"/>}
                        Submit
                    </button>
                    // <LoadingButton
                    //     onClick={submit}
                    //     disabled={isDisabled!}
                    //     loading={isLoading!}
                    //     className="shad-primary-btn lg:w-32 h-11 cursor-pointer"
                    // >
                    //     Submit
                    // </LoadingButton>
                )}
            </div>

            {/* Pagination Dots */}
            <div className="flex justify-center space-x-2 mt-4">
                {Array.from({ length: totalPages }).map((_, idx) => (
                    <div
                        key={idx}
                        onClick={() => setCurrentPage(idx)}
                        className={`w-3 h-3 rounded-full cursor-pointer ${
                            idx === currentPage
                                ? 'bg-blue-600'
                                : 'bg-gray-300 hover:bg-gray-400'
                        }`}
                    />
                ))}
            </div>

            <div className="text-center text-sm text-gray-500 mt-2">
                Page {currentPage + 1} of {totalPages}
            </div>
        </div>
    );
}
