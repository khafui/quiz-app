#!/usr/bin/env bash
set -e

# setup_quiz_app.sh
# Usage: run in the root of your (empty) repo directory: ./setup_quiz_app.sh

echo "Creating files for the MCQ Quiz App..."

# Create directories
mkdir -p app/(dashboard)/admin app/(dashboard)/user app/api/questions app/api/questions/bulk app/api/questions/upload app/api/quiz app/api/analytics app/api/sync-user components components/forms lib prisma public

# package.json
cat > package.json <<'JSON'
{
  "name": "mcq-next-prisma-clerk",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "prisma": "prisma",
    "seed": "node prisma/seed.js"
  },
  "dependencies": {
    "@clerk/nextjs": "^5.0.0",
    "@prisma/client": "^5.0.0",
    "axios": "^1.4.0",
    "clsx": "^1.2.1",
    "date-fns": "^2.30.0",
    "formidable": "^3.0.0",
    "next": "^15.0.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  },
  "devDependencies": {
    "prisma": "^5.0.0",
    "tailwindcss": "^4.0.0",
    "postcss": "^8.0.0",
    "autoprefixer": "^10.0.0",
    "typescript": "^5.0.0"
  }
}
JSON

# tsconfig.json
cat > tsconfig.json <<'JSON'
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["DOM", "DOM.Iterable", "ES2022"],
    "allowJs": false,
    "skipLibCheck": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "ESNext",
    "moduleResolution": "Node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "react-jsx",
    "baseUrl": ".",
    "paths": {
      "@/components/*": ["components/*"],
      "@/lib/*": ["lib/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx"],
  "exclude": ["node_modules"]
}
JSON

# postcss.config.js
cat > postcss.config.js <<'JS'
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {}
  }
}
JS

# tailwind.config.ts
cat > tailwind.config.ts <<'TW'
import { type Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {}
  },
  plugins: []
};

export default config;
TW

# .env.example
cat > .env.example <<'ENV'
# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxx
CLERK_SECRET_KEY=sk_test_xxx

# Database (Postgres)
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public"

# Base URL
NEXT_PUBLIC_BASE_URL=http://localhost:3000
ENV

# Prisma schema
cat > prisma/schema.prisma <<'PRISMA'
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id        String   @id @default(cuid())
  clerkId   String   @unique
  email     String?
  role      String   @default("USER")
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  questions Question[] @relation("UserQuestions")
}

model Question {
  id         String   @id @default(cuid())
  text       String
  isMultiple Boolean  @default(false)
  correctIds String[] @default([])
  options    Option[]
  createdBy  String?
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt
}

model Option {
  id         String   @id @default(cuid())
  text       String
  question   Question @relation(fields: [questionId], references: [id], onDelete: Cascade)
  questionId String
}

model QuizResult {
  id        String   @id @default(cuid())
  userId    String
  total     Int
  correct   Int
  score     Float
  createdAt DateTime @default(now())
}
PRISMA

# prisma seed
cat > prisma/seed.js <<'SEED'
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const q1 = await prisma.question.create({
    data: {
      text: 'What is the capital of France?',
      isMultiple: false,
      options: {
        create: [
          { text: 'Paris' },
          { text: 'London' },
          { text: 'Berlin' },
          { text: 'Madrid' }
        ]
      }
    },
    include: { options: true }
  });
  await prisma.question.update({
    where: { id: q1.id },
    data: { correctIds: [q1.options[0].id] }
  });

  const q2 = await prisma.question.create({
    data: {
      text: 'Select front-end technologies:',
      isMultiple: true,
      options: {
        create: [
          { text: 'JavaScript' },
          { text: 'HTML' },
          { text: 'Python' },
          { text: 'CSS' }
        ]
      }
    },
    include: { options: true }
  });
  await prisma.question.update({
    where: { id: q2.id },
    data: { correctIds: [q2.options[0].id, q2.options[1].id, q2.options[3].id] }
  });

  console.log('Seed complete');
}

main().catch(e => {
  console.error(e);
  process.exit(1);
}).finally(async () => {
  await prisma.$disconnect();
});
SEED

# lib/prisma.ts
cat > lib/prisma.ts <<'PRISMAJS'
import { PrismaClient } from '@prisma/client';

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

