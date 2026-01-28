import { Box, Divider } from "@mui/material";
import SideCard from "./SideCard";
import SideHeader from "./SideHeader";

export default function SideBar({
  list,
  clickCard,
  activeConv,
  createConversation,
}) {
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
            onClick={() => clickCard(e.id)}
            active={activeConv === e.id}
          />
        ))}
      </Box>
    </Box>
  );
}
