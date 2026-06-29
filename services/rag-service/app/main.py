from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import chromadb
from chromadb.utils import embedding_functions
import os

app = FastAPI(title="TW RAG Service")
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])

CHROMA_HOST = os.getenv("CHROMA_HOST", "localhost")
CHROMA_PORT = int(os.getenv("CHROMA_PORT", 8004))

client = chromadb.HttpClient(host=CHROMA_HOST, port=CHROMA_PORT)
ef = embedding_functions.DefaultEmbeddingFunction()
collection = client.get_or_create_collection("tw_plans", embedding_function=ef)


class QueryRequest(BaseModel):
    query: str
    n_results: int = 4

class IngestRequest(BaseModel):
    doc_id: str
    content: str
    metadata: dict = {}


@app.post("/query")
async def query_docs(req: QueryRequest):
    results = collection.query(query_texts=[req.query], n_results=req.n_results)
    docs  = results["documents"][0] if results["documents"] else []
    metas = results["metadatas"][0] if results["metadatas"] else []
    return {"results": [{"content": d, "metadata": m} for d, m in zip(docs, metas)]}

@app.post("/ingest")
async def ingest_doc(req: IngestRequest):
    collection.add(documents=[req.content], ids=[req.doc_id], metadatas=[req.metadata])
    return {"status": "ingested", "doc_id": req.doc_id}

@app.get("/health")
async def health():
    return {"status": "ok", "service": "rag-service"}
