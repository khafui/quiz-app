'use client';
import { format } from 'date-fns';

export default function ResultsTable({ results }: { results: any[] }) {
  if (!results || results.length === 0) return <p>No quiz history yet.</p>;

  return (
    <table className="w-full bg-white rounded border">
      <thead className="bg-slate-100">
        <tr>
          <th className="p-2 text-left">Date</th>
          <th className="p-2 text-left">Total</th>
          <th className="p-2 text-left">Correct</th>
          <th className="p-2 text-left">Score</th>
        </tr>
      </thead>
      <tbody>
        {results.map(r => (
          <tr key={r.id} className="border-t hover:bg-slate-50">
            <td className="p-2">{format(new Date(r.createdAt), 'PPpp')}</td>
            <td className="p-2">{r.total}</td>
            <td className="p-2">{r.correct}</td>
            <td className="p-2">{r.score.toFixed(1)}%</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
