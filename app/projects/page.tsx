"use client"
import { Box, Toolbar, Container, Typography } from "@mui/material"
import Navbar from "../components/navbar"
import Sidebar from "../components/sidebar"
import ProjectsForm from "../components/projectsForm"
import React, {useState} from "react"



const Projects = () => {

    return (
        <div className="flex">
        <Navbar />
        <Sidebar />

        <Box component="main" sx={{flexGrow: 1, py: 8}}>
            <Container maxWidth="xl">
                <Toolbar sx={{mt: -5}} />
                <Typography variant="h6" fontWeight={600} >
                    Home / <span className="text-blue-700"> Projects </span>
                </Typography>
                <Toolbar sx={{mt: -5}}/>
                <ProjectsForm />
            </Container>
        </Box>
        </div>
    )
}

export default Projects