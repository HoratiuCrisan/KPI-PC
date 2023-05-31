"use client"
import React, {useState, useEffect} from "react"
import {Card, CardContent, Grid, TextField, Button, Box, Typography, Toolbar, Container} from "@mui/material"
import Select from "react-select"
import Navbar from "../components/navbar"
import Sidebar from "../components/sidebar"
import { useRouter } from "next/navigation"

interface User {
    ID_EMPLOYEE: number,
    FIRST_NAME: string,
    LAST_NAME: string
}

interface Team {
    ID_TEAM: number,
    TEAM_NAME: string
}

interface Team_Form {
    team_name : string,
    team_manager: User,
    team_members: Array<User>,
}

const TeamsForm = (props: { sx: any }) => {
    const {sx} = props
    const [isSearchable, setIsSearchable] = useState(true);
    const [teamName, setTeamName] = useState('')
    const [assignedManager, setAssignedManager] = useState<User>()
    const [assignedUsers, setAssignedUsers] = useState<Array<User>>([])
    const [formError, setFormError] = useState<String | null>(null)
    const [users, setUsers] = useState<User[]>([])
    const [managers, setManagers] = useState<User[]>([])
    const [allTeams, setAllTeams] = useState<Team[]>([])
    const router = useRouter()

    const handleSubmit = async (event: any) => {
        event.preventDefault()
        
    
        {/* if the select or dateRangePicker are empty trow an error*/}
        {/* always reset the error to null berfor checking for empty fields*/}
        setFormError(null)

        if (assignedManager == null) {
            setFormError("Please assign a manager to the team")
            return
        }

        if (assignedUsers.length < 1) {
            setFormError("Please assign at least 1 member to the team")
            return 
        }
        
        // check if the team already exists
        if (allTeams.some(obj => obj.TEAM_NAME.toLocaleLowerCase().replace(/\s/g, '') === teamName.toLocaleLowerCase().replace(/\s/, ''))) {
            setFormError("Team already exists. Please chose a different team name")
            return
        }

        

        const team = {
            team_name: teamName.charAt(0).toUpperCase() + teamName.slice(1),
            team_manager: assignedManager,
            team_members: assignedUsers,
          }
        sendTeamData(team)
        updateUserData(team)
        updateManagerData(team)
        
        await  router.push('/teams')
    }

    useEffect(() => {
        const fetchUsers = async () => {
          try {
    
            const response = await fetch('/users-managers', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
            });
    
            if (response.ok) {
              const data = await response.json();
              setUsers(data.employees)
              setManagers(data.managers)
              setAllTeams(data.teams)
            } else {
              console.error('Failed to fetch users');
            }
          } catch (error) {
            console.error('An error occurred:', error);
          }
        };
        
        fetchUsers();
       
      }, []);

      // sending the data to the server
      const sendTeamData = async (team:Team_Form) => {
        try {
            const response = await fetch('/create-team', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ team }),
            })
        } catch (error) {
            console.error(error)
        }
      }

      const updateUserData = async (team:Team_Form) => {
        try {
            const response = await fetch('/update-user-team', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ team })
            })
        } catch (error) {
            console.error(error)
        }
    }

    const updateManagerData = async (team:Team_Form) => {
        try {
            const response = await fetch('/update-manager-team', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ team })
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
                        <Typography align="center" variant="h6" fontWeight={600} sx={{color: 'blue'}} >
                            Add Team Form
                        </Typography>
                        <Toolbar sx={{mt: -5}}/>
                <Card elevation={5} style={{maxWidth: 450, margin: "0 auto", padding: "30px 5px"}}>
                    <CardContent>
                        <form onSubmit={handleSubmit}>
                            <Grid container spacing={1}>
                                <Grid item xs={12} >
                                    <TextField 
                                        label="Team Name" 
                                        placeholder="Enter a team name"
                                        variant="outlined"
                                        fullWidth
                                        required
                                        onChange={(event:any) => setTeamName(event.target.value)}
                                        value={teamName}
                                    />
                                </Grid>
                                <Toolbar sx={{mt: -5}}/>

                                <Grid item xs={12}>  
                                      <Select
                                            placeholder="Add team manager"
                                            onChange={(event:any) => setAssignedManager(event)}
                                            options={managers.map(manager => {
                                                return ({value: manager.ID_EMPLOYEE, label: manager.FIRST_NAME + ' ' + manager.LAST_NAME})
                                            })}
                                            instanceId="selectManagerBox"
                                            isSearchable={isSearchable}
                                        />
                                </Grid>
                            
                                <Toolbar sx={{mt: -5}}/>
                            {/* Using react-select for picking members of the team */}
                            <Grid item xs={12}>
                                    <Select
                                        placeholder="Add team members"
                                        onChange={(event:any) => setAssignedUsers(event)}
                                        options={users.map(user => {
                                            return ({value: user.ID_EMPLOYEE, label: user.FIRST_NAME + ' ' + user.LAST_NAME})
                                        })}
                                        isMulti
                                        instanceId="selectBox"
                                    />
                                </Grid>
                               
                                <Toolbar sx={{mt: -5}}/>

                                <Grid item xs={12}>
                                    <Button 
                                        variant="contained" 
                                        fullWidth
                                        type="submit"
                                        className="bg-blue-700"
                                    >
                                        Submit Team
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

export default TeamsForm