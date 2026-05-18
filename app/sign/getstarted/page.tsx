'use client'
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import Button from "@mui/material/Button";
import { useRouter } from 'next/navigation'
 
export default function Loginpage() {
  const router = useRouter()
 
  return (
   <Button
     type="button"
     onClick={() => router.push('/sign')}
     variant="contained"
     endIcon={<ArrowForwardIcon />}
     sx={{
       backgroundColor: "#00796b",
       px: 4,
       py: 1.5,
       borderRadius: "10px",
       textTransform: "none",
       boxShadow: "0 8px 20px rgba(0, 121, 107, 0.25)",
       "&:hover": {
         backgroundColor: "#00695c",
       },
     }}
   >
     Get Started
   </Button>
  )
  
}