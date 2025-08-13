import React, { useState, useEffect } from "react";
import {
  Box, Typography, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, IconButton, Tooltip, Snackbar, Alert, Avatar, Chip, MenuItem, CircularProgress
} from "@mui/material";
import { DataGrid } from '@mui/x-data-grid';
import { AddCircleOutline, Delete, Print, Email, Search, Refresh, Download } from '@mui/icons-material';
import axios from "axios";

const NEON_BG = "#181A20";
const NEON_CARD = "#23263a";
const NEON_ACCENT = "#00f2fe";
const NEON_ACCENT2 = "#f7971e";
const NEON_ACCENT3 = "#43e97b";
const NEON_ACCENT4 = "#764ba2";

function BillingPage() {
  const [customers, setCustomers] = useState([]);
  const [books, setBooks] = useState([]);
  const [bills, setBills] = useState([]); // In-memory for now
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [search, setSearch] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [openCreate, setOpenCreate] = useState(false);
  const [form, setForm] = useState({ customer: null, items: [], manual: { name: '', contactNo: '', address: '', email: '' } });
  const [currentBook, setCurrentBook] = useState({ title: '', category: '', quantity: 1, price: 0 });
  const [pdfLoading, setPdfLoading] = useState(false);
  const [selectedBill, setSelectedBill] = useState(null);
  const [openBillDialog, setOpenBillDialog] = useState(false);
  const [manualEntry, setManualEntry] = useState(false);

  // Fetch customers, books, and bills
  useEffect(() => {
    axios.get("http://localhost:8080/api/customers").then(res => setCustomers(res.data));
    axios.get("http://localhost:8080/api/books").then(res => setBooks(res.data));
    axios.get("http://localhost:8080/api/billing").then(res => setBills(res.data));
  }, []);

  // Handlers for bill creation
  const handleOpenCreate = () => {
    setForm({ customer: null, items: [], manual: { name: '', contactNo: '', address: '', email: '' } });
    setCurrentBook({ title: '', category: '', quantity: 1, price: 0 });
    setManualEntry(false);
    setOpenCreate(true);
  };
  const handleCloseCreate = () => setOpenCreate(false);

  // Add book to bill
  const handleAddBook = () => {
    if (!currentBook.title || !currentBook.quantity || !currentBook.price) return;
    setForm(f => ({ ...f, items: [...f.items, { ...currentBook }] }));
    setCurrentBook({ title: '', category: '', quantity: 1, price: 0 });
  };
  // Remove book from bill
  const handleRemoveBook = (idx) => {
    setForm(f => ({ ...f, items: f.items.filter((_, i) => i !== idx) }));
  };

  // Auto-fill book details
  const handleBookTitleChange = (title) => {
    const book = books.find(b => b.title === title);
    if (book) {
      setCurrentBook({
        title: book.title,
        category: book.category,
        quantity: 1,
        price: book.price
      });
    } else {
      setCurrentBook(c => ({ ...c, title }));
    }
  };
  const handleBookCategoryChange = (category) => {
    setCurrentBook(c => ({ ...c, category }));
  };

  // Calculate total
  const totalPrice = form.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // Create bill (calculate, generate PDF, send email)
  const handleCreateBill = async (action) => {
    if ((manualEntry && (!form.manual.name || !form.manual.contactNo)) || (!manualEntry && !form.customer) || form.items.length === 0) return;
    setPdfLoading(true);
    const bill = manualEntry ? {
      customerName: form.manual.name,
      customerContactNo: form.manual.contactNo,
      customerAddress: form.manual.address,
      customerEmail: form.manual.email || '',
      items: form.items,
      totalPrice,
      billDate: new Date().toISOString()
    } : {
      customerName: form.customer.name,
      customerContactNo: form.customer.contactNo,
      customerAddress: form.customer.address,
      customerEmail: form.customer.email || '',
      items: form.items,
      totalPrice,
      billDate: new Date().toISOString()
    };
    try {
      // Calculate bill (for backend validation)
      const { data: calculated } = await axios.post("http://localhost:8080/api/billing/calculate", bill);
      // Generate PDF
      if (action === 'pdf' || action === 'print') {
        const { data } = await axios.post("http://localhost:8080/api/billing/pdf", calculated, { responseType: 'arraybuffer' });
        const blob = new Blob([data], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        if (action === 'pdf') {
          const a = document.createElement('a');
          a.href = url;
          a.download = `bill-${Date.now()}.pdf`;
          a.click();
        } else {
          window.open(url, '_blank');
        }
        axios.get("http://localhost:8080/api/billing").then(res => setBills(res.data));
        setSnackbar({ open: true, message: 'Bill generated!', severity: 'success' });
      } else if (action === 'email') {
        await axios.post("http://localhost:8080/api/billing/email", calculated);
        axios.get("http://localhost:8080/api/billing").then(res => setBills(res.data));
        setSnackbar({ open: true, message: 'Bill sent to customer email!', severity: 'success' });
      }
      setOpenCreate(false);
    } catch (e) {
      console.error("Bill processing error:", e);
      setSnackbar({ open: true, message: 'Failed to process bill', severity: 'error' });
    } finally {
      setPdfLoading(false);
    }
  };

  // Filtered bills
  const filteredBills = bills.filter(b =>
    (!search || b.customerName?.toLowerCase().includes(search.toLowerCase())) &&
    (!dateFilter || (b.billDate && b.billDate.startsWith(dateFilter)))
  );

  // Table columns
  const columns = [
    { field: 'customerName', headerName: 'Customer', flex: 1, minWidth: 120 },
    { field: 'customerContactNo', headerName: 'Contact', flex: 1, minWidth: 120 },
    { field: 'customerAddress', headerName: 'Address', flex: 1.2, minWidth: 150 },
    { field: 'totalPrice', headerName: 'Total', flex: 0.7, minWidth: 90, renderCell: (params) => `Rs. ${params.value}` },
    {
      field: 'billDate', headerName: 'Bill Date', flex: 1, minWidth: 140,
      renderCell: (params) => params.value ? new Date(params.value).toLocaleString() : ''
    },
    {
      field: 'actions', headerName: 'Details', flex: 0.6, minWidth: 80, sortable: false, filterable: false,
      renderCell: (params) => (
        <Tooltip title="View Details">
          <IconButton onClick={() => { setSelectedBill(params.row); setOpenBillDialog(true); }}><Search sx={{ color: NEON_ACCENT }} /></IconButton>
        </Tooltip>
      )
    },
  ];

  return (
    <Box sx={{ bgcolor: NEON_BG, minHeight: '100vh', p: 4 }}>
      <Typography variant="h4" fontWeight="bold" color={NEON_ACCENT2} mb={3}>Billing</Typography>
      <Button variant="contained" startIcon={<AddCircleOutline />} sx={{ mb: 2, background: NEON_ACCENT2, color: '#181A20', fontWeight: 'bold', borderRadius: 2, boxShadow: `0 0 8px 2px ${NEON_ACCENT2}` }} onClick={handleOpenCreate}>
        Create Bill
      </Button>
      <Box display="flex" gap={2} mb={2}>
        <TextField
          label="Search by Customer"
          value={search}
          onChange={e => setSearch(e.target.value)}
          sx={{ bgcolor: NEON_CARD, borderRadius: 2, input: { color: '#fff' }, label: { color: NEON_ACCENT } }}
          InputLabelProps={{ style: { color: NEON_ACCENT } }}
        />
        <TextField
          label="Bill Date (YYYY-MM-DD)"
          value={dateFilter}
          onChange={e => setDateFilter(e.target.value)}
          sx={{ bgcolor: NEON_CARD, borderRadius: 2, input: { color: '#fff' }, label: { color: NEON_ACCENT4 } }}
          InputLabelProps={{ style: { color: NEON_ACCENT4 } }}
        />
        <Tooltip title="Refresh">
          <IconButton onClick={() => setBills([...bills])} sx={{ color: NEON_ACCENT }}><Refresh /></IconButton>
        </Tooltip>
      </Box>
      <Box sx={{ height: 600, bgcolor: NEON_CARD, borderRadius: 3, boxShadow: 4, p: 2 }}>
        <DataGrid
          rows={filteredBills.map((b, i) => ({ ...b, id: i }))}
          columns={columns}
          loading={loading}
          pageSize={10}
          rowsPerPageOptions={[10, 20, 50]}
          disableSelectionOnClick
          sx={{
            color: '#fff',
            border: 'none',
            '& .MuiDataGrid-columnHeaders': { bgcolor: NEON_BG, color: NEON_ACCENT2, fontWeight: 'bold', fontSize: 16 },
            '& .MuiDataGrid-row': { bgcolor: NEON_CARD },
            '& .MuiDataGrid-cell': { borderBottom: '1px solid #222' },
            '& .MuiDataGrid-footerContainer': { bgcolor: NEON_BG, color: NEON_ACCENT2 },
            '& .MuiDataGrid-row:hover': { bgcolor: '#222' },
          }}
        />
      </Box>
      {/* Create Bill Dialog */}
      <Dialog open={openCreate} onClose={handleCloseCreate} PaperProps={{ sx: { bgcolor: NEON_CARD, color: '#fff', borderRadius: 3, minWidth: 500 } }}>
        <DialogTitle>Create Bill</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
          <TextField
            select
            label="Customer"
            value={manualEntry ? 'manual' : (form.customer?.id || '')}
            onChange={e => {
              if (e.target.value === 'manual') { setManualEntry(true); setForm(f => ({ ...f, customer: null })); }
              else { setManualEntry(false); setForm(f => ({ ...f, customer: customers.find(c => c.id === e.target.value) })); }
            }}
            fullWidth
            required
            InputLabelProps={{ style: { color: NEON_ACCENT } }}
          >
            <MenuItem value="">Select Customer</MenuItem>
            {customers.map(c => (
              <MenuItem key={c.id} value={c.id}>{c.name} ({c.contactNo})</MenuItem>
            ))}
            <MenuItem value="manual">Manual Entry (Guest Customer)</MenuItem>
          </TextField>
          {manualEntry && (
            <Box display="flex" gap={2} flexWrap="wrap">
              <TextField label="Name" value={form.manual.name} onChange={e => setForm(f => ({ ...f, manual: { ...f.manual, name: e.target.value } }))} fullWidth required InputLabelProps={{ style: { color: NEON_ACCENT } }} />
              <TextField label="Contact No" value={form.manual.contactNo} onChange={e => setForm(f => ({ ...f, manual: { ...f.manual, contactNo: e.target.value } }))} fullWidth required InputLabelProps={{ style: { color: NEON_ACCENT } }} />
              <TextField label="Address" value={form.manual.address} onChange={e => setForm(f => ({ ...f, manual: { ...f.manual, address: e.target.value } }))} fullWidth InputLabelProps={{ style: { color: NEON_ACCENT } }} />
              <TextField label="Email" value={form.manual.email} onChange={e => setForm(f => ({ ...f, manual: { ...f.manual, email: e.target.value } }))} fullWidth InputLabelProps={{ style: { color: NEON_ACCENT } }} />
            </Box>
          )}
          <Box>
            <Typography fontWeight="bold" color={NEON_ACCENT3} mb={1}>Add Books</Typography>
            <Box display="flex" gap={2} alignItems="center">
              <TextField
                select
                label="Book Title"
                value={currentBook.title}
                onChange={e => handleBookTitleChange(e.target.value)}
                sx={{ minWidth: 180 }}
                InputLabelProps={{ style: { color: NEON_ACCENT } }}
              >
                {books.map(b => (
                  <MenuItem key={b.id} value={b.title}>{b.title}</MenuItem>
                ))}
              </TextField>
              <TextField
                label="Category"
                value={currentBook.category}
                onChange={e => handleBookCategoryChange(e.target.value)}
                sx={{ minWidth: 120 }}
                InputLabelProps={{ style: { color: NEON_ACCENT4 } }}
              />
              <TextField
                label="Quantity"
                type="number"
                value={currentBook.quantity}
                onChange={e => setCurrentBook(c => ({ ...c, quantity: Number(e.target.value) }))}
                sx={{ minWidth: 80 }}
                InputLabelProps={{ style: { color: NEON_ACCENT2 } }}
              />
              <TextField
                label="Price"
                type="number"
                value={currentBook.price}
                onChange={e => setCurrentBook(c => ({ ...c, price: Number(e.target.value) }))}
                sx={{ minWidth: 100 }}
                InputLabelProps={{ style: { color: NEON_ACCENT3 } }}
              />
              <Button onClick={handleAddBook} sx={{ color: NEON_ACCENT3 }}><AddCircleOutline /></Button>
            </Box>
            <Box mt={2}>
              {form.items.map((item, idx) => (
                <Box key={idx} display="flex" gap={2} alignItems="center" mb={1}>
                  <Chip label={item.title} sx={{ bgcolor: NEON_ACCENT, color: '#181A20', fontWeight: 'bold' }} />
                  <Chip label={item.category} sx={{ bgcolor: NEON_ACCENT4, color: '#fff' }} />
                  <Chip label={`Qty: ${item.quantity}`} sx={{ bgcolor: NEON_ACCENT2, color: '#fff' }} />
                  <Chip label={`Rs. ${item.price}`} sx={{ bgcolor: NEON_ACCENT3, color: '#fff' }} />
                  <IconButton onClick={() => handleRemoveBook(idx)}><Delete sx={{ color: NEON_ACCENT2 }} /></IconButton>
                </Box>
              ))}
            </Box>
          </Box>
          <Typography fontWeight="bold" color={NEON_ACCENT2} mt={2}>Total: Rs. {totalPrice}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseCreate} sx={{ color: NEON_ACCENT2 }}>Cancel</Button>
          <Button onClick={() => handleCreateBill('pdf')} sx={{ color: NEON_ACCENT }}>Download PDF</Button>
          <Button onClick={() => handleCreateBill('print')} sx={{ color: NEON_ACCENT3 }}>Print</Button>
          <Button onClick={() => handleCreateBill('email')} sx={{ color: NEON_ACCENT4 }}>Send Email</Button>
        </DialogActions>
        {pdfLoading && <Box display="flex" justifyContent="center" alignItems="center" p={2}><CircularProgress /></Box>}
      </Dialog>
      {/* Bill Details Dialog */}
      <Dialog open={openBillDialog} onClose={() => setOpenBillDialog(false)} PaperProps={{ sx: { bgcolor: NEON_CARD, color: '#fff', borderRadius: 3, minWidth: 400 } }}>
        <DialogTitle>Bill Details</DialogTitle>
        <DialogContent>
          {selectedBill ? (
            <Box display="flex" flexDirection="column" gap={1}>
              <Typography><b>Customer:</b> {selectedBill.customerName}</Typography>
              <Typography><b>Contact:</b> {selectedBill.customerContactNo}</Typography>
              <Typography><b>Address:</b> {selectedBill.customerAddress}</Typography>
              <Typography><b>Email:</b> {selectedBill.customerEmail}</Typography>
              <Typography><b>Total Price:</b> Rs. {selectedBill.totalPrice}</Typography>
              <Typography><b>Bill Date:</b> {selectedBill.billDate ? new Date(selectedBill.billDate).toLocaleString() : ''}</Typography>
              <Typography fontWeight="bold" color={NEON_ACCENT3} mt={2}>Books:</Typography>
              {selectedBill.items.map((item, idx) => (
                <Box key={idx} display="flex" gap={2} alignItems="center" mb={1}>
                  <Chip label={item.title} sx={{ bgcolor: NEON_ACCENT, color: '#181A20', fontWeight: 'bold' }} />
                  <Chip label={item.category} sx={{ bgcolor: NEON_ACCENT4, color: '#fff' }} />
                  <Chip label={`Qty: ${item.quantity}`} sx={{ bgcolor: NEON_ACCENT2, color: '#fff' }} />
                  <Chip label={`Rs. ${item.price}`} sx={{ bgcolor: NEON_ACCENT3, color: '#fff' }} />
                </Box>
              ))}
            </Box>
          ) : <CircularProgress />}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenBillDialog(false)} sx={{ color: NEON_ACCENT2 }}>Close</Button>
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

export default BillingPage; 