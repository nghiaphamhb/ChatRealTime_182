import { Box, Typography, Avatar, Grid } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import TubesCursorBg from "../landingPage/TubesCursorBg";
import Header from "../landingPage/Header";
import GroupsIcon from "@mui/icons-material/Groups";
import BoltIcon from "@mui/icons-material/Bolt";
import SecurityIcon from "@mui/icons-material/Security";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";

const values = [
  {
    icon: <BoltIcon sx={{ fontSize: 32 }} />,
    title: "Lightning Fast",
    desc: "Real-time messaging with WebSocket technology delivering instant communication.",
  },
  {
    icon: <SecurityIcon sx={{ fontSize: 32 }} />,
    title: "Secure by Design",
    desc: "End-to-end encrypted conversations keeping your data safe and private.",
  },
  {
    icon: <GroupsIcon sx={{ fontSize: 32 }} />,
    title: "Built for Teams",
    desc: "Group chats, channels, and collaboration tools for teams of any size.",
  },
  {
    icon: <AutoAwesomeIcon sx={{ fontSize: 32 }} />,
    title: "Beautiful UI",
    desc: "A stunning, modern interface crafted for the best user experience.",
  },
];

const team = [
  { name: "Nghia Pham", role: "Full-Stack Developer" },
  { name: "Phong Bui", role: "Backend Engineer" },
];

export default function AboutPage() {
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
          maxWidth: 900,
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
            About{" "}
            <Box
              component="span"
              sx={{
                background: "linear-gradient(135deg, #7F5AF0, #2CB67D)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Galaxy Chat
            </Box>
          </Typography>
          <Typography
            variant="h6"
            sx={{
              color: "rgba(255,255,255,0.55)",
              fontWeight: 400,
              maxWidth: 600,
              mx: "auto",
              lineHeight: 1.7,
            }}
          >
            We're building the next generation of real-time communication.
            Fast, secure, and beautifully designed for everyone.
          </Typography>
        </Box>

        {/* Values */}
        <Grid container spacing={3} sx={{ mb: 8 }}>
          {values.map((v, i) => (
            <Grid size={{ xs: 12, sm: 6 }} key={i}>
              <Box
                sx={{
                  p: 3.5,
                  borderRadius: 3,
                  bgcolor: "rgba(15,23,42,0.7)",
                  backdropFilter: "blur(16px)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  transition: "all 0.3s ease",
                  height: "100%",
                  "&:hover": {
                    border: "1px solid rgba(127,90,240,0.3)",
                    boxShadow: "0 8px 30px rgba(127,90,240,0.12)",
                    transform: "translateY(-3px)",
                  },
                }}
              >
                <Box
                  sx={{
                    width: 56,
                    height: 56,
                    borderRadius: 2.5,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "linear-gradient(135deg, rgba(127,90,240,0.2), rgba(44,182,125,0.2))",
                    color: "#9D7BFF",
                    mb: 2,
                  }}
                >
                  {v.icon}
                </Box>
                <Typography
                  variant="h6"
                  sx={{ fontWeight: 700, color: "#F1F5F9", mb: 1 }}
                >
                  {v.title}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: "rgba(255,255,255,0.5)", lineHeight: 1.7 }}
                >
                  {v.desc}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>

        {/* Team */}
        <Box sx={{ textAlign: "center", mb: 4 }}>
          <Typography
            variant="h4"
            sx={{ fontWeight: 800, color: "#F1F5F9", mb: 1 }}
          >
            Our Team
          </Typography>
          <Typography
            variant="body1"
            sx={{ color: "rgba(255,255,255,0.45)", mb: 4 }}
          >
            The people behind Galaxy Chat
          </Typography>

          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              gap: 4,
              flexWrap: "wrap",
            }}
          >
            {team.map((t, i) => (
              <Box
                key={i}
                sx={{
                  p: 3,
                  borderRadius: 3,
                  bgcolor: "rgba(15,23,42,0.7)",
                  backdropFilter: "blur(16px)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  width: 200,
                  textAlign: "center",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    border: "1px solid rgba(127,90,240,0.3)",
                    transform: "translateY(-3px)",
                  },
                }}
              >
                <Avatar
                  sx={{
                    width: 72,
                    height: 72,
                    mx: "auto",
                    mb: 2,
                    background: "linear-gradient(135deg, #7F5AF0, #2CB67D)",
                    fontSize: 28,
                    fontWeight: 700,
                  }}
                >
                  {t.name.charAt(0)}
                </Avatar>
                <Typography
                  variant="body1"
                  sx={{ fontWeight: 700, color: "#F1F5F9" }}
                >
                  {t.name}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{ color: "rgba(255,255,255,0.45)" }}
                >
                  {t.role}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
