import {
    Card,
    CardContent,
    Typography,
    Toolbar,
    Stack,
    Divider,
    Grid,
    Button,
    Dialog,
    DialogContent,
    DialogTitle,
    TextField,
} from "@mui/material"

import {
    DataGrid,
    GridRowsProp,
    GridColDef
} from "@mui/x-data-grid"
import Select from "react-select"
import Image from 'next/image'
import pfpAvatar from "../../../public/assets/pfpAvatar.svg"
import { LocalizationProvider } from "@mui/x-date-pickers"
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs"
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import React, {useState, useEffect} from 'react'
import { DemoItem } from "@mui/x-date-pickers/internals/demo"

interface User {
    ID: number,
    NAME: string,
    EMAIL: string,
    POSITION: number
}

interface Task {
    ID_TASK: number,
    T_STATUS: string,
    FINISH_DATE: string,
    T_NAME: string,
    E_ID: number,
}


const columns: GridColDef[] = [
    { field: 'T_NAME', headerName: 'Task Name', width: 150},
    { field: 'T_STATUS', headerName: 'Task Status', width: 150},
    { field: 'FINISH_DATE', headerName: 'Due Date', width: 150},
    { field: 'E_ID', headerName: 'User ID', width: 150},
]

const rows: GridRowsProp = [
    { id: 1, col1: 'Hello', col2: 'World', col3: 'Hello', col4: 'World', col5: 'World' },
    { id: 2, col1: 'DataGridPro', col2: 'is Awesome', col3: 'Hello', col4: 'World', col5: 'World' },
    { id: 3, col1: 'MUI', col2: 'is Amazing', col3: 'Hello', col4: 'World', col5: 'World'},
    { id: 4, col1: 'blalba', col2: 'asdfasdf', col3: 'Hello', col4: 'World', col5: 'World'}
]

