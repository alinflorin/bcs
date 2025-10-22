import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
} from "@mui/material";
import { Link } from "react-router";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { useSnackbar } from "notistack";
import { Chat } from "../models/chat";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import DriveFileRenameOutlineIcon from "@mui/icons-material/DriveFileRenameOutline";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import { useListener } from "react-bus";
import { Delete, Folder, Share } from "@mui/icons-material";

export default function ChatList() {
  const snackbar = useSnackbar();
  const [chat, setChat] = useState<Chat[]>([]);

  // Menu state
  const [anchorEl1, setAnchorEl1] = useState<null | HTMLElement>(null);
  const [menuChatId, setMenuChatId] = useState<string | null>(null);

  // Delete dialog state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [chatToDelete, setChatToDelete] = useState<string | null>(null);

  useListener("newChatCreated", (e) => {
    setChat((prev) => [e as Chat, ...prev]);
  });

  useEffect(() => {
    (async () => {
      try {
        const chats = await axios.get("/api/chats");
        setChat(chats.data);
      } catch (e: any) {
        snackbar.enqueueSnackbar(e.response?.data?.message || "Error", { variant: "error" });
      }
    })();
  }, [snackbar]);

  const deleteChat = useCallback(
    async (id: string) => {
      try {
        await axios.delete("/api/delete/" + id);
        setChat((prev) => prev.filter((chat) => chat._id?.toString() !== id));

        // Close menu if deleted chat had menu open
        if (menuChatId === id) {
          setAnchorEl1(null);
          setMenuChatId(null);
        }
      } catch (e: any) {
        snackbar.enqueueSnackbar(e.response?.data?.message || "Error", { variant: "error" });
      }
    },
    [snackbar, menuChatId]
  );

  const handleClick1 = (event: React.MouseEvent<HTMLElement>, id: string) => {
    setAnchorEl1(event.currentTarget);
    setMenuChatId(id);
  };

  const handleClose1 = () => {
    setAnchorEl1(null);
    setMenuChatId(null);
  };

  return (
    <>
      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography component="span">Chats</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <List>
            {chat.map((c) => (
              <ListItem
                key={c._id!}
                sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}
              >
                {/* Navigation */}
                <ListItemButton component={Link} to={"/chat/" + c._id!} sx={{ flex: 1 }}>
                  <ListItemText primary={c.title} />
                </ListItemButton>

                {/* Menu Button */}
                <IconButton edge="end" aria-label="menu" onClick={(e) => handleClick1(e, c._id!)}>
                  <MoreHorizIcon />
                </IconButton>

                {/* Menu */}
                <Menu
                  anchorEl={anchorEl1}
                  open={menuChatId === c._id && Boolean(anchorEl1)}
                  onClose={handleClose1}
                  slotProps={{
                    paper: {
                      elevation: 0,
                      sx: {
                        overflow: "visible",
                        filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                        mt: 1.5,
                        "&::before": {
                          content: '""',
                          display: "block",
                          position: "absolute",
                          top: 0,
                          right: 14,
                          width: 10,
                          height: 10,
                          bgcolor: "background.paper",
                          transform: "translateY(-50%) rotate(45deg)",
                          zIndex: 0,
                        },
                      },
                    },
                  }}
                  transformOrigin={{ horizontal: "right", vertical: "top" }}
                  anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
                >
                  <MenuItem>
                    <ListItemIcon>
                      <Share fontSize="small" />
                    </ListItemIcon>
                    Share
                  </MenuItem>
                  <MenuItem>
                    <ListItemIcon>
                      <DriveFileRenameOutlineIcon fontSize="small" />
                    </ListItemIcon>
                    Rename
                  </MenuItem>
                  <MenuItem>
                    <ListItemIcon>
                      <BookmarkBorderIcon fontSize="small" />
                    </ListItemIcon>
                    Archive
                  </MenuItem>
                  <MenuItem>
                    <ListItemIcon>
                      <Folder fontSize="small" />
                    </ListItemIcon>
                    Move to project
                  </MenuItem>

                  {/* Delete opens confirmation dialog */}
                  <MenuItem
                    onClick={(e) => {
                      e.stopPropagation();
                      setChatToDelete(c._id!);
                      setDeleteDialogOpen(true);
                      handleClose1();
                    }}
                  >
                    <ListItemIcon>
                      <Delete fontSize="small" color="error" />
                    </ListItemIcon>
                    Delete
                  </MenuItem>
                </Menu>
              </ListItem>
            ))}
          </List>
        </AccordionDetails>
      </Accordion>

      {/* Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this chat? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button
            color="error"
            onClick={async () => {
              if (chatToDelete) {
                await deleteChat(chatToDelete);
                setDeleteDialogOpen(false);
                setChatToDelete(null);
              }
            }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
