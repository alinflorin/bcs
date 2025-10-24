import {
  Avatar,
  Box,
  Button,
  FormControl,
  InputAdornment,
  InputLabel,
  List,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  OutlinedInput,
  Typography,
  Paper,
} from "@mui/material";
import FolderIcon from "@mui/icons-material/Folder";
import SearchIcon from "@mui/icons-material/Search";
import SearchOffIcon from "@mui/icons-material/SearchOff";
import { useCallback, useEffect, useState } from "react";
import { Chat } from "../models/chat";
import { useSnackbar } from "notistack";
import axios from "axios";
import { Link } from "react-router";
import { snippetAroundWord } from "../helpers/string-helpers";
import { useListener } from "react-bus";

export default function Search() {
  const snackbar = useSnackbar();
  const [chats, setChats] = useState<Chat[]>([]);
  const [search, setSearch] = useState<string>("");

  useListener("chatDeleted", (id) => {
    setChats((prev) => prev.filter((chat) => chat._id?.toString() !== id));
  });

  useListener("chatArchived", (id) => {
    setChats((prev) => prev.filter((chat) => chat._id?.toString() !== id));
  });

  useEffect(() => {
    (async () => {
      try {
        const first10chat = await axios.get("/api/chats?limit=10");
        setChats(first10chat.data);
      } catch (e: any) {
        snackbar.enqueueSnackbar(e.response?.data?.message || "Error", {
          variant: "error",
        });
      }
    })();
  }, []);

  const executeSearch = useCallback(async () => {
    if (search.trim() === "") return;
    try {
      const response = await axios.get(
        "/api/chats?search=" + encodeURIComponent(search)
      );
      setChats(response.data);
    } catch (e: any) {
      snackbar.enqueueSnackbar(e.response?.data?.message || "Error", {
        variant: "error",
      });
    }
  }, [search, snackbar]);

  const bold = useCallback((text: string, search: string) => {
    const parts = text.split(new RegExp(`(${search})`, "gi"));
    return (
      <>
        {parts.map((part, idx) =>
          part.toLowerCase() === search.toLowerCase() ? (
            <strong key={idx}>{part}</strong>
          ) : (
            <span key={idx}>{part}</span>
          )
        )}
      </>
    );
  }, []);

  return (
    <Box sx={{ px: { xs: 2, sm: 4 }, py: 3, bgcolor: "#121212", minHeight: "100vh" }}>
      {/* Search bar */}
      <Box sx={{ maxWidth: 800, mx: "auto", mb: 4 }}>
        <FormControl fullWidth>
          <InputLabel sx={{ color: "#b0b0b0" }}>Search Chat</InputLabel>
          <OutlinedInput
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={async (e) => {
              if (e.key === "Enter") await executeSearch();
            }}
            endAdornment={
              <InputAdornment position="end">
                <Button
                  variant="contained"
                  startIcon={<SearchIcon />}
                  onClick={executeSearch}
                  sx={{
                    bgcolor: "#0b93f6",
                    color: "white",
                    "&:hover": { bgcolor: "#0977d6" },
                  }}
                >
                  Search
                </Button>
              </InputAdornment>
            }
            label="Search Chat"
            sx={{
              bgcolor: "#1e1e1e",
              borderRadius: 2,
              color: "white",
              "& .MuiOutlinedInput-notchedOutline": { borderColor: "#333" },
              "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#0b93f6" },
            }}
          />
        </FormControl>
      </Box>

      {/* Chats list */}
      {chats.length === 0 && search.trim() !== "" ? (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            py: 8,
            color: "white",
          }}
        >
          <SearchOffIcon sx={{ fontSize: 60, mb: 2 }} />
          <Typography variant="h6">No chats found</Typography>
        </Box>
      ) : (
        <List sx={{ maxWidth: 800, mx: "auto", gap: 1 }}>
          {chats.map((c) => (
            <Paper
              key={c._id}
              sx={{
                mb: 1,
                borderRadius: 2,
                overflow: "hidden",
                bgcolor: "#1e1e1e",
                "&:hover": { bgcolor: "#2a2a2a" },
              }}
            >
              <ListItemButton component={Link} to={"/chat/" + c._id} sx={{ px: 2, py: 1.5 }}>
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: "#0b93f6" }}>
                    <FolderIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Typography
                      noWrap
                      sx={{ color: "white", fontWeight: 500 }}
                    >
                      {c.title}
                    </Typography>
                  }
                  secondary={
                    c.searchMessagesResult && c.searchMessagesResult.length > 0 ? (
                      <Typography
                        sx={{
                          color: "#b0b0b0",
                          fontSize: "0.875rem",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {bold(
                          snippetAroundWord(c.searchMessagesResult[0].text, search, 50),
                          search
                        )}
                      </Typography>
                    ) : null
                  }
                />
              </ListItemButton>
            </Paper>
          ))}
        </List>
      )}
    </Box>
  );
}
