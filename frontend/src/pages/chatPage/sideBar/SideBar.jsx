import {
  Avatar,
  Badge,
  Box,
  Divider,
  Stack,
  TextField,
  Typography,
  IconButton,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import { useEffect, useState } from "react";
import SideCard from "./sideCard";
import SideHeader from "./SideHeader";

export default function SideBar() {
  const [list, setList] = useState([]);

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
      alert("Create failed");
      return;
    }
    // if(data?.title === null){
    //   alert("This user does not exist");
    //   return;
    // }
    console.log(data);
    // TODO: add to list + navigate(`/conversations/${data.id}`)

    const newGroup = {
      id: data.id,
      lastMessage: "",
      lastMessageAt: null,
      title: data.title,
      unreadCount: 0,
    };

    setList((prev) => [...prev, newGroup]);
  };

  useEffect(() => {
    const token = localStorage.getItem("token");

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
        width: 340,
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
      {/* Sidebar header */}
      <SideHeader createConversation={createConversation} />

      <Divider />

      {/* Chat list */}
      <Box sx={{ overflowY: "auto", flex: 1 }}>
        {list.map((e) => (
          <SideCard
            key={e.id}
            lastMsg={e.lastMessage}
            lastMsgAt={e.lastMessageAt}
            title={e.title}
            unreadCount={e.unreadCount}
          />
        ))}
      </Box>
    </Box>
  );
}
