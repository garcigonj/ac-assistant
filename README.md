# A/C Assistant — Next.js + RAG + Visión (Railway-ready)

- Subida de **imagen** → extracción de **marca/modelo/código** (GPT-4o-mini).
- **RAG** con SQLite + embeddings (`text-embedding-3-small`).
- **Seed** descarga guías públicas (DOE/EPA/NIST + fabricantes) desde la UI.
- Dockerfile `bookworm-slim` + `output: standalone` (imagen < 4 GB).

## Local
```bash
npm i
cp .env.example .env   # añade OPENAI_API_KEY
mkdir -p data && touch data/rag.db
npm run dev
```

## Railway
- Variables: `OPENAI_API_KEY`, `DATABASE_PATH=/data/rag.db`, `PORT=3000`
- Volume: montar en `/data`
- Deploy: Railway detecta Dockerfile

## Seed
- Botón en la UI: **Descargar manuales públicos (seed)**
- Script: `npm run seed`