export const prisma = global.prisma || new PrismaClient();
if (process.env.NODE_ENV !== 'production') global.prisma = prisma;
PRISMAJS

# lib/auth.ts
cat > lib/auth.ts <<'AUTH'
import { currentUser } from '@clerk/nextjs/server';

export async function getCurrentUserPublicMetadata() {
  const user = await currentUser();
  return user?.publicMetadata || null;
}

export async function getCurrentUserId() {
  const user = await currentUser();
  return user?.id || null;
}
AUTH

# app layout & styles
mkdir -p app
cat > app/layout.tsx <<'LAYOUT'
import './globals.css';
import { ClerkProvider } from '@clerk/nextjs';
import Navbar from '@/components/navbar';

export const metadata = {
  title: 'MCQ App',
  description: 'Questions & Answers app'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>
          <Navbar />
          <main className="max-w-5xl mx-auto p-6">{children}</main>
        </body>
      </html>
    </ClerkProvider>
  );
}
LAYOUT

cat > app/globals.css <<'CSS'
@tailwind base;
@tailwind components;
@tailwind utilities;

html, body, #__next {
  height: 100%;
}

body {
  background: #f8fafc;
  color: #0f172a;
  font-family: Inter, ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial;
}
CSS

# Home page
cat > app/page.tsx <<'PAGE'
import Link from 'next/link';

export default function Home() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">MCQ App</h1>
      <p className="mb-6">Take quizzes, track results, and manage questions (admin).</p>

      <div className="space-x-4">
        <Link href="/user" className="rounded bg-slate-800 text-white px-3 py-1">Take Quizzes</Link>
        <Link href="/admin" className="rounded border px-3 py-1">Admin</Link>
      </div>
    </div>
  );
}
PAGE

# components/navbar.tsx
mkdir -p components
cat > components/navbar.tsx <<'NAV'
'use client';
import Link from 'next/link';
import { useUser, SignedIn, SignedOut, SignInButton, SignOutButton } from '@clerk/nextjs';
import { useEffect, useState } from 'react';

export default function Navbar() {
  const { user } = useUser();
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    if (user) setRole((user.publicMetadata as any)?.role || 'USER');
  }, [user]);

  return (
    <header className="bg-white border-b">
      <div className="max-w-5xl mx-auto p-4 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <Link href="/" className="text-lg font-semibold">MCQ App</Link>
          <SignedIn>
            {role === 'ADMIN' ? (
              <Link href="/admin" className="text-sm text-slate-600">Admin</Link>
            ) : (
              <Link href="/user" className="text-sm text-slate-600">Quizzes</Link>
            )}
          </SignedIn>
        </div>

        <div>
          <SignedIn>
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-700 hidden md:inline">{user?.emailAddresses?.[0]?.emailAddress}</span>
              <SignOutButton />
            </div>
          </SignedIn>
          <SignedOut>
            <SignInButton />
          </SignedOut>
        </div>
      </div>
    </header>
  );
}
NAV

# API: questions (list + create) with pagination & search
mkdir -p app/api/questions
cat > app/api/questions/route.ts <<'APIQ'
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@clerk/nextjs/server';

export async function GET(req) {
  const url = new URL(req.url);
  const search = url.searchParams.get('q') || '';
  const page = parseInt(url.searchParams.get('page')||'1',10) || 1;
  const limit = parseInt(url.searchParams.get('limit')||'10',10) || 10;
  const skip = (page - 1) * limit;

  const where = search ? {
    OR: [
      { text: { contains: search, mode: 'insensitive' } },
      { options: { some: { text: { contains: search, mode: 'insensitive' }}}}
    ]
  } : undefined;

  const [items, total] = await Promise.all([
    prisma.question.findMany({
      where,
      include: { options: true },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit
    }),
    prisma.question.count({ where })
  ]);

  return NextResponse.json({ items, total, page, limit });
}

