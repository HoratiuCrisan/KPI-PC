"use client"
import Navbar from "../components/navbar";
import Sidebar from "../components/sidebar";
import Statistics from "../statistics/page";
import {Box, Typography, Toolbar} from '@mui/material'

const Dashboard = () => {
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