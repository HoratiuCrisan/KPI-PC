import { Typography, Toolbar, IconButton, AppBar, Menu, MenuItem, Avatar} from "@mui/material";
import DashboardIcon from '@mui/icons-material/Dashboard';
import pfpAvatar from "../../public/assets/pfpAvatar.svg"
import React, { useState, useEffect } from 'react'
import Image from 'next/image'

export default function Navbar() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [userRole, setRole] = useState(""); // Add role state
  const [userTeam, setTeam] = useState<string | null>(null)
  const [userEmail, setEmail] = useState("")

  const useRequireAuth = () => {
    useEffect(() => {
      // Check if the user is logged in
      const email = localStorage.getItem('email');
      const role = localStorage.getItem('role');
      const team = localStorage.getItem('team');
  
      if (!email || !role) {
        // If the user is not logged in, redirect to the login page
        window.location.href = "/";
       }else{
        setRole(role)
        setTeam(team)
        setEmail(email)
       }
    }, []);
    
    return null; // Return null or a loading indicator if needed
  };
    
  useRequireAuth();

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const logout = () => {
    localStorage.clear(); // Clear localStorage data
    window.location.href = "/"; // Redirect the user to the homepage
    console.log('User logged out');
  };

  const email = localStorage.getItem('email')

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
          <IconButton onClick={handleClick} component="span">
            <Avatar>
              <Image src={pfpAvatar} alt={"pfp"} width={40} height={40}/>
            </Avatar>
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <MenuItem onClick={handleClose}>{userEmail}</MenuItem>
            <MenuItem onClick={logout}>Sign out</MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
    </div>
  );
}