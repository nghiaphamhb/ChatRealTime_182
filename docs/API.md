# REST API Spec (MVP)

Base URL: /api
Auth: `Authorization: Bearer <JWT>`

## 1) Auth

### POST /auth/register
Request:
```json
{ "username": "dao", "password": "123456", "displayName": "Dao" }
````

Response:

```json
{
  "token": "<jwt>",
  "user": { "id": "uuid", "username": "dao", "displayName": "Dao", "avatarUrl": null }
}
```

### POST /auth/login

Request:

```json
{ "username": "dao", "password": "123456" }
```

Response:

```json
{
  "token": "<jwt>",
  "user": { "id": "uuid", "username": "dao", "displayName": "Dao", "avatarUrl": null }
}
```

### GET /me

Response:

```json
{ "id": "uuid", "username": "dao", "displayName": "Dao", "avatarUrl": null, "lastSeenAt": "2026-01-23T10:00:00Z" }
```

---

## 2) Conversations

### GET /conversations

Response:

```json
[
  {
    "id": "uuid",
    "type": "DM",
    "title": "Dao • An",
    "lastMessage": { "id": "uuid", "content": "ok", "createdAt": "2026-01-23T10:00:00Z" },
    "lastMessageAt": "2026-01-23T10:00:00Z",
    "unreadCount": 3
  }
]
```

### POST /conversations (create DM or GROUP)

Request (DM):

```json
{ "type": "DM", "memberUserIds": ["uuid_of_other_user"] }
```

Request (GROUP):

```json
{ "type": "GROUP", "title": "Team Chat", "memberUserIds": ["u1", "u2", "u3"] }
```

Response:

```json
{ "id": "uuid", "type": "GROUP", "title": "Team Chat", "createdAt": "2026-01-23T10:00:00Z" }
```

### GET /conversations/{id}

Response:

```json
{
  "id": "uuid",
  "type": "GROUP",
  "title": "Team Chat",
  "members": [
    { "userId": "u1", "username": "dao", "displayName": "Dao", "role": "ADMIN" },
    { "userId": "u2", "username": "an",  "displayName": "An",  "role": "MEMBER" }
  ],
  "lastMessageAt": "2026-01-23T10:00:00Z"
}
```

---

## 3) Messages

### GET /conversations/{id}/messages?limit=30&before=<messageId>

Notes:

* If `before` is omitted -> latest messages
* Server returns newest->oldest or oldest->newest; choose one and keep consistent
  Response:

```json
{
  "items": [
    {
      "id": "m1",
      "conversationId": "c1",
      "sender": { "id": "u1", "username": "dao", "displayName": "Dao" },
      "type": "TEXT",
      "content": "Hello",
      "createdAt": "2026-01-23T10:00:00Z"
    }
  ],
  "pageInfo": { "hasMore": true, "nextBefore": "m1" }
}
```

### POST /conversations/{id}/messages (optional fallback)

Request:

```json
{ "type": "TEXT", "content": "Hello", "clientMsgId": "client-uuid" }
```

Response:

```json
{
  "message": {
    "id": "uuid",
    "conversationId": "uuid",
    "senderId": "uuid",
    "type": "TEXT",
    "content": "Hello",
    "createdAt": "2026-01-23T10:00:00Z"
  }
}
```

---

## 4) Read State (Unread)

### POST /conversations/{id}/read

Request:

```json
{ "lastReadMessageId": "uuid" }
```

Response:

```json
{ "ok": true }
```

---

## Common Error Format

```json
{ "error": { "code": "FORBIDDEN", "message": "Not a member of this conversation" } }
```