import React, { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Box,
  Avatar,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  useTheme,
  CircularProgress,
  Button,
  Snackbar,
  Alert,
  Grid,
  Card,
  CardContent,
  Tooltip,
  Skeleton,
  CssBaseline,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Logout,
  Book,
  People,
  Receipt,
  MoreHoriz,
  AdminPanelSettings,
  AccountCircle,
  HelpOutline,
  ExitToApp,
  ListAlt,
  Home as HomeIcon,
  AddCircleOutline,
  BarChart,
  TrendingUp,
} from "@mui/icons-material";
import axios from "axios";
import { Chart, registerables } from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import { useNavigate } from "react-router-dom";
Chart.register(...registerables);

const NEON_GRADIENT = "linear-gradient(135deg, #00f2fe 0%, #4facfe 50%, #f7971e 100%)";
const NEON_BG = "#181A20";
const NEON_CARD = "#23263a";
const NEON_ACCENT = "#00f2fe";
const NEON_ACCENT2 = "#f7971e";
const NEON_ACCENT3 = "#43e97b";
const NEON_ACCENT4 = "#764ba2";

const sections = [
  { key: "home", label: "Home", icon: <HomeIcon /> },
  { key: "books", label: "Manage Books", icon: <Book /> },
  { key: "customers", label: "Customer Accounts", icon: <People /> },
  { key: "billing", label: "Billing", icon: <Receipt /> },
  { key: "orders", label: "Orders", icon: <ListAlt /> },
  { key: "help", label: "Help", icon: <HelpOutline /> },
  { key: "exit", label: "Exit", icon: <ExitToApp /> },
];

