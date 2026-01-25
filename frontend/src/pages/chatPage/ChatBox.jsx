import {
  Avatar,
  Box,
  Divider,
  IconButton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";

export default function ChatBox() {
  return (
    <Box
      sx={{
        flex: 1,
        height: "100%",
        bgcolor: "rgba(255,255,255,0.8)",
        borderRadius: 3,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        backdropFilter: "blur(6px)",
      }}
    >
      {/* Chat header */}
      <Box sx={{ p: 2, display: "flex", alignItems: "center", gap: 1.5 }}>
        <Avatar />
        <Box sx={{ flex: 1 }}>
          <Typography fontWeight={800}>Phong Bui</Typography>
          <Typography variant="caption" color="text.secondary">
            Active now
          </Typography>
        </Box>
      </Box>

      <Divider />

      {/* Messages area */}
      <Box sx={{ flex: 1, overflowY: "auto", p: 2 }}>
        <Stack spacing={1.2}>
          {/* Incoming */}
          <Box sx={{ display: "flex", gap: 1, alignItems: "flex-end" }}>
            <Avatar sx={{ width: 28, height: 28 }} />
            <Box
              sx={{
                maxWidth: "70%",
                bgcolor: "rgba(0,0,0,0.06)",
                px: 1.5,
                py: 1,
                borderRadius: 2,
              }}
            >
              <Typography variant="body2">Hello guys 👋</Typography>
              <Typography variant="caption" color="text.secondary">
                6:08 PM
              </Typography>
            </Box>
          </Box>

          {/* Outgoing */}
          <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
            <Box
              sx={{
                maxWidth: "70%",
                bgcolor: "primary.main",
                color: "white",
                px: 1.5,
                py: 1,
                borderRadius: 2,
              }}
            >
              <Typography variant="body2">Hey! What’s up?</Typography>
              <Typography variant="caption" sx={{ opacity: 0.85 }}>
                6:09 PM
              </Typography>
            </Box>
          </Box>

          {/* Incoming */}
          <Box sx={{ display: "flex", gap: 1, alignItems: "flex-end" }}>
            <Avatar sx={{ width: 28, height: 28 }} />
            <Box
              sx={{
                maxWidth: "70%",
                bgcolor: "rgba(0,0,0,0.06)",
                px: 1.5,
                py: 1,
                borderRadius: 2,
              }}
            >
              <Typography variant="body2">
                Let’s build a real-time chat with Spring + React 😄
              </Typography>
              <Typography variant="caption" color="text.secondary">
                6:10 PM
              </Typography>
            </Box>
          </Box>
        </Stack>
      </Box>

      <Divider />

      {/* Input */}
      <Box sx={{ p: 2 }}>
        <Box sx={{ display: "flex", gap: 1 }}>
          <TextField placeholder="Type a message..." fullWidth size="small" />
          <IconButton color="primary">
            <SendIcon />
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
}
