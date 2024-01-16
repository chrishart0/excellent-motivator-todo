# Base stage for production
FROM python:3.11-slim AS base

WORKDIR /app/backend
COPY . /app/backend

RUN apt-get update && apt-get install -y \
    postgresql-client \
    && rm -rf /var/lib/apt/lists/*

RUN pip install --no-cache-dir -r requirements.txt

EXPOSE 8010
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8010"]

# Development stage builds on the base stage to be used with VScode devcontainer
FROM base AS development

# Install development dependencies, tools, etc.
# RUN pip install --no-cache-dir -r requirements-dev.txt
RUN apt-get update && apt-get install -y \
    curl \
    make \
    && rm -rf /var/lib/apt/lists/*

# Override CMD for development to enable hot reload
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8010", "--reload"]
