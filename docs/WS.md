# WS.md — Socket.IO Spec (MVP)

## Connect

* WS endpoint (Socket.IO server):

  * Path: `/ws`
  * Example URL: `http(s)://<host>:<port>/ws`
* Client connects using **Socket.IO**.

### Auth (JWT)

JWT must be provided at connect time.

Preferred:

* Socket.IO handshake `auth`:

  * `auth: { token: "<JWT>" }`

Alternative (less ideal):

* Query param: `?token=<JWT>`

---

## Rooms (replaces STOMP topics)

Client “subscribes” by joining rooms.

### 1) Conversation stream room

* Room: `conversations:{conversationId}`

Optional:

### 2) Typing room

* Room: `conversations:{conversationId}:typing`

> (Optional) You may also reuse the main room and differentiate by event type.

---

## Client → Server Events (replaces STOMP /app destinations)

### 1) Join conversation stream

Event: `conversations:join`

Payload:

```json
{ "conversationId": "uuid" }
```

Ack (recommended):

```json
{ "ok": true }
```

Error ack:

```json
{ "ok": false, "error": { "code": "FORBIDDEN", "message": "Not a member of this conversation" } }
```

### 2) Leave conversation stream (optional)

Event: `conversations:leave`

Payload:

```json
{ "conversationId": "uuid" }
```

Ack:

```json
{ "ok": true }
```

---

### 3) Send message

Event: `messages:send`

Payload:

```json
{ "conversationId": "uuid", "type": "TEXT", "content": "Hello", "clientMsgId": "client-uuid" }
```

Ack success (recommended):

```json
{ "ok": true, "clientMsgId": "client-uuid", "messageId": "uuid", "createdAt": "2026-01-23T10:00:00Z" }
```

Ack error:

```json
{ "ok": false, "error": { "code": "BAD_REQUEST", "message": "content is required" } }
```

---

### 4) Update read pointer (optional WS version)

Event: `read:update`

Payload:

```json
{ "conversationId": "uuid", "lastReadMessageId": "uuid" }
```

Ack:

```json
{ "ok": true }
```

---

### 5) Typing (optional)

Event: `typing:set`

Payload:

```json
{ "conversationId": "uuid", "isTyping": true }
```

Ack:

```json
{ "ok": true }
```

---

## Server → Client Events

### `event` (recommended unified stream)

All server broadcasts use a single event name `event`, and clients handle by envelope `type`.

Broadcast target:

* Room: `conversations:{conversationId}`

Example:

```js
socket.on("event", (envelope) => { ... });
```

Optional:

* `typing` can be broadcast to:

  * `conversations:{conversationId}` (same room, simpler)
  * or `conversations:{conversationId}:typing` (separate room)

---

## Event Envelope (recommended)

All server broadcasts use this envelope so FE can handle uniformly.

```json
{
  "eventId": "uuid",
  "type": "MESSAGE_CREATED",
  "conversationId": "uuid",
  "ts": "2026-01-23T10:00:00Z",
  "payload": {}
}
```

---

## Event Types (MVP)

### MESSAGE_CREATED

Payload:

```json
{
  "message": {
    "id": "uuid",
    "conversationId": "uuid",
    "sender": { "id": "u1", "username": "dao", "displayName": "Dao" },
    "type": "TEXT",
    "content": "Hello",
    "createdAt": "2026-01-23T10:00:00Z",
    "clientMsgId": "client-uuid"
  }
}
```

### READ_UPDATED (optional)

Payload:

```json
{
  "userId": "uuid",
  "lastReadMessageId": "uuid"
}
```

### TYPING (optional)

Payload:

```json
{
  "userId": "uuid",
  "isTyping": true
}
```

---

## Server Rules

* Must validate JWT and attach Principal
* Must verify membership before allowing:

  * `conversations:join`
  * `messages:send`
  * `read:update`
  * `typing:set`
* Must persist message before broadcasting `MESSAGE_CREATED`

  * Persistence SHOULD be done via Java REST:

    * `POST /api/conversations/{id}/messages`
* Should ignore duplicate sends by `clientMsgId` (optional)

  * Recommended: enforce idempotency at Java layer (unique constraint per sender+conversation+clientMsgId)

---

## Reliability Notes (MVP)

* WebSocket delivery is not guaranteed.
* Client SHOULD fetch missed messages via REST on reconnect:

  * `GET /api/conversations/{id}/messages?limit=30&before=<messageId>`

---

## Minimal Client Example (React)

```js
import { io } from "socket.io-client";

const socket = io("http://localhost:3001", {
  path: "/ws",
  transports: ["websocket"],
  auth: { token: localStorage.getItem("token") },
});

socket.emit("conversations:join", { conversationId: "c1" }, (ack) => {
  if (!ack?.ok) console.error(ack?.error);
});

socket.on("event", (env) => {
  if (env.type === "MESSAGE_CREATED") {
    // update UI
  }
});

socket.emit(
  "messages:send",
  { conversationId: "c1", type: "TEXT", content: "Hello", clientMsgId: crypto.randomUUID() },
  (ack) => {
    if (!ack?.ok) console.error(ack?.error);
  }
);
```