const DetailsCards = (props: any) => {
    const {project, manager, users, empNumber} = props
    const [usr, setUsr] = useState<Number>(0)
    const [dialog, setDialog] = useState(false)
    const [isSearchable, setIsSearchable] = useState(true)
    const [formError, setFormError] = useState<String | null>(null)
    const [taskName, setTaskName] = useState<String>('')
    const [taskDate, setTaskDate] = useState<Date | null>(null)
    const [tasksList, setTasksList] = useState<Task[]>([])

    //fetching the tasks from the database
    useEffect(() => {
        const getTasks = async () => {
            if (project?.PROJECT_NAME !== undefined) {
            try {
                
                const response = await fetch('/get-tasks/' + project?.PROJECT_NAME, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                      },
                })
                const data = await response.json()
                let current_task_list : Task[]= []
                 data.tasks.map((elem:Task)=> {
                    const current_task = {
                        ID_TASK: elem.ID_TASK,
                        T_STATUS: elem.T_STATUS,
                        FINISH_DATE: elem.FINISH_DATE.toString().slice(0,10),
                        E_ID: elem.E_ID,
                        T_NAME: elem.T_NAME
                    }
                    current_task_list.push(current_task)
                })
                setTasksList(current_task_list) 
                console.log(current_task_list)
            } catch (error) {
                console.error(error)
            }
        }
        }
        getTasks()
    }, [project?.PROJECT_NAME])

   
    
    const handleSubmit = (event: any) => {
        event.preventDefault()
        setFormError(null)

        //check for errors inside the task form

        if (usr === null) {
            setFormError('Please select an employee to fulfill this task!')
            return
        }

        if (taskDate === null) {
            setFormError('Please provide a due date for the task!')
            return 
        }
        
        createTask(taskName, usr, taskDate)
        setDialog(false)
    }
    
    //creating a task function
    const createTask = async (taskName:String, usr:Number, taskDate:Date) => {
        const task = {
            TEAM_A: project?.TEAM,
            T_PROJECT: project?.PROJECT_NAME,
            T_STATUS: 'Not finished',
            FINISH_DATE: taskDate,
            T_NAME: taskName,
            E_ID: usr
        }
        try {
            const response = await fetch('/create-task', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({task})
            })
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <Grid 
        container 
        direction={"row"}
        spacing={8}
        
        >
            <Grid item>
                <Card 
                    elevation={1} 
                    sx={{maxWidth: 450, bgcolor: '#f8fafc'}}
                >
                    <CardContent>
                        <Typography variant="h4">
                            {project?.PROJECT_NAME}
                        </Typography>

                        <Toolbar sx={{mt: -5}}/>

                        <Typography variant="body1">
                            {project?.DESCRIPTION}
                        </Typography>
                    </CardContent>
                </Card>

                <Toolbar/>

                <Card 
                    elevation={1} 
                    sx={{maxWidth: 450, bgcolor: '#f8fafc'}}
                >
                    <Stack 
                        direction={"row"} 
                        spacing={32} 
                        sx={{mt: 3}}
                    >
                        <Typography 
                            variant="body1" 
                            sx={{color: "gray", ml: 2}}
                        >
                            Start time
                        </Typography>

                        <Typography 
                            variant="body1" 
                            sx={{color: "gray"}}
                        >
                            {project?.TERM_START.toString().slice(0,10)}
                        </Typography>
                        </Stack>

                        <Toolbar sx={{mt: -5}} />

                        <Stack 
                            direction={"row"} 
                            spacing={32.5}
                        >
                            <Typography 
                                variant="body1" 
                                sx={{color: "gray", ml: 2}}
                            >
                                End time
                            </Typography>

                            <Typography 
                                variant="body1" 
                                sx={{color: "gray"}}
                            >
                                {project?.TERM_END.toString().slice(0,10)}
                            </Typography>
                        </Stack>

                        <Toolbar sx={{mt: -5}} />

                        <Stack 
                            direction={"row"} 
                            spacing={32}
                        >
                            <Typography 
                                variant="body1" 
                                sx={{color: "gray", ml: 2}}
                            >
                                Status
                            </Typography>

                            <Typography 
                                variant="body1" 
                                sx={{color: "red"}}
                                fontWeight={600}
                            >
                                {project?.PROJECT_STATUS}
                            </Typography>

                        </Stack>
                            <Toolbar sx={{mt: -5}} />
                        </Card>

                        <Toolbar />

                        <Card 
                            elevation={1} 
                            sx={{maxWidth: 450, bgcolor: '#f8fafc'}}
                        >
                            <CardContent>
                                <Typography 
                                    variant="h6"
                                    fontWeight={600}    
                                >
                                    Project Team
                                </Typography>

                                <Toolbar sx={{mt: -5}}/>

                                <Typography 
                                    variant="body1"
                                    fontWeight={600}
                                >
                                    {empNumber + ' team members'}
                                </Typography>

                                <Toolbar sx={{mt: -5}} />

                                {/* Project manager */}
                                <Stack 
                                    direction={"row"} 
                                    spacing={3}
                                >
                                    <Image 
                                        src={pfpAvatar} 
                                        alt={"pfp"} 
                                        width={100} 
                                        height={40}
                                    />
                                <Stack 
                                    direction={"column"} 
                                    spacing={1}
                                >
                                    <Typography 
                                        variant="h6"
                                        fontWeight={700}
                                    >
                                        {manager?.NAME}
                                    </Typography>

                                    <Typography variant="body1" >
                                        {manager?.EMAIL}
                                    </Typography>

                                    <Typography variant="body1" >
                                        Manager
                                    </Typography>
                                </Stack>    
                        </Stack>
                        <Toolbar sx={{mt: -5}} />
                                    
                        <Divider sx={{ml: 1, mr: 1}} />
                                    
                        {/* displaying all the users*/}
                        {users?.map((elem: User) => {
                            return (
                                <Stack 
                                    direction={"row"} 
                                    spacing={2} 
                                    sx={{mt: 3}}
                                    key={elem.ID}
                                >
                                    <Image 
                                        src={pfpAvatar} 
                                        alt="pfp" 
                                        width={50} 
                                        height={40} 
                                    />
                                    <Stack 
                                        direction={"column"} 
                                        spacing={0.5}
                                    >
                                        <Typography 
                                            variant="body2" 
                                            fontWeight={600} 
                                            sx={{color: "gray"}}
                                        >
                                            {elem.NAME}
                                        </Typography>

                                        <Typography 
                                            variant="body2" 
                                            fontWeight={600} 
                                            sx={{color: "gray"}}
                                        >
                                            {elem.EMAIL}
                                        </Typography>
                                    </Stack>
                                </Stack>
                                    )
                            })}
                    </CardContent>
                </Card>
            </Grid>
            
            {/* Tasks data grid */}
            <Grid item>
                <Card
                    elevation={1}
                    sx={{width: 800}}
                >
                    <CardContent>
                        <Grid 
                            display={"flex"}
                            justifyContent={"flex-end"}
                            sx={{mb: 3}}
                            alignItems={"flex-end"}
                        >
                            <Button
                                onClick={() => setDialog(true)}
                                sx={{"&.MuiButton-text": { bgcolor: "#2563eb" , color: "white"}}}
                                variant="text"
                            >
                                Add Task
                            </Button>
                        </Grid>
                        {tasksList.length > 0 &&
                        <DataGrid
                            rows={tasksList} 
                            columns={columns}
                            getRowId={(row) => row.ID_TASK} 
                        />
                        }

                    </CardContent>

                    {/* Dialog to add a task */}
                    <Dialog
                        open={dialog}
                        onClose={() => setDialog(false)}
                        aria-labelledby="aria-dialog-title"
                        aria-describedby="alert-dialog-description"
                    >
                        <DialogTitle 
                            id="alert-dialog-title" 
                            justifyContent={"center"} 
                            display={"flex"}
                        >
                            {"Add a new task"}
                        </DialogTitle>
                        <DialogContent sx={{maxWidth: 500, maxHeight: 700}}>
                            <Grid container spacing={3}>
                                <Grid item xs={12}>
                                    <form 
                                        className="mt-3"
                                        onSubmit={handleSubmit}    
                                    >
                                        <Grid 
                                            container 
                                            spacing={5}>
                                            <Grid item xs={12}>
                                                <TextField
                                                    label="Task Name"
                                                    placeholder="Task Name"
                                                    variant="outlined"
                                                    fullWidth
                                                    required
                                                    onChange={(event: any) => setTaskName(event.target.value)}
                                                    value={taskName}
                                                />
                                            </Grid>
                                            
                                            <Grid item xs={12}>
                                                <Select 
                                                    placeholder="Assign the task to an user"
                                                    isSearchable={isSearchable} 
                                                    options={users?.map((user:User) => {
                                                        return ({value: user.ID, label: user.NAME})
                                                    })}
                                                     onChange={(event:any) => setUsr(event.value)}
                                                />
                                            </Grid>

                                            <Grid item xs={12}>
                                                 
                                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                    <DemoItem label="Select due day">
                                                   <DatePicker
                                                    onChange={(event:any) => setTaskDate(event)} 
                                                    value={taskDate}
                                                   />
                                                    </DemoItem>
                                                </LocalizationProvider>
                                            </Grid>

                                            <Grid item xs={12}>
                                                <Button 
                                                    variant="contained" 
                                                    fullWidth
                                                    type="submit"
                                                    className="bg-blue-700"
                                                >
                                                    Submit Task
                                                </Button>

                                                {formError && 
                                                <Typography 
                                                    variant="h6" 
                                                    className="text-red-500 mt-2" 
                                                    align="center"
                                                >
                                                    {formError}
                                                </Typography>
                                            }

                                            </Grid>
                                        </Grid> 
                                    </form>
                                </Grid>
                            </Grid>
                        </DialogContent>

                    </Dialog>
                </Card>
            </Grid>
        </Grid>
    )
}

export default DetailsCards