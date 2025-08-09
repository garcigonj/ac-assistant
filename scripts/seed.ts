import 'server-only';
import { ingestDocument } from '@/lib/rag';
import pdf from 'pdf-parse';
import { SEED_SOURCES } from '@/lib/seedSources';

async function run() {
  let total = 0;
  for (const s of SEED_SOURCES) {
    try {
      const res = await fetch(s.url);
      const arr = Buffer.from(await res.arrayBuffer());
      let text = "";
      try {
        const parsed = await pdf(arr);
        text = parsed.text;
      } catch {
        text = arr.toString("utf-8");
      }
      await ingestDocument({ title: s.title, model: s.model, source: s.url, text });
      total++;
    } catch {}
  }
  console.log("Seeded:", total);
}
run();
