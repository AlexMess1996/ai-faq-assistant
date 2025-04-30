import codecs
from typing import List
from fastapi import FastAPI, UploadFile, File, Body
from fastapi.middleware.cors import CORSMiddleware
from app.services.qa_service import QAService

app = FastAPI(title="AI FAQ Assistant")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000","http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
qa = QAService(threshold=0.4)

def chunk_text(text: str, size: int = 500, overlap: int = 50) -> List[str]:
    words = text.split()
    chunks = []
    start = 0
    while start < len(words):
        end = min(start + size, len(words))
        chunk = " ".join(words[start:end])
        chunks.append(chunk)
        start += size - overlap
    return chunks

@app.get("/health")
async def health_check():
    return {"status": "ok"}

@app.post("/upload")
async def upload_document(file: UploadFile = File(...)):
    contents = await file.read()
    # Detect encoding
    if contents.startswith(codecs.BOM_UTF16_LE) or contents.startswith(codecs.BOM_UTF16_BE):
        text = contents.decode('utf-16', errors='ignore')
    elif b'\x00' in contents:
        text = contents.decode('utf-16-le', errors='ignore')
    else:
        text = contents.decode('utf-8', errors='ignore')
    # Chunk and ingest
    chunks = chunk_text(text)
    qa.add_documents(chunks)
    return {"filename": file.filename, "ingested_chunks": len(chunks)}

@app.post("/ask")
async def ask(question: str = Body(..., embed=True)):
    results = qa.query(question)
    if not results:
        return {"answer": [{"text": "Sorry, I don't have an answer to that.", "score": 0.0}]}  
    return {"answer": [{"text": text, "score": score} for text, score in results]}