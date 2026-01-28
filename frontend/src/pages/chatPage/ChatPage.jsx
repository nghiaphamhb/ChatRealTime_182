import { Box } from "@mui/material";

import SideBar from "./sideBar/SideBar";
import ChatBox from "./chatBox/ChatBox";
import { useEffect, useState } from "react";

export default function ChatPage() {
  const [list, setList] = useState([]);
  const [activeConv, setActiveConv] = useState(null);

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

  const clickCard = (id) => setActiveConv(id);

  useEffect(() => {
    const token = localStorage.getItem("token");

    (async () => {
      const res = await fetch("api/users/me", {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      const mine = JSON.stringify(data);
      localStorage.setItem("mine", mine);
    })();

    (async () => {
      const res = await fetch("/api/conversations", {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      setList(data);
    })();
  }, []);

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
      }}
    >
      <SideBar
        list={list}
        clickCard={clickCard}
        activeConv={activeConv}
        createConversation={createConversation}
      />
      {activeConv && <ChatBox activeConv={activeConv} />}
    </Box>
  );
}
