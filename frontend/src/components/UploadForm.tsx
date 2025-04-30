import React, { useState } from 'react';
import { uploadFile } from '../services/api';

export function UploadForm({ onUploaded }: { onUploaded: (chunks: number) => void }) {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;
    setLoading(true);
    setError(null);
    try {
      const { ingested_chunks } = await uploadFile(file);
      onUploaded(ingested_chunks);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border rounded">
      <label className="block mb-2">
        Select document to upload:
        <input
          type="file"
          accept=".txt,.pdf"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="mt-1"
        />
      </label>
      <button
        type="submit"
        disabled={!file || loading}
        className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
      >
        {loading ? 'Uploading…' : 'Upload'}
      </button>
      {error && <p className="mt-2 text-red-600">{error}</p>}
    </form>
  );
}
