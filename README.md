# 💬 Realtime Chat Web App

A simple **realtime chat web application** built with **React (frontend)** and **Java Spring Boot (backend)** using **WebSocket + STOMP**.

---

## 🚀 Features (MVP)
- User authentication (JWT)
- Direct & group conversations
- Message history (pagination)
- Realtime messaging via WebSocket
- Basic unread message tracking

---

## 🧱 Tech Stack
- **Frontend:** React (Vite), MUI, STOMP client
- **Backend:** Java 17, Spring Boot, Spring Security, WebSocket
- **Database:** PostgreSQL
- **Infra:** Docker, REST + WebSocket


---

## ▶️ Run Locally
```bash
docker-compose up -d
cd backend && ./mvnw spring-boot:run
cd frontend && npm install && npm run dev
````

---

## 🔐 Env

**Backend**

```
DB_URL=jdbc:postgresql://localhost:5432/chat
JWT_SECRET=secret
```

**Frontend**

```
VITE_API_BASE=http://localhost:8080/api
VITE_WS_BASE=http://localhost:8080/ws
```

---

## 🎯 Goal

Practice **REST + WebSocket realtime systems** in a small team within **1 week**.
