import React from 'react';
import dynamic from 'next/dynamic';
import {Chart} from './ApexCharts'
import {Card, CardContent} from '@mui/material'

const options = {
  chart: {
    id: 'basic-area-chart'
  },
  xaxis: {
    categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  },
  yaxis: {
    title: {
      text: 'Tasks'
    }
  }
};

const series = [{
  name: 'Tasks',
  data: [30, 40, 35, 50, 49, 60, 70, 91, 125, 100, 80, 60]
}];

export const AreaChart = (props: any) => {
    const sx = props
    return (
    <Card sx={sx} elevation={5}>
        <CardContent>
            <Chart options={options} series={series} type="area" height={350} width='100%'/>
        </CardContent>
    </Card>
  );
};
