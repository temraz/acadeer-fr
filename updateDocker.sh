#!/bin/bash

echo "🛑 Stopping container..."
docker stop subte-frontend || true

echo "🗑️ Removing container..."
docker rm subte-frontend || true

echo "🏗️ Building new image..."
docker build -t subte-frontend .

echo "🚀 Starting new container..."
docker run -d -p 3000:3000 --name subte-frontend subte-frontend

echo "✅ Done! Application is running at http://localhost:3000" 