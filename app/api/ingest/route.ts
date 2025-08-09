import { NextRequest, NextResponse } from 'next/server';
import { ingestDocument } from '@/lib/rag';
import pdf from 'pdf-parse';
import { v4 as uuid } from 'uuid';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const form = await req.formData();
  const file = form.get('file') as File | null;
  const model = (form.get('model') as string | null) || 'desconocido';
  const title = (form.get('title') as string | null) || `Manual ${uuid().slice(0,8)}`;

  if (!file) return NextResponse.json({ error: 'file required' }, { status: 400 });
  const buf = Buffer.from(await file.arrayBuffer());

  let text = '';
  if ((file.name || '').toLowerCase().endsWith('.pdf')) {
    const res = await pdf(buf);
    text = res.text;
  } else {
    text = buf.toString('utf-8');
  }

  const out = await ingestDocument({ title, model, source: file.name || 'upload', text });
  return NextResponse.json(out);
}
