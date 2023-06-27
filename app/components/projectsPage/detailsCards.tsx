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
    DialogActions,
    DialogContentText,
    DialogTitle,
    TextField,
    ListItemButton
} from "@mui/material"

import {
    DataGrid,
    GridRowsProp,
    GridColDef,
} from "@mui/x-data-grid"
import Select from "react-select"
import Image from 'next/image'
import pfpAvatar from "../../../public/assets/pfpAvatar.svg"
import { LocalizationProvider } from "@mui/x-date-pickers"
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs"
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import React, {useState, useEffect, useReducer} from 'react'
import { DemoItem } from "@mui/x-date-pickers/internals/demo"
import DeleteIcon from '@mui/icons-material/Delete'
import SaveAsIcon from '@mui/icons-material/SaveAs'
import { LinearProgress } from '@mui/material';
import { useRouter } from "next/navigation"
import dayjs from "dayjs"
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

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

interface Project {
    ID_PROJECT: number,
    PROJECT_NAME: string,
    TEAM: string,
    PROJECT_STATUS: string,
    DESCRIPTION: string,
    TERM_START: Date,
    TERM_END: Date
}





const DetailsCards = (props: any) => {

    const [userRole, setRole] = useState(""); // Add role state
    const [userTeam, setTeam] = useState<string | null>(null);
    const [userId, setId] = useState<string | null>(null);
    
    const useRequireAuth = () => {
      useEffect(() => {
        // Check if the user is logged in
        const email = localStorage.getItem('email');
        const role = localStorage.getItem('role');
        const team = localStorage.getItem('team');
        const id = localStorage.getItem('id');
    
        if (!email || !role) {
          // If the user is not logged in, redirect to the login page
          window.location.href = "/";
         }else{
          setRole(role);
          setTeam(team);
          setId(id);
         }
      }, []);
      
      return null; // Return null or a loading indicator if needed
    };
      
    useRequireAuth();

    const {project, manager, users, empNumber} = props
    const [usr, setUsr] = useState<Number>(0)
    const [dialog, setDialog] = useState(false)
    const [isSearchable, setIsSearchable] = useState(true)
    const [formError, setFormError] = useState<String | null>(null)
    const [taskName, setTaskName] = useState<String>('')
    const [taskDate, setTaskDate] = useState<Date | null>(null)
    const [tasksList, setTasksList] = useState<Task[]>([])
    const [filteredTasksList, setFilteredTasksList] = useState<Task[]>([]);
    //getting the list of users id for the select inside the data grid
    const usersId = users?.map((currentUser:User) => {
        return currentUser.ID
    })
    //set values for status bar
    const [progresValue, setProgresValue] = useState(0)
    const [projectStatusError, setProjectStatusError] = useState<String | null>(null)
    const [finishProjectDialog, setFinishProjectDialog] = useState(false)
    const [openProjectDialog, setOpenProjectDialog] = useState(false)
    
    const pageReload = () => {
        window.location.reload()
    }

      
    //Set the PROJECT_STATUS to FINISHED
    const closeProject = async (params: Project) => {
        setProjectStatusError(null)
        
        setFinishProjectDialog(false)
        if (progresValue != 100) {
            setProjectStatusError('Please finish all tasks before closing the project')
            return 
        }
        
        try {
            await fetch('/close-project', {
                method: 'PUT',
                headers: { 
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ params })
            })
        } catch(error) {
            console.error(error)
        }

        pageReload()
    }

    {/* open project functionality */}
    const openProject = async (params: Project) => {
        try {
            await fetch('/open-project', {
                method: 'PUT',
                headers: { 
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ params })
            })
        } catch(error) {
            console.error(error)
        }
        setOpenProjectDialog(false)
        pageReload()
    }

const handleEditRow = async (params:Task) => {
    try {
       await fetch('/update-task-data', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({params})
        })
    } catch (error) {
        console.error("could not send the new task data to the server ", error)
    }
}

