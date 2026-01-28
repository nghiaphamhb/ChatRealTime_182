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

      setMessages(items.reverse());
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
          >
            <SendIcon />
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
}