export async function POST(req: Request) {
  const { userId } = auth();
  const body = await req.json();
  const { text, isMultiple = false, options, correctIndexes = [] } = body;

  if (!text || !Array.isArray(options) || options.length < 2) {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
  }

  const created = await prisma.question.create({
    data: {
      text,
      isMultiple,
      createdBy: userId || undefined,
      options: { create: options.map((o: any) => ({ text: o.text })) }
    },
    include: { options: true }
  });

  const mappedCorrectIds = [];
  for (const idx of correctIndexes) {
    if (typeof idx === 'number' && created.options[idx]) mappedCorrectIds.push(created.options[idx].id);
  }

  if (mappedCorrectIds.length) {
    const updated = await prisma.question.update({
      where: { id: created.id },
      data: { correctIds: mappedCorrectIds }
    });
    return NextResponse.json(await prisma.question.findUnique({ where: { id: updated.id }, include: { options: true } }));
  }

  return NextResponse.json(created);
}
APIQ

# API: question by id (get, put, delete)
cat > app/api/questions/[id]/route.ts <<'APID'
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@clerk/nextjs/server';

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const q = await prisma.question.findUnique({ where: { id: params.id }, include: { options: true } });
  if (!q) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(q);
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const { userId } = auth();
  const body = await req.json();
  const { text, isMultiple = false, options, correctIndexes = [] } = body;

  if (!text || !Array.isArray(options) || options.length < 2) {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
  }

  await prisma.option.deleteMany({ where: { questionId: params.id } });

  const updated = await prisma.question.update({
    where: { id: params.id },
    data: {
      text,
      isMultiple,
      updatedAt: new Date(),
      options: { create: options.map((o: any) => ({ text: o.text })) }
    },
    include: { options: true }
  });

  const mappedCorrectIds = [];
  for (const idx of correctIndexes) {
    if (typeof idx === 'number' && updated.options[idx]) mappedCorrectIds.push(updated.options[idx].id);
  }

  const final = await prisma.question.update({
    where: { id: updated.id },
    data: { correctIds: mappedCorrectIds }
  });

  return NextResponse.json(await prisma.question.findUnique({ where: { id: final.id }, include: { options: true } }));
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  await prisma.question.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
APID

# API: bulk create (POST rows)
mkdir -p app/api/questions/bulk
cat > app/api/questions/bulk/route.ts <<'APIB'
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@clerk/nextjs/server';

export async function POST(req: Request) {
  const { userId } = auth();
  const body = await req.json();
  const { rows } = body;
  if (!Array.isArray(rows) || rows.length === 0) {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
  }

  const created = [];
  for (const r of rows) {
    const { text, isMultiple=false, options, correctIndexes=[] } = r;
    if (!text || !Array.isArray(options) || options.length < 2) continue;
    const q = await prisma.question.create({
      data: {
        text,
        isMultiple,
        createdBy: userId || undefined,
        options: { create: options.map((o:any)=>({ text: o.text })) }
      },
      include: { options: true }
    });
    const mapped = [];
    for (const idx of correctIndexes) {
      if (typeof idx === 'number' && q.options[idx]) mapped.push(q.options[idx].id);
    }
    if (mapped.length) {
      await prisma.question.update({ where: { id: q.id }, data: { correctIds: mapped } });
    }
    created.push(q);
  }

  return NextResponse.json({ createdCount: created.length });
}
APIB

# API: server-side CSV upload using formidable
mkdir -p app/api/questions/upload
cat > app/api/questions/upload/route.ts <<'APIU'
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@clerk/nextjs/server';
import formidable from 'formidable';
import fs from 'fs';

export const config = {
  api: {
    bodyParser: false,
  },
};

function parseCSV(text) {
  const lines = text.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
  const rows = [];
  for (const line of lines) {
    const parts = [];
    let cur = ''; let inQuotes = false;
    for (let i=0;i<line.length;i++){
      const ch = line[i];
      if (ch === '"'){ inQuotes = !inQuotes; continue; }
      if (ch === ',' && !inQuotes) { parts.push(cur); cur=''; continue; }
      cur += ch;
    }
    parts.push(cur);
    const [text, isMultiple, optionsStr, correctStr] = parts.map(p => p?.trim()?.replace(/^"|"$/g,''));
    const options = optionsStr ? optionsStr.split('|').map(s => ({ text: s.trim() })) : [];
    const correctIndexes = correctStr ? correctStr.split('|').map(s => parseInt(s,10)) : [];
    rows.push({ text, isMultiple: isMultiple === 'true', options, correctIndexes });
  }
  return rows;
}

