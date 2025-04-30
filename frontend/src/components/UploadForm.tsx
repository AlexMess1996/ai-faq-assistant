import React, { useState } from 'react';
import { Box, Button, Stack, Typography, CircularProgress } from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';

interface UploadFormProps {
  onUploaded: (chunks: number) => void;
}

export function UploadForm({ onUploaded }: UploadFormProps) {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;
    setLoading(true);
    setError(null);
    try {
      const form = new FormData();
      form.append('file', file);
      const res = await fetch('http://localhost:8000/upload', {
        method: 'POST',
        body: form,
      });
      if (!res.ok) throw new Error('Upload failed');
      const { ingested_chunks } = await res.json();
      onUploaded(ingested_chunks);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
      <Stack spacing={2}>
        <Button
          variant="outlined"
          component="label"
          startIcon={<UploadFileIcon />}
          fullWidth
        >
          {file?.name || 'Select File'}
          <input
            type="file"
            accept=".txt,.pdf"
            hidden
            onChange={handleFileChange}
          />
        </Button>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={!file || loading}
          fullWidth
          sx={{ height: 48 }}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : 'Upload'}
        </Button>
        {error && (
          <Typography color="error" variant="body2" align="center">
            {error}
          </Typography>
        )}
      </Stack>
    </Box>
  );
}