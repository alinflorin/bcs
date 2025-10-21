import { Avatar, Box, Button, FormControl, InputAdornment, InputLabel, List, ListItem, ListItemAvatar, ListItemButton, ListItemText, OutlinedInput, styled, Typography } from "@mui/material";
import FolderIcon from '@mui/icons-material/Folder';
import SearchIcon from '@mui/icons-material/Search';
import { useEffect, useState } from "react";
import { Chat } from "../models/chat";
import { useSnackbar } from "notistack";
import axios from "axios";
import { Link } from "react-router";

export default function Search() {

    const snackbar = useSnackbar();
    const [firstchat, firstsetChat]= useState<Chat[]>([])




    useEffect(()=>{
        (async()=>{

            try{

                const first10chat = await axios.get('/api/chats?limit=10')
                firstsetChat(first10chat.data)

            }catch(e: any){
          snackbar.enqueueSnackbar(e.response?.data?.message || "Error", {
          variant: "error",
        });
            }

        })()
    },[])



    return <div>
 
 
  <Typography sx={{ mt: 4, mb: 2 }} variant="h6" component="div">
         
        <Box sx={{ display:'flex', justifyContent:'center', alignItems:'center'}} >
            <FormControl sx={{ width: "60%", maxWidth: 600 }}>
            <InputLabel>Search Chat</InputLabel>
            <OutlinedInput endAdornment={ 
            <InputAdornment position="end">
              <Button variant="contained" startIcon={<SearchIcon />}>   Search </Button>
           </InputAdornment>}label="Search Chat"/>
 </FormControl>
        </Box>


          </Typography>
          <Box sx={ {backgroundColor:'black'}} >
            <List>
             {firstchat.map(c =>  <ListItemButton component={Link} to={"/chat/" + c._id!} key={c._id}
                >
                  <ListItemAvatar>
                    <Avatar>
                      <FolderIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={c.title}
             
                  />
                </ListItemButton>)}
              
           
            </List>
          </Box>
  
   
  
    
    </div>
}