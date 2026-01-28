import { Box, Typography, Avatar } from "@mui/material";

export default function MessageBubble({ msg, isMine }){
    return(
        <Box sx={{ display: "flex", justifyContent: isMine ? "flex-end" : "flex-start" }}>
        {!isMine && <Avatar sx={{ width: 28, height: 28, mr: 1 }} />}
        <Box sx={{
            maxWidth: "70%",
            bgcolor: isMine ? "primary.main" : "rgba(0,0,0,0.06)",
            color: isMine ? "white" : "inherit",
            px: 1.5, py: 1, borderRadius: 2
        }}>
        <Typography variant="body2">{msg.content}</Typography>
        <Typography variant="caption" sx={{ opacity: 0.85 }}>
          {msg.createdAt}
        </Typography>
      </Box>
    </Box>
    );
}