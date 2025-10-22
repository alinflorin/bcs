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
import { Delete, Folder, Share } from "@mui/icons-material";
import { useConfirm } from "../hooks/useConfirmDialog";

export default function ChatList() {
  const snackbar = useSnackbar();
  const [chat, setChat] = useState<Chat[]>([]);

  // Menu state
  const [anchorEl1, setAnchorEl1] = useState<null | HTMLElement>(null);
  const [menuChatId, setMenuChatId] = useState<string | null>(null);

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

  const bus = useBus();

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



  const updateisArchived = useCallback(
  async (id: string) => {
       try {
        await axios.patch("/api/update/" + id, {isArchived: true});
        setChat((prev) => prev.filter(x => x._id !== id));

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

const confirm = useConfirm();

  return (
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
                  <MenuItem onClick={async (e)=>{
                    e.stopPropagation();
                     await updateisArchived(c._id!)
                  }} >
                    <ListItemIcon>
                      {c.isArchived ? (<BookmarkIcon fontSize="small" />): (<BookmarkBorderIcon fontSize="small" />)}
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
    
  );
}