const finishTask = async (task: Task) => {
    try {
      await fetch('/finish-task', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ task })
      });
    } catch (error) {
      console.error("could not send the task data to the server ", error);
    }
  };

    const handleDeleteRow = async (params:Task) => {
        const id = params.ID_TASK
        console.log(params)
        try {
        const response = await fetch('/delete-task', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({params})
            })
            
        } catch (error) {
            console.error(error)
        }
    }

    // Data grid columns information
    const columns: GridColDef[] = [
        { field: 'T_NAME', headerName: 'Task Name', width: 150, editable: true},
        { field: 'T_STATUS', headerName: 'Task Status', width: 150},
        { field: 'FINISH_DATE', headerName: 'Due Date', width: 150, 
            editable: true, type: 'Date'
        },
        { field: 'E_ID', headerName: 'User ID', width: 150, editable: true,
            type: 'singleSelect', valueOptions: usersId
        },
        { field: 'actions', headerName: 'Actions', width: 140, 
            renderCell: (params: any) => (
               <Stack direction={"row"} sx={{ml: -3}} spacing={0.5}>
               {userRole === '1' ? (
                <ListItemButton 
                onClick={() => {
                    finishTask(params.row);
                    pageReload()
                }}
                    sx={{borderRadius: '45%'}}
                >
                    <CheckCircleIcon />
                </ListItemButton>
                ) : (
                <Stack direction={"row"}  spacing={0.5}>
                    <ListItemButton 
                        onClick={() =>{ 
                            handleDeleteRow(params.row);
                            pageReload()
                            }
                        }
                    sx={{borderRadius: '45%', color: "red"}}
                    disabled={userRole !== '2' && userRole !== '3'}
                    >
                    <DeleteIcon />
                    </ListItemButton>

                    <ListItemButton 
                        onClick={() => {
                            handleEditRow(params.row);
                            pageReload()
                        }}
                    sx={{borderRadius: '45%'}}
                    disabled={userRole !== '2' && userRole !== '3'}
                    >
                    <SaveAsIcon />
                    </ListItemButton>
                </Stack>
                )}
                            </Stack>
                            )
                        },
                    ]

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
                const current_task_list: Task[] = [];
                data.tasks.map((elem: Task) => {
                  const current_task = {
                    ID_TASK: elem.ID_TASK,
                    T_STATUS: elem.T_STATUS,
                    FINISH_DATE: dayjs(elem.FINISH_DATE).format("MM/DD/YYYY"),
                    E_ID: elem.E_ID,
                    T_NAME: elem.T_NAME,
                  };
                  if (userRole === '1' && elem.E_ID === Number(userId)) {
                    current_task_list.push(current_task);
                  } else if (userRole !== '1') {
                    current_task_list.push(current_task);
                  }
                });
                setTasksList(current_task_list);
                setFilteredTasksList(current_task_list);
            } catch (error) {
                console.error(error)
            }
        }
        }
        const getStatusBarData = async () => {
            try {
                const pName = project?.TEAM
                const response = await fetch('/get-status-tasks' + pName , {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                      },
                })
                const data = await response.json()
                console.log(data.total_tasks)
                setProgresValue(Math.round((data.finished_tasks * 100) / data.total_tasks)) 
            } catch (error) {
                console.error(error)
            }
        }
        getStatusBarData()
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
            T_STATUS: 'NOT FINISHED',
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

        pageReload()
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

                        <Typography variant="body2" sx={{mt: 1, mb: 0.5}}>
                           Project status: {progresValue}%
                        </Typography>
                        <LinearProgress variant="determinate" value={progresValue} />
                    
                    
                        {(userRole === '2' || userRole === '3') &&  project?.PROJECT_STATUS.toLowerCase() == "not finished" ?
                            (
                                <Button 
                                    onClick={() => setFinishProjectDialog(true)}
                                    sx={{mt: 2}}
                                >
                                    Close Project
                                </Button>
                            ) : (
                               (userRole === '2' || userRole === '3') &&  <Button 
                                    onClick={() => setOpenProjectDialog(true)}
                                    sx={{mt: 2}}
                                >
                                    Open Project
                                </Button>
                               
                            )
                        }
                         {projectStatusError && 
                            <Typography 
                                variant="h6" 
                                className="text-red-500 mt-2" 
                                align="center"
                            >
                                {projectStatusError}
                            </Typography>}
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
                            {project?.PROJECT_STATUS.toLowerCase() == "not finished" ?
                            (
                            <Typography 
                                variant="body1" 
                                sx={{color: "gray", ml: 2}}
                            >
                                Status
                            </Typography>
                            ) : (
                                <Typography 
                                variant="body1" 
                                sx={{color: "gray", ml: 2, mr: 3}}
                            >
                                Status
                            </Typography>
                            )}

                            {project?.PROJECT_STATUS.toLowerCase() == 'finished' &&
                                <Typography 
                                variant="body1" 
                                sx={{color: "green"}}
                                fontWeight={600}
                            >
                                {project?.PROJECT_STATUS}
                            </Typography>                            
                            }

                            {project?.PROJECT_STATUS.toLowerCase() == 'not finished' &&
                            <Typography 
                                variant="body1" 
                                sx={{color: "red"}}
                                fontWeight={600}
                            >
                                {project?.PROJECT_STATUS}
                            </Typography>
                            }

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
                            {(userRole === '2' || userRole === '3')&&project?.PROJECT_STATUS.toLowerCase() === 'not finished' &&(
                                <Button
                                onClick={() => setDialog(true)}
                                variant="contained"
                                color="primary"
                                sx={{ mt: 2 }}
                                >
                                Add Task
                                </Button>
                            )}
                        </Grid>
                        {tasksList.length > 0 &&
                        <DataGrid
                            rows={filteredTasksList} 
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

                    {/* finish project dialog */}
                    <Dialog
                        open={finishProjectDialog}
                        onClose={() => setFinishProjectDialog(false)}
                        aria-labelledby="alert-dialog-title"
                        aria-describedby="alert-dialog-description"
                    >
                        <DialogTitle
                            id="alert-dialog-title"
                        >  
                            {"Are you sure you want to continue?"}
                        </DialogTitle>
                        <DialogContent>
                            <DialogContentText
                                id="alert-dialog-description"
                            >
                                Are you sure you want to close this project?
                            </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <Button
                                sx={{"&.MuiButton-text": { bgcolor: "red" , color: "white"}}}
                                variant="text"
                                onClick={() => setOpenProjectDialog(false)}
                            >
                                No
                            </Button>
                            <Button
                                sx={{"&.MuiButton-text": { bgcolor: "blue" , color: "white"}}}
                                variant="text"
                                onClick={() => closeProject(project)}
                            >
                                Yes
                            </Button>
                        </DialogActions>
                    </Dialog>

                    {/* open project dialog */}
                    <Dialog
                        open={openProjectDialog}
                        onClose={() => setOpenProjectDialog(false)}
                        aria-labelledby="alert-dialog-title"
                        aria-describedby="alert-dialog-description"
                    >
                        <DialogTitle
                            id="alert-dialog-title"
                        >  
                            {"Are you sure you want to continue?"}
                        </DialogTitle>
                        <DialogContent>
                            <DialogContentText
                                id="alert-dialog-description"
                            >
                                Are you sure you want open this project?
                            </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <Button
                                sx={{"&.MuiButton-text": { bgcolor: "red" , color: "white"}}}
                                variant="text"
                                onClick={() => setOpenProjectDialog(false)}
                            >
                                No
                            </Button>
                            <Button
                                sx={{"&.MuiButton-text": { bgcolor: "blue" , color: "white"}}}
                                variant="text"
                                onClick={() => openProject(project)}
                            >
                                Yes
                            </Button>
                        </DialogActions>
                    </Dialog>
            
            
                </Card>
            </Grid>
        </Grid>
    )
}

export default DetailsCards