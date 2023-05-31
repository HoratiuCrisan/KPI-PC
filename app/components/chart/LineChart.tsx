import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { Card, CardContent } from '@mui/material';

// Import the type declaration for Chart component
import { Chart } from './ApexCharts';

const options = {
  chart: {
    id: 'basic-area-chart',
  },
  xaxis: {
    categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  },
  yaxis: {
    title: {
      text: 'Users',
    },
  },
};
interface AreaChartProps {
  sx: React.CSSProperties; // Define the type for the 'sx' prop
}

export const AreaChart: React.FC<AreaChartProps> = ({ sx }) => {
  const [series, setSeries] = useState([{ name: 'Users', data: [] }]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/components-linechart');
        if (!response.ok) {
          throw new Error('Failed to fetch chart data');
        }
        const data = await response.json();
        setSeries([{ name: 'Users', data: data.data }]);
        setLoading(false);
      } catch (error) {
        console.error('An error occurred:', error);
        setLoading(false);
      }
    };
    

    fetchData();
  }, []);
  

  return (
    <Card sx={sx} elevation={5}>
      <CardContent>
        <Chart options={options} series={series} type="area" height={350} width="100%" />
      </CardContent>
    </Card>
  );
};

export default AreaChart;