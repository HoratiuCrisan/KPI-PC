import React from 'react'
import dynamic from 'next/dynamic'
import {Chart} from './ApexCharts'
import {Card, CardContent, Typography, CardHeader} from '@mui/material'



const options = {
    chart: {
        id: 'basic-pie-chart',
    },
    labels: ['Team1', 'Team2', 'Team3', 'Team4'],
    legend: {
        show: false
    }
  };
  
  const series = [10, 15, 8 , 12];

export const PieChart = (props : any) => {
    const {sx} = props 
    return (
        <Card sx={sx} elevation={5} >
            <CardContent >
                <Chart options={options} series={series} type="pie" height={300} width={"100%"}/>
                <Typography variant="h6" align='center'>Tasks / Team </Typography>
            </CardContent>
        </Card>
      )
  }



