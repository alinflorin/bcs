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
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
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
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder"; //emty
import BookmarkIcon from "@mui/icons-material/Bookmark"; // filled
import { useBus, useListener } from "react-bus";
import { Delete, Share } from "@mui/icons-material";
import { useConfirm } from "../hooks/useConfirmDialog";

export default function ChatList() {
  const snackbar = useSnackbar();
  const [chat, setChat] = useState<Chat[]>([]);

   const bus = useBus();
   const confirm = useConfirm();

  // Menu state
  const [anchorEl1, setAnchorEl1] = useState<null | HTMLElement>(null);
  const [menuChatId, setMenuChatId] = useState<string | null>(null);

  // === RENAME DIALOG STATE ===
  const [isRenameDialogOpen, setIsRenameDialogOpen] = useState(false);
  const [renameInput, setRenameInput] = useState('');
  const [chatIdToRename, setChatIdToRename] = useState<string | null>(null);

  useListener("newChatCreated", (e) => {
    setChat((prev) => [e as Chat, ...prev]);
  });

  useListener("chatDeleted", (id) => {
      setChat((prev) => prev.filter((chat) => chat._id?.toString() !== id));
  });

    useListener("chatArchived", (id) => {
      setChat((prev) => prev.filter((chat) => chat._id?.toString() !== id));
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
        bus.emit("chatDeleted", id);
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

  // Function to open the dialog, called from the menu item
  const handleOpenRenameDialog = (chatId: string, currentTitle: string) => {
    handleClose1(); // Always close the context menu
    setChatIdToRename(chatId);
    setRenameInput(currentTitle);
    setIsRenameDialogOpen(true);
  };

  // Function to close the dialog and reset the state
  const handleCloseRenameDialog = () => {
    setIsRenameDialogOpen(false);
    setChatIdToRename(null);
    setRenameInput('');
  };



  const updateisArchived = useCallback(
  async (id: string) => {
       try {
        await axios.patch("/api/update/" + id, {isArchived: true});
        setChat((prev) => prev.filter(x => x._id !== id));
        bus.emit("chatArchived", id);

        // Close menu if archive chat had menu open
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

const updateTitle = useCallback(
    async () => {
      const newTitle = renameInput.trim();
      if (!chatIdToRename || !newTitle) {
        handleCloseRenameDialog();
        return;
      }

      try {
        await axios.patch("/api/update/" + chatIdToRename, { title: newTitle });

        // Update the chat title in the local state
        setChat((prev) =>
          prev.map((c) =>
            c._id === chatIdToRename ? { ...c, title: newTitle } : c
          )
        );

        handleCloseRenameDialog();
        snackbar.enqueueSnackbar("Chat renamed successfully", { variant: "success" });

      } catch (e: any) {
        snackbar.enqueueSnackbar(e.response?.data?.message || "Error renaming chat", { variant: "error" });
      }
    },
    [snackbar, chatIdToRename, renameInput]
  );



    const shareChat = useCallback(
       async (c:  Chat) => {
       try {
          // 1. Ask backend to generate/get publicId
        const resposne = await axios.post<Chat>(`/api/share/${c._id}`)
        const publicId = resposne.data.publicId

      //Build the frontend share url
      const shareUrl = `${window.location.origin}/public/${publicId}`;

     
      // 3. Detect if Web Share API is available
      if (navigator.share) {
        // Mobile / supported browsers
        await navigator.share({
          title: c.title,
          text: "Check out this chat!",
          url: shareUrl,
        });
      } else {
        // Desktop fallback: copy to clipboard
        await navigator.clipboard.writeText(shareUrl);
        snackbar.enqueueSnackbar("Share link copied to clipboard", {
          variant: "success",
        });
      }

        // Close menu if deleted chat had menu open
        if (menuChatId === c._id) {
          setAnchorEl1(null);
          setMenuChatId(null);
        }
      } catch (e: any) {
        snackbar.enqueueSnackbar(e.response?.data?.message || "Error", { variant: "error" });
      }
    

  },
  [snackbar, menuChatId] 
);






  return ( <>
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
                  <ListItemText primary={c.title.length > 11 ? c.title.slice(0,11)+ "..." : c.title} />
                </ListItemButton>

                {/* Menu Button */}
                <IconButton edge="end" aria-label="menu" onClick={(e) => handleClick1(e, c._id!)}
                sx={{display:{xs: "none", md: "inline-flex"}}} >
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
                  <MenuItem onClick={async (l)=>{
                    l.stopPropagation()
                     await shareChat(c)
                  }} >
                    <ListItemIcon>
                      <Share fontSize="small" />
                    </ListItemIcon>
                    Share
                  </MenuItem>
                  <MenuItem onClick={() => handleOpenRenameDialog(c._id!, c.title)}>
                    <ListItemIcon>
                      <DriveFileRenameOutlineIcon fontSize="small" />
                    </ListItemIcon>
                    Rename
                  </MenuItem>
                  <MenuItem onClick={async (e)=>{
                    e.stopPropagation();
                     await updateisArchived(c._id!)
                  }} >
                    <ListItemIcon>
                      {c.isArchived ? (<BookmarkIcon fontSize="small" />): (<BookmarkBorderIcon fontSize="small" />)}
                    </ListItemIcon>
                    Archive
                  </MenuItem>
                  {/* Delete opens confirmation dialog */}
                  <MenuItem
                    onClick={async (e) => {
                      e.stopPropagation();
                      const ok = await confirm({
                        title: "Delete this item?",
                        message: "This action cannot be undone. This chat will be deleted permanently.",
                      });
                      if (ok) {
                        await deleteChat(c._id!);
                      }
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

          {/* Rename Dialog */}
      <Dialog
        open={isRenameDialogOpen}
        onClose={handleCloseRenameDialog}
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle>Rename Chat</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="new-chat-title-input"
            label="New Chat Title"
            type="text"
            fullWidth
            variant="standard"
            value={renameInput}
            onChange={(e) => setRenameInput(e.target.value)}
            // Allows 'Enter' key to trigger the rename action
            onKeyDown={(e) => {
                if (e.key === 'Enter' && renameInput.trim()) {
                    updateTitle();
                }
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseRenameDialog}>Cancel</Button>
          <Button onClick={updateTitle} disabled={!renameInput.trim()}>
            Rename
          </Button>
        </DialogActions>
      </Dialog>

    </>
  );
}