export async function POST(req) {
  const { userId } = auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const data = await new Promise((resolve, reject) => {
    const form = new formidable.IncomingForm();
    form.parse(req, (err, fields, files) => {
      if (err) reject(err);
      else resolve({ fields, files });
    });
  }).catch(e => ({ error: e.message }));

  if (data && data.error) return NextResponse.json({ error: data.error }, { status: 500 });

  const files = (data as any).files || {};
  const keys = Object.keys(files);
  if (keys.length === 0) return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });

  const file = files[keys[0]];
  const filepath = file.filepath || file.path || file.file;
  const content = fs.readFileSync(filepath, 'utf8');
  const rows = parseCSV(content);

  const created = [];
  for (const r of rows) {
    const { text, isMultiple=false, options, correctIndexes=[] } = r;
    if (!text || !Array.isArray(options) || options.length < 2) continue;
    const q = await prisma.question.create({
      data: {
        text,
        isMultiple,
        createdBy: userId || undefined,
        options: { create: options.map((o:any)=>({ text: o.text })) }
      },
      include: { options: true }
    });
    const mapped = [];
    for (const idx of correctIndexes) {
      if (typeof idx === 'number' && q.options[idx]) mapped.push(q.options[idx].id);
    }
    if (mapped.length) {
      await prisma.question.update({ where: { id: q.id }, data: { correctIds: mapped } });
    }
    created.push(q);
  }

  return NextResponse.json({ createdCount: created.length });
}
APIU

# quiz submit
mkdir -p app/api/quiz
cat > app/api/quiz/submit/route.ts <<'QSUB'
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@clerk/nextjs/server';

/**
 * POST payload:
 * {
 *   answers: [
 *     { questionId, selectedOptionIds: [string,...] },
 *     ...
 *   ],
 *   scoringMode: 'exact' | 'partial' // optional, default 'exact'
 * }
 */
export async function POST(req: Request) {
  const { userId } = auth();
  const body = await req.json();
  const { answers, scoringMode = 'exact' } = body;

  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  if (!Array.isArray(answers) || answers.length === 0) {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
  }

  let totalScore = 0;
  let correctCount = 0;
  const perQuestion = [];

  for (const ans of answers) {
    const q = await prisma.question.findUnique({ where: { id: ans.questionId } });
    if (!q) {
      perQuestion.push({ questionId: ans.questionId, correct: false, reason: 'Question not found' });
      continue;
    }

    const correctSet = new Set(q.correctIds || []);
    const selected = Array.isArray(ans.selectedOptionIds) ? ans.selectedOptionIds : (ans.selectedOptionId ? [ans.selectedOptionId] : []);
    const selectedSet = new Set(selected);

    if (scoringMode === 'exact') {
      let isEqual = true;
      if (correctSet.size !== selectedSet.size) isEqual = false;
      else {
        for (const id of correctSet) {
          if (!selectedSet.has(id)) { isEqual = false; break; }
        }
      }
      if (isEqual) {
        totalScore += 1;
        correctCount++;
      }
      perQuestion.push({ questionId: q.id, correct: isEqual });
    } else {
      const truePositives = Array.from(selectedSet).filter(id => correctSet.has(id)).length;
      const falsePositives = Array.from(selectedSet).filter(id => !correctSet.has(id)).length;
      const denom = correctSet.size || 1;
      const pts = Math.max(0, (truePositives - falsePositives) / denom);
      totalScore += pts;
      const isCorrect = pts === 1;
      if (isCorrect) correctCount++;
      perQuestion.push({ questionId: q.id, partialScore: pts, correct: isCorrect });
    }
  }

  const total = answers.length;
  const scorePercent = (totalScore / total) * 100;

  const result = await prisma.quizResult.create({
    data: { userId, total, correct: correctCount, score: scorePercent }
  });

  return NextResponse.json({ result, correct: correctCount, total, score: scorePercent, details: perQuestion });
}
QSUB

# quiz results API
cat > app/api/quiz/results/route.ts <<'QRES'
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@clerk/nextjs/server';

