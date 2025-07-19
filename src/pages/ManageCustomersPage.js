import React, { useState, useEffect } from "react";
import {
  Box, Typography, Button, Chip, Snackbar, Alert, TextField, IconButton, Tooltip, CircularProgress, MenuItem
} from "@mui/material";
import { DataGrid } from '@mui/x-data-grid';
import { CheckCircle, Block, Search, Refresh } from '@mui/icons-material';
import axios from "axios";

const NEON_BG = "#181A20";
const NEON_CARD = "#23263a";
const NEON_ACCENT = "#00f2fe";
const NEON_ACCENT2 = "#f7971e";
const NEON_ACCENT3 = "#43e97b";
const NEON_ACCENT4 = "#764ba2";

function ManageCustomersPage() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const fetchCustomers = () => {
    setLoading(true);
    axios.get("http://localhost:8080/api/customers")
      .then(res => setCustomers(res.data))
      .catch(() => setSnackbar({ open: true, message: 'Failed to fetch customers', severity: 'error' }))
      .finally(() => setLoading(false));
  };
  useEffect(fetchCustomers, []);

  const handleActivate = (id) => {
    axios.patch(`http://localhost:8080/api/customers/${id}/activate`)
      .then(() => { setSnackbar({ open: true, message: 'Account activated!', severity: 'success' }); fetchCustomers(); })
      .catch(() => setSnackbar({ open: true, message: 'Failed to activate account', severity: 'error' }));
  };
  const handleDeactivate = (id) => {
    axios.patch(`http://localhost:8080/api/customers/${id}/deactivate`)
      .then(() => { setSnackbar({ open: true, message: 'Account deactivated!', severity: 'success' }); fetchCustomers(); })
      .catch(() => setSnackbar({ open: true, message: 'Failed to deactivate account', severity: 'error' }));
  };

  // Filtered customers
  const filteredCustomers = customers.filter(c =>
    (!search || c.name?.toLowerCase().includes(search.toLowerCase()) || c.username?.toLowerCase().includes(search.toLowerCase())) &&
    (!statusFilter || c.accountStatus === statusFilter)
  );

  // Table columns
  const columns = [
    { field: 'name', headerName: 'Name', flex: 1, minWidth: 120 },
    { field: 'username', headerName: 'Username', flex: 1, minWidth: 120 },
    { field: 'accountNumber', headerName: 'Account #', flex: 0.8, minWidth: 100 },
    { field: 'contactNo', headerName: 'Contact', flex: 1, minWidth: 120 },
    { field: 'address', headerName: 'Address', flex: 1.2, minWidth: 150 },
    {
      field: 'accountStatus', headerName: 'Status', flex: 0.7, minWidth: 100,
      renderCell: (params) => (
        <Chip
          label={params.value}
          sx={{
            bgcolor: params.value === 'ACTIVE' ? NEON_ACCENT3 : NEON_ACCENT2,
            color: '#fff', fontWeight: 'bold', letterSpacing: 1
          }}
          icon={params.value === 'ACTIVE' ? <CheckCircle /> : <Block />}
        />
      )
    },
    {
      field: 'actions', headerName: 'Actions', flex: 1, minWidth: 140, sortable: false, filterable: false,
      renderCell: (params) => (
        <Box>
          {params.row.accountStatus === 'ACTIVE' ? (
            <Tooltip title="Deactivate Account">
              <IconButton onClick={() => handleDeactivate(params.row.id)}><Block sx={{ color: NEON_ACCENT2 }} /></IconButton>
            </Tooltip>
          ) : (
            <Tooltip title="Activate Account">
              <IconButton onClick={() => handleActivate(params.row.id)}><CheckCircle sx={{ color: NEON_ACCENT3 }} /></IconButton>
            </Tooltip>
          )}
        </Box>
      )
    },
  ];

  return (
    <Box sx={{ bgcolor: NEON_BG, minHeight: '100vh', p: 4 }}>
      <Typography variant="h4" fontWeight="bold" color={NEON_ACCENT4} mb={3}>Manage Customers</Typography>
      <Box display="flex" gap={2} mb={2}>
        <TextField
          label="Search by Name or Username"
          value={search}
          onChange={e => setSearch(e.target.value)}
          sx={{ bgcolor: NEON_CARD, borderRadius: 2, input: { color: '#fff' }, label: { color: NEON_ACCENT } }}
          InputLabelProps={{ style: { color: NEON_ACCENT } }}
          InputProps={{
            endAdornment: <Search sx={{ color: NEON_ACCENT }} />
          }}
        />
        <TextField
          select
          label="Status"
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          sx={{ bgcolor: NEON_CARD, borderRadius: 2, minWidth: 120, label: { color: NEON_ACCENT2 } }}
          InputLabelProps={{ style: { color: NEON_ACCENT2 } }}
        >
          <MenuItem value="">All</MenuItem>
          <MenuItem value="ACTIVE">Active</MenuItem>
          <MenuItem value="INACTIVE">Inactive</MenuItem>
        </TextField>
        <Tooltip title="Refresh">
          <IconButton onClick={fetchCustomers} sx={{ color: NEON_ACCENT }}><Refresh /></IconButton>
        </Tooltip>
      </Box>
      <Box sx={{ height: 600, bgcolor: NEON_CARD, borderRadius: 3, boxShadow: 4, p: 2 }}>
        <DataGrid
          rows={filteredCustomers.map(c => ({ ...c, id: c.id }))}
          columns={columns}
          loading={loading}
          pageSize={10}
          rowsPerPageOptions={[10, 20, 50]}
          disableSelectionOnClick
          sx={{
            color: '#fff',
            border: 'none',
            '& .MuiDataGrid-columnHeaders': { bgcolor: NEON_BG, color: NEON_ACCENT4, fontWeight: 'bold', fontSize: 16 },
            '& .MuiDataGrid-row': { bgcolor: NEON_CARD },
            '& .MuiDataGrid-cell': { borderBottom: '1px solid #222' },
            '& .MuiDataGrid-footerContainer': { bgcolor: NEON_BG, color: NEON_ACCENT4 },
            '& .MuiDataGrid-row:hover': { bgcolor: '#222' },
          }}
        />
      </Box>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default ManageCustomersPage; 