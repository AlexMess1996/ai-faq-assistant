import React, { useState } from 'react';
import { Box, Button, TextField, Stack, Typography, CircularProgress } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';

interface Answer {
  text: string;
  score: number;
}

export function Chat() {
  const [question, setQuestion] = useState('');
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [loading, setLoading] = useState(false);

  const handleAsk = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question) return;
    setLoading(true);
    try {
      const res = await fetch('http://localhost:8000/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question }),
      });
      if (!res.ok) throw new Error('Ask failed');
      const { answer } = await res.json();
      setAnswers(answer);
    } catch {
      setAnswers([{ text: 'Error fetching answer', score: 0 }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Box component="form" onSubmit={handleAsk} sx={{ width: '100%' }}>
        <Stack direction="row" spacing={2} alignItems="center">
          <TextField
            variant="outlined"
            placeholder="Type your question..."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            fullWidth
            sx={{ backgroundColor: 'background.paper', borderRadius: 1 }}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            endIcon={<SendIcon />}
            disabled={!question || loading}
            sx={{ height: 48 }}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Ask'}
          </Button>
        </Stack>
      </Box>
      <Stack spacing={2} mt={3}>
        {answers.map((ans, idx) => (
          <Box
            key={idx}
            p={2}
            bgcolor="background.paper"
            borderRadius={2}
            boxShadow={1}
          >
            <Typography>{ans.text}</Typography>
            <Typography variant="caption" color="textSecondary" align="right">
              Score: {ans.score.toFixed(2)}
            </Typography>
          </Box>
        ))}
      </Stack>
    </Box>
  );
}
