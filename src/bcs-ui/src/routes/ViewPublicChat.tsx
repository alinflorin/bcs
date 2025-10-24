import { Box, Typography, Paper } from "@mui/material";
import axios from "axios";
import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router";
import { Message } from "../models/message";

export default function ViewPublicChat() {

  const { publicId } = useParams<{ publicId: string }>();
   const messagesEndRef = useRef<HTMLDivElement | null>(null);


  const [chatTitle, setChatTitle] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
 

  // Scroll to bottom when messages load
  useEffect(() => {
    if (messages.length > 0) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Fetch public chat messages
  useEffect(() => {
    (async () => {
      try {
        const response = await axios.get(`/api/public/${publicId}`);
        setChatTitle(response.data.chatTitle);
        setMessages(response.data.messages || []);
      } catch (e: any) {
        console.error(e);
        setMessages([]);
      }
    })();
  }, [publicId]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        p: 2,
      }}
    >
      {/* Chat title */}
      <Box sx={{ textAlign: "center", mb: 2 }}>
        <Typography variant="h6">{chatTitle}</Typography>
      </Box>

      {/* Messages */}
      <Box
        sx={{
          flex: 1,
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        {messages.map((m, i) => (
          <Box
            key={i}
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
    </Box>
  );
}
