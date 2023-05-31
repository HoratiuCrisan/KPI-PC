import { 
    Card, 
    CardContent, 
    CardHeader, 
    Stack, 
    Typography, 
    Toolbar, 
    Divider, 
    ListItemButton,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle
} from "@mui/material"
import React, {useState, useReducer} from "react"
import DeleteIcon from '@mui/icons-material/Delete'

interface User {
    FIRST_NAME: string,
    LAST_NAME: string,
    TEAM_N: string
}

const TeamsCards = (props: any) => {
    // dialog use State
    const [dialog, setDialog] = useState(false)
    const [reducerValue, forceUpdate] = useReducer(x => x + 1, 0)
    const {sx, teamName, teamManager, teamMembers, teamID} = props

    const updateUserData = async (teamName: string) => {
        try {
            const response = await fetch('/remove-user-team', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({teamName})
            }) 
        } catch (error) {
            console.error(error)
        }       
    }

    const deleteTeam = async (teamName: string) => {
        setDialog(false)
        try {
            const response = await fetch('/remove-team', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({teamName})
            })
        } catch (error) {
            console.error(error)
        }
    }
    function handleDelete() {
        updateUserData(teamName)
        deleteTeam(teamName)
    }

    return (
        <Card 
            sx={{sx}} 
            elevation={5} 
            key={teamID} 
        > 
            <CardHeader 
                title={teamName}
                subheader={teamManager}
                titleTypographyProps={{variant: "body1", fontWeight: 800, color: "blue"}}
                subheaderTypographyProps={{variant: "body2", fontWeight: 700, color: "gray"}}
            /> 

            <Toolbar sx={{mt: -8}} />
                    <Divider sx={{ml: 2, mr: 2}}/>
                    <Toolbar sx={{mt: -8}} />
            <CardContent>
                <Stack
                    alignItems="flex-center"
                    direction="row"
                    justifyContent="space-between"
                    spacing={3}
                >
                
                <Stack 
                    spacing={1} 
                    direction={"row"} 
                >
                    {teamMembers.map((e:User) => {
                           return (
                                <Typography
                                color="black"
                                variant="body2"
                                key={e.FIRST_NAME + ' ' +e.LAST_NAME}
                                >
                                    {e.FIRST_NAME}
                                </Typography>
                           )
                        })}
                   
                </Stack>

                <Stack spacing={1} alignItems={"end"} >
                    <ListItemButton 
                        sx={{borderRadius: '45%'}} 
                        onClick={()=>setDialog(true)}
                    >
                        <DeleteIcon sx={{color: 'red'}} />
                    </ListItemButton>
                </Stack>
                </Stack>
            </CardContent>

            <Dialog
                open={dialog}
                onClose={() => setDialog(false)}
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
                        By clicking "Yes", you agree on the removal of this card
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button
                        sx={{"&.MuiButton-text": { bgcolor: "red" , color: "white"}}}
                        variant="text"
                        onClick={() => setDialog(false)}
                    >
                        No
                    </Button>
                    <Button
                        sx={{"&.MuiButton-text": { bgcolor: "blue" , color: "white"}}}
                        variant="text"
                        onClick={handleDelete}
                    >
                        Yes
                    </Button>
                </DialogActions>
            </Dialog>
        </Card>
    )
}

export default TeamsCards