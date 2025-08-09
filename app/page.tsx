"use client";
import { useState } from "react";

export default function Page() {
  const [result, setResult] = useState<any>(null);
  const [file, setFile] = useState<File | null>(null);
  const [notes, setNotes] = useState("");

  async function diagnose() {
    const form = new FormData();
    if (file) form.append("image", file);
    form.append("notes", notes);
    const res = await fetch("/api/diagnose", { method: "POST", body: form });
    setResult(await res.json());
  }

  const [ingFile, setIngFile] = useState<File | null>(null);
  const [ingModel, setIngModel] = useState("");
  const [ingTitle, setIngTitle] = useState("");

  async function ingest() {
    if (!ingFile) return alert("Selecciona un archivo");
    const form = new FormData();
    form.append("file", ingFile);
    form.append("model", ingModel);
    form.append("title", ingTitle);
    const res = await fetch("/api/ingest", { method: "POST", body: form });
    const json = await res.json();
    alert(`Ingestado: ${json?.chunks ?? 0} fragmentos`);
  }

  async function seed() {
    const res = await fetch("/api/ingest/seed", { method: "POST" });
    const j = await res.json();
    alert(`Descargados e ingestados ${j.total} documentos`);
  }

  return (
    <main className="max-w-6xl mx-auto p-6 space-y-6">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">A/C Assistant</h1>
        <div className="text-sm">RAG + Visión</div>
      </header>

      <section className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow p-4 space-y-3">
          <h2 className="font-semibold">Diagnóstico por imagen</h2>
          <input type="file" accept="image/*" onChange={(e)=> setFile(e.target.files?.[0] ?? null)} />
          <textarea className="w-full border rounded p-2 text-sm" placeholder="Notas del técnico" value={notes} onChange={(e)=> setNotes(e.target.value)} />
          <button onClick={diagnose} className="px-4 py-2 rounded bg-black text-white">Diagnosticar</button>
          {result && (
            <div className="text-sm mt-4">
              <div className="font-semibold">Resumen</div>
              <p>{result.summary}</p>
              {result.diagnosis && <p><b>Diagnóstico:</b> {result.diagnosis}</p>}
              {Array.isArray(result.steps) && result.steps.length > 0 && (
                <ol className="list-decimal ml-5">{result.steps.map((s:string,i:number)=>(<li key={i}>{s}</li>))}</ol>
              )}
              {Array.isArray(result.citations) && result.citations.length > 0 && (
                <ul className="list-disc ml-5">{result.citations.map((c:any,i:number)=>(<li key={i}>{c.title} (modelo: {c.model}) pág. {c.page ?? "?"}</li>))}</ul>
              )}
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl shadow p-4 space-y-3">
          <h2 className="font-semibold">Ingesta de manuales</h2>
          <input type="file" accept=".pdf,.md,.txt" onChange={(e)=> setIngFile(e.target.files?.[0] ?? null)} />
          <input className="w-full border rounded p-2 text-sm" placeholder="Modelo (ej. Daikin FTXB35C)" value={ingModel} onChange={(e)=> setIngModel(e.target.value)} />
          <input className="w-full border rounded p-2 text-sm" placeholder="Título del manual" value={ingTitle} onChange={(e)=> setIngTitle(e.target.value)} />
          <div className="flex gap-2">
            <button onClick={ingest} className="px-4 py-2 rounded bg-black text-white">Ingestar</button>
            <button onClick={seed} className="px-4 py-2 rounded border">Descargar manuales públicos (seed)</button>
          </div>
          <p className="text-xs text-gray-500">Se descargan guías públicas (DOE/EPA/NIST + fabricantes).</p>
        </div>
      </section>

      <footer className="text-xs text-gray-500 pt-10">
        Construido con Next.js · RAG (SQLite+Embeddings) · Visión (OpenAI)
      </footer>
    </main>
  );
}
