import React, { useState } from 'react';
import { askQuestion, Answer } from '../services/api';

const FALLBACK = "Sorry, I don't have an answer to that.";

export function Chat() {
  const [question, setQuestion] = useState('');
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [loading, setLoading] = useState(false);

  const handleAsk = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question) return;
    setLoading(true);
    try {
      const resp = await askQuestion(question);
      setAnswers(resp.answer);
    } catch (err) {
      setAnswers([{ text: 'Error fetching answer', score: 0 }]);
    } finally {
      setLoading(false);
    }
  };

  const isFallback = answers.length === 1 && answers[0].text === FALLBACK;

  return (
    <div className="p-4 border rounded mt-6">
      <form onSubmit={handleAsk} className="mb-4">
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Ask something…"
          className="w-full p-2 border rounded"
        />
        <button
          type="submit"
          disabled={loading}
          className="mt-2 px-4 py-2 bg-green-600 text-white rounded disabled:opacity-50"
        >
          {loading ? 'Thinking…' : 'Ask'}
        </button>
      </form>

      {isFallback ? (
        <p className="italic text-gray-600">{FALLBACK}</p>
      ) : (
        answers.map((ans, i) => (
          <div key={i} className="mb-2 p-2 bg-gray-100 rounded">
            <p>{ans.text}</p>
            <p className="text-sm text-gray-500">Score: {ans.score.toFixed(2)}</p>
          </div>
        ))
      )}
    </div>
  );
}
