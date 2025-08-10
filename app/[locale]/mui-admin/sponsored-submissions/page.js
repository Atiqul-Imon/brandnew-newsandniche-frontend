'use client';

import { useEffect, useState } from 'react';
import { api } from '../../../apiConfig';
import { Box, Paper, Table, TableHead, TableRow, TableCell, TableBody, Chip, IconButton, Snackbar, Alert, Typography } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import PublishIcon from '@mui/icons-material/Publish';

export default function SponsoredSubmissionsPage({ params }) {
  const { locale } = params;
  const [rows, setRows] = useState([]);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const fetchData = async () => {
    try {
      const res = await api.get('/api/sponsored-posts');
      setRows(res.data?.data?.submissions || []);
    } catch (e) {
      setSnackbar({ open: true, message: 'Failed to load sponsored submissions', severity: 'error' });
    }
  };

  useEffect(() => { fetchData(); }, []);

  const act = async (id, action) => {
    try {
      if (action === 'approve') {
        await api.put(`/api/sponsored-posts/${id}/status`, { status: 'approved' });
      } else if (action === 'reject') {
        await api.put(`/api/sponsored-posts/${id}/status`, { status: 'rejected', rejectionReason: 'Not a fit' });
      } else if (action === 'publish') {
        await api.post(`/api/sponsored-posts/${id}/publish`);
      }
      setSnackbar({ open: true, message: 'Action completed', severity: 'success' });
      fetchData();
    } catch (e) {
      setSnackbar({ open: true, message: 'Action failed', severity: 'error' });
    }
  };

  const statusColor = (s) => s === 'approved' ? 'success' : s === 'rejected' ? 'error' : s === 'under_review' ? 'warning' : 'default';

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 2 }}>Sponsored Submissions</Typography>
      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Company</TableCell>
              <TableCell>Title</TableCell>
              <TableCell>Budget</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Requested</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((r) => (
              <TableRow key={r._id}>
                <TableCell>{r.client?.company}</TableCell>
                <TableCell>{r.post?.title?.en}</TableCell>
                <TableCell>${r.sponsorship?.budget}</TableCell>
                <TableCell><Chip label={r.status} color={statusColor(r.status)} size="small" /></TableCell>
                <TableCell>{new Date(r.requestDate).toLocaleDateString('en')}</TableCell>
                <TableCell align="right">
                  <IconButton title="Approve" onClick={() => act(r._id, 'approve')}><CheckIcon /></IconButton>
                  <IconButton title="Reject" onClick={() => act(r._id, 'reject')}><CloseIcon /></IconButton>
                  <IconButton title="Publish" onClick={() => act(r._id, 'publish')}><PublishIcon /></IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
      <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
        <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
}


