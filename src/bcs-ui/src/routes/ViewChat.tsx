import {
  Box,
  FormControl,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Typography,
  Paper,
  Button,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";
import axios from "axios";
import { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate, useParams } from "react-router";
import { Chat } from "../models/chat";
import { useSnackbar } from "notistack";
import { Message } from "../models/message";
import { Delete, Share } from "@mui/icons-material";
import DriveFileRenameOutlineIcon from "@mui/icons-material/DriveFileRenameOutline";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder"; 
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import React from "react";
import { useConfirm } from "../hooks/useConfirmDialog";
import { useBus } from "react-bus";


export default function ViewChat() {
  const params = useParams();
  const snackbar = useSnackbar();
  const confirm = useConfirm();
  const bus = useBus();
  const navigate = useNavigate()
  

  const [chat, setChat] = useState<Chat | undefined>();
  const [messages, setMessages] = useState<Message[]>([]); // 👈 null means "not loaded yet"
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const [inputText, setInputText] = useState(""); // For the send input

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

    // === RENAME DIALOG STATE ===
    const [isRenameDialogOpen, setIsRenameDialogOpen] = useState(false);
    const [renameInput, setRenameInput] = useState('');
    const [chatIdToRename, setChatIdToRename] = useState<string | null>(null);

      // Function to open the dialog, called from the menu item
  const handleOpenRenameDialog = (chatId: string, currentTitle: string) => {
    handleClose(); // Always close the context menu
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

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
 



  // Scroll to bottom when new messages arrive
  useEffect(() => {
    if (messages && messages.length > 0) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Fetch chat + messages
  useEffect(() => {
    (async () => {
      try {
        const [chatResponse, messageResponse] = await Promise.all([
          axios.get<Chat>("/api/chat/" + params.id),
          axios.get<Message[]>("/api/messages/" + params.id),
        ]);

        setChat(chatResponse.data);
        setMessages(messageResponse.data || []); // fallback to empty array
        
      } catch (e: any) {
        console.error(e);
        snackbar.enqueueSnackbar(e.response?.data?.message || "Error", {
          variant: "error",
        });
        setMessages([]); // fallback to empty array if error
      }
    })();
  }, [params.id, snackbar]);

  const hasMessages = messages && messages.length > 0;

  const handleSend = async ()=>{
    if(!inputText.trim()) return;
    const myMessage: Message = {
      isFromAi: false,
      chatId: params.id!,
      text: inputText,
      date: new Date().getTime()
    };
    setMessages(m => [...m!, myMessage]);
    try{
      const response = await axios.post<Message>("/api/messages", {
        
        chatId: params.id!,
        text: inputText,

      } as Message)

      setMessages((prev)=> [...(prev || []), response.data])
      setInputText("")  //clear input 

    }catch(e: any){
      snackbar.enqueueSnackbar(e.response?.data?.message || 'Failed to send', {
        variant: "error"
      })
    }
  }

  
       
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
    
           
          } catch (e: any) {
            snackbar.enqueueSnackbar(e.response?.data?.message || "Error", { variant: "error" });
          }
        
    
      },
      [snackbar] 
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
           setChat((prev: any) => {
             if (!prev) return prev;
             return { ...prev, title: newTitle};
             });
    
            handleCloseRenameDialog();
            snackbar.enqueueSnackbar("Chat renamed successfully", { variant: "success" });
    
          } catch (e: any) {
            snackbar.enqueueSnackbar(e.response?.data?.message || "Error renaming chat", { variant: "error" });
          }
        },
        [snackbar, chatIdToRename, renameInput]
      );


    
  const updateisArchived = useCallback(
      async (id: string) => {
           try {
            await axios.patch("/api/update/" + id, {isArchived: true});
            navigate('/')
            bus.emit("chatArchived", id);
    
          } catch (e: any) {
            snackbar.enqueueSnackbar(e.response?.data?.message || "Error", { variant: "error" });
          }
        
    
      },
      [snackbar, ] 
    );


  const deleteChat = useCallback(
      async (id: string) => {
        try {
          await axios.delete("/api/delete/" + id);
          navigate('/')
          bus.emit("chatDeleted", id);
         
        } catch (e: any) {
          snackbar.enqueueSnackbar(e.response?.data?.message || "Error", { variant: "error" });
        }
      },
      [snackbar]
    );
    




  return (
   <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
      }}
    >
      {/* --- If there are messages --- */}
      {hasMessages ? (
        <>
          {/* Chat header */}
          <Box
            sx={{
               display:'flex',
               justifyContent:'space-between',
              borderBottom: "1px solid #eee",
            }}
          >
            <Typography variant="h6" color="text.secondary">
              {chat?.title}
            </Typography>

              {/* Menu Button */}
                <IconButton edge="end" aria-label="menu" onClick={handleClick} > 
                   <MoreHorizIcon />
                </IconButton>

                {/* Menu */}
                <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        slotProps={{
          paper: {
            elevation: 0,
            sx: {
              overflow: 'visible',
              filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
              mt: 1.5,
              '& .MuiAvatar-root': {
                width: 32,
                height: 32,
                ml: -0.5,
                mr: 1,
              },
              '&::before': {
                content: '""',
                display: 'block',
                position: 'absolute',
                top: 0,
                right: 14,
                width: 10,
                height: 10,
                bgcolor: 'background.paper',
                transform: 'translateY(-50%) rotate(45deg)',
                zIndex: 0,
              },
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}>
      
      
       
        <MenuItem  onClick={async (l)=>{
                    l.stopPropagation()
                     await shareChat(chat!)
                     handleClose()
                  }}>
          <ListItemIcon>
            <Share fontSize="small" />
          </ListItemIcon>
          Share
        </MenuItem>

         <MenuItem   onClick={() => handleOpenRenameDialog(chat!._id!, chat!.title)}>
          <ListItemIcon>
            <DriveFileRenameOutlineIcon fontSize="small" />
          </ListItemIcon>
          Rename
        </MenuItem>

         <MenuItem onClick={async (e)=>{
                    e.stopPropagation();
                     await updateisArchived(chat!._id!)
                     handleClose()
                  }}>
          <ListItemIcon>
            <BookmarkBorderIcon fontSize="small" />
          </ListItemIcon>
          Archive
        </MenuItem>

         <MenuItem  onClick={async (e) => {
                      e.stopPropagation();
                      const ok = await confirm({
                        title: "Delete this item?",
                        message: "This action cannot be undone. This chat will be deleted permanently.",
                      });
                      if (ok) {
                        await deleteChat(chat!._id!);
                      }
                      handleClose();
                    }} >
          <ListItemIcon>
            <Delete fontSize="small" />
          </ListItemIcon>
          Delete
        </MenuItem>
      </Menu>


          </Box>

          {/* Scrollable messages */}
          <Box
            sx={{
              flex: 1,
              overflowY: "auto",
              p: 3,
              display: "flex",
              flexDirection: "column",
              gap: 2,
            }}
          >
            {messages.map((m, i) => (
              <Box
                key={i.toString()}
                sx={{
                  display: "flex",
                  justifyContent: m.isFromAi ? "flex-start" : "flex-end",
                }}
              >
                <Paper
                  elevation={1}
                  sx={{
                    p: 2,
                    borderRadius: 3,
                    maxWidth: "75%",
                    backgroundColor: m.isFromAi ? "#ffffff" : "#0b93f6",
                    color: m.isFromAi ? "black" : "white",
                  }}
                >
                  <Typography variant="body1">{m.text}</Typography>
                </Paper>
              </Box>
            ))}
            <div ref={messagesEndRef} />
          </Box>

          {/* Fixed bottom input with send button */}
          <Box
            sx={{
              position: "sticky",
              bottom: 0,
              borderTop: "1px solid #e0e0e0",
              p: 2,
            }}
          >
            <FormControl fullWidth sx={{ borderRadius: 3 }}>
              <InputLabel>Ask anything</InputLabel>
              <OutlinedInput
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={async (e)=>{
                  if (e.key === "Enter" && !e.shiftKey){
                    e.preventDefault() //prevent newline
                    await handleSend()
                  }
                }}
                endAdornment={
                  <InputAdornment position="end">
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleSend}
                      disabled={!inputText.trim()}
                    >
                      Send
                    </Button>
                  </InputAdornment>
                }
                label="Ask anything"
              />
            </FormControl>
          </Box>
        </>
      ) : (
        // --- If there are NO messages, show centered input only ---
        <Box
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            px: 2,
          }}
        >
          <Typography variant="h4" mb={3}>
            What are you working on?
          </Typography>

          <FormControl sx={{ width: "100%", maxWidth: 800 }}>
            <InputLabel>Ask anything</InputLabel>
           <OutlinedInput
  value={inputText}
  onChange={(e) => setInputText(e.target.value)}
  onKeyDown={async(e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault(); // Prevent new line
      await handleSend();
    }
  }}
  endAdornment={
    <InputAdornment position="end">
      <Button
        variant="contained"
        color="primary"
        onClick={handleSend}
        disabled={!inputText.trim()}
      >
        Send
      </Button>
    </InputAdornment>
  }
  label="Ask anything"
/>
          </FormControl>
        </Box>
      )}


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
    </Box>

  );
}
