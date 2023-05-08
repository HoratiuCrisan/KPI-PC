"use client"
import { Box, Toolbar } from "@mui/material"
import Navbar from "../components/navbar"
import Sidebar from "../components/sidebar"

const Teams = () => {
    return (
        <div className="flex">
        <Navbar />
        <Sidebar />
        
        <Box component={"main"} sx={{flexGrow: 1, p: 3}}>
            <Toolbar />
            <h1 className="font-bold pl-4 pt-4"><span className="text-blue-500">Dashboard /</span> Teams</h1>
        </Box>
        </div>
    )
}

export default Teams