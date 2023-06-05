import React, { useEffect, useState } from "react";
import { ScrollBar } from './ScrollBar';
import ArrowRightIcon from '@heroicons/react/24/solid/ArrowRightIcon';
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
} from '@mui/material';

export const NewUsers = (props: { sx: any; }) => {
  const { sx } = props;
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('/statistics-users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        });

        if (response.ok) {
          const data = await response.json();
          setUsers(data.slice(0, 5)); // Store only the first five users
        } else {
          console.error('Failed to fetch users');
        }
      } catch (error) {
        console.error('An error occurred:', error);
      }
    };

    fetchUsers();
  }, []);

  let id = 1; // Starting ID

  const getPositionLabel = (position: number) => {
    if (position === 1) {
      return 'USER';
    } else if (position === 2) {
      return 'MANAGER';
    } else if (position === 3) {
      return 'ADMIN';
    } else {
      return '';
    }
  };

  return (
    <Card sx={sx} elevation={5}>
      <CardHeader title="New Users" />
      <ScrollBar sx={{ flexGrow: 1 }}>
        <Box sx={{ minWidth: 800 }}>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: "#f4f4f5" }}>
                <TableCell sx={{ fontWeight: 600 }}>
                  ID
                </TableCell>
                <TableCell sx={{ fontWeight: 600 }}>
                  First Name
                </TableCell>
                <TableCell sx={{ fontWeight: 600 }}>
                  Last Name
                </TableCell>
                <TableCell sx={{ fontWeight: 600 }}>
                  Role
                </TableCell>
                <TableCell sortDirection="desc" sx={{ fontWeight: 600 }}>
                  Hire Date
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user: any, index) => (
                <TableRow hover key={index}>
                  <TableCell>
                    {id++}
                  </TableCell>
                  <TableCell>
                    {user.FIRST_NAME}
                  </TableCell>
                  <TableCell>
                    {user.LAST_NAME}
                  </TableCell>
                  <TableCell>
                    {getPositionLabel(user.POSITION)}
                  </TableCell>
                  <TableCell>
                    {new Date(user.DATE).toLocaleDateString('en-GB')}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      </ScrollBar>
      <Divider sx={{ mt: -40 }} />
      <CardActions sx={{ justifyContent: 'flex-end' }}>
        <Button href="/users/" color="inherit" size="small" sx={{ fontWeight: 600 }} variant="text" endIcon={(
          <SvgIcon fontSize="small">
            <ArrowRightIcon />
          </SvgIcon>
        )}>
          View all
        </Button>
      </CardActions>
    </Card>
  );
};

export default NewUsers;