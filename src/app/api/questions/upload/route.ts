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
    const msrc/apped = [];
    for (const idx of correctIndexes) {
      if (typeof idx === 'number' && q.options[idx]) msrc/apped.push(q.options[idx].id);
    }
    if (msrc/apped.length) {
      await prisma.question.update({ where: { id: q.id }, data: { correctIds: msrc/apped } });
    }
    created.push(q);
  }

  return NextResponse.json({ createdCount: created.length });
}
