export default function AnalyticsCards({ totals }: { totals: any }) {
  const items = [
    { label: 'Questions', value: totals.questions },
    { label: 'Quizzes Taken', value: totals.quizzes },
    { label: 'Avg. Score', value: `${(totals.averageScore || 0).toFixed(1)}%` }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {items.map(it => (
        <div key={it.label} className="bg-white p-4 rounded shadow">
          <p className="text-sm text-slate-500">{it.label}</p>
          <p className="text-2xl font-bold">{it.value}</p>
        </div>
      ))}
    </div>
  );
}
