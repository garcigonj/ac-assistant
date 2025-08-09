import 'server-only';
import OpenAI from 'openai';
import { OPENAI_API_KEY } from './env';

const client = new OpenAI({ apiKey: OPENAI_API_KEY });

export async function embedTexts(texts: string[]): Promise<number[][]> {
  const model = 'text-embedding-3-small';
  const res = await client.embeddings.create({ model, input: texts });
  return res.data.map(d => d.embedding as unknown as number[]);
}

export function cosine(a: number[], b: number[]) {
  let dot = 0, na = 0, nb = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    na += a[i] * a[i];
    nb += b[i] * b[i];
  }
  return dot / (Math.sqrt(na) * Math.sqrt(nb) + 1e-8);
}
