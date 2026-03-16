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
        bgcolor: "rgba(15,23,42,0.85)",
        borderRadius: 3,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        backdropFilter: "blur(20px)",
        border: "1px solid rgba(255,255,255,0.08)",
        boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
        position: "relative",
        zIndex: 1,
      }}
    >
      {/* Chat header */}
      <Box
        sx={{
          p: 2,
          display: "flex",
          alignItems: "center",
          gap: 1.5,
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <Box sx={{ position: "relative" }}>
          <Avatar />
          <Box
            sx={{
              position: "absolute",
              bottom: 2,
              right: 2,
              width: 10,
              height: 10,
              borderRadius: "50%",
              bgcolor: "#2CB67D",
              border: "2px solid rgba(15,23,42,0.85)",
              boxShadow: "0 0 8px rgba(44,182,125,0.6)",
            }}
          />
        </Box>
        <Box sx={{ flex: 1 }}>
          <Typography fontWeight={700} sx={{ color: "#F1F5F9" }}>
            Phong Bui
          </Typography>
          <Typography
            variant="caption"
            sx={{ color: "#2CB67D", fontWeight: 500 }}
          >
            Active now
          </Typography>
        </Box>
      </Box>

      {/* Messages area */}
      <Box sx={{ flex: 1, overflowY: "auto", p: 2 }}>
        <Stack spacing={1.5}>
          {/* Incoming */}
          <Box sx={{ display: "flex", gap: 1, alignItems: "flex-end" }}>
            <Avatar sx={{ width: 28, height: 28 }} />
            <Box
              sx={{
                maxWidth: "70%",
                bgcolor: "rgba(255,255,255,0.08)",
                border: "1px solid rgba(255,255,255,0.06)",
                px: 2,
                py: 1.2,
                borderRadius: "16px 16px 16px 4px",
              }}
            >
              <Typography variant="body2" sx={{ color: "#F1F5F9" }}>
                Hello guys 👋
              </Typography>
              <Typography
                variant="caption"
                sx={{ color: "rgba(255,255,255,0.35)", mt: 0.3, display: "block" }}
              >
                6:08 PM
              </Typography>
            </Box>
          </Box>

          {/* Outgoing */}
          <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
            <Box
              sx={{
                maxWidth: "70%",
                background:
                  "linear-gradient(135deg, #7F5AF0 0%, #5A4FCF 100%)",
                color: "white",
                px: 2,
                py: 1.2,
                borderRadius: "16px 16px 4px 16px",
                boxShadow: "0 4px 15px rgba(127,90,240,0.25)",
              }}
            >
              <Typography variant="body2">Hey! What's up?</Typography>
              <Typography
                variant="caption"
                sx={{ opacity: 0.7, mt: 0.3, display: "block" }}
              >
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
                bgcolor: "rgba(255,255,255,0.08)",
                border: "1px solid rgba(255,255,255,0.06)",
                px: 2,
                py: 1.2,
                borderRadius: "16px 16px 16px 4px",
              }}
            >
              <Typography variant="body2" sx={{ color: "#F1F5F9" }}>
                Let's build a real-time chat with Spring + React 😄
              </Typography>
              <Typography
                variant="caption"
                sx={{ color: "rgba(255,255,255,0.35)", mt: 0.3, display: "block" }}
              >
                6:10 PM
              </Typography>
            </Box>
          </Box>
        </Stack>
      </Box>

      {/* Input */}
      <Box
        sx={{
          p: 2,
          borderTop: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
          <TextField
            placeholder="Type a message..."
            fullWidth
            size="small"
            sx={{
              "& .MuiOutlinedInput-root": {
                bgcolor: "rgba(255,255,255,0.05)",
                borderRadius: 3,
                color: "#F1F5F9",
                "& fieldset": {
                  borderColor: "rgba(255,255,255,0.08)",
                },
                "&:hover fieldset": {
                  borderColor: "rgba(255,255,255,0.15)",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#7F5AF0",
                  borderWidth: 1,
                },
              },
              "& .MuiInputBase-input::placeholder": {
                color: "rgba(255,255,255,0.35)",
                opacity: 1,
              },
            }}
          />
          <IconButton
            sx={{
              width: 40,
              height: 40,
              background:
                "linear-gradient(135deg, #7F5AF0 0%, #5A4FCF 100%)",
              color: "#fff",
              borderRadius: 2,
              boxShadow: "0 4px 12px rgba(127,90,240,0.3)",
              transition: "all 0.25s ease",
              "&:hover": {
                background:
                  "linear-gradient(135deg, #9D7BFF 0%, #7F5AF0 100%)",
                boxShadow: "0 6px 20px rgba(127,90,240,0.45)",
                transform: "translateY(-1px)",
              },
            }}
          >
            <SendIcon fontSize="small" />
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
}
