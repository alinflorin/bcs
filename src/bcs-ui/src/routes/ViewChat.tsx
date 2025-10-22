import {
  Box,
  FormControl,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Typography,
  Paper,
  Button,
} from "@mui/material";
import axios from "axios";
import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router";
import { Chat } from "../models/chat";
import { useSnackbar } from "notistack";
import { Message } from "../models/message";

export default function ViewChat() {
  const params = useParams();
  const snackbar = useSnackbar();

  const [chat, setChat] = useState<Chat | undefined>();
  const [messages, setMessages] = useState<Message[]>([]); // 👈 null means "not loaded yet"
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const [inputText, setInputText] = useState(""); // For the send input



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
              textAlign: "center",
              p: 2,
              borderBottom: "1px solid #eee",
            }}
          >
            <Typography variant="h6" color="text.secondary">
              {chat?.title}
            </Typography>
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

          <FormControl sx={{ width: "60%", maxWidth: 600 }}>
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
    </Box>

  );
}
