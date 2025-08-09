export function chunkText(text: string, maxLen = 900, overlap = 120) {
  const paragraphs = text.split(/\n\s*\n/);
  const chunks: string[] = [];
  let buf: string[] = [];
  function flush(force=false) {
    const candidate = buf.join('\n').trim();
    if (candidate && (force || candidate.length >= maxLen)) {
      chunks.push(candidate);
      buf = [];
    }
  }
  for (const p of paragraphs) {
    buf.push(p);
    if (buf.join('\n').length >= maxLen) {
      flush(true);
      if (overlap > 0 && chunks.length) {
        const last = chunks[chunks.length - 1];
        const tail = last.slice(Math.max(0, last.length - overlap));
        buf = [tail];
      }
    }
  }
  flush(true);
  return chunks;
}
