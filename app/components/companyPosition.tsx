"use client"
import * as React from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';


const CompanyPosition = () => {
    const company_position = ['User', 'Manager', 'Admin']

    const [position, setPosition] = React.useState('')

    const handleChange = (event: SelectChangeEvent) => {
        setPosition(event.target.value as string)
    }

    return (
        <Box sx = {{minWidth: 120}}>
            <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">
                    Position
                </InputLabel>
                <Select 
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={position}
                    label="Position"
                    onChange={handleChange}>
                      {
                        company_position.map((elem) => {
                            return ( <MenuItem value={elem}>{elem}</MenuItem>)
                        })
                      }
                </Select>
            </FormControl>
        </Box>
    )
}

export default CompanyPosition