import QuestionForm from '@/components/forms/question-form';

export default async function EditPage({ params }: { params: { id: string } }) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ''}/api/questions/${params.id}`, { cache: 'no-store' });
  const q = await res.json();
  return (
    <div>
      <h1 className="text-xl font-semibold mb-4">Edit Question</h1>
      <QuestionForm question={q} />
    </div>
  );
}
