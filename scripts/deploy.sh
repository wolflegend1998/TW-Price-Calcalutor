#!/bin/bash
set -e
PROJECT_ID=${GCP_PROJECT_ID:-"your-project-id"}
REGION=${GCP_REGION:-"us-central1"}
CLUSTER=${GKE_CLUSTER:-"tw-calculator-cluster"}

gcloud auth configure-docker

for SERVICE in rag-service agent-service pricing-service api-gateway; do
  docker build -t "gcr.io/$PROJECT_ID/$SERVICE:latest" "./services/$SERVICE"
  docker push "gcr.io/$PROJECT_ID/$SERVICE:latest"
done

gcloud container clusters get-credentials "$CLUSTER" --region "$REGION" --project "$PROJECT_ID"
kubectl apply -f k8s/
kubectl get pods -n tw-calculator
