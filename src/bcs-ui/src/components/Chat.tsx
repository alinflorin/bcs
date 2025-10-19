import { Box, FormControl, InputAdornment, InputLabel, OutlinedInput, } from "@mui/material";
import axios from "axios";
import { useEffect } from "react";
import { useParams } from "react-router";
import { Chat } from "../models/chat";

export default function Chat() {

     const params  = useParams()

     useEffect(()=>{

      (async ()=>{
        const response = await axios.get<Chat>('/api/chat/'+ params.id);
        console.log(response.data)
      })()

     }, [params.id])
    


    return  <>
       <Box sx={{ display: "flex", flexDirection:"column", alignItems: "center", justifyContent: "center", height:'100%'}} >
    
         <p>What are you working on?</p>

         <FormControl fullWidth sx={{ m: 1 }}>
          <InputLabel htmlFor="outlined-adornment-amount">Ask anything</InputLabel>
          <OutlinedInput
            id="outlined-adornment-amount"
            startAdornment={<InputAdornment position="start">+</InputAdornment>}
            label="Amount"
          />
        </FormControl>
        
      </Box>
 
    
    </>
}