export async function GET() {
  const { userId } = auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const results = await prisma.quizResult.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' }
  });

  return NextResponse.json(results);
}
QRES

# analytics API
cat > app/api/analytics/route.ts <<'AN'
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const [questionCount, quizCount, avgObj] = await Promise.all([
    prisma.question.count(),
    prisma.quizResult.count(),
    prisma.quizResult.aggregate({ _avg: { score: true } })
  ]);

  const top = await prisma.quizResult.groupBy({
    by: ['userId'],
    _avg: { score: true },
    _count: { _all: true },
    orderBy: { _avg: { score: 'desc' } },
    take: 10
  });

  const leaderboard = top.map(t => ({
    userId: t.userId,
    averageScore: t._avg.score ?? 0,
    attempts: t._count._all
  }));

  return NextResponse.json({
    totals: {
      questions: questionCount,
      quizzes: quizCount,
      averageScore: (avgObj._avg.score ?? 0)
    },
    leaderboard
  });
}
AN

# sync-user API
cat > app/api/sync-user/route.ts <<'SYNC'
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { currentUser } from '@clerk/nextjs/server';

export async function POST() {
  const user = await currentUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const clerkId = user.id;
  const email = user.emailAddresses?.[0]?.emailAddress || null;
  const role = (user.publicMetadata as any)?.role || 'USER';

  const upserted = await prisma.user.upsert({
    where: { clerkId },
    update: { email, role, updatedAt: new Date() },
    create: { clerkId, email, role }
  });

  return NextResponse.json({ ok: true, user: upserted });
}
SYNC

# Admin layout protection
mkdir -p app/(dashboard)/admin
cat > app/(dashboard)/admin/layout.tsx <<'AL'
import { auth, currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const { userId } = auth();
  const user = await currentUser();

  if (!userId || (user?.publicMetadata as any)?.role !== 'ADMIN') {
    redirect('/sign-in');
  }

  return (
    <div className="min-h-screen">
      <header className="bg-white border-b p-4">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <h2 className="text-lg font-semibold">Admin Dashboard</h2>
        </div>
      </header>
      <div className="max-w-5xl mx-auto p-6">
        {children}
      </div>
    </div>
  );
}
AL

# Admin pages: list, new, edit
cat > app/(dashboard)/admin/page.tsx <<'APAGE'
'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import QuestionList from '@/components/question-list';

export default function AdminPageClient() {
  const [items, setItems] = useState([]);
  const [q, setQ] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 10;

  useEffect(() => {
    fetchData();
  }, [page]);

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

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Questions</h1>
        <Link href="/admin/new" className="rounded bg-slate-800 text-white px-3 py-1">Add Question</Link>
      </div>

      <form onSubmit={onSearch} className="mb-4 flex gap-2">
        <input className="border rounded p-2 flex-1" placeholder="Search questions or options" value={q} onChange={(e)=>setQ(e.target.value)} />
        <button className="rounded bg-slate-700 text-white px-3 py-1">Search</button>
      </form>

      <QuestionList questions={items} />

      <div className="mt-4 flex items-center justify-between">
        <div>Page {page} of {Math.ceil(total/limit)}</div>
        <div className="flex gap-2">
          <button disabled={page<=1} onClick={()=>setPage(p=>p-1)} className="px-3 py-1 border rounded">Prev</button>
          <button disabled={page>=Math.ceil(total/limit)} onClick={()=>setPage(p=>p+1)} className="px-3 py-1 border rounded">Next</button>
        </div>
      </div>
    </div>
  );
}
APAGE

cat > app/(dashboard)/admin/new/page.tsx <<'ANEW'
import dynamic from 'next/dynamic';
const QuestionForm = dynamic(() => import('@/components/forms/question-form'), { ssr: false });
const BulkUpload = dynamic(() => import('@/components/bulk-upload'), { ssr: false });

export default function NewQuestionPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold mb-4">Add Question</h1>
        <QuestionForm />
      </div>
      <div>
        <h2 className="text-lg font-semibold mb-2">Or Bulk Upload</h2>
        <BulkUpload />
      </div>
    </div>
  );
}
ANEW

cat > app/(dashboard)/admin/[id]/edit/page.tsx <<'AEDIT'
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
AEDIT

