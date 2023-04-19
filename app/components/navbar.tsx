import { Typography, Toolbar, IconButton, AppBar, Grid } from "@mui/material";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import MenuIcon  from "@mui/icons-material/Menu"
export default function Navbar() {
    return (
        <div>
           <AppBar position="static" className="bg-gray-100 text-black">
                <Toolbar variant="dense" > 
                     <IconButton className="flex justify-end lg:hidden" edge="start"  color="inherit" aria-label="menu" sx={{ mr: 2 }}>
                         <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" color="inherit" component="div" className="text-blue-500 font-bold text-xl ">
                    KPI
                    </Typography>
                    <IconButton >
                        <AccountCircleIcon />
                    </IconButton>
                </Toolbar>
            </AppBar>
        </div>
    )
}