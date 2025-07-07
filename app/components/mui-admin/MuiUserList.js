'use client';

import { useEffect, useState } from 'react';
import {
  Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Typography, Chip, CircularProgress, Tooltip, Dialog, DialogTitle, DialogContent, DialogActions, Button, MenuItem, Select, FormControl, InputLabel, Snackbar, Alert
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, CheckCircle as CheckCircleIcon, Cancel as CancelIcon, Person as PersonIcon } from '@mui/icons-material';
import { api } from '../../apiConfig';

const roleLabels = {
  user: 'User',
  editor: 'Editor',
  moderator: 'Moderator',
  admin: 'Admin',
};

export default function MuiUserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editDialog, setEditDialog] = useState({ open: false, user: null });
  const [deleteDialog, setDeleteDialog] = useState({ open: false, user: null });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [role, setRole] = useState('user');
  const [statusLoading, setStatusLoading] = useState(null);
  const [roleLoading, setRoleLoading] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(null);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const res = await api.get('/api/users', { headers: { Authorization: `Bearer ${token}` } });
      setUsers(res.data.data.users || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Edit Role
  const handleOpenEdit = (user) => {
    setRole(user.role);
    setEditDialog({ open: true, user });
  };
  const handleCloseEdit = () => setEditDialog({ open: false, user: null });
  const handleSaveRole = async () => {
    setRoleLoading(editDialog.user._id);
    try {
      const token = localStorage.getItem('token');
      await api.put(`/api/users/${editDialog.user._id}/role`, { role }, { headers: { Authorization: `Bearer ${token}` } });
      setSnackbar({ open: true, message: 'Role updated successfully', severity: 'success' });
      fetchUsers();
      handleCloseEdit();
    } catch (err) {
      setSnackbar({ open: true, message: err.response?.data?.message || 'Failed to update role', severity: 'error' });
    } finally {
      setRoleLoading(null);
    }
  };

  // Activate/Deactivate
  const handleToggleStatus = async (user) => {
    setStatusLoading(user._id);
    try {
      const token = localStorage.getItem('token');
      await api.put(`/api/users/${user._id}/status`, { isActive: !user.isActive }, { headers: { Authorization: `Bearer ${token}` } });
      setSnackbar({ open: true, message: `User ${user.isActive ? 'deactivated' : 'activated'} successfully`, severity: 'success' });
      fetchUsers();
    } catch (err) {
      setSnackbar({ open: true, message: err.response?.data?.message || 'Failed to update status', severity: 'error' });
    } finally {
      setStatusLoading(null);
    }
  };

  // Delete
  const handleOpenDelete = (user) => setDeleteDialog({ open: true, user });
  const handleCloseDelete = () => setDeleteDialog({ open: false, user: null });
  const handleDelete = async () => {
    setDeleteLoading(deleteDialog.user._id);
    try {
      const token = localStorage.getItem('token');
      await api.delete(`/api/users/${deleteDialog.user._id}`, { headers: { Authorization: `Bearer ${token}` } });
      setSnackbar({ open: true, message: 'User deleted successfully', severity: 'success' });
      fetchUsers();
      handleCloseDelete();
    } catch (err) {
      setSnackbar({ open: true, message: err.response?.data?.message || 'Failed to delete user', severity: 'error' });
    } finally {
      setDeleteLoading(null);
    }
  };

  return (
    <Box>
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 6 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Username</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user._id}>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <PersonIcon fontSize="small" />
                      <Typography>{user.name}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.username}</TableCell>
                  <TableCell>
                    <Chip label={roleLabels[user.role] || user.role} color={user.role === 'admin' ? 'primary' : user.role === 'moderator' ? 'secondary' : 'default'} size="small" />
                  </TableCell>
                  <TableCell>
                    <Chip label={user.isActive ? 'Active' : 'Inactive'} color={user.isActive ? 'success' : 'default'} size="small" />
                  </TableCell>
                  <TableCell align="right">
                    <Tooltip title="Edit Role">
                      <span>
                        <IconButton onClick={() => handleOpenEdit(user)} disabled={roleLoading === user._id}>
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </span>
                    </Tooltip>
                    <Tooltip title={user.isActive ? 'Deactivate' : 'Activate'}>
                      <span>
                        <IconButton onClick={() => handleToggleStatus(user)} disabled={statusLoading === user._id}>
                          {user.isActive ? <CancelIcon color="error" fontSize="small" /> : <CheckCircleIcon color="success" fontSize="small" />}
                        </IconButton>
                      </span>
                    </Tooltip>
                    <Tooltip title="Delete User">
                      <span>
                        <IconButton onClick={() => handleOpenDelete(user)} disabled={deleteLoading === user._id}>
                          <DeleteIcon color="error" fontSize="small" />
                        </IconButton>
                      </span>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Edit Role Dialog */}
      <Dialog open={editDialog.open} onClose={handleCloseEdit}>
        <DialogTitle>Edit User Role</DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Role</InputLabel>
            <Select value={role} onChange={e => setRole(e.target.value)} label="Role">
              <MenuItem value="user">User</MenuItem>
              <MenuItem value="editor">Editor</MenuItem>
              <MenuItem value="moderator">Moderator</MenuItem>
              <MenuItem value="admin">Admin</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEdit}>Cancel</Button>
          <Button onClick={handleSaveRole} variant="contained" disabled={roleLoading === (editDialog.user && editDialog.user._id)}>
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={deleteDialog.open} onClose={handleCloseDelete}>
        <DialogTitle>Delete User</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this user? This action cannot be undone.</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDelete}>Cancel</Button>
          <Button onClick={handleDelete} variant="contained" color="error" disabled={deleteLoading === (deleteDialog.user && deleteDialog.user._id)}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
        <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
} 