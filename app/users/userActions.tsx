import { Box, Button, IconButton, Tooltip } from '@mui/material';
import { Delete, Edit, Preview, Add } from '@mui/icons-material';

interface UserActionsProps {
  params: any;
  onDelete: (id: number, position: number, teamN: string | null) => Promise<void>;
}

const UserActions = (props: UserActionsProps) => {
  const { params, onDelete } = props;
  const { ID_EMPLOYEE, POSITION } = params.row;

  const handleDeleteClick = () => {
    onDelete(ID_EMPLOYEE, POSITION, params.row.TEAM_N);
  };

  return (
    <Box>
      <Tooltip title="Edit user details">
        <IconButton>
          <Edit sx={{ color: 'green' }} />
        </IconButton>
      </Tooltip>
      <Tooltip title="Delete this user">
        <IconButton onClick={handleDeleteClick}>
          <Delete sx={{ color: 'red' }} />
        </IconButton>
      </Tooltip>
    </Box>
  );
};

export default UserActions;