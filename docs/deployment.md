# Deployment Guide

## Clone Repository

git clone https://github.com/Ayush-Iyer1611/BZR-Pitwall-System.git

cd BZR-Pitwall-System

---

## Frontend

npm install

npm run dev

Frontend URL:

http://localhost:5173

---

## Backend

python3 -m venv .venv

source .venv/bin/activate

pip install fastapi uvicorn pandas

cd backend

uvicorn app:app --reload

Backend URL:

http://127.0.0.1:8000

Swagger Docs:

http://127.0.0.1:8000/docs

---

## Mock Dataset

The current development build uses a generated telemetry dataset containing 5000 samples.

The dataset is intended for testing replay functionality before integration with real vehicle telemetry.
