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
    if (search.trim() === "") {
      return;
    }
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
  }, [setChats, snackbar, search]);

  const bold = useCallback((text: string, search: string) => {
    const parts = text.split(new RegExp(`(${search})`, "gi"));
    return (
      <>
        {parts.map((part, index) =>
          part.toLowerCase() === search.toLowerCase() ? (
            <strong key={index}>{part}</strong>
          ) : (
            <span key={index}>{part}</span>
          )
        )}
      </>
    );
  }, []);

  return (
    <div>
      <Typography sx={{ mt: 4, mb: 2 }} variant="h6" component="div">
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <FormControl sx={{ width: "100%", maxWidth: 800 }}>
            <InputLabel>Search Chat</InputLabel>
            <OutlinedInput
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={async (e) => {
                if (e.key === "Enter") {
                  await executeSearch();
                }
              }}
              endAdornment={
                <InputAdornment position="end">
                  <Button
                    variant="contained"
                    startIcon={<SearchIcon />}
                    onClick={executeSearch}
                  > Search
                  </Button>
                </InputAdornment>
              }
              label="Search Chat"
            />
          </FormControl>
        </Box>
      </Typography>
      <Box sx={{ backgroundColor: "black" }}>
        {chats.length === 0 && search.trim() !== "" ? (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              py: 4,
              color: "white",
            }}
          >
            <SearchOffIcon  sx={{ fontSize: 50, mb: 2 }} />
            <Typography variant="h6">No chats found</Typography>
          </Box>
        ) : (
          <List>
            {chats.map((c) => (
              <ListItemButton
                component={Link}
                to={"/chat/" + c._id!}
                key={c._id}
              >
                <ListItemAvatar>
                  <Avatar>
                    <FolderIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={c.title}
                  secondary={
                    c.searchMessagesResult &&
                    c.searchMessagesResult.length > 0
                      ? bold(
                          snippetAroundWord(
                            c.searchMessagesResult[0].text,
                            search,
                            50
                          ),
                          search
                        )
                      : undefined
                  }
                />
              </ListItemButton>
            ))}
          </List>
        )}
      </Box>
    </div>
  );
}
