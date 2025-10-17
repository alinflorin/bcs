import { Box, FormControl, InputAdornment, InputLabel, OutlinedInput, } from "@mui/material";

export default function Chat() {
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