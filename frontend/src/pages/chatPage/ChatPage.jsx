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
      <SideBar />
      <ChatBox />
    </Box>
  );
}
