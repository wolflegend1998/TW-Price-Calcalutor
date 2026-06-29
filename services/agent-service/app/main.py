"""
Agent Service — Claude-powered assistant that answers staff questions
about TW plans using RAG context from real plan data.
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
import httpx, os, anthropic

app = FastAPI(title="TW Agent Service")
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])

client = anthropic.Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))
RAG_URL     = os.getenv("RAG_SERVICE_URL", "http://localhost:8001")
PRICING_URL = os.getenv("PRICING_SERVICE_URL", "http://localhost:8003")


class ChatRequest(BaseModel):
    message: str
    number_of_lines: str = "1"
    device_type: str = "smartphone"
    auto_pay: bool = False
    home_internet: bool = False
    conversation_history: list = []


async def get_rag_context(query: str) -> str:
    async with httpx.AsyncClient() as c:
        r = await c.post(f"{RAG_URL}/query", json={"query": query, "n_results": 4})
        chunks = [x["content"] for x in r.json().get("results", [])]
    return "\n\n".join(chunks) if chunks else ""


@app.post("/chat")
async def chat(req: ChatRequest):
    context = await get_rag_context(req.message)

    system = f"""You are a helpful assistant for Total Wireless store staff helping them quote deals to customers.
Use the plan information below to give accurate, specific answers about pricing and features.
Always be concise and sales-friendly. Mention AutoPay savings and the 5-year price guarantee when relevant.

CURRENT TW PLANS & PRICING:
{context}

Customer context for this conversation:
- Lines: {req.number_of_lines}
- Device type: {req.device_type}
- AutoPay: {"Yes" if req.auto_pay else "No"}
- Home Internet add-on: {"Yes" if req.home_internet else "No"}
"""

    messages = req.conversation_history + [{"role": "user", "content": req.message}]
    resp = client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=1024,
        system=system,
        messages=messages
    )
    return {"reply": resp.content[0].text}


@app.get("/health")
async def health():
    return {"status": "ok", "service": "agent-service"}
