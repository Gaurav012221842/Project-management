#!/bin/bash
set -e

echo "Starting Project Management Backend..."

if [ -f .env ]; then
  export $(grep -v '^#' .env | xargs)
fi

docker-compose -f docker-compose.dev.yml up -d

echo "Application started on http://localhost:${APP_PORT:-9989}"
echo "Swagger UI: http://localhost:${APP_PORT:-9989}/swagger-ui.html"
