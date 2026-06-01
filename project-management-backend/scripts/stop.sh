#!/bin/bash
set -e

echo "Stopping Project Management Backend..."
docker-compose -f docker-compose.dev.yml down
echo "Application stopped."
