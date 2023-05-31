"use client"
import React, {useState, useEffect} from "react"
import {Card, CardContent, Grid, TextField, Button, Container, Box, Typography, Toolbar} from "@mui/material"
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs" 
import { DateRange, LocalizationProvider} from "@mui/x-date-pickers-pro"
import { DateRangePicker } from "@mui/x-date-pickers-pro/DateRangePicker"
import {DemoContainer, DemoItem } from "@mui/x-date-pickers/internals/demo"
import Select from "react-select"
import Navbar from "../components/navbar"
import Sidebar from "../components/sidebar"
import { useRouter } from "next/navigation"

interface Team {
    ID_TEAM: Number,
    TEAM_NAME: String
}

interface Project {
    Name: String,
    Description: String,
    StartDate: Date,
    EndDate: Date,
    Team: String
}

const ProjectsForm = () => {
    const [projectName, setProjectName] = useState<String>('')
    const [projectDescription, setProjectDescription] = useState<String>('')
    const [projectTeamName, setProjectTeamName] = useState<String>('')
    const [projectDate, setProjectDate] = useState<DateRange<Date>>([null, null])
    const [formError, setFormError] = useState<String | null>(null)
    const [existingProjectNames, setProjectNames] = useState<Array<String>>([])
    const [existingTeams, setExistingTeams] = useState<Team[]>([])
    const router = useRouter()

    const handleSubmit = (event: any) => {
        event.preventDefault()
    
        {/* if the select or dateRangePicker are empty trow an error*/}
        {/* always reset the error to null berfor checking for empty fields*/}
        setFormError(null)

        if (existingProjectNames.includes(projectName)) {
            setFormError("Project with name " + projectName + " already exists")
            return
        }

        if (projectDate[0] == null) {
            setFormError("Please select a date for the project")
            return
        }

        if (projectDate[1] == null) {
            setFormError("Please select a date for the project")
            return 
        }
    
        {/* Createing a project with the properties from the fields to store in the db */}
        let startDate = projectDate[0]
        const endDate = projectDate[1]

    
        const project: Project = {
            Name: projectName,
            Description: projectDescription,
            StartDate: startDate,
            EndDate: endDate,
            Team: projectTeamName
        }
        createProject(project)
        router.push('/projects')
    }

    useEffect(() => {
        const fetchUsers = async () => {
          try {
    
            const response = await fetch('/get-project-form-data', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
            });
    
            if (response.ok) {
              const data = await response.json();
              setExistingTeams(data.teams)
              setProjectNames(data.projects)
            } else {
              console.error('Failed to fetch users');
            }
          } catch (error) {
            console.error('An error occurred:', error);
          }
        };
        
        fetchUsers();
       
      }, []);

      const createProject = async (project: Project) => {
        try {
            const response = await fetch('/create-project', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ project })
            })
        } catch (error) {
            console.error(error)
        }
      }

    return (
        <div className="flex">
        <Navbar />
        <Sidebar />

        <Box component="main" sx={{flexGrow: 1, py: 8}}>
            <Container maxWidth="xl">
                <Toolbar sx={{mt: -5}} />
                <Typography variant="h6" fontWeight={600} sx={{color: 'blue'}} align="center">
                    Add Project
                </Typography>
                <Toolbar sx={{mt: -5}}/>
                <Card elevation={5} style={{maxWidth: 450, margin: "0 auto", padding: "30px 5px"}}>
                    <CardContent>
                        <form onSubmit={handleSubmit}>
                            <Grid container spacing={1}>
                                <Grid item xs={12}>
                                    <TextField 
                                        label="Project Name" 
                                        placeholder="Enter a project name"
                                        variant="outlined"
                                        fullWidth
                                        required
                                        onChange={(event:any) => setProjectName(event.target.value)}
                                        value={projectName}
                                    />
                                </Grid>
                                <Toolbar sx={{mt: -6}}/>

                                <Grid item xs={12} >
                                    <TextField 
                                        rows={5}
                                        label="Project Description" 
                                        placeholder="Enter a project description"
                                        variant="outlined"
                                        fullWidth
                                        multiline
                                        required
                                        onChange={(event:any) => setProjectDescription(event.target.value)}
                                        value={projectDescription}
                                        inputProps={{ maxLength: 255 }}
                                    />
                                </Grid>
                                
                                <Grid item xs={6}>
                                <Box width={400}>
                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                            <DemoContainer components={['DateRangerPicker']}>
                                                <DemoItem label="Select deadline" component="DateRangePicker">
                                                    <DateRangePicker
                                                        label="Date"
                                                        value={projectDate}
                                                        onChange={(newValue) => setProjectDate(newValue)}
                                                        format="MM/DD/YYYY"
                                                    />
                                                </DemoItem>
                                            </DemoContainer>
                                        </LocalizationProvider>  
                                    </Box> 
                                </Grid>

                                <Toolbar sx={{mt: -8}}/>

                                <Grid item xs={12} sx={{mb: 3, mt: 3}}>
                                        <Select
                                            placeholder="Add team"
                                            onChange={(event:any) => setProjectTeamName(event.label)}
                                            options={existingTeams.map(team => {
                                                return ({value: team.ID_TEAM, label: team.TEAM_NAME})
                                            })}
                                            instanceId="selectManagerBox"
                                        />
                                </Grid>

                                <Grid item xs={12}>
                                    <Button 
                                        variant="contained" 
                                        fullWidth
                                        type="submit"
                                        className="bg-blue-700"
                                    >
                                        Submit Project
                                    </Button>
                                    {formError && <Typography variant="h6" className="text-red-500 mt-2" align="center">{formError}</Typography>}
                                    
                                </Grid>
                                
                            </Grid>
                        </form>
                    </CardContent>
                </Card>
            </Container>
        </Box>
    </div>
    )
}

export default ProjectsForm