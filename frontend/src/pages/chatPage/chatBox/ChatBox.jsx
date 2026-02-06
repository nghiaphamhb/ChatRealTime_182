import {
  Avatar,
  Box,
  Divider,
  IconButton,
  Stack,
  TextField,
  Typography,
  CircularProgress,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { useEffect, useRef, useState } from "react";
import MessageBubble from "./MessageBubble";

export default function ChatBox({ activeConv, socket }) {
  const [chatInfo, setChatInfo] = useState(null);
  const [messages, setMessages] = useState([]);
  // const [pageInfo, setPageInfo] = useState({ hasMore: false, nextBefore: null });

  const [loading, setLoading] = useState(true);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);

  const endRef = useRef(null);

  const scrollToEnd = (behavior = "smooth") => {
    endRef.current?.scrollIntoView({ behavior, block: "end" });
  };

  const handleSend = () => {
    const content = text.trim();
    if (!content || sending || !socket || !activeConv) return;

    if (!socket.connected) {
      console.log("socket not connected yet");
      return;
    }

    setSending(true);

    // console.log("sending", { activeConv, connected: socket?.connected });
    socket.emit(
      "messages:send",
      {
        conversationId: activeConv,
        type: "TEXT",
        content,
        clientMsgId: crypto.randomUUID(),
      },
      (ack) => {
        setSending(false);
        if (!ack?.ok) {
          console.log("send failed:", ack?.error);
          return;
        }
        setText("");
      },
    );
  };

  // call REST API to show box info
  useEffect(() => {
    const getChatBoxInfo = async (token) => {
      const res = await fetch(`/api/conversations/${activeConv}`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();

      const newChatInfo = {
        title: data?.title,
        lastMsgAt: data?.lastMessageAt,
        type: data?.type,
        numberMem: data?.members?.length ?? 0,
      };
      setChatInfo(newChatInfo);
    };

    const getListOfMessages = async (token, mineId) => {
      const res = await fetch(
        `/api/conversations/${activeConv}/messages?limit=30`,
        {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      const data = await res.json();

      const items = (data?.items ?? []).map((i) => ({
        ...i,
        isMine: mineId === i.sender?.id,
      }));
      // console.log(items[0]);

      setMessages(items.reverse());
      setText("");
    };

    if (!activeConv) return;

    const token = localStorage.getItem("token");
    const mineId = JSON.parse(localStorage.getItem("mine"))?.id;
    setLoading(true);
    setMessages([]);
    // setPageInfo({ hasMore: false, nextBefore: null });

    (async () => {
      try {
        await getChatBoxInfo(token);
        await getListOfMessages(token, mineId);
      } finally {
        setLoading(false);
      }
    })();
  }, [activeConv]);

  // listen realtime event from server & append messages
  useEffect(() => {
    if (!socket || !activeConv) return;

    const mineId = JSON.parse(localStorage.getItem("mine"))?.id;

    const onEvent = (env) => {
      if (env?.conversationId !== activeConv) return;

      if (env?.type === "MESSAGE_CREATED") {
        const msg = env?.payload?.saved;
        if (!msg) return;

        const normalized = { ...msg, isMine: mineId === msg.sender?.id };

        setMessages((prev) => {
          // prevent duplicate messages if server re-send / reconnect
          if (prev.some((m) => m.id === normalized.id)) return prev;
          return [...prev, normalized];
        });
      }
    };

    socket.on("event", onEvent);
    return () => socket.off("event", onEvent);
  }, [socket, activeConv]);

  // auto scroll to the end message while updating
  useEffect(() => {
    if (loading) return;
    scrollToEnd();
  }, [messages, loading]);

  return (
    <Box
      sx={{
        flex: 1,
        height: "100%",
        bgcolor: "rgba(255,255,255,0.15)",
        borderRadius: 3,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        backdropFilter: "blur(6px)",
        opacity: 0.85,
        border: "1px solid rgba(255,255,255,0.5)",
        boxShadow: "0 0 30px rgba(0,0,0,0.5)",
        color: "white",
      }}
    >
      {/* Chat header */}
      <Box
        sx={{
          p: 2,
          display: "flex",
          alignItems: "center",
          gap: 1.5,
          background:
            "linear-gradient(135deg, #7F5AF0 0%, #5A4FCF 45%, #3B2F80 100%)",
          borderBottom: "1px solid rgba(43,34,80,0.14)",
        }}
      >
        <Avatar sx={{ border: 1, borderColor: "#FFC982" }} />
        <Box sx={{ flex: 1 }}>
          <Typography fontWeight={800}>{chatInfo?.title}</Typography>
          {chatInfo?.type === "GROUP" && (
            <Typography variant="caption" color="white" fontWeight={800}>
              {chatInfo?.numberMem} members
            </Typography>
          )}
        </Box>
      </Box>

      <Divider />

      {/* Messages area */}
      {loading && <CircularProgress />}
      <Box
        sx={{
          flex: 1,
          overflowY: "auto",
          p: 4,
          // hide scrollbar (still scrollable)
          scrollbarWidth: "none", // Firefox
          msOverflowStyle: "none", // IE/Edge legacy
          "&::-webkit-scrollbar": { display: "none" }, // Chrome/Safari
        }}
      >
        <Stack spacing={1.2}>
          {messages.map((m) => (
            <MessageBubble key={m.id} msg={m} isMine={m.isMine} />
          ))}

          <div ref={endRef}></div>
        </Stack>
      </Box>

      <Divider />

      {/* Input */}
      <Box sx={{ p: 2 }}>
        <Box sx={{ display: "flex", gap: 1 }}>
          <TextField
            placeholder="Type a message..."
            fullWidth
            size="small"
            sx={{
              "& .MuiOutlinedInput-root": {
                backgroundColor: "rgba(255,255,255,0.8)",
                borderRadius: 2.5,
                color: "#2B2250",
                "&:hover fieldset": {
                  borderColor: "#7F5AF0",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#7F5AF0",
                  borderWidth: 2,
                },
              },
            }}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
          />
          <IconButton
            sx={{
              width: 40,
              height: 40,
              borderRadius: 2.5,
              color: "white",
              border: "1px solid rgba(43,34,80,0.18)",
              background:
                "linear-gradient(135deg, #7F5AF0 0%, #5A4FCF 45%, #3B2F80 100%)",
              "&:hover": {
                background:
                  "linear-gradient(135deg, #9D7BFF 0%, #8B6BFF 50%, #5A3BFF 100%)",
                boxShadow: "0 12px 38px rgba(157,123,255,0.45)",
              },
            }}
            onClick={handleSend}
            disabled={!socket || !socket.connected || sending}
          >
            <SendIcon />
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
}
