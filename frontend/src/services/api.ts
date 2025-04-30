const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export interface Answer {
  text: string;
  score: number;
}

export async function uploadFile(file: File): Promise<{ filename: string; ingested_chunks: number }> {
  const form = new FormData();
  form.append('file', file);
  const res = await fetch(`${BASE_URL}/upload`, {
    method: 'POST',
    body: form,
  });
  if (!res.ok) throw new Error('Upload failed');
  return res.json();
}

export async function askQuestion(question: string): Promise<{ answer: Answer[] }> {
  const res = await fetch(`${BASE_URL}/ask`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ question }),
  });
  if (!res.ok) throw new Error('Ask failed');
  return res.json();
}