# components: question-list
cat > components/question-list.tsx <<'QL'
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
QL

# components/forms/question-form.tsx
mkdir -p components/forms
cat > components/forms/question-form.tsx <<'QFORM'
'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

type OptionLocal = { id?: string; text: string };

export default function QuestionForm({ question }: { question?: any }) {
  const router = useRouter();
  const [text, setText] = useState(question?.text || '');
  const [isMultiple, setIsMultiple] = useState<boolean>(question?.isMultiple ?? false);
  const [options, setOptions] = useState<OptionLocal[]>(
    () => question?.options?.length ? question.options.map((o: any) => ({ id: o.id, text: o.text })) : [{ text: '' }, { text: '' }]
  );
  const [correctFlags, setCorrectFlags] = useState<boolean[]>(
    () => {
      if (!question) return options.map(() => false);
      const flags = options.map((_, i) => (question.correctIds || []).includes(question.options[i]?.id || '') );
      return flags;
    }
  );

  useEffect(() => {
    setCorrectFlags(prev => {
      if (prev.length === options.length) return prev;
      const next = options.map((_, i) => prev[i] ?? false);
      return next;
    });
  }, [options.length]);

  function addOption() {
    setOptions(prev => [...prev, { text: '' }]);
  }
  function removeOption(index: number) {
    setOptions(prev => prev.filter((_, i) => i !== index));
  }
  function updateOptionText(index: number, value: string) {
    setOptions(prev => prev.map((o, i) => i === index ? { ...o, text: value } : o));
  }
  function toggleCorrect(index: number) {
    setCorrectFlags(prev => {
      if (!isMultiple) {
        return prev.map((_, i) => i === index);
      }
      const next = [...prev];
      next[index] = !next[index];
      return next;
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const correctIndexes = correctFlags
      .map((flag, i) => flag ? i : -1)
      .filter(i => i !== -1);

    if (options.length < 2) {
      alert('Provide at least 2 options');
      return;
    }
    if (correctIndexes.length === 0) {
      alert('Mark at least one correct option');
      return;
    }

    const payload = {
      text,
      isMultiple,
      options: options.map(o => ({ text: o.text })),
      correctIndexes
    };

    const method = question ? 'PUT' : 'POST';
    const url = question ? `/api/questions/${question.id}` : '/api/questions';

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({ message: 'Unknown error' }));
      alert('Error: ' + (err?.error || err?.message || 'Saving question failed'));
      return;
    }

    router.push('/admin');
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow max-w-3xl">
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Question</label>
        <textarea className="w-full border rounded p-2" value={text} onChange={e => setText(e.target.value)} />
      </div>

      <div className="mb-3 flex items-center gap-3">
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={isMultiple} onChange={e => setIsMultiple(e.target.checked)} />
          <span className="text-sm">Allow multiple answers</span>
        </label>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Options</label>
        <div className="space-y-2">
          {options.map((opt, i) => (
            <div key={i} className="flex items-center gap-2">
              <input
                type={isMultiple ? 'checkbox' : 'radio'}
                name="correct"
                checked={!!correctFlags[i]}
                onChange={() => toggleCorrect(i)}
              />
              <input
                className="flex-1 border rounded p-2"
                value={opt.text}
                onChange={e => updateOptionText(i, e.target.value)}
                placeholder={`Option ${i + 1}`}
              />
              <button
                type="button"
                onClick={() => removeOption(i)}
                className="text-red-600 text-sm"
              >
                Remove
              </button>
            </div>
          ))}
        </div>

        <div className="mt-2">
          <button type="button" onClick={addOption} className="text-sm text-blue-600">+ Add option</button>
        </div>
      </div>

      <div className="flex gap-2">
        <button type="submit" className="rounded bg-slate-800 text-white px-3 py-1">Save</button>
        <button type="button" onClick={() => router.push('/admin')} className="rounded border px-3 py-1">Cancel</button>
      </div>
    </form>
  );
}
QFORM

