#!/bin/bash
set -e

IMAGE_TAG=${1:-latest}
REGISTRY=${DOCKER_REGISTRY:-""}

echo "Building Docker image: project-management-backend:${IMAGE_TAG}"
docker build -f docker/Dockerfile.prod -t project-management-backend:${IMAGE_TAG} .

if [ -n "$REGISTRY" ]; then
  echo "Pushing image to registry..."
  docker tag project-management-backend:${IMAGE_TAG} ${REGISTRY}/project-management-backend:${IMAGE_TAG}
  docker push ${REGISTRY}/project-management-backend:${IMAGE_TAG}
fi

echo "Deploying with docker-compose..."
IMAGE_TAG=${IMAGE_TAG} docker-compose -f docker-compose.prod.yml up -d

echo "Deployment complete!"
