'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import QuestionList from '@/components/question-list';
import Banner from "@/components/banner";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import {DashboardData} from "@/types/types";


export default function AdminPageClient() {
    const [data, setData] = useState<DashboardData | null>(null);
  const [items, setItems] = useState([]);
  const [q, setQ] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 10;

  useEffect(() => {
    fetchData();
  }, [page]);

    useEffect(() => {
        const fetchData = async () => {
            const res = await fetch('/api/dashboard');
            if (!res.ok) {
                console.error('Unauthorized or fetch failed');
                return;
            }
            const json = await res.json();
            setData(json);
        };
        fetchData();
    }, []);

  async function fetchData() {
    const res = await fetch(`/api/questions?q=${encodeURIComponent(q)}&page=${page}&limit=${limit}`);
    const json = await res.json();
    setItems(json.items);
    setTotal(json.total);
  }

  function onSearch(e) {
    e.preventDefault();
    setPage(1);
    fetchData();
  }


  if (!data) return <p className="text-center mt-10">Loading dashboard...</p>;
  return (
    <div>
      {/*<Banner title="Admin Dashboard" />*/}
      <Banner title={data.role === 'ADMIN' ? 'Admin Dashboard' : 'My Dashboard'} />
      {/*<div className="flex items-center justify-between mb-4">*/}
      {/*  <h1 className="text-2xl font-bold">Questions</h1>*/}
      {/*  <Link href="/admin/new" className="rounded bg-slate-800 text-white px-3 py-1">Add Question</Link>*/}
      {/*</div>*/}

      {/*<form onSubmit={onSearch} className="mb-4 flex gap-2">*/}
      {/*  <input className="border rounded p-2 flex-1" placeholder="Search questions or options" value={q} onChange={(e)=>setQ(e.target.value)} />*/}
      {/*  <button className="rounded bg-slate-700 text-white px-3 py-1">Search</button>*/}
      {/*</form>*/}

      {/*<QuestionList questions={items} />*/}

      {/*<div className="mt-4 flex items-center justify-between">*/}
      {/*  <div>Page {page} of {Math.ceil(total/limit)}</div>*/}
      {/*  <div className="flex gap-2">*/}
      {/*    <button disabled={page<=1} onClick={()=>setPage(p=>p-1)} className="px-3 py-1 border rounded">Prev</button>*/}
      {/*    <button disabled={page>=Math.ceil(total/limit)} onClick={()=>setPage(p=>p+1)} className="px-3 py-1 border rounded">Next</button>*/}
      {/*  </div>*/}
      {/*</div>*/}
        <div className="space-y-2">
            {/*<h1 className="text-3xl font-bold mb-4">*/}
            {/*    {data.role === 'ADMIN' ? '📊 Admin Dashboard' : '👤 My Dashboard'}*/}
            {/*</h1>*/}

            {/* Summary cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Card>
                    <CardHeader><CardTitle>Total Courses</CardTitle></CardHeader>
                    <CardContent><p className="text-2xl font-semibold">{data.totalCourses}</p></CardContent>
                </Card>

                <Card>
                    <CardHeader><CardTitle>Total Quizzes</CardTitle></CardHeader>
                    <CardContent><p className="text-2xl font-semibold">{data.totalQuizzes}</p></CardContent>
                </Card>

                {data.role === 'ADMIN' && (
                    <Card>
                        <CardHeader><CardTitle>Total Users</CardTitle></CardHeader>
                        <CardContent><p className="text-2xl font-semibold">{data.totalUsers}</p></CardContent>
                    </Card>
                )}
            </div>

            {/* Average stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Card>
                    <CardHeader><CardTitle>Average Score</CardTitle></CardHeader>
                    <CardContent><p className="text-4xl font-semibold">{data.averageScore.toFixed(2)}%</p></CardContent>
                </Card>
                <Card>
                    <CardHeader><CardTitle>Total Attempts</CardTitle></CardHeader>
                    <CardContent><p className="text-4xl font-semibold">{data.attempts}</p></CardContent>
                </Card>
            </div>

            {/* Top Courses */}
            <Card>
                <CardHeader><CardTitle>Top Performing Courses</CardTitle></CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={data.topCourses}>
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="avgScore" />
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            {/* Recent Results */}
            <Card>
                <CardHeader>
                    <CardTitle>
                        {data.role === 'ADMIN' ? 'Recent Quiz Results (All Users)' : 'My Recent Quiz Results'}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <table className="w-full text-sm">
                        <thead>
                        <tr className="border-b text-left">
                            <th className="p-2">Quiz</th>
                            {data.role === 'ADMIN' && <th className="p-2">User</th>}
                            <th className="p-2">Score</th>
                            <th className="p-2">Date</th>
                        </tr>
                        </thead>
                        <tbody>
                        {data.recentResults.map((r, idx) => (
                            <tr key={idx} className="border-b">
                                <td className="p-2">{r.quiz}</td>
                                {data.role === 'ADMIN' && <td className="p-2">{r.user}</td>}
                                <td className="p-2">{r.score}%</td>
                                <td className="p-2">{r.date}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </CardContent>
            </Card>
        </div>
    </div>
  );
}
