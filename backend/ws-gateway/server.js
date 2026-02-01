const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../../.env") });

const express = require("express");
const http = require("http");
const cors = require("cors");
const crypto = require("crypto");
const { Server } = require("socket.io");
const { fetchMe } = require("./apis/javaApi");
const { fetchConversation, isMember } = require("./apis/conversationApi");
const { postMessage } = require("./apis/messageApi");

const PORT = Number(process.env.PORT || 3001);
const CORS_ORIGIN = process.env.CORS_ORIGIN || "*";

const app = express();

app.use(express.json());
app.use(
  cors({
    origin: CORS_ORIGIN,
    credentials: true,
  }),
);

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({
    ok: true,
    service: "ws-gateway",
    ts: new Date().toDateString(),
  });
});

// create http server
const httpServer = http.createServer(app);

// Create Socket.IO server
const io = new Server(httpServer, {
  path: "/ws",
  cors: {
    origin: CORS_ORIGIN,
    credentials: true,
  },
  transports: ["websocket"],
});

// ==== auth middleware ====
io.use(async (socket, next) => {
  try {
    const token = socket.handshake.auth?.token;

    if (!token || typeof token !== "string") {
      return next(new Error("UNAUTHORIZED"));
    }
    const me = await fetchMe(token);

    // Attach principal to socket
    socket.user = {
      id: me.id,
      username: me.username,
      displayName: me.displayName,
      avatarUrl: me.avatarUrl ?? null,
    };

    socket.token = token;

    return next();
  } catch (err) {
    console.log("[auth] reject:", err?.status, err?.detail || err?.message);
    return next(new Error("UNAUTHORIZED"));
  }
});

// connection handler
io.on("connection", (socket) => {
  console.log("[ws] connected:", socket.id);

  socket.on("disconnect", (reason) =>
    console.log("[ws] disconnected:", socket.id, "reason:", reason),
  );

  socket.on("conversations:join", async ({ conversationId } = {}, ack) => {
    try {
      if (!conversationId || typeof conversationId !== "string")
        return ack({
          ok: false,
          error: { code: "BAD_REQUEST", message: "conversationId is required" },
        });

      const conv = await fetchConversation(conversationId, socket.token);

      if (!isMember(conv, socket.user.id))
        return ack({
          ok: false,
          error: {
            code: "FORBIDDEN",
            message: "Not a member of this conversation",
          },
        });

      const room = `conversations:${conversationId}`;
      socket.join(room);

      console.log("[ws] join room:", room, "user:", socket.user.username);
      return ack({ ok: true });
    } catch (err) {
      const status = err?.status;
      if (status === 404)
        return ack({
          ok: false,
          error: { code: "NOT_FOUND", message: "Conversation not found" },
        });
      if (status === 401)
        return ack({
          ok: false,
          error: { code: "UNAUTHORIZED", message: "Invalid token" },
        });
      if (status === 403)
        return ack({
          ok: false,
          error: { code: "FORBIDDEN", message: "Not allowed" },
        });

      console.log("[ws] join error:", err?.status, err?.detail || err?.message);
      return ack({
        ok: false,
        error: { code: "INTERNAL", message: "Join failed" },
      });
    }
  });

  socket.on("messages:send", async (data = {}, ack) => {
    try {
      const { conversationId, type, content, clientMsgId } = data;

      if (!conversationId || typeof conversationId !== "string")
        return ack({
          ok: false,
          error: { code: "BAD_REQUEST", message: "conversationId is required" },
        });

      if (!type || typeof type !== "string")
        return ack({
          ok: false,
          error: { code: "BAD_REQUEST", message: "type is required" },
        });

      if (
        type === "TEXT" &&
        (!content || typeof content !== "string" || !content.trim())
      )
        return ack({
          ok: false,
          error: { code: "BAD_REQUEST", message: "content is required" },
        });

      console.log(
        "[ws] send from",
        socket.user.username,
        "conv",
        conversationId,
      );
      const saved = await postMessage(conversationId, socket.token, {
        type,
        content,
        clientMsgId,
      });
      const message = saved.content;

      // Build envelope
      const envelope = {
        eventId: crypto.randomUUID(),
        type: "MESSAGE_CREATED",
        conversationId,
        ts: new Date().toISOString(),
        payload: { saved },
      };

      // Broadcast to conversation room
      const room = `conversations:${conversationId}`;
      io.to(room).emit("event", envelope);

      return ack({
        ok: true,
        clientMsgId,
        messageId: message.id,
        createdAt: message.createdAt,
      });
    } catch (err) {
      console.log(
        "[ws] messages:send error:",
        err?.status,
        err?.detail || err?.message,
      );
      return ack({
        ok: false,
        error: { code: "INTERNAL", message: "Send failed" },
      });
    }
  });
});

httpServer.listen(PORT, () => {
  console.log(`[http] listening on http://localhost:${PORT}`);
  console.log(`[ws]   socket.io path: /ws`);
  console.log(`[cors] origin: ${CORS_ORIGIN}`);
});
