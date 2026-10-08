from typing import List
import hashlib
import math

_embedding_model = None

def get_embedding_model():
    global _embedding_model
    if _embedding_model is None:
        try:
            from fastembed import TextEmbedding
            _embedding_model = TextEmbedding(model_name="sentence-transformers/all-MiniLM-L6-v2")
        except Exception as e:
            print(f"Warning: FastEmbed initialization fallback: {e}")
            _embedding_model = None
    return _embedding_model


def _fallback_embedding(text: str, dim: int = 384) -> List[float]:
    """Deterministic, normalized pseudo-semantic vector generator for offline fallback."""
    vec = [0.0] * dim
    words = text.lower().split()
    if not words:
        return vec

    for i, word in enumerate(words):
        # hash word to multiple buckets
        h = int(hashlib.md5(word.encode('utf-8')).hexdigest(), 16)
        idx = h % dim
        vec[idx] += 1.0 / (math.log(i + 2))

    # Normalize
    norm = math.sqrt(sum(x * x for x in vec))
    if norm > 0:
        vec = [x / norm for x in vec]
    return vec


def generate_embedding(text: str) -> List[float]:
    """
    Generate a 384-dimensional embedding for the given text using fastembed (all-MiniLM-L6-v2).
    """
    clean_text = (text or "").strip()
    if not clean_text:
        return [0.0] * 384

    model = get_embedding_model()
    if model is not None:
        try:
            embeddings = list(model.embed([clean_text]))
            return embeddings[0].tolist()
        except Exception as e:
            print(f"Embedding computation error, using fallback: {e}")

    return _fallback_embedding(clean_text)

def chunk_and_embed_text(text: str, chunk_size: int = 1000, overlap: int = 200) -> List[dict]:
    """
    Splits text into overlapping chunks and generates embeddings for each.
    """
    if not text:
        return []
        
    chunks = []
    start = 0
    while start < len(text):
        end = min(start + chunk_size, len(text))
        chunk_text = text[start:end]
        
        chunks.append({
            "text": chunk_text,
            "embedding": generate_embedding(chunk_text)
        })
        
        if end == len(text):
            break
        start += (chunk_size - overlap)
        
    return chunks
