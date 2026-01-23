# Architecture — Realtime Chat Web App

## High-level Components
- Frontend (React):
  - Auth pages (Login/Register)
  - Main layout (Sidebar conversations + Chat panel)
  - HTTP client for REST (token-based)
  - WebSocket/STOMP client for realtime events

- Backend (Spring Boot):
  - REST API for auth, conversations, history, read state
  - WebSocket/STOMP endpoints for realtime send/receive
  - PostgreSQL for persistence
  - Flyway for DB migrations
  - Security: JWT auth for REST + WS handshake

## Data Model (MVP)
- users
- conversations (DM / GROUP)
- conversation_members (membership + last_read_message_id)
- messages

## Request Flows

### 1) Login (REST)
1. FE POST /api/auth/login (username/password)
2. BE verifies, returns JWT
3. FE stores JWT (memory + localStorage optional)
4. FE uses JWT for all REST + WS connect

### 2) Load sidebar conversations (REST)
1. FE GET /api/conversations
2. BE returns list sorted by last_message_at and unreadCount
3. FE renders sidebar

### 3) Open conversation (REST + WS)
1. FE GET /api/conversations/{id} (members + metadata)
2. FE GET /api/conversations/{id}/messages?limit=30
3. FE connects WebSocket and SUBSCRIBE /topic/conversations/{id}
4. FE renders history + listens for realtime events

### 4) Send message (WS)
1. FE SEND /app/conversations/{id}/send payload {content, clientMsgId}
2. BE validates:
   - JWT valid
   - user is a member of conversation
3. BE persists message in DB
4. BE updates conversations.last_message_at
5. BE broadcasts event to /topic/conversations/{id}
6. All subscribers update UI immediately

### 5) Update read pointer (REST or WS)
- Option A (REST): FE POST /api/conversations/{id}/read {lastReadMessageId}
- Option B (WS): FE SEND /app/conversations/{id}/read
BE updates conversation_members.last_read_message_id

## Realtime Transport
- WebSocket with STOMP
- Topics:
  - /topic/conversations/{id} (message created/edited/deleted)
  - optional /topic/conversations/{id}/typing
- App destinations:
  - /app/conversations/{id}/send
  - optional /app/conversations/{id}/typing
  - optional /app/conversations/{id}/read

## Security Notes
- REST: Authorization: Bearer <JWT>
- WebSocket:
  - JWT passed during CONNECT (header) or query param
  - Server authenticates and attaches Principal
- Authorization:
  - On send/read: verify membership in conversation_members

## Deployment (later)
- FE: static hosting (Vercel/Netlify)
- BE: Render/VPS/Docker
- DB: managed Postgres
