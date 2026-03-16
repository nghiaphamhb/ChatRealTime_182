import { Box, Typography, Button } from "@mui/material";
import Header from "./Header";
import AuthDialog from "./AuthDialog";
import { useState } from "react";
import TubesCursorBg from "./TubesCursorBg";
import RocketLaunchIcon from "@mui/icons-material/RocketLaunch";

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
      {/* Dark overlay for readability */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse at 50% 0%, rgba(15,23,42,0.3) 0%, rgba(15,23,42,0.7) 100%)",
          zIndex: 0,
        }}
      />

      <TubesCursorBg />
      <Header handleOpen={() => setOpen(true)} />

      {/* Hero Section */}
      <Box
        sx={{
          position: "relative",
          zIndex: 2,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100%",
          textAlign: "center",
          px: 3,
          gap: 2,
          animation: "fadeInUp 1s ease-out",
          "@keyframes fadeInUp": {
            from: { opacity: 0, transform: "translateY(30px)" },
            to: { opacity: 1, transform: "translateY(0)" },
          },
        }}
      >
        <Typography
          variant="h1"
          sx={{
            fontWeight: 900,
            fontSize: { xs: "2.5rem", md: "4.5rem" },
            color: "#fff",
            lineHeight: 1.1,
            letterSpacing: "-0.02em",
            textShadow: "0 0 60px rgba(127,90,240,0.4)",
          }}
        >
          Connect Across
          <br />
          <Box
            component="span"
            sx={{
              background: "linear-gradient(135deg, #7F5AF0, #2CB67D)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            the Galaxy
          </Box>
        </Typography>

        <Typography
          variant="h6"
          sx={{
            color: "rgba(255,255,255,0.6)",
            fontWeight: 400,
            maxWidth: 520,
            fontSize: { xs: "1rem", md: "1.2rem" },
            lineHeight: 1.6,
          }}
        >
          Real-time messaging powered by the stars.
          <br />
          Fast, secure, and beautifully designed.
        </Typography>

        <Button
          variant="contained"
          size="large"
          onClick={() => setOpen(true)}
          startIcon={<RocketLaunchIcon />}
          sx={{
            mt: 2,
            px: 5,
            py: 1.5,
            fontSize: "1.1rem",
            fontWeight: 700,
            borderRadius: 3,
            background:
              "linear-gradient(135deg, #7F5AF0 0%, #5A4FCF 45%, #2CB67D 100%)",
            boxShadow: "0 8px 32px rgba(127,90,240,0.35)",
            transition: "all 0.3s ease",
            "&:hover": {
              background:
                "linear-gradient(135deg, #9D7BFF 0%, #7F5AF0 50%, #3DD68C 100%)",
              boxShadow: "0 12px 40px rgba(127,90,240,0.5)",
              transform: "translateY(-2px)",
            },
          }}
        >
          Get Started
        </Button>
      </Box>

      <AuthDialog open={open} handleClose={() => setOpen(false)} />
    </Box>
  );
}
