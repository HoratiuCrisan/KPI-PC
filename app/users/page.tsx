"use client"
import React, { useEffect, useState } from "react";
import Navbar from "../components/navbar";
import Sidebar from "../components/sidebar";
import UserActions from "./userActions";
import UserCards from './cards';
import { ScrollBar } from "../components/ScrollBar";
import { DataGrid } from "@mui/x-data-grid";
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
  TableRow,
  Toolbar,
  Typography,
  Grid,
  Container,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  MenuItem,
  Select
} from '@mui/material';

interface User {
  id: number;
  ID_EMPLOYEE: number;
  FIRST_NAME: string;
  LAST_NAME: string;
  POSITION: number;
  DATE: string;
  TEAM_N: string | null; // Add TEAM_N property
}

const Users = () => {
  const [role, setRole] = useState(""); // Add role state

  useEffect(() => {
    const useRequireAuth = () => {
      // Check if the user is logged in
      const email = localStorage.getItem('email');
      const role = localStorage.getItem('role');
      const team = localStorage.getItem('team');

      console.log('User Role:', role);
      console.log('User Team:', team);

      if (!email || !role) {
        // If the user is not logged in, redirect to the login page
        location.href = "/";
      } else {
        setRole(role); // Set the role state
      }
    };

    useRequireAuth();
  }, []);

  const [users, setUsers] = useState<User[]>([]);
  const [totalEmployees, setTotalEmployees] = useState(0);
  const [totalAdmins, setTotalAdmins] = useState(0);
  const [totalManagers, setTotalManagers] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);
  const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
  const [deletingUserId, setDeletingUserId] = useState(0);
  const [deletingUserPosition, setDeletingUserPosition] = useState(0);
  const [deletingUserTeam, setDeletingUserTeam] = useState<string | null>(null);

  const [replacementManager, setReplacementManager] = useState<number | null>(null);
  const [availableManagers, setAvailableManagers] = useState<User[]>([]);

  const handleDeleteUser = async (id: number, position: number, teamN: string | null): Promise<void> => {
    setDeletingUserId(id);
    setDeletingUserPosition(position);
    setDeletingUserTeam(teamN);
    setReplacementManager(null); // Reset the replacement manager ID
    setDeleteConfirmationOpen(true);
  };

  useEffect(() => {
    // Filter available managers
    const availableManagers = users.filter(
      (user) => user.POSITION === 2 && user.TEAM_N === null
    );
    setAvailableManagers(availableManagers);

    // If the replacementManager is not null and is not available anymore,
    // reset the replacementManager value
    if (replacementManager !== null && !availableManagers.find(manager => manager.ID_EMPLOYEE === replacementManager)) {
      setReplacementManager(null);
    }
  }, [users]); // Add users as a dependency to the useEffect hook

  const handleConfirmationChoice = (confirmed: boolean) => {
    if (confirmed) {
      // User confirmed deletion, perform deletion logic
      if (deletingUserPosition === 2 && replacementManager !== null) {
        // Delete the manager and assign the replacement manager
        deleteUser(deletingUserId, deletingUserPosition, deletingUserTeam, replacementManager);
      } else if (deletingUserPosition === 1) {
        // Delete the user without assigning a replacement manager
        deleteUser(deletingUserId, deletingUserPosition, deletingUserTeam, null);
      } else if (deletingUserPosition === 2 && replacementManager == null && deletingUserTeam == null) {
        deleteUser(deletingUserId, deletingUserPosition, deletingUserTeam, null);
      } else if (deletingUserPosition === 2 && replacementManager == null) {
        alert('The replacement manager wasn\'t selected');
      }
    }
    // Reset confirmation-related state variables
    setDeletingUserId(0);
    setDeletingUserPosition(0);
    setDeletingUserTeam(null);
    setReplacementManager(null);
    setDeleteConfirmationOpen(false);
  };

  const deleteUser = async (id: number, position: number, teamN: string | null, replacementManager: number | null) => {
    try {
      const response = await fetch(`/delete-user/${id}?position=${position}&teamN=${teamN}&replacementManager=${replacementManager}`, {
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
          console.log(data)

          const { totalUsers, totalAdmins, totalEmployees, totalManagers } = data;
          // Generate an incremented ID for each user
          const formattedUsers = data.users.map((user: any, index: number) => ({
            ...user,
            id: index + 1,
          }));
          // Set the users state with the updated array
          setTotalUsers(totalUsers);
          setTotalAdmins(totalAdmins);
          setTotalEmployees(totalEmployees);
          setTotalManagers(totalManagers);

          setUsers(formattedUsers);

          // Filter available managers
          const availableManagers = formattedUsers.filter(
            (user: { POSITION: number; TEAM_N: null; }) => user.POSITION === 2 && user.TEAM_N === null
          );
          setAvailableManagers(availableManagers);
        }
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  const columns = [
    { field: 'id', headerName: "ID", width: 60 },
    { field: 'FIRST_NAME', headerName: "First Name", width: 170 },
    { field: 'LAST_NAME', headerName: "Last Name", width: 170 },
    {
      field: 'POSITION',
      headerName: "Role",
      width: 100,
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
            sx={{  width: '100%', ml: 3 }}
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
            
            {(role === "2" || role === "3" || role === null) && ( // Conditionally show the button based on the role
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
                +Add User/Manager
              </Button>
            )}
          </Grid>
        </Container>
      </Box>

      {/* Delete confirmation dialog */}
      <Dialog open={deleteConfirmationOpen} onClose={() => handleConfirmationChoice(false)}>
        <DialogTitle>Delete User</DialogTitle>
        <DialogContent>
          <Typography variant="body1">Are you sure you want to delete this user?</Typography>

          {(deletingUserPosition === 2 && availableManagers.length > 0 && deletingUserTeam !== null) && (
            <FormControl sx={{ mt: 6 }}>
              <InputLabel id="replacement-manager-label">Select Replacement Manager</InputLabel>
              <Select
                labelId="replacement-manager-label"
                value={replacementManager}
                onChange={(event) => setReplacementManager(event.target.value as number)}
              >
                {availableManagers.map((manager) => (
                  <MenuItem key={manager.ID_EMPLOYEE} value={manager.ID_EMPLOYEE}>
                    {`${manager.FIRST_NAME} ${manager.LAST_NAME}`}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleConfirmationChoice(true)}>Delete</Button>
          <Button onClick={() => handleConfirmationChoice(false)}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Users;