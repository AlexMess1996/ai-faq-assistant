# backend/app/services/qa_service.py
from typing import List, Tuple
import os
import json
import faiss
from sentence_transformers import SentenceTransformer

class QAService:
    INDEX_PATH = os.path.join(os.path.dirname(__file__), "..", "..", "qa_index.idx")
    DOCS_PATH = os.path.join(os.path.dirname(__file__), "..", "..", "documents.json")

    def __init__(self, threshold: float = 0.4):
        self.threshold = threshold
        self.model = SentenceTransformer("all-MiniLM-L6-v2")
        self.dim = self.model.get_sentence_embedding_dimension()
        # Try to load existing index
        if os.path.exists(self.INDEX_PATH) and os.path.exists(self.DOCS_PATH):
            # Load FAISS index
            self.index = faiss.read_index(self.INDEX_PATH)
            # Load documents
            with open(self.DOCS_PATH, "r", encoding="utf-8") as f:
                self.documents = json.load(f)
            # Normalize index vectors for cosine similarity if using IP index
            faiss.normalize_L2(self.index.reconstruct_n(0, self.index.ntotal))
        else:
            # Create a new inner-product index for cosine similarity
            self.index = faiss.IndexFlatIP(self.dim)
            self.documents: List[str] = []

    def add_documents(self, docs: List[str]):
        # Encode and normalize
        embs = self.model.encode(docs, convert_to_numpy=True)
        faiss.normalize_L2(embs)
        # Add to index and persist
        self.index.add(embs)
        self.documents.extend(docs)
        # Save index
        faiss.write_index(self.index, self.INDEX_PATH)
        # Save documents list
        with open(self.DOCS_PATH, "w", encoding="utf-8") as f:
            json.dump(self.documents, f, ensure_ascii=False, indent=2)

    def query(self, question: str, top_k: int = 3) -> List[Tuple[str, float]]:
        if self.index.ntotal == 0:
            return []
        q_emb = self.model.encode([question], convert_to_numpy=True)
        faiss.normalize_L2(q_emb)
        scores, indices = self.index.search(q_emb, top_k)
        results: List[Tuple[str, float]] = []
        for score, idx in zip(scores[0], indices[0]):
            if idx >= 0 and idx < len(self.documents) and score >= self.threshold:
                results.append((self.documents[idx], float(score)))
        return results