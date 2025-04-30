import React, { useState } from 'react';
import { UploadForm } from './components/UploadForm';
import { Chat } from './components/Chat';

function App() {
  const [ingestedChunks, setIngestedChunks] = useState<number | null>(null);

  return (
    <div className="max-w-2xl mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-6">AI FAQ Assistant</h1>
      <UploadForm onUploaded={(chunks) => setIngestedChunks(chunks)} />
      {ingestedChunks !== null && (
        <p className="mt-2 text-sm text-gray-600">
          Ingested {ingestedChunks} chunk{ingestedChunks > 1 ? 's' : ''}.
        </p>
      )}
      {ingestedChunks !== null && <Chat />}
    </div>
  );
}

export default App;