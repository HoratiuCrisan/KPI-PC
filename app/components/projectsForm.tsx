import React, {useState} from "react"
import {Card, CardContent, Grid, TextField, Button, Box, Typography, Toolbar} from "@mui/material"
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs" 
import { DateRange, LocalizationProvider} from "@mui/x-date-pickers-pro"
import { DateRangePicker } from "@mui/x-date-pickers-pro/DateRangePicker"
import {DemoContainer, DemoItem } from "@mui/x-date-pickers/internals/demo"
import Select from "react-select"


const ProjectsForm = () => {
    const [projectName, setProjectName] = useState('')
    const [projectDetails, setProjectDetails] = useState('')
    const [projectTeamName, setProjectTeamName] = useState('')
    const [assignedUsers, setAssignedUsers] = useState([])
    const [projectDate, setProjectDate] = useState<DateRange<Date>>([null, null])
    const [formError, setFormError] = useState<String | null>(null)

    const handleSubmit = (event: any) => {
        event.preventDefault()
    
        {/* if the select or dateRangePicker are empty trow an error*/}
        {/* always reset the error to null berfor checking for empty fields*/}
        setFormError(null)

        if (projectDate[0] == null) {
            setFormError("Please select a date for the project")
            return
        }

        if (projectDate[1] == null) {
            setFormError("Please select a date for the project")
            return 
        }

        if (assignedUsers.length < 1) {
            setFormError("Please assign the project to at least 1 user")
            return 
        }
    
        {/* Createing a project with the properties from the fields to store in the db */}
        const startDate = projectDate[0].toString().split(" ")
        const endDate = projectDate[1].toString().split(" ")

        const project = {
           projectName,
           projectTeamName,
           projectDetails,
           date: {
            sDay: startDate[1],
            sMonth: startDate[2],
            sYear: startDate[3],    
            eDay: endDate[1],
            eMonth: endDate[2],
            eYear: endDate[3]
            },
            comments: [],
            assignedUsers
        }
        
        
        console.log(project)
       
    }


    const users = [
        {id: 1, firstName: 'John', lastName: 'Johnes', position: 'admin', hiredate: '05/06/2023'},
        {id: 2, firstName: 'Lockie', lastName: 'Wells', position: 'manager', hiredate: '04/06/2023'},
        {id: 3, firstName: 'Quiton', lastName: 'Hudson', position: 'user', hiredate: '03/05/2023'},
        {id: 4, firstName: 'Sidney', lastName: 'Stevenson', position: 'admin', hiredate: '21/06/2020'},
        {id: 5, firstName: 'Lynette', lastName: 'Boyce', position: 'user', hiredate: '05/06/2019'},
        {id: 6, firstName: 'Dwayne', lastName: 'Prescott', position: 'user', hiredate: '05/06/2019'},
        {id: 7, firstName: 'Kenith', lastName: 'Edwards', position: 'user', hiredate: '05/06/2019'},
        {id: 8, firstName: 'Marilla', lastName: 'Walker', position: 'user', hiredate: '05/06/2019'},
        {id: 9, firstName: 'Candice', lastName: 'Aitken', position: 'user', hiredate: '05/06/2019'},
    ]


    return (
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
                        <Grid item xs={12}>
                            <TextField 
                                label="Team Name" 
                                placeholder="Enter a team name"
                                variant="outlined"
                                fullWidth
                                required
                                onChange={(event:any) => setProjectTeamName(event.target.value)}
                                value={projectTeamName}
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
                                onChange={(event:any) => setProjectDetails(event.target.value)}
                                value={projectDetails}
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

                       {/* Using react-select for picking members of the project */}

                       <Grid item xs={12} sx={{mb: 3, mt: 3}}>
                            <Select
                                placeholder="Add team members"
                                onChange={(event:any) => setAssignedUsers(event)}
                                options={users.map(user => {
                                    return ({value: user.id, label: user.firstName})
                                })}
                                isMulti
                                instanceId="selectBox"
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
    )
}

export default ProjectsForm