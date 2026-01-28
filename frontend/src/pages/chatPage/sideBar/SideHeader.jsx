import {
  Box,
  Stack,
  TextField,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  Button,
  DialogActions,
  Chip,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useMemo, useState } from "react";
import UserIdPicker from "./UserIdPicker";

export default function SideHeader({ createConversation }) {
  const [menuEl, setMenuEl] = useState(null);
  const menuOpen = Boolean(menuEl);

  const [mode, setMode] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [selectedIds, setSelectedIds] = useState([]);

  const openMenu = (e) => setMenuEl(e.currentTarget);

  const closeMenu = () => setMenuEl(null);

  const startNewDM = () => {
    closeMenu();
    setMode("DM");
    setDialogOpen(true);
    setGroupName("");
    setSelectedIds([]);
  };

  const startNewGroup = () => {
    closeMenu();
    setMode("GROUP");
    setDialogOpen(true);
    setGroupName("");
    setSelectedIds([]);
  };

  const closeDialog = () => setDialogOpen(false);

  const addUserId = (value) => {
    const id = value.trim();
    if (!id) return;
    setSelectedIds((prev) => (prev.includes(id) ? prev : [...prev, id]));
  };

  const removeUserId = (id) => {
    setSelectedIds((prev) => prev.filter((x) => x !== id));
  };

  const canSubmit = useMemo(() => {
    if (mode === "DM") return selectedIds.length === 1;
    if (mode === "GROUP")
      return groupName.trim().length > 0 && selectedIds.length >= 2;
    return false;
  }, [mode, selectedIds, groupName]);

  const handleSubmit = async () => {
    if (!canSubmit) return;

    const payload =
      mode === "DM"
        ? { type: mode, memberUserIds: selectedIds }
        : {
            type: mode,
            title: groupName.trim(),
            memberUserIds: selectedIds,
          };

    await createConversation(payload);
    setDialogOpen(false);
  };

  return (
    <Box
      sx={{
        p: 2,
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Typography fontWeight={700} variant="h6">
          Chats
        </Typography>
        <IconButton aria-label="add-button" onClick={openMenu}>
          <AddIcon />
        </IconButton>
      </Box>

      <Menu anchorEl={menuEl} open={menuOpen} onClose={closeMenu}>
        <MenuItem onClick={startNewDM}>New DM</MenuItem>
        <MenuItem onClick={startNewGroup}>New Group</MenuItem>
      </Menu>

      <Dialog open={dialogOpen} onClose={closeDialog}>
        <DialogTitle>
          {mode === "DM" ? "New direct message" : "New group"}
        </DialogTitle>

        <DialogContent>
          {mode == "GROUP" && (
            <TextField
              label="Group name"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              fullWidth
              autoFocus
            />
          )}

          {/* Enter user id here */}
          <UserIdPicker addUserId={addUserId} />

          <Stack direction="row">
            {selectedIds.map((id) => (
              <Chip
                key={id}
                label={`${id.slice(0, 6)}...`}
                onDelete={() => removeUserId(id)}
              />
            ))}
          </Stack>

          <Typography variant="caption" sx={{ opacity: 0.7, p: 2 }}>
            Tip: type userId and press Enter
          </Typography>
        </DialogContent>

        <DialogActions>
          <Button onClick={closeDialog}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={!canSubmit}
          >
            {mode === "DM" ? "Start chat" : "Create group"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
