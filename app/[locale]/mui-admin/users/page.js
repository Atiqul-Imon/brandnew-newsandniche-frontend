import MuiUserList from '../../../components/mui-admin/MuiUserList';
import { Box, Typography } from '@mui/material';

export default function MuiAdminUsersPage() {
  return (
    <Box sx={{ p: { xs: 1, md: 3 } }}>
      <Typography variant="h4" sx={{ mb: 2, fontWeight: 700 }}>
        User Management
      </Typography>
      <Typography variant="body1" sx={{ mb: 3, color: 'text.secondary' }}>
        View, edit, and manage all users. Only admins can access this page.
      </Typography>
      <MuiUserList />
    </Box>
  );
} 