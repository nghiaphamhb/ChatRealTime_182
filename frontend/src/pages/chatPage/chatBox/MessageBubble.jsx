import { Box, Typography, Avatar } from "@mui/material";

export default function MessageBubble({ msg, isMine }) {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: isMine ? "flex-end" : "flex-start",
      }}
    >
      {!isMine && (
        <Avatar
          sx={{
            width: 40,
            height: 40,
            mr: 2,
            border: 1,
            borderColor: "#f9c076",
          }}
        />
      )}
      <Box
        sx={{
          maxWidth: "70%",
          bgcolor: isMine ? "#b4cbf9" : "rgba(255,255,255,0.8)",
          color: "black",
          px: 1.5,
          py: 1,
          borderRadius: 2,
        }}
      >
        <Typography variant="body2">{msg.content}</Typography>
        <Typography variant="caption" sx={{ opacity: 0.85 }}>
          {msg.createdAt}
        </Typography>
      </Box>
    </Box>
  );
}
