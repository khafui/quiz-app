// 'use client';
// import { useState, useEffect } from 'react';
// import Link from 'next/link';
// import QuestionList from '@/components/question-list';
// import Banner from "@/components/banner";
//
// export default function AdminPageClient() {
//   const [items, setItems] = useState([]);
//   const [q, setQ] = useState('');
//   const [page, setPage] = useState(1);
//   const [total, setTotal] = useState(0);
//   const limit = 10;
//
//   useEffect(() => {
//     fetchData();
//   }, [page]);
//
//   async function fetchData() {
//     const res = await fetch(`/api/questions?q=${encodeURIComponent(q)}&page=${page}&limit=${limit}`);
//     const json = await res.json();
//     setItems(json.items);
//     setTotal(json.total);
//   }
//
//   function onSearch(e) {
//     e.preventDefault();
//     setPage(1);
//     fetchData();
//   }
//
//   return (
//     <div>
//       <Banner title="Admin Dashboard" />
//       <div className="flex items-center justify-between mb-4">
//         <h1 className="text-2xl font-bold">Questions</h1>
//         <Link href="/admin/new" className="rounded bg-slate-800 text-white px-3 py-1">Add Question</Link>
//       </div>
//
//       <form onSubmit={onSearch} className="mb-4 flex gap-2">
//         <input className="border rounded p-2 flex-1" placeholder="Search questions or options" value={q} onChange={(e)=>setQ(e.target.value)} />
//         <button className="rounded bg-slate-700 text-white px-3 py-1">Search</button>
//       </form>
//
//       <QuestionList questions={items} />
//
//       <div className="mt-4 flex items-center justify-between">
//         <div>Page {page} of {Math.ceil(total/limit)}</div>
//         <div className="flex gap-2">
//           <button disabled={page<=1} onClick={()=>setPage(p=>p-1)} className="px-3 py-1 border rounded">Prev</button>
//           <button disabled={page>=Math.ceil(total/limit)} onClick={()=>setPage(p=>p+1)} className="px-3 py-1 border rounded">Next</button>
//         </div>
//       </div>
//     </div>
//   );
// }
