#!/bin/bash
# Start script for Docker container

# Start Ollama service
ollama serve &
sleep 3

# Download default model if not present
ollama pull phi3:mini || true

# Start the application
cd /app
npm run tauri dev
