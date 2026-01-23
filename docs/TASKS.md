# 7-Day Plan (Team of 2: FE + BE)

## Day 1 — Project bootstrap
BE:
- Init Spring Boot project (Web, Security, WebSocket, JPA, Flyway)
- Add docker-compose (Postgres)
- Implement /health
- Create DB migrations V1 (users, conversations, members, messages)

FE:
- Init React Vite project
- Add MUI + routing skeleton
- Create pages: Login, Register, ChatLayout
- Create HTTP client wrapper (baseURL + token)

Shared:
- Decide naming conventions, env vars, repo structure
- Put docs/* into repo

Deliverable:
- `docker-compose up` + FE runs + BE runs

---

## Day 2 — Auth end-to-end
BE:
- Register/Login endpoints (JWT)
- Spring Security config + password hashing (BCrypt)
- GET /api/me

FE:
- Login/Register forms with MUI
- Save token + fetch /me
- Guarded routes (require auth)

Deliverable:
- User can register/login and reach ChatLayout

---

## Day 3 — Conversations (sidebar)
BE:
- GET /api/conversations (for current user)
- POST /api/conversations (create DM/GROUP)
- GET /api/conversations/{id} (members)

FE:
- Sidebar conversation list
- Create DM (input username) or create group (title + members)
- Select conversation -> route /c/{id}

Deliverable:
- Sidebar shows rooms; can create room

---

## Day 4 — Message history (REST)
BE:
- GET /api/conversations/{id}/messages (pagination)
- Authorization: must be member

FE:
- Chat panel loads last 30 messages
- Infinite scroll / load more button (before=)
- Message bubble UI (left/right)

Deliverable:
- History loads reliably, pagination works

---

## Day 5 — Realtime messaging (WebSocket/STOMP)
BE:
- WS endpoint /ws
- STOMP send handler /app/conversations/{id}/send
- Broadcast to /topic/conversations/{id}
- Persist then broadcast

FE:
- Connect STOMP with JWT
- Subscribe /topic/conversations/{id}
- Send messages with optimistic UI + reconcile on server ack/event

Deliverable:
- Two tabs chat realtime in same room

---

## Day 6 — Unread + polish
BE:
- conversation_members.last_read_message_id logic
- POST /api/conversations/{id}/read
- unreadCount in GET /api/conversations

FE:
- Unread badge on sidebar
- Mark as read when opening room / after scrolling bottom
- UI polish: typing indicator optional, time format, empty states

Deliverable:
- Unread works in basic way

---

## Day 7 — Stabilize + demo + deploy
BE:
- Error handling + validation
- CORS config for FE domain
- Seed data for demo
- Dockerize (optional)

FE:
- Final UI pass + bug fixes
- README screenshots + demo steps
- Deploy FE + BE (optional)

Deliverable:
- Demo script:
  1) Register 2 users
  2) Create DM
  3) Send realtime messages
  4) Refresh shows history
  5) Unread badge behavior
