import 'server-only';
export const OPENAI_API_KEY = process.env.OPENAI_API_KEY!;
export const DATABASE_PATH = process.env.DATABASE_PATH || "./data/rag.db";
if (!OPENAI_API_KEY) console.warn("[WARN] Falta OPENAI_API_KEY");
