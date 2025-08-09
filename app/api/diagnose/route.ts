import { NextRequest, NextResponse } from 'next/server';
import { extractFromImage } from '@/lib/vision';
import { search } from '@/lib/rag';
import OpenAI from 'openai';
import { OPENAI_API_KEY } from '@/lib/env';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const form = await req.formData();
  const file = form.get('image') as File | null;
  const notes = (form.get('notes') as string | null) || '';

  let extracted: any = {};
  if (file) {
    const buf = Buffer.from(await file.arrayBuffer());
    const base64 = buf.toString('base64');
    extracted = await extractFromImage(base64);
  }

  const queryParts = [notes];
  if (extracted?.model) queryParts.push(`modelo ${extracted.model}`);
  if (extracted?.errorCode) queryParts.push(`código error ${extracted.errorCode}`);
  if (extracted?.screenText) queryParts.push(String(extracted.screenText));
  const query = queryParts.filter(Boolean).join(' ').trim() || 'diagnóstico aire acondicionado';

  const top = await search(query, 6);
  const context = top.map((r: any, i: number) => `# Fragmento ${i+1} (modelo: ${r.model}, doc: ${r.title})\n${r.text}`).join('\n\n');

  const client = new OpenAI({ apiKey: OPENAI_API_KEY });
  const completion = await client.chat.completions.create({
    model: 'gpt-4o-mini',
    temperature: 0.2,
    messages: [
      { role: 'system', content: 'Eres un asistente técnico HVAC. Responde en español, con pasos concretos de comprobación y seguridad. Si no estás seguro, indica dudas y pide más fotos/mediciones. Cita fragmentos.' },
      { role: 'user', content: `Consulta del técnico: ${query}\n\nContexto de manuales (relevantes):\n${context}\n\nDevuelve JSON con { "summary":string, "diagnosis":string, "steps":string[], "citations": { "title":string, "model":string, "page":number|null }[] }` }
    ]
  });

  let parsed: any = {};
  try {
    parsed = JSON.parse(completion.choices[0].message?.content || '{}');
  } catch {
    parsed = { summary: completion.choices[0].message?.content };
  }

  if (!parsed.citations || !Array.isArray(parsed.citations)) {
    parsed.citations = top.slice(0,3).map((r: any) => ({ title: r.title, model: r.model, page: r.page ?? null }));
  }

  parsed.extracted = extracted;
  return NextResponse.json(parsed);
}
