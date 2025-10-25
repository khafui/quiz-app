import AnalyticsCards from '@/components/analytics-cards';
import TopPerformersTable from '@/components/top-performers-table';

export default async function AdminAnalytics() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ''}/api/analytics`, { cache: 'no-store' });
  const data = await res.json();

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Analytics</h1>
      <AnalyticsCards totals={data.totals} />
      <div className="mt-6">
        <TopPerformersTable leaderboard={data.leaderboard} />
      </div>
    </div>
  );
}
