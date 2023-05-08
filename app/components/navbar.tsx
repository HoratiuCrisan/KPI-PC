import { Typography, Toolbar, IconButton, AppBar, Menu, MenuItem, Avatar} from "@mui/material";
import DashboardIcon from '@mui/icons-material/Dashboard';
import pfpAvatar from "../../public/assets/pfpAvatar.svg"
import React, {useState} from 'react'
import Image from 'next/image'

export default function Navbar() {

    const [anchorEl, setAnchorEl] = useState(null)
    const handleClick = (event: any) => {
        setAnchorEl(event.currentTarget)
    }

    const handleClose = () => {
        setAnchorEl(null)
    }

    return (
        <div>
           <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }} className="text-black" style={{background: '#f3f4f6'}}>
                <Toolbar variant="dense" > 
                    <IconButton edge="start" aria-label="logo">
                        <DashboardIcon className="text-black bg-gray-100"/>
                    </IconButton>
                    <Typography variant="h6"  component="div" className="font-bold text-xl" sx={{ flexGrow: 1}} style={{color: '#3b82f6'}}>
                    KPI
                    </Typography>
                    <IconButton onClick={handleClick} >
                        <Avatar>
                            <Image src={pfpAvatar} alt={"pfp"} width={40} height={40}/>
                        </Avatar>
                    </IconButton>
                    <Menu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={handleClose}
                    >
                        <MenuItem onClick={handleClose}>Account</MenuItem>
                        <MenuItem onClick={handleClose}>Sign out</MenuItem>
                    </Menu>
                </Toolbar>
            </AppBar>
        </div>
    )
}