export default function TopPerformersTable({ leaderboard }: { leaderboard: any[] }) {
  if (!leaderboard?.length) return <p>No performer data yet.</p>;

  return (
    <div className="bg-white rounded border">
      <table className="w-full">
        <thead className="bg-slate-100">
          <tr>
            <th className="p-2 text-left">User ID</th>
            <th className="p-2 text-left">Avg Score</th>
            <th className="p-2 text-left">Attempts</th>
          </tr>
        </thead>
        <tbody>
          {leaderboard.map((l) => (
            <tr key={l.userId} className="border-t hover:bg-slate-50">
              <td className="p-2">{l.userId}</td>
              <td className="p-2">{l.averageScore.toFixed(1)}%</td>
              <td className="p-2">{l.attempts}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
