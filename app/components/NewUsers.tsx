import React from "react"
import {ScrollBar} from './ScrollBar'
import  ArrowRightIcon from '@heroicons/react/24/solid/ArrowRightIcon'
import {
    Box,
    Button,
    Card,
    CardActions,
    CardHeader,
    Divider,
    SvgIcon,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow
} from '@mui/material'

const newUsers = [
    {id: 1, firstName: 'John', lastName: 'Johnes', position: 'admin', hiredate: '05/06/2023'},
    {id: 2, firstName: 'Lockie', lastName: 'Wells', position: 'manager', hiredate: '04/06/2023'},
    {id: 3, firstName: 'Quiton', lastName: 'Hudson', position: 'user', hiredate: '03/05/2023'},
    {id: 4, firstName: 'Sidney', lastName: 'Stevenson', position: 'admin', hiredate: '21/06/2020'},
    {id: 5, firstName: 'Lynette', lastName: 'Boyce', position: 'user', hiredate: '05/06/2019'},
]

export const NewUsers = (props: any) => {
   const {sx} = props
    return (
        <Card sx={sx} elevation={5} >
            <CardHeader title="New Users"/>
            <ScrollBar sx={{flexGrow: 1}} >
                <Box sx={{ minWidth: 800}}>
                    <Table>
                        <TableHead>
                            <TableRow sx={{bgcolor: "#f4f4f5"}}>
                                <TableCell sx={{fontWeight: 600}}>
                                    ID
                                </TableCell>
                                <TableCell sx={{fontWeight: 600}}>
                                    First Name
                                </TableCell>
                                <TableCell sx={{fontWeight: 600}}>
                                    Last Name
                                </TableCell>
                                <TableCell sx={{fontWeight: 600}}>
                                    Position
                                </TableCell>
                                <TableCell sortDirection="desc" sx={{fontWeight: 600}}>
                                    Hire Date
                                </TableCell>
                             </TableRow>
                        </TableHead>
                        <TableBody>
                            {newUsers.map((user) => {
                                return (
                                    <TableRow hover key={user.id}>
                                        <TableCell>
                                            {user.id}
                                        </TableCell>
                                        <TableCell>
                                            {user.firstName}
                                        </TableCell>
                                        <TableCell>
                                            {user.lastName}
                                        </TableCell>
                                        <TableCell>
                                            {user.position}
                                        </TableCell>
                                        <TableCell>
                                            {user.hiredate}
                                        </TableCell>
                                    </TableRow>
                                 )   
                                })}
                            </TableBody>
                        </Table>
                    </Box>
                </ScrollBar>
                <Divider sx={{mt: -40}}/>
                <CardActions sx={{ justifyContent: 'flex-end'}}>
                    <Button href="/users/" color="inherit" size="small" sx={{fontWeight: 600}} variant="text" endIcon={(
                        <SvgIcon fontSize="small">
                            <ArrowRightIcon />
                      </SvgIcon>
                    )}>
                        View all    
                    </Button>
                </CardActions>
        </Card>
    )
}

