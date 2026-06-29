# TW Price Calculator — Agentic AI Microservices Platform

An AI-powered deal quoting tool for Total Wireless store staff, built on top of the existing React/TypeScript price calculator and deployed on Google Kubernetes Engine.

## Architecture

```
React/TypeScript Frontend  (CRA + Tailwind)
           │
    API Gateway  :8000  (FastAPI)
           │
  ┌────────┼──────────────┐
  │        │              │
RAG      Agent        Pricing
Service  Service      Service
:8001    :8002        :8003
  │        │              │
ChromaDB  Claude       In-memory
          Sonnet       (pricing.json)
```

## Services

| Service | Port | Description |
|---------|------|-------------|
| React Frontend | 3000 | Price Calculator + AI Chat tabs |
| API Gateway | 8000 | Single entry point, routes to all services |
| RAG Service | 8001 | ChromaDB vector store for TW plan docs |
| Agent Service | 8002 | Claude Sonnet — AI deal recommendations |
| Pricing Service | 8003 | Mirrors pricing.json — all plan/fee logic |

## Plans Supported

- **Total MAX 5G BYO** — $30/line flat
- **Total STARTER** — $25–$40/line (scales with lines)
- **Total MAX 5G** — $27.50–$55/line
- **Total ALL ACCESS** — $30–$65/line

All plans include: AutoPay $5 off/line, $29.99 processing fee, optional 8% taxes.

## Quick Start (Local)

```bash
# 1. Clone and configure
cp .env.example .env
# Add your ANTHROPIC_API_KEY to .env

# 2. Start all backend services
docker-compose up --build

# 3. Seed plan docs into ChromaDB
python scripts/seed_docs.py

# 4. Start React frontend (separate terminal)
npm install
npm start
# → http://localhost:3000
```

## Deploy to GKE

```bash
# Set your GCP project
export GCP_PROJECT_ID=your-project-id
export GKE_CLUSTER=tw-calculator-cluster
export GCP_REGION=us-central1

# Create the secret (one-time)
kubectl create secret generic tw-secrets \
  --from-literal=anthropic-api-key=$ANTHROPIC_API_KEY \
  -n tw-calculator

# Build, push, deploy
./scripts/deploy.sh
```

## GitHub Actions Secrets Required

| Secret | Value |
|--------|-------|
| `GCP_SA_KEY` | GCP service account JSON |
| `GCP_PROJECT_ID` | Your GCP project ID |
| `GKE_CLUSTER` | Cluster name |
| `GCP_REGION` | e.g. `us-central1` |

## Adding New Promo Docs

Drop a `.txt` file in `services/rag-service/data/docs/` and re-run:
```bash
python scripts/seed_docs.py
```
No redeployment needed — ChromaDB updates immediately.

## Resume Bullet Points

- Built an AI-driven microservices application on Google Kubernetes Engine for real-time wireless deal quoting
- Implemented Retrieval-Augmented Generation (RAG) workflows using ChromaDB to surface live Total Wireless plan data
- Developed a Claude Sonnet-powered agent service that recommends optimal plans based on customer needs
- Containerized four Python FastAPI microservices with Docker and orchestrated via GKE with HPA autoscaling
- Extended existing React/TypeScript calculator with AI chat panel and CI/CD via GitHub Actions
