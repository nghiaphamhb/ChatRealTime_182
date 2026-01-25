import { Box } from "@mui/material";
import Header from "./Header";
import AuthDialog from "./AuthDialog";
import { useState } from "react";
import TubesCursorBg from "./TubesCursorBg";

export default function LandingPage() {
  const [open, setOpen] = useState(false);

  return (
    <Box
      sx={{
        position: "fixed",
        width: "100vw",
        height: "100vh",
        zIndex: 0,
        backgroundImage: "url(/wallpaper.gif)",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <TubesCursorBg />
      <Header handleOpen={() => setOpen(true)} />
      <AuthDialog open={open} handleClose={() => setOpen(false)} />
    </Box>
  );
}
