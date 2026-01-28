import {
  Avatar,
  Box,
  Divider,
  IconButton,
  Stack,
  TextField,
  Typography,
  CircularProgress 
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { useEffect, useState } from "react";
import MessageBubble from "./MessageBubble";

export default function ChatBox({ activeConv }) {
  const [chatInfo, setChatInfo] = useState(null);
  const [messages, setMessages] = useState([]);
  // const [pageInfo, setPageInfo] = useState({ hasMore: false, nextBefore: null });
  const [text, setText] = useState("");

  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  const sendMessage = async () => {
    const content = text.trim();
    if(!content || sending) return;

    const token = localStorage.getItem("token");
    const mine = JSON.parse(localStorage.getItem("mine"));
    const mineId = mine?.id;

    const clientMsgId = crypto.randomUUID();

    // optimistic message
    const optimistic = {
      id: clientMsgId,
      conversationId: activeConv,
      sender: {
        id: mineId,
        username: mine?.username,
        displayName: mine?.displayName,
      },
      type: "TEXT",
      content,
      createdAt: new Date().toISOString(),
      isMine: true,
      _status: "sending",
    };

    setMessages((prev) => [...prev, optimistic]);
    setText("");
    setSending(true);

    try {
      const res = await fetch(`/api/conversations/${activeConv}/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          type: "TEXT",
          content,
          clientMsgId,
        }),
      });

      if (!res.ok) {
        // mark failed
        setMessages((prev) =>
          prev.map((m) => (m.id === clientMsgId ? { ...m, _status: "failed" } : m))
        );
        return;
      }

      const data = await res.json();
      const serverMsg = data;
      
      // replace optimistic with real message
      setMessages((prev) =>
        prev.map((m) =>
          m.id === clientMsgId
            ? {
                ...m,
                id: serverMsg.id,
                createdAt: serverMsg.createdAt,
                content: serverMsg.content,
                type: serverMsg.type,
                _status: "sent",
              }
            : m
        )
      );
      } catch (e) {
        setMessages((prev) =>
        prev.map((m) => (m.id === clientMsgId ? { ...m, _status: "failed" } : m))
      );
        console.log("Error while sending message: " + e.message);
    } finally {
      setSending(false);
    }
  };

  useEffect(() => {
    const getChatBoxInfo = async (token) => {
        const res = await fetch(`/api/conversations/${activeConv}`, {
          method: "GET",
          headers: { Authorization: `Bearer ${token}`}
        });

        const data = await res.json();

        const newChatInfo = { 
          title: data?.title,
          lastMsgAt: data?.lastMessageAt,
          type: data?.type, 
          numberMem: data?.members?.length ?? 0,
        }
        setChatInfo(newChatInfo);
      };

      const getListOfMessages = async (token, mineId) => {
        const res = await fetch(`/api/conversations/${activeConv}/messages?limit=30`, {
          method: "GET",
          headers: { Authorization: `Bearer ${token}`}
        });
        
        const data = await res.json();

        const items = (data?.items ?? []).map((i) => ({
          ...i, isMine : mineId === i?.sender?.id
        }));

        setMessages(items.reverse());
        // setPageInfo(data?.pageInfo);
      };

    if(!activeConv) return;
    
    const token = localStorage.getItem("token");
    const mineId = JSON.parse(localStorage.getItem("mine"))?.id;
    setLoading(true);
    setMessages([]);
    // setPageInfo({ hasMore: false, nextBefore: null });
    setText("");

    (async () => {
      try{
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
          <Typography fontWeight={800}>
            {chatInfo?.title}
          </Typography>
          {(chatInfo?.type === "GROUP" && 
          <Typography variant="caption" color="text.secondary">
            {chatInfo?.numberMem} members
          </Typography>)}
        </Box>
      </Box>

      <Divider />

      {/* Messages area */}
      {loading && <CircularProgress/>}
      <Box sx={{ flex: 1, overflowY: "auto", p: 2 }}>
        <Stack spacing={1.2}>
          {messages.map((m)=> (<MessageBubble key={m.id} msg={m} isMine={m.isMine}/>))}
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
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if(e.key === "Enter"){
              e.preventDefault();
              sendMessage();
            }
          }}
          disabled={sending || loading}
          />
          <IconButton color="primary" onClick={sendMessage} disabled={sending || loading}>
            <SendIcon />
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
}
