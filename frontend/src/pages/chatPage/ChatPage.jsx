import { Box } from "@mui/material";

import SideBar from "./SideBar";
import ChatBox from "./ChatBox";

export default function ChatPage() {
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
      <SideBar />
      <ChatBox />
    </Box>
  );
}
