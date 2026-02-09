# 💬 Realtime Chat Web App

A simple **realtime chat web application** built with **React (frontend)** and **Java Spring Boot (backend)** using **Socket.io**, which was implemented by microservice in **NodeJS**.

---

## 🚀 Features (MVP)

- User authentication (JWT)
- Direct & group conversations
- Message history (pagination)
- Realtime messaging via WebSocket
- Basic unread message tracking

---

## 🧱 Tech Stack

- **Frontend:** React (Vite), MUI
- **Backend:** Java 21, Spring Boot, Spring Security, WebSocket
- **Microservice**: Socket.io, NodeJS
- **Database:** MongoDB
- **Infra:** Docker, REST + WebSocket

---

## ▶️ Run Locally

```bash
cd backend/WebChat && ./gradlew.bat bootRun
cd backend/ws-gateway && npm install && npm run dev
cd frontend && npm install && npm run dev
```

---

## 🔐 Env

File .env will be placed in root directory.

```
JWT_PRIVATE_KEY=...
JWT_EXPIRATION_SECONDS=...
MONGODB_URI=...
PORT=...
CORS_ORIGIN=...
JAVA_BASE_URL=...
```


---

## 🎯 Goal

Practice **REST + WebSocket realtime systems** in a small team within **1 week**.
