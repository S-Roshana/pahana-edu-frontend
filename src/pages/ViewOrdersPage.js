import React, { useState, useEffect } from "react";
import {
  Box, Typography, Snackbar, Alert, TextField, IconButton, Tooltip, Chip, Dialog, DialogTitle, DialogContent, DialogActions, Button, MenuItem, CircularProgress
} from "@mui/material";
import { DataGrid } from '@mui/x-data-grid';
import { Search, Refresh, Info } from '@mui/icons-material';
import axios from "axios";

const NEON_BG = "#181A20";
const NEON_CARD = "#23263a";
const NEON_ACCENT = "#00f2fe";
const NEON_ACCENT2 = "#f7971e";
const NEON_ACCENT3 = "#43e97b";
const NEON_ACCENT4 = "#764ba2";

function ViewOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [openDetails, setOpenDetails] = useState(false);

  const fetchOrders = () => {
    setLoading(true);
    axios.get("http://localhost:8080/api/orders")
      .then(res => setOrders(res.data))
      .catch(() => setSnackbar({ open: true, message: 'Failed to fetch orders', severity: 'error' }))
      .finally(() => setLoading(false));
  };
  useEffect(fetchOrders, []);

  // Filtered orders
  const filteredOrders = orders.filter(o =>
    (!search ||
      o.customerName?.toLowerCase().includes(search.toLowerCase()) ||
      o.bookTitle?.toLowerCase().includes(search.toLowerCase())
    ) &&
    (!dateFilter || (o.orderDate && o.orderDate.startsWith(dateFilter)))
  );

  // Table columns
  const columns = [
    { field: 'id', headerName: 'Order ID', flex: 0.7, minWidth: 90 },
    { field: 'bookTitle', headerName: 'Book', flex: 1, minWidth: 120 },
    { field: 'customerName', headerName: 'Customer', flex: 1, minWidth: 120 },
    { field: 'quantity', headerName: 'Qty', flex: 0.5, minWidth: 60 },
    { field: 'totalPrice', headerName: 'Total', flex: 0.7, minWidth: 90, renderCell: (params) => `Rs. ${params.value}` },
    {
      field: 'orderDate', headerName: 'Order Date', flex: 1, minWidth: 140,
      renderCell: (params) => params.value ? new Date(params.value).toLocaleString() : ''
    },
    {
      field: 'actions', headerName: 'Details', flex: 0.6, minWidth: 80, sortable: false, filterable: false,
      renderCell: (params) => (
        <Tooltip title="View Details">
          <IconButton onClick={() => { setSelectedOrder(params.row); setOpenDetails(true); }}><Info sx={{ color: NEON_ACCENT }} /></IconButton>
        </Tooltip>
      )
    },
  ];

  return (
    <Box sx={{ bgcolor: NEON_BG, minHeight: '100vh', p: 4 }}>
      <Typography variant="h4" fontWeight="bold" color={NEON_ACCENT3} mb={3}>View Orders</Typography>
      <Box display="flex" gap={2} mb={2}>
        <TextField
          label="Search by Customer or Book"
          value={search}
          onChange={e => setSearch(e.target.value)}
          sx={{ bgcolor: NEON_CARD, borderRadius: 2, input: { color: '#fff' }, label: { color: NEON_ACCENT } }}
          InputLabelProps={{ style: { color: NEON_ACCENT } }}
          InputProps={{
            endAdornment: <Search sx={{ color: NEON_ACCENT }} />
          }}
        />
        <TextField
          label="Order Date (YYYY-MM-DD)"
          value={dateFilter}
          onChange={e => setDateFilter(e.target.value)}
          sx={{ bgcolor: NEON_CARD, borderRadius: 2, input: { color: '#fff' }, label: { color: NEON_ACCENT4 } }}
          InputLabelProps={{ style: { color: NEON_ACCENT4 } }}
        />
        <Tooltip title="Refresh">
          <IconButton onClick={fetchOrders} sx={{ color: NEON_ACCENT }}><Refresh /></IconButton>
        </Tooltip>
      </Box>
      <Box sx={{ height: 600, bgcolor: NEON_CARD, borderRadius: 3, boxShadow: 4, p: 2 }}>
        <DataGrid
          rows={filteredOrders.map(o => ({ ...o, id: o.id }))}
          columns={columns}
          loading={loading}
          pageSize={10}
          rowsPerPageOptions={[10, 20, 50]}
          disableSelectionOnClick
          sx={{
            color: '#fff',
            border: 'none',
            '& .MuiDataGrid-columnHeaders': { bgcolor: NEON_BG, color: NEON_ACCENT3, fontWeight: 'bold', fontSize: 16 },
            '& .MuiDataGrid-row': { bgcolor: NEON_CARD },
            '& .MuiDataGrid-cell': { borderBottom: '1px solid #222' },
            '& .MuiDataGrid-footerContainer': { bgcolor: NEON_BG, color: NEON_ACCENT3 },
            '& .MuiDataGrid-row:hover': { bgcolor: '#222' },
          }}
          onRowClick={(params) => { setSelectedOrder(params.row); setOpenDetails(true); }}
        />
      </Box>
      {/* Order Details Dialog */}
      <Dialog open={openDetails} onClose={() => setOpenDetails(false)} PaperProps={{ sx: { bgcolor: NEON_CARD, color: '#fff', borderRadius: 3, minWidth: 400 } }}>
        <DialogTitle>Order Details</DialogTitle>
        <DialogContent>
          {selectedOrder ? (
            <Box display="flex" flexDirection="column" gap={1}>
              <Typography><b>Order ID:</b> {selectedOrder.id}</Typography>
              <Typography><b>Book:</b> {selectedOrder.bookTitle}</Typography>
              <Typography><b>Customer:</b> {selectedOrder.customerName}</Typography>
              <Typography><b>Contact:</b> {selectedOrder.customerContact}</Typography>
              <Typography><b>Address:</b> {selectedOrder.customerAddress}</Typography>
              <Typography><b>Email:</b> {selectedOrder.customerEmail}</Typography>
              <Typography><b>Quantity:</b> {selectedOrder.quantity}</Typography>
              <Typography><b>Total Price:</b> Rs. {selectedOrder.totalPrice}</Typography>
              <Typography><b>Order Date:</b> {selectedOrder.orderDate ? new Date(selectedOrder.orderDate).toLocaleString() : ''}</Typography>
              <Typography><b>Payment Method:</b> {selectedOrder.paymentMethod}</Typography>
            </Box>
          ) : <CircularProgress />}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDetails(false)} sx={{ color: NEON_ACCENT2 }}>Close</Button>
        </DialogActions>
      </Dialog>
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

export default ViewOrdersPage; 