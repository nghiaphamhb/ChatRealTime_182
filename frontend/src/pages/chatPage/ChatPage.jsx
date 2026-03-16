import { Box } from "@mui/material";
import SideBar from "./sideBar/SideBar";
import ChatBox from "./chatBox/ChatBox";
import { useEffect, useState, useRef } from "react";

import { io } from "socket.io-client";

export default function ChatPage() {
  const [list, setList] = useState([]);
  const [activeConv, setActiveConv] = useState(null);

  // need for rerender ChatBox component's props
  const [socket] = useState(() => {
    const token = localStorage.getItem("token");
    if (!token) return null;

    return io("http://localhost:3001", {
      path: "/ws",
      transports: ["websocket"],
      auth: { token: `Bearer ${token}` },
    });
  });

  const activeConvRef = useRef(null);
  const socketRef = useRef(null);

  const createConversation = async (payload) => {
    const token = localStorage.getItem("token");

    const res = await fetch("/api/conversations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    if (!res.ok) {
      alert("This user does not exist");
      return;
    }

    const newGroup = {
      id: data.id,
      lastMessage: "",
      lastMessageAt: null,
      title: data.title,
      unreadCount: 0,
    };

    setList((prev) => [...prev, newGroup]);
  };

  const clickCard = (conversationId) => setActiveConv(conversationId);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    // fetch mine
    (async () => {
      const res = await fetch("api/users/me", {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      const mine = JSON.stringify(data);
      localStorage.setItem("mine", mine);
    })();

    // fetch conversation
    (async () => {
      const res = await fetch("/api/conversations", {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      setList(data);
    })();
  }, []);

  useEffect(() => {
    activeConvRef.current = activeConv;
  }, [activeConv]);

  // add listener and cleanup for socket
  useEffect(() => {
    if (!socket) return;

    socketRef.current = socket;

    const onConnect = () => {
      console.log("connected socket:", socket.id);

      // auto-join active conv after reconnect
      const convId = activeConvRef.current;
      if (convId)
        socket.emit("conversations:join", { conversationId: convId }, (ack) => {
          if (!ack?.ok) console.log("join failed:", ack?.error);
        });
    };
    const onDisconnect = (reason) =>
      console.log("socket disconnected:", reason);
    const onConnectError = (err) => console.log("connect_error", err.message);

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("connect_error", onConnectError);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("connect_error", onConnectError);

      socket.close();
      socketRef.current = null;
    };
  }, [socket]);

  //  join conv when user click card
  useEffect(() => {
    if (!socket || !socket.connected || !activeConv) return;

    socket.emit("conversations:join", { conversationId: activeConv }, (ack) => {
      if (!ack?.ok) console.log("join failed:", ack?.error);
      else console.log("joined:", activeConv);
    });
  }, [activeConv, socket]);

  return (
    <Box
      sx={{
        backgroundImage: "url(/wallpaper.gif)",
        width: "100vw",
        height: "100vh",
        backgroundSize: "cover",
        backgroundPosition: "center",
        display: "flex",
        p: 2,
        gap: 2,
        position: "relative",
        "&::before": {
          content: '""',
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse at 30% 20%, rgba(127,90,240,0.08) 0%, rgba(15,23,42,0.75) 60%, rgba(15,23,42,0.85) 100%)",
          zIndex: 0,
        },
      }}
    >
      <SideBar
        list={list}
        clickCard={clickCard}
        activeConv={activeConv}
        createConversation={createConversation}
      />
      {activeConv ? (
        <ChatBox activeConv={activeConv} socket={socket} />
      ) : (
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
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          Select a chat to start messaging
        </Box>
      )}
    </Box>
  );
}
