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
import React , {useState} from "react"
import DeleteIcon from '@mui/icons-material/Delete'
import InfoIcon from '@mui/icons-material/Info'
import Link from 'next/link'
import { useRouter } from "next/router"

const ProjectCards = (props: any) => {
    // state of the dialog
    const [dialog, setDialog] = useState(false)
    const {sx, projectId, projectName, sDate, eDate, status, teamName} = props

    const deleteProject = async (projectName: string) => {
        setDialog(false)
        try {
            const response = await fetch('/remove-project', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({projectName})
            })
            useRouter().reload()
        } catch (error) {
            console.error(error)
        }
        window.location.reload()
    }

    function handleDelete() {
        deleteProject(projectName)
    }


    return (
        <Card 
            sx={{sx}} 
            elevation={5} 
            key={projectId}
        > 
            
            <CardHeader 
                title={projectName} 
                subheader={sDate.slice(0,10) + ' to ' + eDate.slice(0,10)}
                titleTypographyProps={{variant: "body1", fontWeight: 1000, color: 'blue'}}
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
                <Link href={`projects/${projectId}`}>
                <Stack spacing={1} display={"flex"} key={teamName}>
                    {status.toLowerCase() == "finished" ? 
                    (
                        <Typography
                        color="#4ade80"
                        variant="body2"
                        sx={{fontWeight: 800}}
                        >
                            {status}
                        </Typography>
                    ) : (
                        <Typography
                        color="red"
                        variant="body2"
                        sx={{fontWeight: 800}}
                        >
                            {status}
                        </Typography>
                    )
                    } 
                    
                   

                    <Typography
                        color="black"
                        variant="body2"
                        fontWeight={900}
                    >
                       {teamName}
                    </Typography>
                </Stack>
                </Link>
                <Stack spacing={0} direction="row" alignItems={"end"}>
                    <Link href={{
                        pathname: `projects/${projectId}`,
                        query: {
                            id: projectId
                        } 
                        }}>
                        <ListItemButton
                            sx={{borderRadius: '45%'}}
                        >
                            <InfoIcon />
                        </ListItemButton>
                    </Link>
                    <ListItemButton 
                        sx={{borderRadius: '45%'}} 
                        onClick={() => setDialog(true)}
                    >
                        <DeleteIcon 
                            sx={{color: 'red'}} 
                        />
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

export default ProjectCards