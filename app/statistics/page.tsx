"use client"
import React from "react"
import {Toolbar, Typography, Box, Grid, Container} from "@mui/material"
import {AreaChart} from "../components/chart/LineChart"
import {PieChart} from "../components/chart/PieChart"
import CardComponent from "../components/Statistic-cards"
import UserIcon from '@heroicons/react/24/solid/UserIcon'
import ClipboardDocumentListIcon from '@heroicons/react/24/solid/ClipboardDocumentListIcon'
import UserGroupIcon from '@heroicons/react/24/solid/UserGroupIcon'
import CurrencyDollarIcon from '@heroicons/react/24/solid/CurrencyDollarIcon'
import {NewUsers} from "../components/NewUsers"
//import {userDataGrid} from "../components/userDataGrid"
const statCards = [
    {
        text: 'New Users',
        icon: <UserIcon />,
        value: 10,
        bgcolor: "#ef4444",
        money: false
    },
    {
        text: 'Tasks/Month',
        icon: <ClipboardDocumentListIcon />,
        value: 56,
        bgcolor: "#10b981",
        money: false
    },
    {
        text: 'Total Teams',
        icon: <UserGroupIcon />,
        value: 44,
        bgcolor: "#f97316",
        money: false
    },
    {
        text: 'Total Profit',
        icon: <CurrencyDollarIcon />,
        value: 35000,
        bgcolor: "#a855f7",
        money: true
    },
]

const Statistics = () => {
    return (
        <Box component="main" sx={{flexGrow: 1, py: 8}}>
            <Container maxWidth="xl">
            <Toolbar sx={{mt: -8}}/>
            <Typography variant="h6" fontWeight={600}>
                Home / <span className="text-blue-700">Statistics</span>
            </Typography>
            <Toolbar sx={{mt: -5}} />
                <Grid container spacing={3}>
                    { statCards.map(elem => {
                        return (
                            <Grid item xs={12} sm={6} lg={3} key={elem.text}>
                                <CardComponent 
                                    sx={{height: '100%'}} 
                                    text={elem.text} 
                                    icon={elem.icon} 
                                    value={elem.value}
                                    color={elem.bgcolor}
                                    money={elem.money}
                                />
                            </Grid>
                        )
                    })
                    }
                    <Grid item xs={12} lg={8}>
                        <AreaChart sx={{height: '100%'}} />
                    </Grid>
                    <Grid item xs={12} md={6} lg={4}>
                        <PieChart sx={{ height: '100%'}}/>
                    </Grid>

                    <Grid item xs={12} md={6} lg={11.99} >
                        <NewUsers sx={{ height: '100%'}}/>
                    </Grid>
                    
                </Grid>

               
            </Container>
        </Box>
    )
}

export default Statistics