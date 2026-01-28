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
import { useEffect, useState } from "react";
import MessageBubble from "./MessageBubble";

export default function ChatBox({ activeConv }) {
  const [chatInfo, setChatInfo] = useState(null);
  const [messages, setMessages] = useState([]);
  // const [pageInfo, setPageInfo] = useState({ hasMore: false, nextBefore: null });

  const [loading, setLoading] = useState(true);

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

      setMessages(items);
      // setPageInfo(data?.pageInfo);
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

  return (
    <Box
      sx={{
        flex: 1,
        height: "100%",
        bgcolor: "rgba(255,255,255,0.8)",
        borderRadius: 3,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        backdropFilter: "blur(6px)",
        opacity: 0.85,
      }}
    >
      {/* Chat header */}
      <Box sx={{ p: 2, display: "flex", alignItems: "center", gap: 1.5 }}>
        <Avatar />
        <Box sx={{ flex: 1 }}>
          <Typography fontWeight={800}>{chatInfo?.title}</Typography>
          {chatInfo?.type === "GROUP" && (
            <Typography variant="caption" color="text.secondary">
              {chatInfo?.numberMem} members
            </Typography>
          )}
        </Box>
      </Box>

      <Divider />

      {/* Messages area */}
      {loading && <CircularProgress />}
      <Box sx={{ flex: 1, overflowY: "auto", p: 2 }}>
        <Stack spacing={1.2}>
          {messages.map((m) => (
            <MessageBubble key={m.id} msg={m} isMine={m.isMine} />
          ))}
        </Stack>
      </Box>

      <Divider />

      {/* Input */}
      <Box sx={{ p: 2 }}>
        <Box sx={{ display: "flex", gap: 1 }}>
          <TextField placeholder="Type a message..." fullWidth size="small" />
          <IconButton color="primary">
            <SendIcon />
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
}
