import React, { useState, useEffect } from "react";
import {
  Box, Typography, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, IconButton, Tooltip, Snackbar, Alert, Avatar, Chip
} from "@mui/material";
import { DataGrid } from '@mui/x-data-grid';
import { AddCircleOutline, Edit, Delete, Star, Close } from '@mui/icons-material';
import axios from "axios";

const NEON_BG = "#181A20";
const NEON_CARD = "#23263a";
const NEON_ACCENT = "#00f2fe";
const NEON_ACCENT2 = "#f7971e";
const NEON_ACCENT3 = "#43e97b";
const NEON_ACCENT4 = "#764ba2";

function ManageBooksPage() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [form, setForm] = useState({ title: '', author: '', description: '', imageUrl: '', price: '', quantity: '', category: '' });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("");

  // Fetch books
  const fetchBooks = () => {
    setLoading(true);
    axios.get("http://localhost:8080/api/books")
      .then(res => setBooks(res.data))
      .catch(() => setSnackbar({ open: true, message: 'Failed to fetch books', severity: 'error' }))
      .finally(() => setLoading(false));
  };
  useEffect(fetchBooks, []);

  // Handlers
  const handleOpenAdd = () => { setForm({ title: '', author: '', description: '', imageUrl: '', price: '', quantity: '', category: '' }); setOpenAdd(true); };
  const handleOpenEdit = (book) => { setSelectedBook(book); setForm({ ...book }); setOpenEdit(true); };
  const handleOpenDelete = (book) => { setSelectedBook(book); setOpenDelete(true); };
  const handleCloseDialogs = () => { setOpenAdd(false); setOpenEdit(false); setOpenDelete(false); setSelectedBook(null); };

  // CRUD
  const handleAdd = () => {
    axios.post("http://localhost:8080/api/books", { ...form, price: Number(form.price), quantity: Number(form.quantity) })
      .then(() => { setSnackbar({ open: true, message: 'Book added!', severity: 'success' }); fetchBooks(); setOpenAdd(false); })
      .catch(() => setSnackbar({ open: true, message: 'Failed to add book', severity: 'error' }));
  };
  const handleEdit = () => {
    axios.put(`http://localhost:8080/api/books/${selectedBook.id}`, { ...form, price: Number(form.price), quantity: Number(form.quantity) })
      .then(() => { setSnackbar({ open: true, message: 'Book updated!', severity: 'success' }); fetchBooks(); setOpenEdit(false); })
      .catch(() => setSnackbar({ open: true, message: 'Failed to update book', severity: 'error' }));
  };
  const handleDelete = () => {
    axios.delete(`http://localhost:8080/api/books/${selectedBook.id}`)
      .then(() => { setSnackbar({ open: true, message: 'Book deleted!', severity: 'success' }); fetchBooks(); setOpenDelete(false); })
      .catch(() => setSnackbar({ open: true, message: 'Failed to delete book', severity: 'error' }));
  };

  // Image upload handler
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setForm({ ...form, imageUrl: ev.target.result });
    reader.readAsDataURL(file);
  };

  // Filtered books
  const filteredBooks = books.filter(b =>
    (!search || b.title.toLowerCase().includes(search.toLowerCase()) || b.author.toLowerCase().includes(search.toLowerCase())) &&
    (!filterCategory || b.category?.toLowerCase() === filterCategory.toLowerCase())
  );

  // Table columns
  const columns = [
    { field: 'title', headerName: 'Title', flex: 1, minWidth: 120 },
    { field: 'author', headerName: 'Author', flex: 1, minWidth: 120 },
    { field: 'category', headerName: 'Category', flex: 1, minWidth: 100 },
    { field: 'price', headerName: 'Price', flex: 0.5, minWidth: 80, renderCell: (params) => `Rs. ${params.value}` },
    { field: 'quantity', headerName: 'Qty', flex: 0.5, minWidth: 60 },
    {
      field: 'rating', headerName: 'Avg Rating', flex: 0.7, minWidth: 100,
      renderCell: (params) => (
        <Box display="flex" alignItems="center" gap={0.5}>
          <Star sx={{ color: NEON_ACCENT2, fontSize: 18 }} />
          <Typography color={NEON_ACCENT2} fontWeight="bold">{params.row.rating || 0}</Typography>
        </Box>
      )
    },
    {
      field: 'userRatings', headerName: 'User Ratings', flex: 1, minWidth: 120,
      renderCell: (params) => (
        <Tooltip title={Object.entries(params.value || {}).map(([user, rating]) => `${user}: ${rating}`).join('\n') || 'No ratings'}>
          <Chip label={Object.keys(params.value || {}).length + ' users'} sx={{ bgcolor: NEON_ACCENT3, color: '#fff', fontWeight: 'bold' }} />
        </Tooltip>
      )
    },
    {
      field: 'actions', headerName: 'Actions', flex: 1, minWidth: 120, sortable: false, filterable: false,
      renderCell: (params) => (
        <Box>
          <Tooltip title="Edit Book"><IconButton onClick={() => handleOpenEdit(params.row)}><Edit sx={{ color: NEON_ACCENT }} /></IconButton></Tooltip>
          <Tooltip title="Delete Book"><IconButton onClick={() => handleOpenDelete(params.row)}><Delete sx={{ color: NEON_ACCENT2 }} /></IconButton></Tooltip>
        </Box>
      )
    },
  ];

  return (
    <Box sx={{ bgcolor: NEON_BG, minHeight: '100vh', p: 4 }}>
      <Typography variant="h4" fontWeight="bold" color={NEON_ACCENT} mb={3}>Manage Books</Typography>
      <Box display="flex" gap={2} mb={2}>
        <TextField
          label="Search by Title or Author"
          value={search}
          onChange={e => setSearch(e.target.value)}
          sx={{ bgcolor: NEON_CARD, borderRadius: 2, input: { color: '#fff' }, label: { color: NEON_ACCENT } }}
          InputLabelProps={{ style: { color: NEON_ACCENT } }}
        />
        <TextField
          label="Filter by Category"
          value={filterCategory}
          onChange={e => setFilterCategory(e.target.value)}
          sx={{ bgcolor: NEON_CARD, borderRadius: 2, input: { color: '#fff' }, label: { color: NEON_ACCENT4 } }}
          InputLabelProps={{ style: { color: NEON_ACCENT4 } }}
        />
        <Button variant="contained" startIcon={<AddCircleOutline />} sx={{ background: NEON_ACCENT, color: '#181A20', fontWeight: 'bold', borderRadius: 2, boxShadow: `0 0 8px 2px ${NEON_ACCENT}` }} onClick={handleOpenAdd}>
          Add Book
        </Button>
      </Box>
      <Box sx={{ height: 600, bgcolor: NEON_CARD, borderRadius: 3, boxShadow: 4, p: 2 }}>
        <DataGrid
          rows={filteredBooks.map(b => ({ ...b, id: b.id, rating: b.rating ?? (b.userRatings ? (Object.values(b.userRatings).reduce((a, b) => a + b, 0) / Object.values(b.userRatings).length).toFixed(1) : 0) }))}
          columns={columns}
          loading={loading}
          pageSize={10}
          rowsPerPageOptions={[10, 20, 50]}
          disableSelectionOnClick
          sx={{
            color: '#fff',
            border: 'none',
            '& .MuiDataGrid-columnHeaders': { bgcolor: NEON_BG, color: NEON_ACCENT, fontWeight: 'bold', fontSize: 16 },
            '& .MuiDataGrid-row': { bgcolor: NEON_CARD },
            '& .MuiDataGrid-cell': { borderBottom: '1px solid #222' },
            '& .MuiDataGrid-footerContainer': { bgcolor: NEON_BG, color: NEON_ACCENT },
            '& .MuiDataGrid-row:hover': { bgcolor: '#222' },
          }}
        />
      </Box>
      {/* Add Book Dialog */}
      <Dialog open={openAdd} onClose={handleCloseDialogs} PaperProps={{ sx: { bgcolor: NEON_CARD, color: '#fff', borderRadius: 3, minWidth: 400 } }}>
        <DialogTitle>Add Book</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
          <TextField label="Title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} fullWidth required autoFocus InputLabelProps={{ style: { color: NEON_ACCENT } }} />
          <TextField label="Author" value={form.author} onChange={e => setForm({ ...form, author: e.target.value })} fullWidth required InputLabelProps={{ style: { color: NEON_ACCENT } }} />
          <TextField label="Description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} fullWidth multiline minRows={2} InputLabelProps={{ style: { color: NEON_ACCENT } }} />
          <Box display="flex" alignItems="center" gap={2}>
            <Button variant="outlined" component="label" sx={{ color: NEON_ACCENT, borderColor: NEON_ACCENT }}>
              Upload Image
              <input type="file" accept="image/*" hidden onChange={handleImageUpload} />
            </Button>
            {form.imageUrl && <Avatar src={form.imageUrl} sx={{ width: 48, height: 48, border: `2px solid ${NEON_ACCENT}` }} />}
          </Box>
          <TextField label="Price" type="number" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} fullWidth required InputLabelProps={{ style: { color: NEON_ACCENT } }} />
          <TextField label="Quantity" type="number" value={form.quantity} onChange={e => setForm({ ...form, quantity: e.target.value })} fullWidth required InputLabelProps={{ style: { color: NEON_ACCENT } }} />
          <TextField label="Category" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} fullWidth InputLabelProps={{ style: { color: NEON_ACCENT } }} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialogs} sx={{ color: NEON_ACCENT2 }}>Cancel</Button>
          <Button onClick={handleAdd} sx={{ color: NEON_ACCENT }}>Add</Button>
        </DialogActions>
      </Dialog>
      {/* Edit Book Dialog */}
      <Dialog open={openEdit} onClose={handleCloseDialogs} PaperProps={{ sx: { bgcolor: NEON_CARD, color: '#fff', borderRadius: 3, minWidth: 400 } }}>
        <DialogTitle>Edit Book</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
          <TextField label="Title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} fullWidth required autoFocus InputLabelProps={{ style: { color: NEON_ACCENT } }} />
          <TextField label="Author" value={form.author} onChange={e => setForm({ ...form, author: e.target.value })} fullWidth required InputLabelProps={{ style: { color: NEON_ACCENT } }} />
          <TextField label="Description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} fullWidth multiline minRows={2} InputLabelProps={{ style: { color: NEON_ACCENT } }} />
          <Box display="flex" alignItems="center" gap={2}>
            <Button variant="outlined" component="label" sx={{ color: NEON_ACCENT, borderColor: NEON_ACCENT }}>
              Upload Image
              <input type="file" accept="image/*" hidden onChange={handleImageUpload} />
            </Button>
            {form.imageUrl && <Avatar src={form.imageUrl} sx={{ width: 48, height: 48, border: `2px solid ${NEON_ACCENT}` }} />}
          </Box>
          <TextField label="Price" type="number" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} fullWidth required InputLabelProps={{ style: { color: NEON_ACCENT } }} />
          <TextField label="Quantity" type="number" value={form.quantity} onChange={e => setForm({ ...form, quantity: e.target.value })} fullWidth required InputLabelProps={{ style: { color: NEON_ACCENT } }} />
          <TextField label="Category" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} fullWidth InputLabelProps={{ style: { color: NEON_ACCENT } }} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialogs} sx={{ color: NEON_ACCENT2 }}>Cancel</Button>
          <Button onClick={handleEdit} sx={{ color: NEON_ACCENT }}>Save</Button>
        </DialogActions>
      </Dialog>
      {/* Delete Book Dialog */}
      <Dialog open={openDelete} onClose={handleCloseDialogs} PaperProps={{ sx: { bgcolor: NEON_CARD, color: '#fff', borderRadius: 3, minWidth: 350 } }}>
        <DialogTitle>Delete Book</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete <b>{selectedBook?.title}</b>?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialogs} sx={{ color: NEON_ACCENT3 }}>Cancel</Button>
          <Button onClick={handleDelete} sx={{ color: NEON_ACCENT2 }}>Delete</Button>
        </DialogActions>
      </Dialog>
      <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={() => setSnackbar({ ...snackbar, open: false })} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
        <Alert severity={snackbar.severity} sx={{ width: '100%' }}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
}

export default ManageBooksPage; 