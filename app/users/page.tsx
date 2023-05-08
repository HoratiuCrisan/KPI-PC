"use client"
import {useEffect, useMemo} from "react"
import Navbar from "../components/navbar"
import Sidebar from "../components/sidebar"
import Statistics from "../statistics/page"
import { Box, Toolbar,Typography, Grid, Container } from '@mui/material'
import { DataGrid } from "@mui/x-data-grid"
import UserActions from "./userActions"
import UserCards from './cards'


const cards = [
    {name: "Total Empolyees", value: 53},
    {name: "Total Admins", value: 3},
    {name: "Total Managers", value: 10},
    {name: "Total Users", value: 40}
]


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
  
  const columns = [
    {field: 'id', headerName:"ID", width: 60},
    {field: 'firstName', headerName:"FirstName", width: 170},
    {field: 'lastName', headerName:"SecondName", width: 170},
    {field: 'position', headerName:"Position", width: 100},
    {field: 'hiredate', headerName:"HireDate", width: 100},
    {field: 'actions', headerName: "Actions", width: 150, renderCell: (params: any)=> <UserActions {...{params}} />}
  ]

const Users = () => {
    return (
        <div className="flex">
        <Navbar />
        <Sidebar />
        
       <Box flex="main" sx={{flexGrow: 1, py: 8}}>
            <Container maxWidth="xl">
                <Toolbar sx={{mt: -5}} />
                <Typography variant="h6" fontWeight={600} >
                    Home / <span className="text-blue-500"> Users </span>
                </Typography>
                <Toolbar sx={{mt: -5}}/>
                <Grid container spacing={3}>
                    {cards.map((elem)=> {
                        return (
                            <Grid item xs={12} md={6} lg={3} key={elem.name}>
                                <UserCards 
                                    sx={{height: '100%'}}
                                    text={elem.name}
                                    value={elem.value}
                                />
                            </Grid>
                        )
                    })}

                     <Grid
                        item xs={8} md={10} lg={12}
                        component={"main"} 
                        sx={{hieght: 300, width: '100%', ml: 3}}                
                    >
                        <Toolbar />
                        <DataGrid
                            sx={{
                                border: 'none', 
                                '& .MuiDataGrid-columnSeparator': {display: 'none'}
                            }}
                            columns={columns}
                            rows={users}
                            getRowId={row=>row.id}
                            initialState={{
                                pagination: {
                                    paginationModel: {
                                        pageSize: 5,
                                    }
                                }
                            }}
                            pageSizeOptions={[5, 25, 50]}
                            
                            getRowSpacing={(params:any) =>({
                                top: params.isFirstVisible ? 0 : 5,
                                bottom: params.isLastVisible ? 0 : 5
                            })}
                            
                        />
                    </Grid>
                </Grid>
                
            </Container>
       </Box>
        
        </div>
    )
}

export default Users