# bulk-upload component
cat > components/bulk-upload.tsx <<'BULK'
'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function BulkUpload() {
  const [fileName, setFileName] = useState('');
  const [status, setStatus] = useState('');
  const router = useRouter();

  function parseCSV(content: string) {
    const lines = content.split('\n').map(l => l.trim()).filter(Boolean);
    const rows = [];
    for (const line of lines) {
      const parts = splitCSVLine(line);
      const [text, isMultiple, optionsStr, correctStr] = parts;
      const options = optionsStr.split('|').map(s => ({ text: s.trim() }));
      const correctIndexes = correctStr ? correctStr.split('|').map(s => parseInt(s,10)) : [];
      rows.push({ text, isMultiple: isMultiple==='true', options, correctIndexes });
    }
    return rows;
  }

  function splitCSVLine(line: string) {
    const res = [];
    let cur = '';
    let inQuotes = false;
    for (let i=0;i<line.length;i++) {
      const ch = line[i];
      if (ch === '"') { inQuotes = !inQuotes; continue; }
      if (ch === ',' && !inQuotes) { res.push(cur); cur=''; continue; }
      cur += ch;
    }
    res.push(cur);
    return res.map(s => s.trim());
  }

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    setFileName(f.name);
    const text = await f.text();
    const rows = parseCSV(text);
    setStatus(`Parsed ${rows.length} rows — uploading...`);
    const res = await fetch('/api/questions/bulk', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ rows })
    });
    if (res.ok) {
      setStatus('Upload successful');
      router.refresh();
    } else {
      const err = await res.json().catch(()=>({error:'Unknown'}));
      setStatus('Upload failed: ' + (err.error || JSON.stringify(err)));
    }
  }

  return (
    <div className="bg-white p-4 rounded shadow">
      <label className="block text-sm font-medium mb-2">Bulk upload CSV</label>
      <input type="file" accept=".csv" onChange={handleFile} />
      <div className="mt-2 text-sm text-slate-600">{fileName}</div>
      <div className="mt-2 text-sm">{status}</div>
      <p className="text-xs text-slate-500 mt-2">CSV columns: text,isMultiple (true/false),options (| separated),correctIndexes (| separated indexes)</p>
    </div>
  );
}
BULK

# user dashboard pages
mkdir -p app/(dashboard)/user
cat > app/(dashboard)/user/page.tsx <<'UHOME'
import Link from 'next/link';

export const revalidate = 0;

