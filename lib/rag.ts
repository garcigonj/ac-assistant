import { getDB } from './db';
import { v4 as uuid } from 'uuid';
import { chunkText } from './chunker';
import { embedTexts, cosine } from './embeddings';

export async function ingestDocument(params: { title: string; model: string; source: string; text: string; pageMap?: number[] }) {
  const { title, model, source, text, pageMap } = params;
  const db = getDB();
  const id = uuid();
  db.prepare('INSERT INTO documents(id, title, model, source) VALUES (?,?,?,?)').run(id, title, model, source);
  const chunks = chunkText(text);
  const embeddings = await embedTexts(chunks);
  const stmt = db.prepare('INSERT INTO chunks(id, document_id, chunk_index, text, page, embedding) VALUES (?,?,?,?,?,?)');
  chunks.forEach((ck, i) => {
    const cid = uuid();
    const page = pageMap?.[i] ?? null;
    stmt.run(cid, id, i, ck, page, JSON.stringify(embeddings[i]));
  });
  return { id, chunks: chunks.length };
}

export async function search(query: string, limit = 6) {
  const db = getDB();
  const all = db.prepare('SELECT chunks.*, documents.title, documents.model FROM chunks JOIN documents ON chunks.document_id = documents.id').all();
  if (all.length === 0) return [];
  const qEmb = (await embedTexts([query]))[0];
  const scored = (all as any[]).map((row: any) => {
    const emb = JSON.parse(row.embedding) as number[];
    return { ...row, score: cosine(qEmb, emb) };
  }).sort((a, b) => b.score - a.score).slice(0, limit);
  return scored;
}