function AdminDashboard({ admin, logoutAdmin }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedSection, setSelectedSection] = useState("home");
  const theme = useTheme();
  const [books, setBooks] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const navigate = useNavigate();

  // Fetch all data on mount for dashboard stats
  useEffect(() => {
    setLoading(true);
    Promise.all([
      axios.get("http://localhost:8080/api/books"),
      axios.get("http://localhost:8080/api/customers"),
      axios.get("http://localhost:8080/api/orders"),
    ])
      .then(([booksRes, customersRes, ordersRes]) => {
        setBooks(booksRes.data);
        setCustomers(customersRes.data);
        setOrders(ordersRes.data);
      })
      .catch(() => setError("Failed to fetch dashboard data."))
      .finally(() => setLoading(false));
  }, []);

  // Section-specific fetches
  useEffect(() => {
    if (selectedSection === "books") {
      setLoading(true);
      axios.get("http://localhost:8080/api/books")
        .then(res => setBooks(res.data))
        .catch(() => setError("Failed to fetch books."))
        .finally(() => setLoading(false));
    } else if (selectedSection === "customers") {
      setLoading(true);
      axios.get("http://localhost:8080/api/customers")
        .then(res => setCustomers(res.data))
        .catch(() => setError("Failed to fetch customers."))
        .finally(() => setLoading(false));
    } else if (selectedSection === "orders") {
      setLoading(true);
      axios.get("http://localhost:8080/api/orders")
        .then(res => setOrders(res.data))
        .catch(() => setError("Failed to fetch orders."))
        .finally(() => setLoading(false));
    }
  }, [selectedSection]);

  const handleProfileMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleProfileMenuClose = () => setAnchorEl(null);
  const handleDrawerToggle = () => setDrawerOpen(!drawerOpen);
  // Sidebar navigation handler
  const handleSectionChange = (section) => {
    if (section === "books") {
      navigate("/admin/books");
      return;
    }
    if (section === "customers") {
      navigate("/admin/customers");
      return;
    }
    if (section === "orders") {
      navigate("/admin/orders");
      return;
    }
    if (section === "billing") {
      navigate("/admin/billing");
      return;
    }
    setSelectedSection(section);
    setDrawerOpen(false);
    setError("");
  };

  // Exit system (logout)
  const handleExit = () => {
    logoutAdmin();
    setSnackbar({ open: true, message: "Logged out successfully.", severity: "info" });
  };

  // --- Dashboard Statistics ---
  const totalBooks = books.length;
  const totalCustomers = customers.length;
  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((sum, o) => sum + (o.totalPrice || 0), 0);

  // Orders per month (for chart)
  const ordersByMonth = Array(12).fill(0);
  const revenueByMonth = Array(12).fill(0);
  orders.forEach(order => {
    if (order.orderDate) {
      const month = new Date(order.orderDate).getMonth();
      ordersByMonth[month]++;
      revenueByMonth[month] += order.totalPrice || 0;
    }
  });

  // Customers per month (for chart)
  // If Customer model has registration date, use it. Otherwise, randomize for demo.
  const customersByMonth = Array(12).fill(0);
  customers.forEach(cust => {
    if (cust.createdAt) {
      const month = new Date(cust.createdAt).getMonth();
      customersByMonth[month]++;
    } else {
      // For demo: randomly assign to a month
      const month = Math.floor(Math.random() * 12);
      customersByMonth[month]++;
    }
  });

  // Top 5 selling books
  const bookSales = {};
  orders.forEach(order => {
    if (order.bookTitle) {
      bookSales[order.bookTitle] = (bookSales[order.bookTitle] || 0) + (order.quantity || 0);
    }
  });
  const topBooks = Object.entries(bookSales)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  // --- Section Renderers ---
  const renderHome = () => (
    <Box p={3}>
      {/* Welcome Banner */}
      <Card sx={{ mb: 4, background: NEON_GRADIENT, color: 'white', borderRadius: 3, boxShadow: 8, position: 'relative', overflow: 'hidden' }}>
        <CardContent sx={{ position: 'relative', zIndex: 2 }}>
          <Box display="flex" alignItems="center" gap={3}>
            <Avatar sx={{ width: 72, height: 72, boxShadow: `0 0 16px 4px ${NEON_ACCENT}`, border: `3px solid ${NEON_ACCENT2}`, background: NEON_BG, fontSize: 40 }}>
              <AdminPanelSettings sx={{ color: NEON_ACCENT, fontSize: 48 }} />
            </Avatar>
            <Box>
              <Typography variant="h4" fontWeight="bold">Welcome, {admin?.admin?.username || "Admin"}!</Typography>
              <Typography variant="h6" sx={{ mt: 1 }}>Today is {new Date().toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</Typography>
              <Typography variant="body1" sx={{ mt: 2, fontStyle: 'italic', color: NEON_ACCENT2 }}>
                "Empowering education, one book at a time."
              </Typography>
            </Box>
          </Box>
        </CardContent>
        <Box sx={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 80% 20%, #fff2, transparent 70%)', zIndex: 1 }} />
      </Card>
      {/* Statistics Cards */}
      <Box display="flex" justifyContent="center" mb={4}>
        <Grid container spacing={3} sx={{ maxWidth: 900 }} justifyContent="center">
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ 
                width: 200, height: 140, // Fixed size 
                display: 'flex', flexDirection: 'column', justifyContent: 'center', 
                alignItems: 'center', 
                background: NEON_CARD, 
                borderLeft: `6px solid ${NEON_ACCENT}`, 
                borderRadius: 3, 
                boxShadow: 4, 
                color: 'white', 
                position: 'relative', 
                overflow: 'hidden' 
              }}>
              <CardContent sx={{ textAlign: "center" }}>
                <Typography color={NEON_ACCENT} gutterBottom>Books</Typography>
                <Typography variant="h4" fontWeight="bold">{loading ? <Skeleton width={60} /> : totalBooks}</Typography>
                <BarChart sx={{ fontSize: 32, mt: 1, color: NEON_ACCENT }} />
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ width: 200, height: 140, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', background: NEON_CARD, borderLeft: `6px solid ${NEON_ACCENT4}`, borderRadius: 3, boxShadow: 4, color: 'white', position: 'relative', overflow: 'hidden' }}>
              <CardContent sx={{ textAlign: "center" }}>
                <Typography color={NEON_ACCENT4} gutterBottom>Customers</Typography>
                <Typography variant="h4" fontWeight="bold">{loading ? <Skeleton width={60} /> : totalCustomers}</Typography>
                <People sx={{ fontSize: 32, mt: 1, color: NEON_ACCENT4 }} />
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ width: 200, height: 140, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', background: NEON_CARD, borderLeft: `6px solid ${NEON_ACCENT3}`, borderRadius: 3, boxShadow: 4, color: 'white', position: 'relative', overflow: 'hidden' }}>
              <CardContent sx={{ textAlign: "center" }}>
                <Typography color={NEON_ACCENT3} gutterBottom>Orders</Typography>
                <Typography variant="h4" fontWeight="bold">{loading ? <Skeleton width={60} /> : totalOrders}</Typography>
                <ListAlt sx={{ fontSize: 32, mt: 1, color: NEON_ACCENT3 }} />
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ width: 200, height: 140, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', background: NEON_CARD, borderLeft: `6px solid ${NEON_ACCENT2}`, borderRadius: 3, boxShadow: 4, color: 'white', position: 'relative', overflow: 'hidden' }}>
              <CardContent sx={{ textAlign: "center" }}>
                <Typography color={NEON_ACCENT2} gutterBottom>Total Revenue</Typography>
                <Typography variant="h4" fontWeight="bold">{loading ? <Skeleton width={80} /> : `Rs. ${totalRevenue.toLocaleString()}`}</Typography>
                <TrendingUp sx={{ fontSize: 32, mt: 1, color: NEON_ACCENT2 }} />
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
      {/* Charts */}
      <Grid
  container
  spacing={3}
  wrap="nowrap"
  sx={{ overflowX: "auto" }}
>
  <Grid item xs={12} md={3} sx={{ minWidth: 320 }}>
    <Card sx={{ background: NEON_CARD, borderRadius: 3, boxShadow: 4, color: 'white', height: '100%' }}>
      <CardContent>
        <Typography variant="h6" mb={2} color={NEON_ACCENT}>Orders Per Month</Typography>
        <Line
          data={{
            labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
            datasets: [
              {
                label: "Orders",
                data: ordersByMonth,
                fill: true,
                backgroundColor: "rgba(0,242,254,0.15)",
                borderColor: NEON_ACCENT,
                tension: 0.4,
              },
            ],
          }}
          options={{
            responsive: true,
            plugins: { legend: { display: false } },
            scales: { y: { beginAtZero: true, grid: { color: '#333' } }, x: { grid: { color: '#333' } } },
          }}
          height={220}
        />
      </CardContent>
    </Card>
  </Grid>
  <Grid item xs={12} md={3} sx={{ minWidth: 320 }}>
    <Card sx={{ background: NEON_CARD, borderRadius: 3, boxShadow: 4, color: 'white', height: '100%' }}>
      <CardContent>
        <Typography variant="h6" mb={2} color={NEON_ACCENT2}>Top 5 Selling Books</Typography>
        <Bar
          data={{
            labels: topBooks.map(([title]) => title),
            datasets: [
              {
                label: "Units Sold",
                data: topBooks.map(([, qty]) => qty),
                backgroundColor: [NEON_ACCENT, NEON_ACCENT2, NEON_ACCENT3, NEON_ACCENT4, "#ff6a00"],
              },
            ],
          }}
          options={{
            responsive: true,
            plugins: { legend: { display: false } },
            scales: { y: { beginAtZero: true, grid: { color: '#333' } }, x: { grid: { color: '#333' } } },
          }}
          height={220}
        />
      </CardContent>
    </Card>
  </Grid>
  <Grid item xs={12} md={3} sx={{ minWidth: 320 }}>
    <Card sx={{ background: NEON_CARD, borderRadius: 3, boxShadow: 4, color: 'white', height: '100%' }}>
      <CardContent>
        <Typography variant="h6" mb={2} color={NEON_ACCENT3}>Customers Per Month</Typography>
        <Line
          data={{
            labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
            datasets: [
              {
                label: "Customers",
                data: customersByMonth,
                fill: true,
                backgroundColor: "rgba(67,233,123,0.15)",
                borderColor: NEON_ACCENT3,
                tension: 0.4,
              },
            ],
          }}
          options={{
            responsive: true,
            plugins: { legend: { display: false } },
            scales: { y: { beginAtZero: true, grid: { color: '#333' } }, x: { grid: { color: '#333' } } },
          }}
          height={220}
        />
      </CardContent>
    </Card>
  </Grid>
  <Grid item xs={12} md={3} sx={{ minWidth: 320 }}>
    <Card sx={{ background: NEON_CARD, borderRadius: 3, boxShadow: 4, color: 'white', height: '100%' }}>
      <CardContent>
        <Typography variant="h6" mb={2} color={NEON_ACCENT4}>Revenue Per Month</Typography>
        <Bar
          data={{
            labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
            datasets: [
              {
                label: "Revenue",
                data: revenueByMonth,
                backgroundColor: NEON_ACCENT4,
              },
            ],
          }}
          options={{
            responsive: true,
            plugins: { legend: { display: false } },
            scales: { y: { beginAtZero: true, grid: { color: '#333' } }, x: { grid: { color: '#333' } } },
          }}
          height={220}
        />
      </CardContent>
    </Card>
  </Grid>
</Grid>

      {/* Quick Actions */}
      <Box mt={5} display="flex" gap={2} flexWrap="wrap">
        <Tooltip title="Add New Book">
          <Button variant="contained" sx={{ background: NEON_GRADIENT, color: '#fff', borderRadius: 2, fontWeight: 'bold', boxShadow: `0 0 8px 2px ${NEON_ACCENT}` }} startIcon={<AddCircleOutline sx={{ color: NEON_ACCENT2 }} />}>
            Add Book
          </Button>
        </Tooltip>
        <Tooltip title="View All Orders">
          <Button variant="outlined" sx={{ borderColor: NEON_ACCENT, color: NEON_ACCENT, borderRadius: 2, fontWeight: 'bold', boxShadow: `0 0 8px 2px ${NEON_ACCENT}` }} startIcon={<ListAlt sx={{ color: NEON_ACCENT }} />}>
            View Orders
          </Button>
        </Tooltip>
      </Box>
    </Box>
  );

  // --- Other Section Renderers (reuse previous code for books, customers, orders, billing, help) ---
  const renderBooks = () => (
    <Box p={3}>
      <Typography variant="h5" mb={2} color={NEON_ACCENT}>Book List</Typography>
      {loading ? <CircularProgress /> : (
        <Box>
          {books.length === 0 ? <Typography>No books found.</Typography> : (
            <Box component="ul" sx={{ pl: 0, listStyle: "none" }}>
              {books.map(book => (
                <li key={book.id}>
                  <Typography color="white"><b>{book.title}</b> by {book.author} | Qty: {book.quantity} | Price: {book.price}</Typography>
                </li>
              ))}
            </Box>
          )}
        </Box>
      )}
    </Box>
  );

  const renderCustomers = () => (
    <Box p={3}>
      <Typography variant="h5" mb={2} color={NEON_ACCENT4}>Customer Accounts</Typography>
      {loading ? <CircularProgress /> : (
        <Box>
          {customers.length === 0 ? <Typography>No customers found.</Typography> : (
            <Box component="ul" sx={{ pl: 0, listStyle: "none" }}>
              {customers.map(cust => (
                <li key={cust.id}>
                  <Typography color="white"><b>{cust.name}</b> | Account ID: {cust.accountNumber} | Contact: {cust.contactNo} | Address: {cust.address}</Typography>
                </li>
              ))}
            </Box>
          )}
        </Box>
      )}
    </Box>
  );

  const renderOrders = () => (
    <Box p={3}>
      <Typography variant="h5" mb={2} color={NEON_ACCENT3}>Customer Orders</Typography>
      {loading ? <CircularProgress /> : (
        <Box>
          {orders.length === 0 ? <Typography>No orders found.</Typography> : (
            <Box component="ul" sx={{ pl: 0, listStyle: "none" }}>
              {orders.map(order => (
                <li key={order.id}>
                  <Typography color="white">Order #{order.id} | Book: {order.bookTitle} | Customer: {order.customerName} | Qty: {order.quantity} | Total: {order.totalPrice}</Typography>
                </li>
              ))}
            </Box>
          )}
        </Box>
      )}
    </Box>
  );

  const renderBilling = () => (
    <Box p={3}>
      <Typography variant="h5" mb={2} color={NEON_ACCENT2}>Billing</Typography>
      <Typography color="white">Feature coming soon: Calculate and print bill based on units consumed.</Typography>
    </Box>
  );

  const renderHelp = () => (
    <Box p={3}>
      <Typography variant="h5" mb={2} color={NEON_ACCENT}>Help & Usage Guidelines</Typography>
      <Typography color="white">Welcome to the Admin Dashboard! Use the sidebar to manage books, view customer accounts, handle billing, and review orders. For more help, contact support.</Typography>
    </Box>
  );

  const renderSection = () => {
    switch (selectedSection) {
      case "home": return renderHome();
      case "books": return renderBooks();
      case "customers": return renderCustomers();
      case "billing": return renderBilling();
      case "orders": return renderOrders();
      case "help": return renderHelp();
      case "exit": handleExit(); return null;
      default: return null;
    }
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: NEON_BG }}>
      <CssBaseline />
      <AppBar position="static" sx={{ background: NEON_GRADIENT, boxShadow: 8 }}>
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={handleDrawerToggle} sx={{ mr: 2 }}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1, color: '#fff', fontWeight: 'bold', letterSpacing: 1 }}>
            <span style={{ textShadow: `0 0 8px ${NEON_ACCENT}` }}>Pahana Admin</span>
          </Typography>
          <IconButton onClick={handleProfileMenuOpen} color="inherit">
            <Avatar sx={{ bgcolor: NEON_ACCENT4, boxShadow: `0 0 8px 2px ${NEON_ACCENT4}` }}>
              <AdminPanelSettings sx={{ color: '#fff', fontSize: 32 }} />
            </Avatar>
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleProfileMenuClose}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            transformOrigin={{ vertical: "top", horizontal: "right" }}
          >
            <MenuItem disabled>
              <AccountCircle sx={{ mr: 1 }} />
              {admin?.admin?.username || "Admin"}
            </MenuItem>
            <Divider />
            <MenuItem onClick={() => { handleProfileMenuClose(); logoutAdmin(); }}>
              <Logout sx={{ mr: 1, color: NEON_ACCENT2 }} /> Logout
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
      <Drawer anchor="left" open={drawerOpen} onClose={handleDrawerToggle} sx={{ '& .MuiDrawer-paper': { background: NEON_GRADIENT, color: '#fff', boxShadow: 8 } }}>
        <Box sx={{ width: 260, pt: 2 }} role="presentation" onClick={handleDrawerToggle}>
          <Box sx={{ textAlign: 'center', mb: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', letterSpacing: 1, color: '#fff', textShadow: `0 0 8px ${NEON_ACCENT}` }}>Pahana Admin</Typography>
          </Box>
          <Divider sx={{ bgcolor: 'rgba(255,255,255,0.2)', mb: 1 }} />
          <List>
            {sections.map(sec => (
              <ListItem button key={sec.key} selected={selectedSection === sec.key} onClick={() => handleSectionChange(sec.key)}
                sx={{
                  borderRadius: 2,
                  mb: 1,
                  background: selectedSection === sec.key ? 'rgba(0,242,254,0.15)' : 'transparent',
                  boxShadow: selectedSection === sec.key ? `0 0 12px 2px ${NEON_ACCENT}` : 'none',
                  color: selectedSection === sec.key ? NEON_ACCENT : '#fff',
                  '&:hover': { background: 'rgba(0,242,254,0.10)' },
                }}
              >
                <ListItemIcon sx={{ color: selectedSection === sec.key ? NEON_ACCENT2 : '#fff' }}>{sec.icon}</ListItemIcon>
                <ListItemText primary={sec.label} />
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
      <Box sx={{ maxWidth: 1400, mx: "auto", mt: 4, bgcolor: "transparent", borderRadius: 3, minHeight: 400 }}>
        {error && <Alert severity="error">{error}</Alert>}
        {renderSection()}
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

export default AdminDashboard; 