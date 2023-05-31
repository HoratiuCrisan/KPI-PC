"use client"
import {
    Box,
    Container,
    Toolbar,
    Typography,
    Grid,
    Stack,
    Card,
    CardContent,
    Divider,
    Button
} 
from "@mui/material"
import Navbar from "../../components/navbar"
import Sidebar from "../../components/sidebar"
import { useSearchParams  } from "next/navigation"
import { useEffect, useState } from "react"
import DetailsCards from "../../components/projectsPage/detailsCards"

interface Project_User {
    ID_PROJECT: number,
    PROJECT_NAME: string,
    TEAM: string,
    PROJECT_STATUS: string,
    DESCRIPTION: string,
    TERM_START: Date,
    TERM_END: Date,
    ID_EMPLOYEE: number,
    FIRST_NAME: string,
    LAST_NAME: string,
    EMAIL: string,
    POSITION: number
}

interface Project {
    ID_PROJECT: number,
    PROJECT_NAME: string,
    TEAM: string,
    PROJECT_STATUS: string,
    DESCRIPTION: string,
    TERM_START: Date,
    TERM_END: Date,
}

interface User {
    ID: number,
    NAME: string,
    EMAIL: string,
    POSITION: number
}



const ProjectDetails= () => {
    const [project, setProject] = useState<Project>()
    const [manager, setManager] = useState<User>()
    const [users, setUsers] = useState<User[]>()
    const [empNumber, setEmpNumber] = useState<Number>(0)
    const searchParams = useSearchParams ()
    const id = searchParams.get('id')
   

   useEffect(() => {
    const fetchProjects = async () => {
    try {

        const response = await fetch('/get-project-details' + id, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        });

        if (response.ok) {
            const data = await response.json();
            //getting project details
            const current_project = {
                ID_PROJECT: data.project[0].ID_PROJECT,
                PROJECT_NAME: data.project[0].PROJECT_NAME,
                TEAM: data.project[0].TEAM,
                DESCRIPTION: data.project[0].DESCRIPTION,
                PROJECT_STATUS: data.project[0].PROJECT_STATUS,
                TERM_START: data.project[0].TERM_START,
                TERM_END: data.project[0].TERM_END
            }
            
            //getting the manager data
            const current_manager = data.project.filter((elem:Project_User) => 
                elem.POSITION == 2
            ).map((elem:Project_User) => {
                return {
                    ID: elem.ID_EMPLOYEE,
                    NAME: elem.FIRST_NAME + ' ' + elem.LAST_NAME,
                    EMAIL: elem.EMAIL,
                    POSITION: elem.POSITION
                }
            })
            
            //getting all users
            const current_users = data.project.filter((elem:Project_User) =>
                elem.POSITION == 1
            ).map((elem:Project_User) => {
                return {
                    ID: elem.ID_EMPLOYEE,
                    NAME: elem.FIRST_NAME + ' ' + elem.LAST_NAME,
                    EMAIL: elem.EMAIL,
                    POSITION: elem.POSITION
                }
            })
            setProject(current_project)
            setManager(current_manager[0])
            setUsers(current_users)
            setEmpNumber(current_users.length + 1)
            
        } else {
        console.error('Failed to fetch users');
        }
    } catch (error) {
        console.error('An error occurred:', error);
    }
    };
    
    fetchProjects()
    
}, []);

    return (
        <div className="flex">
        <Navbar />
        <Sidebar />

        <Box 
            component="main" 
            sx={{flexGrow: 1, py: 8}}
        >
                <Container maxWidth="xl">
                    <Toolbar sx={{mt: -5}} />
                    <DetailsCards 
                        project={project}
                        manager={manager}
                        users={users}
                        empNumber={empNumber}
                    />
                </Container>
        </Box>
        </div>
    )
}

export default ProjectDetails 



