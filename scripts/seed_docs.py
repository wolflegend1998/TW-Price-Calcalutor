"""
Seed Total Wireless plan docs into the RAG vector store.
Run once after starting services: python scripts/seed_docs.py
"""
import httpx, os, glob

RAG_URL  = os.getenv("RAG_SERVICE_URL", "http://localhost:8001")
DOCS_DIR = os.path.join(os.path.dirname(__file__), "../services/rag-service/data/docs")


def chunk_text(text: str, words_per_chunk: int = 80) -> list[str]:
    words  = text.split()
    return [" ".join(words[i:i+words_per_chunk]) for i in range(0, len(words), words_per_chunk)]


def seed():
    for filepath in glob.glob(f"{DOCS_DIR}/*.txt"):
        name   = os.path.basename(filepath)
        text   = open(filepath).read()
        chunks = chunk_text(text)
        print(f"Ingesting {name} ({len(chunks)} chunks)...")
        for i, chunk in enumerate(chunks):
            r = httpx.post(f"{RAG_URL}/ingest", json={
                "doc_id": f"{name}_chunk_{i}",
                "content": chunk,
                "metadata": {"source": name, "chunk": i}
            })
            print(f"  {'✓' if r.status_code == 200 else '✗'} chunk_{i}")
    print("Done.")

if __name__ == "__main__":
    seed()
