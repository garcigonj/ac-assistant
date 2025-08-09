import OpenAI from 'openai';
import { OPENAI_API_KEY } from './env';

const client = new OpenAI({ apiKey: OPENAI_API_KEY });

export async function extractFromImage(base64: string) {
  const prompt = `Eres un asistente para técnicos de climatización. Extrae del contenido visible en la imagen: 
- Marca y modelo exacto si aparece
- Código de error si aparece (p.ej., E5, H6, U4, F0, P4...)
- Mensaje de pantalla textual
Devuelve un JSON con { "brand":?, "model":?, "errorCode":?, "screenText":? }. Usa null cuando no estés seguro.`;

  const res = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: 'system', content: 'Responde únicamente en JSON válido.' },
      { role: 'user', content: [
        { type: 'text', text: prompt },
        { type: 'image_url', image_url: { url: `data:image/jpeg;base64,${base64}` } },
      ] as any }
    ],
    temperature: 0
  });

  try { return JSON.parse(res.choices[0]?.message?.content || '{}'); }
  catch { return {}; }
}
