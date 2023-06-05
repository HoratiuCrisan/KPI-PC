import { Box, IconButton, Tooltip } from '@mui/material';
import { Delete, Edit } from '@mui/icons-material';

interface UserActionsProps {
  params: any;
  onDelete: (id: number, position: number, teamN: string | null) => Promise<void>;
  position: any;
}

const UserActions = (props: UserActionsProps) => {
  const { params, onDelete, position } = props;
  const { ID_EMPLOYEE, POSITION } = params.row;

  const handleDeleteClick = async () => {
    await onDelete(ID_EMPLOYEE, POSITION, params.row.TEAM_N);
  };

  const userRole = localStorage.getItem('role');
  const userTeam = localStorage.getItem('team');

  const showEditButton = userRole === "3" || (userRole === "2" && userTeam === params.row.TEAM_N);
  const showDeleteButton = showEditButton;

  return (
    <Box>
      {showEditButton && (
        <Tooltip title="Edit user details">
          <IconButton>
            <Edit sx={{ color: 'green' }} />
          </IconButton>
        </Tooltip>
      )}
      {showDeleteButton && (
        <Tooltip title="Delete this user">
          <IconButton onClick={handleDeleteClick}>
            <Delete sx={{ color: 'red' }} />
          </IconButton>
        </Tooltip>
      )}
    </Box>
  );
};

export default UserActions;