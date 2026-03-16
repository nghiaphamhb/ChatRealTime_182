import { Box, Typography, Grid } from "@mui/material";
import TubesCursorBg from "../landingPage/TubesCursorBg";
import Header from "../landingPage/Header";
import ChatIcon from "@mui/icons-material/Chat";
import GroupIcon from "@mui/icons-material/Group";
import VideocamIcon from "@mui/icons-material/Videocam";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import CloudSyncIcon from "@mui/icons-material/CloudSync";
import TuneIcon from "@mui/icons-material/Tune";

const services = [
  {
    icon: <ChatIcon sx={{ fontSize: 36 }} />,
    title: "Real-Time Messaging",
    desc: "Instant message delivery powered by WebSocket technology. Type, send, and receive messages with zero lag.",
    gradient: "linear-gradient(135deg, #7F5AF0, #5A4FCF)",
  },
  {
    icon: <GroupIcon sx={{ fontSize: 36 }} />,
    title: "Group Conversations",
    desc: "Create group chats with unlimited members. Share ideas and collaborate in real-time.",
    gradient: "linear-gradient(135deg, #2CB67D, #1A8A5E)",
  },
  {
    icon: <VideocamIcon sx={{ fontSize: 36 }} />,
    title: "Media Sharing",
    desc: "Share images, videos, and files seamlessly within your conversations.",
    gradient: "linear-gradient(135deg, #E53E6B, #C02954)",
  },
  {
    icon: <NotificationsActiveIcon sx={{ fontSize: 36 }} />,
    title: "Smart Notifications",
    desc: "Customizable push notifications so you never miss an important message.",
    gradient: "linear-gradient(135deg, #F59E0B, #D97706)",
  },
  {
    icon: <CloudSyncIcon sx={{ fontSize: 36 }} />,
    title: "Cloud Sync",
    desc: "Your messages are synced across all devices. Pick up where you left off, anywhere.",
    gradient: "linear-gradient(135deg, #3B82F6, #2563EB)",
  },
  {
    icon: <TuneIcon sx={{ fontSize: 36 }} />,
    title: "Customization",
    desc: "Personalize your chat experience with themes, wallpapers, and display preferences.",
    gradient: "linear-gradient(135deg, #8B5CF6, #6D28D9)",
  },
];

export default function ServicesPage() {
  return (
    <Box
      sx={{
        position: "fixed",
        width: "100vw",
        height: "100vh",
        backgroundImage: "url(/wallpaper.gif)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        overflowY: "auto",
      }}
    >
      <Box
        sx={{
          position: "fixed",
          inset: 0,
          background:
            "radial-gradient(ellipse at 50% 0%, rgba(15,23,42,0.4) 0%, rgba(15,23,42,0.85) 100%)",
          zIndex: 0,
        }}
      />
      <TubesCursorBg />
      <Header />

      {/* Content */}
      <Box
        sx={{
          position: "relative",
          zIndex: 2,
          maxWidth: 1000,
          mx: "auto",
          pt: 14,
          pb: 8,
          px: 3,
        }}
      >
        {/* Hero */}
        <Box
          sx={{
            textAlign: "center",
            mb: 8,
            animation: "fadeInUp 0.8s ease-out",
            "@keyframes fadeInUp": {
              from: { opacity: 0, transform: "translateY(30px)" },
              to: { opacity: 1, transform: "translateY(0)" },
            },
          }}
        >
          <Typography
            variant="h2"
            sx={{
              fontWeight: 900,
              color: "#fff",
              letterSpacing: "-0.02em",
              mb: 2,
            }}
          >
            Our{" "}
            <Box
              component="span"
              sx={{
                background: "linear-gradient(135deg, #7F5AF0, #2CB67D)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Services
            </Box>
          </Typography>
          <Typography
            variant="h6"
            sx={{
              color: "rgba(255,255,255,0.55)",
              fontWeight: 400,
              maxWidth: 550,
              mx: "auto",
              lineHeight: 1.7,
            }}
          >
            Everything you need for seamless communication, all in one place.
          </Typography>
        </Box>

        {/* Services Grid */}
        <Grid container spacing={3}>
          {services.map((s, i) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={i}>
              <Box
                sx={{
                  p: 3.5,
                  borderRadius: 3,
                  bgcolor: "rgba(15,23,42,0.7)",
                  backdropFilter: "blur(16px)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  transition: "all 0.3s ease",
                  height: "100%",
                  cursor: "pointer",
                  "&:hover": {
                    border: "1px solid rgba(127,90,240,0.3)",
                    boxShadow: "0 8px 30px rgba(127,90,240,0.12)",
                    transform: "translateY(-4px)",
                  },
                }}
              >
                <Box
                  sx={{
                    width: 64,
                    height: 64,
                    borderRadius: 3,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: s.gradient,
                    color: "#fff",
                    mb: 2.5,
                    boxShadow: `0 8px 20px ${s.gradient.includes("#7F5AF0") ? "rgba(127,90,240,0.25)" : "rgba(0,0,0,0.2)"}`,
                  }}
                >
                  {s.icon}
                </Box>
                <Typography
                  variant="h6"
                  sx={{ fontWeight: 700, color: "#F1F5F9", mb: 1 }}
                >
                  {s.title}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: "rgba(255,255,255,0.5)", lineHeight: 1.7 }}
                >
                  {s.desc}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
}
