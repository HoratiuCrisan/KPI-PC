"use client"
import { useEffect, useState } from "react";
import Navbar from "../components/navbar";
import Sidebar from "../components/sidebar";
import Statistics from "../statistics/page";
import {Box, Typography, Toolbar} from '@mui/material'

const Dashboard = () => {

  const useRequireAuth = () => {
    useEffect(() => {
      // Check if the user is logged in
      const email = localStorage.getItem('email');
      const role = localStorage.getItem('role');
  
      if (!email || !role) {
        // If the user is not logged in, redirect to the login page
        window.location.href = "/";
       }
    }, []);
    
    return null; // Return null or a loading indicator if needed
  };
    
  useRequireAuth();

  return (
    <div className="flex">
      <Navbar />
      <Sidebar />
      <Box component={"main"} sx={{flexGrow: 1, p: 2}}>
            <Statistics />
        </Box>
    </div>
  )  
}

export default Dashboard;