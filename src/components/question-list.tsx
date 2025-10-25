'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function QuestionList({ questions }: { questions: any[] }) {
  const router = useRouter();

  async function handleDelete(id: string) {
    if (!confirm('Delete this question?')) return;
    await fetch(`/api/questions/${id}`, { method: 'DELETE' });
    router.refresh();
  }

  return (
    <div className="space-y-4">
      {questions.map(q => (
        <div key={q.id} className="bg-white p-4 rounded border">
          <div className="flex justify-between">
            <div>
              <p className="font-medium">{q.text}</p>
              <div className="mt-2 text-sm text-slate-600">
                {q.options?.map((o: any) => (
                  <span key={o.id} className={`inline-block mr-2 ${q.correctIds?.includes(o.id) ? 'font-semibold text-green-600' : ''}`}>{o.text}</span>
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Link href={`/admin/${q.id}/edit`} className="text-sm text-blue-600">Edit</Link>
              <button onClick={() => handleDelete(q.id)} className="text-sm text-red-600">Delete</button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
