"use client"
import { Box, Toolbar , Button, Container, Typography, Divider, Grid, Stack, ListItem} from "@mui/material"
import Navbar from "../components/navbar"
import Sidebar from "../components/sidebar"
import TeamsCards from "../components/teamsPage/teamsCards"
import React, {useEffect, useState} from 'react'
import Link from "next/link"

interface FullTeam {
    team: Team,
    manager: User,
    members: User[]
}

interface Team {
    ID_TEAM: number,
    TEAM_NAME: string
}

interface User {
    FIRST_NAME: string,
    LAST_NAME: string,
    TEAM_N: string
}



const Teams = () => {
    const [teamArray, setTeamArray] = useState<FullTeam[]>([])
    

    useEffect(() => {
        const fetchTeams = async () => {
          try {
    
            const response = await fetch('/get-team-details', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
            });
    
            if (response.ok) {
              const data = await response.json();
             setTeamArray(createTeams(data.teams, data.managers, data.users))
            } else {
              console.error('Failed to fetch users');
            }
          } catch (error) {
            console.error('An error occurred:', error);
          }
        };
        
        fetchTeams()
        
      }, []);

    function createTeams(teams: Team[], managers: User[], users: User[]){
        let _all_teams: FullTeam[] = []
        for (let team of teams) {
            let _current_team_members: User[] = []
            for (let user of users) 
                if (user.TEAM_N == team.TEAM_NAME) 
                    _current_team_members.push(user)
            
            for (let manager of managers) {
                if (team.TEAM_NAME == manager.TEAM_N) {
                    const _current_team = {
                        team: team,
                        manager: manager,
                        members: _current_team_members
                    }
                    _all_teams.push(_current_team)
                }
            }
        }
       return _all_teams
    }

    let fullTeamArray:FullTeam[] = []
    if (teamArray.length > 0) {
      teamArray.map((elem) => {
          fullTeamArray.push(elem)
      })
    }

    return (
        <Box sx={{display: 'flex'}}>
            <Navbar />
            <Sidebar />
    
            <Box component="main" sx={{flexGrow: 1, py: 8}}>
                <Container maxWidth="xl">
                    <Toolbar sx={{mt: -5}} />
                    <Typography variant="h6" fontWeight={600} >
                        Home / <span className="text-blue-700"> Teams </span>
                    </Typography>
                    <Toolbar sx={{mt: -5}}/>
                    
                    <Grid container spacing={2} alignItems={"center"} sx={{mb: 8}}>
                        <Grid item xs={6}>
                            <Typography variant="body1" align="left" fontWeight={800}>
                                Team List
                            </Typography>
                        </Grid>
                        
                        <Grid item xs={6} container justifyContent="flex-end">
                            <Button variant="contained" href="/teamsForm">
                                Add team
                            </Button>
                        </Grid>
                    </Grid>
    
                    <Divider />
                    <Toolbar sx={{mt: -5}} />
                    <Grid container spacing={3}>
                        {
                            fullTeamArray.length ==0 && 
                            <Typography 
                                variant="body1" 
                                align="left"
                                fontWeight={800}
                                sx={{ml: 5, mt: 5}}
                            >
                                No teams yet!
                            </Typography>
                        }            
                        {fullTeamArray.map((elem:FullTeam) => {
                            return (
                                <Grid item xs={4} key={elem.team.ID_TEAM}>
                                    <TeamsCards 
                                        sx={{height: '100%'}} 
                                        teamID={elem.team.ID_TEAM}
                                        teamName={elem.team.TEAM_NAME}
                                        teamManager={elem.manager.FIRST_NAME + ' ' + elem.manager.LAST_NAME}
                                        teamMembers={elem.members}
                                        key={elem.team.ID_TEAM}
                                    />
                                </Grid>
                            )
                        })}
                    </Grid>
                    <Toolbar />
                    
                </Container>
            </Box>
        </Box>
    )
}

export default Teams