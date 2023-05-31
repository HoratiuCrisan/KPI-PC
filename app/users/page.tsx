"use client"
import { useEffect, useState } from "react";
import Navbar from "../components/navbar";
import Sidebar from "../components/sidebar";
import UserActions from "./userActions";
import UserCards from './cards';
import { ScrollBar } from "../components/ScrollBar";
import { DataGrid } from "@mui/x-data-grid";
import { Box, Button, Card, CardActions, CardHeader, Divider, SvgIcon, Table, TableBody, TableCell, TableHead, TableRow, Toolbar, Typography, Grid, Container } from '@mui/material';

interface User {
  id: number;
  ID_EMPLOYEE: number;
  FIRST_NAME: string; // Change firstName to FIRST_NAME
  LAST_NAME: string; // Change lastName to LAST_NAME
  POSITION: number; // Change position to POSITION
  DATE: string; // Change hiredate to DATE
  EMAIL: string;
  TEAM_N: string;
}

const Users = () => { // Remove unnecessary props declaration
  const [users, setUsers] = useState<User[]>([]);
  const [totalEmployees, setTotalEmployees] = useState(0);
  const [totalAdmins, setTotalAdmins] = useState(0);
  const [totalManagers, setTotalManagers] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);

  const handleDeleteUser = async (id: number, position: number, teamN: string | null) => {
   console.log(id)
    try {
      const response = await fetch(`/delete-user/${id}?position=${position}&teamN=${teamN}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        // User deleted successfully
        setUsers(users.filter((user) => user.ID_EMPLOYEE !== id));
      } else {
        console.error('Failed to delete user');
      }
    } catch (error) {
      console.error('An error occurred:', error);
    }
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('/statistics-users_u', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        });

        if (response.ok) {
          const data = await response.json();

          const { totalUsers, totalAdmins, totalEmployees, totalManagers } = data;
          // Generate an incremented ID for each user
          const usersWithId = data.users.map((user: any, index: number) => ({
            ...user,
            id: index + 1,
          }));

          // Set the users state with the updated array
          setUsers(usersWithId);
          setTotalUsers(totalUsers);
          setTotalAdmins(totalAdmins);
          setTotalEmployees(totalEmployees);
          setTotalManagers(totalManagers);
        } else {
          console.error('Failed to fetch users');
        }
      } catch (error) {
        console.error('An error occurred:', error);
      }
    };

    fetchUsers();
  }, []);

  const columns = [
    { field: 'id', headerName: "ID", width: 60 },
    { field: 'FIRST_NAME', headerName: "First Name", width: 170 },
    { field: 'LAST_NAME', headerName: "Last Name", width: 170 },
    {field: 'EMAIL', headerName: "Email", width: 300},
    {field: 'TEAM_N', headerName: "Team", width: 200},
    { 
      field: 'POSITION', 
      headerName: "Position", 
      width: 150,
      renderCell: (params: any) => {
        const positionLabel = getPositionLabel(params.value);
        return <span>{positionLabel}</span>;
      },
    },

    {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      renderCell: (params: any) => (
        <UserActions {...{ params, onDelete: handleDeleteUser, position: params.row.POSITION }} />
      ),
    },
  ];

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

  const cards = [
    { name: "Total Employees", value: totalEmployees },
    { name: "Total Admins", value: totalAdmins },
    { name: "Total Managers", value: totalManagers },
    { name: "Total Users", value: totalUsers }
  ];

  return (
    <div className="flex">
      <Navbar />
      <Sidebar />

      <Box flex="main" sx={{ flexGrow: 1, py: 8 }}>
        <Container maxWidth="xl">
          <Toolbar sx={{ mt: -5 }} />
          <Typography variant="h6" fontWeight={600}>
            Home / <span className="text-blue-700"> Users </span>
          </Typography>
          <Toolbar sx={{ mt: -5 }} />

          {/* Beginning of the card component */}
          <Grid container spacing={3}>
            {cards.map((elem) => (
              <Grid item xs={12} md={6} lg={3} key={elem.name}>
                <UserCards sx={{ height: '100%' }} text={elem.name} value={elem.value} />
              </Grid>
            ))}
          </Grid>
          {/* Ending of the card component */}

          {/* User data grid table */}
          <Toolbar sx={{ mt: -5 }} />
          <Grid
            item xs={8} md={10} lg={12}
            component={"main"}
            sx={{width: '100%', ml: 3 }}
          >
            <Toolbar />
            <DataGrid
              sx={{
                border: 'none',
                '& .MuiDataGrid-columnSeparator': { display: 'none' }
              }}
              columns={columns}
              rows={users}
              getRowId={(row) => row.id}
              initialState={{
                pagination: {
                  paginationModel: {
                    pageSize: 5,
                  }
                }
              }}
              pageSizeOptions={[5, 25, 50]}
              getRowSpacing={(params: any) => ({
                top: params.isFirstVisible ? 0 : 5,
                bottom: params.isLastVisible ? 0 : 5
              })}
            />
           <Button
              variant="contained"
              onClick={() => {
                location.href = '/usersForm';
              }}
              sx={{
                mt: 2,
                ml: 3,
                color: 'white',
                backgroundColor: 'blue !important',
                '&:hover': {
                  backgroundColor: 'green !important',
                },
              }}
            >
              +Add User
            </Button>
          </Grid>
        </Container>
      </Box>
    </div>
  );
};

export default Users;