import codecs
from fastapi import FastAPI, UploadFile, File, Body
from fastapi.middleware.cors import CORSMiddleware
from app.services.qa_service import QAService

app = FastAPI(title="AI FAQ Assistant")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Instantiate the QA service
qa = QAService()

@app.get("/health")
async def health_check():
    return {"status": "ok"}

@app.post("/upload")
async def upload_document(file: UploadFile = File(...)):
    contents = await file.read()
    # detect UTF-16 vs UTF-8
    if contents.startswith(codecs.BOM_UTF16_LE) or contents.startswith(codecs.BOM_UTF16_BE):
    # Has a BOM, decode generically as UTF-16
     text = contents.decode('utf-16', errors='ignore')
    elif b'\x00' in contents:
    # no BOM but null‐bytes present → assume little-endian UTF-16
        text = contents.decode('utf-16-le', errors='ignore')
    else:
    # otherwise fall back to UTF-8
     text = contents.decode('utf-8', errors='ignore')
     
    qa.add_documents([text])
    return {"filename": file.filename, "ingested": True}

@app.post("/ask")
async def ask(question: str = Body(..., embed=True)):
    results = qa.query(question)
    if not results:
       return {"answer": ["Sorry, I dont have an answer to that."]}
    return {"answer": results}