export default async function UserDashboard() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ''}/api/questions`, { cache: 'no-store' });
  const questions = await res.json();

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Available Quizzes</h1>
      <div className="grid gap-4">
        {questions.items?.map((q: any) => (
          <div key={q.id} className="bg-white p-4 rounded border">
            <p className="font-medium">{q.text}</p>
            <div className="mt-3">
              <Link href={`/user/${q.id}`} className="text-sm text-blue-600">Take Quiz</Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
UHOME

cat > app/(dashboard)/user/[id]/page.tsx <<'UQUIZ'
'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function TakeQuiz({ params }: { params: { id: string } }) {
  const [q, setQ] = useState<any>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [result, setResult] = useState<any>(null);
  const [scoringMode, setScoringMode] = useState<'exact'|'partial'>('exact');
  const router = useRouter();

  useEffect(() => {
    (async () => {
      const res = await fetch(`/api/questions/${params.id}`);
      const data = await res.json();
      setQ(data);
    })();
  }, [params.id]);

  function toggleSelect(optionId: string) {
    if (!q) return;
    if (q.isMultiple) {
      setSelectedIds(prev => prev.includes(optionId) ? prev.filter(id => id !== optionId) : [...prev, optionId]);
    } else {
      setSelectedIds([optionId]);
    }
  }

  async function submit() {
    if (!selectedIds.length) return alert('Please select an option');
    const payload = {
      answers: [{ questionId: q.id, selectedOptionIds: selectedIds }],
      scoringMode
    };
    const res = await fetch('/api/quiz/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (res.ok) setResult(data);
    else alert('Error submitting quiz');
  }

  if (!q) return <p>Loading...</p>;

  return (
    <div className="bg-white p-6 rounded shadow">
      <h2 className="text-lg font-medium mb-4">{q.text}</h2>

      <div className="mb-4">
        <label className="text-sm mr-3">Scoring:</label>
        <label className="mr-2"><input type="radio" checked={scoringMode==='exact'} onChange={()=>setScoringMode('exact')} /> Exact</label>
        <label><input type="radio" checked={scoringMode==='partial'} onChange={()=>setScoringMode('partial')} /> Partial</label>
      </div>

      <div className="space-y-2 mb-4">
        {q.options.map((o: any) => (
          <label key={o.id} className="flex items-center gap-3">
            <input
              type={q.isMultiple ? 'checkbox' : 'radio'}
              name="opt"
              checked={selectedIds.includes(o.id)}
              onChange={() => toggleSelect(o.id)}
            />
            <span>{o.text}</span>
          </label>
        ))}
      </div>

      {!result ? (
        <div className="flex gap-2">
          <button onClick={submit} className="rounded bg-slate-800 text-white px-3 py-1">Submit</button>
          <button onClick={() => router.push('/user')} className="rounded border px-3 py-1">Back</button>
        </div>
      ) : (
        <div className="p-4 border rounded">
          <p className="mb-2">Score: {result.score.toFixed(0)}%</p>
          <p>{result.correct} / {result.total} correct</p>
          <div className="mt-3">
            <button onClick={() => router.push('/user')} className="rounded border px-3 py-1">Back to quizzes</button>
          </div>
        </div>
      )}
    </div>
  );
}
UQUIZ

cat > app/(dashboard)/user/results/page.tsx <<'URES'
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
URES

# components/results-table.tsx
cat > components/results-table.tsx <<'RT'
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
RT

# analytics components
cat > components/analytics-cards.tsx <<'AC'
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
AC

cat > components/top-performers-table.tsx <<'TP'
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
TP

# admin analytics page
mkdir -p app/(dashboard)/admin/analytics
cat > app/(dashboard)/admin/analytics/page.tsx <<'AAN'
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
AAN

# DEPLOYMENT.md
cat > DEPLOYMENT.md <<'DEP'
# Deploying to Vercel with Neon (Postgres) and Clerk

## Overview
This guide shows how to deploy the Next.js App Router app to Vercel and use Neon (Postgres) as the database and Clerk for authentication.

## 1. Prepare your repo
Push your project to GitHub (e.g., https://github.com/khafui/quiz-app.git).

## 2. Create Neon database
1. Sign up at Neon (https://neon.tech/) and create a Postgres database.
2. Copy the connection string (format: postgresql://USER:PASSWORD@HOST:PORT/DATABASE?options).

## 3. Create Clerk application
1. Sign in to Clerk (https://clerk.com) and create a new application.
2. Copy Publishable Key and Secret Key.

## 4. Vercel project
1. Go to Vercel, import the GitHub repository.
2. In Vercel Project Settings -> Environment Variables, add:
   - `DATABASE_URL` = your Neon connection string
   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` = Clerk Publishable Key
   - `CLERK_SECRET_KEY` = Clerk Secret Key
   - `NEXT_PUBLIC_BASE_URL` = https://your-vercel-url.vercel.app

## 5. Prisma & Migrations on Vercel (Build)
During build, you should run migrations. Use a Vercel build step:
- In `package.json`, ensure `prisma migrate deploy` runs as part of `vercel-build` script, or run it in an initialization step.

Example `package.json` scripts:
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "vercel-build": "prisma migrate deploy && next build"
  }
}

Vercel will run `vercel-build` during deployment.

## 6. Seed data
You can create an endpoint to seed demo data or run seed from your local machine.

## 7. CI
Use GitHub Actions to run tests and `prisma migrate deploy` on merges to main before Vercel deploys.

## Notes
- Ensure Clerk is configured for production domains in its dashboard.
- Neon connection string might require SSL settings; set `PGSSLMODE` if needed.
DEP

echo "Files created. Installing npm dependencies (this may take a minute)..."

# Install packages
npm install

echo "Done installing. NEXT STEPS:"
echo "1) Edit .env.local with your DATABASE_URL and Clerk keys."
echo "   You can copy .env.example to .env.local and edit."
echo "2) Run prisma migrate and seed when ready:"
echo "   npx prisma migrate dev --name init"
echo "   node prisma/seed.js"
echo "3) Start the dev server: npm run dev"
echo ""
echo "If you'd like, after verifying the app locally you can commit & push to your GitHub repo."
