# AI FAQ Assistant

An interactive web application that lets users upload documents and ask questions about them using AI-powered semantic search.

---

## 🔍 Features

- **Document Ingestion**: Upload text or PDF files for processing.
- **Semantic Search**: Uses SentenceTransformer embeddings and FAISS index to find relevant text chunks.
- **Chunking & Persistence**: Automatically splits large documents into overlapping chunks and persists the index across restarts.
- **Adaptive Threshold**: Configurable similarity threshold to control result relevance.
- **Fallback Handling**: Returns a friendly message when no relevant content is found.
- **Professional UI**: Built with React, MUI (Material-UI), and Framer Motion for a polished user experience.

---

## 🛠 Tech Stack

- **Backend**: Python, FastAPI, Uvicorn, FAISS, SentenceTransformers  
- **Frontend**: React, TypeScript, MUI (Material-UI), Framer Motion  
- **Persistence**: FAISS index and document list saved to disk (`qa_index.idx`, `documents.json`)  
- **DevOps**: Docker Compose for easy development and deployment  

---

## 🚀 Getting Started

### Prerequisites

- Python 3.8+  
- Node.js 16+  
- Docker & Docker Compose (optional)  


## Backend Setup
```
cd backend
python -m venv .venv

# Activate venv
# Windows:
.\\.venv\\Scripts\\activate

# macOS/Linux:
# source .venv/bin/activate

pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```
---
# Frontend Setup
```
cd frontend
npm install
npm run dev
```
---

 - **Frontend running at:  http://localhost:3000**

- **Backend running at http://localhost:8000**
---
# 📂 Project Structure
```ai-faq-assistant/
├── backend/
│   ├── app/
│   │   ├── main.py                # FastAPI entrypoint
│   │   └── services/qa_service.py # Embedding & FAISS logic
│   ├── .venv/                     # Python virtual environment
│   └── requirements.txt           # Python dependencies
├── frontend/
│   ├── src/
│   │   ├── App.tsx                # Main React component
│   │   ├── components/            # UploadForm, Chat components
│   │   └── main.tsx               # ReactDOM bootstrap
│   ├── package.json               # Node dependencies & scripts
│   └── index.css                  # Global styles
├── .gitignore                     # Ignored files
├── docker-compose.yml             # Dev container orchestration
└── README.md                      # Project documentation
```
---

# 💡 Usage

1. Upload a document via the "Upload Document" panel.

2. Ingested chunks count appears once processing completes.

3. Ask questions in the "Ask the Assistant" panel.

4. Results appear with a similarity score for transparency.
---
# ⚠️ Model Behavior
* **Retrieval-Only:** The backend uses embeddings + FAISS to retrieve text chunks most similar to your query—it does not generate summaries or new content.

* **Exact-Match Sensitivity:** With a small corpus, off-topic questions can still return content because FAISS will always find the “nearest” vector. Use the similarity threshold to filter out irrelevant results.

* **Threshold Tuning:** You can adjust the threshold in app/services/qa_service.py to control how “strict” the matching is. Higher values require closer semantic alignment; lower values return more results but may include false positives.

* **Transient Index:** By default, the index is stored on disk (qa_index.idx) and reloaded on startup, but documents.json is ignored via .gitignore. Ensure you back up these files if you need permanent persistence.
---


# 🤝 Contributing
1. Fork the repository

2. Create a feature branch (git checkout -b feature/name)

3. Commit your changes (git commit -m "feat: ...")

4. Push to the branch (git push origin feature/name)

5. Open a Pull Request

6. Please follow existing coding style and include tests for new functionality.

---


© 2025 Alexandros Messaritakis. All rights reserved.