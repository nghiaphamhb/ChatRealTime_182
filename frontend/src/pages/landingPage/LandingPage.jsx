import { Box } from "@mui/material";
import Header from "./Header";
import AuthDialog from "./AuthDialog";
import { useState } from "react";

export default function LandingPage() {
  const [open, setOpen] = useState(false);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#000",
        backgroundImage: "url(/wallpaper.gif)",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <Header handleOpen={() => setOpen(true)} />
      <AuthDialog open={open} handleClose={() => setOpen(false)} />
    </Box>
  );
}
