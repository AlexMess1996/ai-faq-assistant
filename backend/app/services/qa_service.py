# backend/app/services/qa_service.py
from typing import List
import faiss
from sentence_transformers import SentenceTransformer
import numpy as np

class QAService:
    def __init__(self, threshold: float = 0.2):
        # Load your embedding model
        self.model = SentenceTransformer("all-MiniLM-L6-v2")
        self.dim = self.model.get_sentence_embedding_dimension()
        # Use an Inner-Product (IP) index for cosine similarity
        self.index = faiss.IndexFlatIP(self.dim)
        self.documents: List[str] = []
        self.threshold = threshold

    def add_documents(self, docs: List[str]):
        # 1) Encode to numpy
        embs = self.model.encode(docs, convert_to_numpy=True)
        # 2) Normalize so that IP == cosine similarity
        faiss.normalize_L2(embs)
        # 3) Add to index & keep raw text
        self.index.add(embs)
        self.documents.extend(docs)

    def query(self, question: str, top_k: int = 3) -> List[str]:
        if self.index.ntotal == 0:
            return []

        # 1) Embed & normalize the question
        q_emb = self.model.encode([question], convert_to_numpy=True)
        faiss.normalize_L2(q_emb)

        # 2) Search for top_k most similar
        scores, indices = self.index.search(q_emb, top_k)

        # 3) Only return docs with similarity ≥ threshold
        results: List[str] = []
        for score, idx in zip(scores[0], indices[0]):
            if idx >= 0 and score >= self.threshold:
                results.append(self.documents[idx])
        return results
