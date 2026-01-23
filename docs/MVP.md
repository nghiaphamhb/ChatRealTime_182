# MVP — Realtime Chat Web App (1 week)

## Goal
Build a working realtime chat web app for 2 users (React FE + Java/Spring Boot BE) with:
- Auth (JWT)
- Conversation list (DM + GROUP)
- Message history (pagination)
- Realtime messaging (WebSocket + STOMP)
- Basic unread tracking (last_read)

## Must-have Features (Week 1)
### Authentication
- Register
- Login -> returns JWT
- Get current user (/api/me)

### Conversations
- List conversations for current user (sorted by last_message_at desc)
- Create conversation:
  - DM: by target username/userId
  - GROUP: by title + members
- Get conversation detail (members + metadata)

### Messages
- Load history (pagination):
  - `GET /api/conversations/{id}/messages?limit=30&before=<messageId>`
- Send message:
  - Primary: via WebSocket
  - Fallback (optional): REST POST
- Soft delete (optional): week 2

### Realtime
- Subscribe room topic -> receive new messages instantly
- Send message -> server validates membership -> persists -> broadcasts

### Unread (simple)
- Track last read message per user per conversation:
  - `conversation_members.last_read_message_id`
- Endpoint to update read pointer:
  - `POST /api/conversations/{id}/read`

## Out of Scope (NOT in week 1)
- File upload / attachments
- Voice/video calls
- End-to-end encryption
- Full-text message search
- Reactions, pins, threads
- Multi-device session management / refresh tokens (optional)
- Admin moderation

## Definition of Done (DoD)
- Two browser tabs with two accounts can:
  - Login
  - See conversation list
  - Open a conversation
  - Load message history
  - Send message and receive in realtime
  - Refresh page and still see history
  - Unread badge decreases after opening room (basic)

## Tech Stack
- FE: React (Vite), MUI, STOMP client, React Router
- BE: Spring Boot, Spring Security, WebSocket + STOMP, JPA, PostgreSQL, Flyway
- Local infra: docker-compose for Postgres
