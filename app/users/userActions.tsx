import {Box, IconButton, Tooltip} from '@mui/material'
import { Delete, Edit, Preview} from '@mui/icons-material'

const UserActions = (props: any) => {
    return (
        <Box>
            <Tooltip title="View user details">
                <IconButton >
                    <Preview sx={{color: "black"}}/>
                </IconButton>
            </Tooltip>
            <Tooltip title="Edit user details">
                <IconButton >
                    <Edit sx={{color: "green"}}/>
                </IconButton>
            </Tooltip>
            <Tooltip title="Delete this user">
                <IconButton >
                    <Delete sx={{color: "red"}}/>
                </IconButton>
            </Tooltip>
        </Box>
    )
}

export default UserActions