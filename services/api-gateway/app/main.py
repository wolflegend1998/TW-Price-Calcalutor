from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
import httpx, os

app = FastAPI(title="TW API Gateway")
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])

RAG_URL     = os.getenv("RAG_SERVICE_URL",     "http://localhost:8001")
AGENT_URL   = os.getenv("AGENT_SERVICE_URL",   "http://localhost:8002")
PRICING_URL = os.getenv("PRICING_SERVICE_URL", "http://localhost:8003")


class ChatRequest(BaseModel):
    message: str
    number_of_lines: str = "1"
    device_type: str = "smartphone"
    auto_pay: bool = False
    home_internet: bool = False
    conversation_history: list = []

class QuoteRequest(BaseModel):
    plan: str
    device_type: str = "smartphone"
    number_of_lines: str = "1"
    home_internet: bool = False
    auto_pay: bool = False
    include_taxes: bool = True


@app.post("/api/chat")
async def chat(req: ChatRequest):
    async with httpx.AsyncClient(timeout=30) as c:
        r = await c.post(f"{AGENT_URL}/chat", json=req.model_dump())
        return r.json()

@app.get("/api/plans")
async def plans():
    async with httpx.AsyncClient() as c:
        r = await c.get(f"{PRICING_URL}/plans")
        return r.json()

@app.post("/api/quote")
async def quote(req: QuoteRequest):
    async with httpx.AsyncClient() as c:
        r = await c.post(f"{PRICING_URL}/quote", json=req.model_dump())
        return r.json()

@app.get("/api/health")
async def health():
    statuses = {}
    async with httpx.AsyncClient(timeout=5) as c:
        for name, url in [("rag", RAG_URL), ("agent", AGENT_URL), ("pricing", PRICING_URL)]:
            try:
                statuses[name] = (await c.get(f"{url}/health")).json()
            except:
                statuses[name] = {"status": "unreachable"}
    return {"gateway": "ok", "services": statuses}
