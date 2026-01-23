# WebSocket / STOMP Spec (MVP)

## Connect
- WS endpoint: `/ws`
- Client connects using STOMP
- JWT should be included:
  - Preferred: STOMP CONNECT headers: `Authorization: Bearer <JWT>`
  - Alternative: query param `?token=<JWT>` (less ideal)

## Subscriptions (Client SUBSCRIBE)
### 1) Conversation stream
- `/topic/conversations/{conversationId}`

Optional:
### 2) Typing indicator
- `/topic/conversations/{conversationId}/typing`

## App Destinations (Client SEND)
### 1) Send message
- `/app/conversations/{conversationId}/send`

### 2) Update read pointer (optional WS version)
- `/app/conversations/{conversationId}/read`

### 3) Typing (optional)
- `/app/conversations/{conversationId}/typing`

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
````

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

## Client -> Server Send Payloads

### SEND /app/conversations/{id}/send

```json
{ "type": "TEXT", "content": "Hello", "clientMsgId": "client-uuid" }
```

### SEND /app/conversations/{id}/read (optional)

```json
{ "lastReadMessageId": "uuid" }
```

### SEND /app/conversations/{id}/typing (optional)

```json
{ "isTyping": true }
```

---

## Server Rules

* Must validate JWT and attach Principal
* Must verify membership before accepting send/read
* Must persist message before broadcasting
* Should ignore duplicate sends by `clientMsgId` (optional)