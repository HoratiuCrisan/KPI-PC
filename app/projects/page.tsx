"use client"
import {
     Box, 
     Toolbar, 
     Container, 
     Typography,
     Grid,
     Button,
     Divider
    } 
from "@mui/material"
import Navbar from "../components/navbar"
import Sidebar from "../components/sidebar"
import React, {useState, useEffect} from "react"
import Link from "next/link"
import ProjectsCard from "../components/projectsPage/projectsCards"

interface Project {
    ID_PROJECT: number,
    PROJECT_NAME: string,
    TEAM: string,
    PROJECT_STATUS: string,
    DESCRIPTION: string,
    TERM_START: Date,
    TERM_END: Date
}

interface User {
    ID_EMPLOYEE: Number,
    FIRST_NAME: String,
    LAST_NAME: String,
    TEAM_N: String
}

interface ProjectArray {
    Project: Project,
    Manager: User,
    Users: User[]
}

const Projects = () => {
    const [projectArray, setProjectArray] = useState<ProjectArray[]>([])

    const [userRole, setRole] = useState(""); // Add role state
    const [userTeam, setTeam] = useState<string | null>(null);
    
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
          setRole(role);
          setTeam(team);
         }
      }, []);
      
      return null; // Return null or a loading indicator if needed
    };
      
    useRequireAuth();

    useEffect(() => {
        const fetchProjects = async () => {
        try {

            const response = await fetch('/get-project-details', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            });

            if (response.ok) {
                const data = await response.json();
                console.log(data)
                setProjectArray(createProject(data.projects, data.managers, data.users))
            } else {
            console.error('Failed to fetch users');
            }
        } catch (error) {
            console.error('An error occurred:', error);
        }
        };
        
        fetchProjects()
        
    }, []);

    function createProject(projects: Project[], managers: User[], users: User[]) {
        let _all_projects : ProjectArray[] = []
            for (let elem of projects) {
                let _current_users: User[] = []
                for (let usr of users) {  
                    if (elem.TEAM == usr.TEAM_N) {
                        _current_users.push(usr)
                        
                    }
                }

                for (let mgr of managers) {
                    if (mgr.TEAM_N == elem.TEAM) {
                        const _current_project = {
                            Project: elem,
                            Manager: mgr,
                            Users: _current_users
                        }
                        _all_projects.push(_current_project)
                    }
                }
            }
        return _all_projects
    }

    let _all_projects_array : ProjectArray[] = []
    if (projectArray.length > 0) {
        projectArray.map((elem) => {
            _all_projects_array.push(elem)
        })
        
    }



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
                    
                    <Grid container spacing={2} alignItems={"center"} sx={{mb: 8}}>
                        <Grid item xs={6}>
                            <Typography variant="body1" align="left" fontWeight={800}>
                                Project List
                            </Typography>
                        </Grid>

                        {(userRole === "2" || userRole === "3") && (
                        <Grid item xs={6} container justifyContent="flex-end">
                            <Button variant="contained" href="/projectsForm">
                            Add project
                            </Button>
                        </Grid>
                        )}
                    </Grid>
    
                    <Divider />
                    <Toolbar sx={{mt: -5}} />
                    
                    <Grid container spacing={3}>
                        {
                           _all_projects_array.length ==0 && 
                            <Typography 
                                variant="body1" 
                                align="left"
                                fontWeight={800}
                                sx={{ml: 5, mt: 5}}
                            >
                                No projects yet!
                            </Typography>
                         }
                         {
                            _all_projects_array
                            .filter(
                            (elem: ProjectArray) =>
                                userRole === "1" || userRole === "2" ? elem.Project.TEAM === userTeam : true
                            )
                            .map((elem: ProjectArray) => {
                            return (
                                <Grid item xs={4} key={elem.Project.ID_PROJECT}>
                                <ProjectsCard
                                    sx={{ height: '100%' }}
                                    projectId={elem.Project.ID_PROJECT}
                                    projectName={elem.Project.PROJECT_NAME}
                                    sDate={elem.Project.TERM_START}
                                    eDate={elem.Project.TERM_END}
                                    status={elem.Project.PROJECT_STATUS}
                                    teamName={elem.Project.TEAM}
                                    key={elem.Project.ID_PROJECT}
                                />
                                </Grid>
                            );
                            })
                        }      
                    </Grid>
                   
                    <Toolbar />
                    
                </Container>
            </Box>
        </div>
    )
}

export default Projects