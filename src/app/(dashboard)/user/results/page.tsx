import ResultsTable from '@/components/results-table';

export default async function ResultsPage() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ''}/api/quiz/results`, { cache: 'no-store' });
  const results = await res.json();

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">My Results</h1>
      <ResultsTable results={results} />
    </div>
  );
}
