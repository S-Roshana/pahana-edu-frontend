"use client"

import { useEffect, useState } from "react";
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Paper,
  Typography,
  Button,
  Avatar,
  List,
  ListItem,
  Container,
  Grid,
  Card,
  CardContent,
  Chip,
  IconButton,
  useTheme,
  alpha,
  AppBar,
  Toolbar,
  Fade,
  CircularProgress,
  Alert,
  Modal,
  Snackbar,
} from "@mui/material";
import { ArrowBack, Edit, ShoppingBag, Receipt, Phone, Badge, LocationOn, CalendarToday, School } from "@mui/icons-material";

export default function Dashboard({ user }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cancelSuccess, setCancelSuccess] = useState(false);
  const [cancelOrderId, setCancelOrderId] = useState(null);
  const navigate = useNavigate();
  const theme = useTheme();

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const contactNo = user.customer?.contactNo || user.contactNo;

    if (contactNo) {
      axios
        .get(`http://localhost:8080/api/orders/byCustomer/${contactNo}`)
        .then((res) => {
          setOrders(res.data);
          setLoading(false);
        })
        .catch((err) => {
          console.error("Error fetching orders:", err);
          setError("Failed to load order history");
          setLoading(false);
        });
    } else {
      setError("Contact number not found");
      setLoading(false);
    }
  }, [user]);

  const handleCancelOrder = (orderId) => {
    setLoading(true);
    axios
      .delete(`http://localhost:8080/api/orders/${orderId}`)
      .then(() => {
        setOrders(orders.filter((order) => order.id !== orderId));
        setCancelOrderId(orderId);
        setCancelSuccess(true);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error cancelling order:", err);
        setError("Failed to cancel order");
        setLoading(false);
      });
  };

  const isCancelDisabled = (orderDate) => {
    const now = new Date();
    const orderTime = new Date(orderDate);
    const hoursElapsed = (now - orderTime) / (1000 * 60 * 60); // Convert to hours
    return hoursElapsed > 4.5; // Disable after 4.5 hours
  };

  if (!user) {
    return (
      <Container sx={{ py: 8, textAlign: "center" }}>
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Loading user data...
        </Typography>
      </Container>
    );
  }

  const userData = user.customer || user;
  const userName = userData.name || userData.username || "User";
  const userContact = userData.contactNo || "Not provided";
  const accountNumber = userData.accountNumber || "Not assigned";
  const userAddress = userData.address || "Not provided";
  const userProfilePic = userData.profilePicUrl;

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      {/* Top Navigation */}
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          bgcolor: alpha(theme.palette.primary.main, 0.95),
          backdropFilter: "blur(10px)",
        }}
      >
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={() => navigate("/books")} sx={{ mr: 2 }}>
            <ArrowBack />
          </IconButton>
          <School sx={{ mr: 2 }} />
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: "bold" }}>
            Dashboard
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ py: 4, ml: 1, mr: 1 }}>
        <Fade in timeout={800}>
          <Grid container spacing={3}>
            {/* Profile Section */}
            <Grid item xs={12} md={4}>
              <Card
                elevation={0}
                sx={{
                  border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                  borderRadius: 3,
                  overflow: "hidden",
                }}
              >
                <Box
                  sx={{
                    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    color: "white",
                    p: 3,
                    textAlign: "center",
                  }}
                >
                  <Avatar
                    src={userProfilePic}
                    sx={{
                      width: 100,
                      height: 100,
                      mx: "auto",
                      mb: 2,
                      border: "4px solid white",
                      fontSize: "2rem",
                    }}
                  >
                    {userName.charAt(0).toUpperCase()}
                  </Avatar>
                  <Typography variant="h5" sx={{ fontWeight: "bold", mb: 1 }}>
                    {userName}
                  </Typography>
                  <Chip
                    label="Premium Member"
                    size="small"
                    sx={{
                      bgcolor: alpha("#fff", 0.2),
                      color: "white",
                      fontWeight: "bold",
                    }}
                  />
                </Box>

                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <Badge sx={{ mr: 2, color: "text.secondary" }} />
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Account ID
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        {accountNumber}
                      </Typography>
                    </Box>
                  </Box>

                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <Phone sx={{ mr: 2, color: "text.secondary" }} />
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Contact
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        {userContact}
                      </Typography>
                    </Box>
                  </Box>

                  <Box sx={{ display: "flex", alignItems: "flex-start", mb: 3 }}>
                    <LocationOn sx={{ mr: 2, color: "text.secondary", mt: 0.5 }} />
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Address
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        {userAddress}
                      </Typography>
                    </Box>
                  </Box>

                  <Button
                    fullWidth
                    variant="contained"
                    startIcon={<Edit />}
                    onClick={() => navigate("/profile/edit")}
                    sx={{
                      borderRadius: 2,
                      py: 1.5,
                      background: "linear-gradient(45deg, #667eea 30%, #764ba2 90%)",
                      "&:hover": {
                        background: "linear-gradient(45deg, #5a6fd8 30%, #6a4190 90%)",
                      },
                    }}
                  >
                    Edit Profile
                  </Button>
                </CardContent>
              </Card>
            </Grid>

            {/* Order History Section */}
            <Grid item xs={12} md={4} sx={{ mr: -1 }}>
              <Card
                elevation={0}
                sx={{
                  border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                  borderRadius: 3,
                  width:430,
                  height: "fit-content",
                }}
              >
                <Box
                  sx={{
                    p: 3,
                    borderBottom: `1px solid ${theme.palette.divider}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Receipt color="primary" />
                    <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                      Order History
                    </Typography>
                  </Box>
                  <Chip label={`${orders.length} Orders`} color="primary" variant="outlined" />
                </Box>

                <CardContent sx={{ p: 0 }}>
                  {loading ? (
                    <Box sx={{ p: 4, textAlign: "center" }}>
                      <CircularProgress />
                      <Typography variant="body2" sx={{ mt: 2 }}>
                        Loading orders...
                      </Typography>
                    </Box>
                  ) : error ? (
                    <Box sx={{ p: 3 }}>
                      <Alert severity="error">{error}</Alert>
                    </Box>
                  ) : orders.length === 0 ? (
                    <Box sx={{ p: 4, textAlign: "center" }}>
                      <ShoppingBag sx={{ fontSize: 64, color: "text.disabled", mb: 2 }} />
                      <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
                        No Orders Yet
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                        Start shopping to see your order history here
                      </Typography>
                      <Button
                        variant="contained"
                        onClick={() => navigate("/books")}
                        sx={{
                          borderRadius: 2,
                          background: "linear-gradient(45deg, #667eea 30%, #764ba2 90%)",
                        }}
                      >
                        Browse Books
                      </Button>
                    </Box>
                  ) : (
                    <List>
                      {orders.map((order, index) => (
                        <ListItem
                          key={index}
                          alignItems="flex-start"
                          sx={{ borderBottom: "1px solid #e0e0e0", mb: 2 }}
                        >
                          <ListItemAvatar>
                            <Avatar sx={{ bgcolor: "primary.main" }}>
                              <LocalShippingIcon />
                            </Avatar>
                          </ListItemAvatar>
                          <ListItemText
                            primary={
                              <Box
                                display="flex"
                                justifyContent="space-between"
                                alignItems="center"
                                mb={1}
                              >
                                <Typography variant="h6" component="div">
                                  Order #{index + 1}
                                </Typography>
                                <Box>
                                  <CalendarToday sx={{ fontSize: 16, mr: 1 }} />
                                  <Typography variant="body2" color="text.secondary">
                                    {new Date(order.orderDate).toLocaleDateString()}
                                  </Typography>
                                </Box>
                              </Box>
                            }
                            secondary={
                              <>
                                {order.items.map((item, i) => (
                                  <Box key={i} display="flex" alignItems="center" mb={1} ml={1}>
                                    {item.imageUrl && (
                                      <img
                                        src={item.imageUrl}
                                        alt={item.bookTitle}
                                        style={{
                                          width: 50,
                                          height: 70,
                                          objectFit: "cover",
                                          marginRight: 12,
                                          borderRadius: 4,
                                        }}
                                      />
                                    )}
                                    <Box>
                                      <Typography variant="subtitle2" sx={{ fontWeight: "bold" }}>
                                        {item.bookTitle}
                                      </Typography>
                                      <Typography variant="body2" color="text.secondary">
                                        Quantity: {item.quantity} • Price: Rs. {item.price}
                                      </Typography>
                                    </Box>
                                  </Box>
                                ))}
                                <Divider sx={{ my: 1 }} />
                                <Typography
                                  variant="body2"
                                  color="text.secondary"
                                  align="right"
                                  fontWeight="bold"
                                >
                                  Total Price: Rs. {order.totalPrice}
                                </Typography>
                              </>
                            }
                          />
                          <Button
                            variant="contained"
                            color="error"
                            startIcon={<DeleteIcon />}
                            onClick={() => handleCancelOrder(order.id)}
                            disabled={isCancelDisabled(order.orderDate)}
                            sx={{
                              borderRadius: 20,
                              px: 2,
                              py: 0.5,
                              background: "linear-gradient(45deg, #ff4444 30%, #cc0000 90%)",
                              "&:hover": {
                                background: "linear-gradient(45deg, #ff6666 30%, #aa0000 90%)",
                              },
                              "&:disabled": {
                                background: alpha("#ff4444", 0.3),
                                color: alpha("#fff", 0.6),
                              },
                            }}
                          >
                            Cancel
                          </Button>
                        </ListItem>
                      ))}
                    </List>
                  )}
                </CardContent>
              </Card>

              {/* Quick Stats */}
              {orders.length > 0 && (
                <Grid container spacing={2} sx={{ mt: 2 }}>
                  <Grid item xs={6}>
                    <Paper
                      elevation={0}
                      sx={{
                        p: 2,
                        textAlign: "center",
                        border: `1px solid ${alpha(theme.palette.success.main, 0.2)}`,
                        borderRadius: 2,
                      }}
                    >
                      <Typography variant="h4" color="success.main" sx={{ fontWeight: "bold" }}>
                        {orders.length}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Total Orders
                      </Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={6}>
                    <Paper
                      elevation={0}
                      sx={{
                        p: 2,
                        textAlign: "center",
                        border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                        borderRadius: 2,
                      }}
                    >
                      <Typography variant="h4" color="primary.main" sx={{ fontWeight: "bold" }}>
                        Rs. {orders.reduce((sum, order) => sum + (order.totalPrice || 0), 0).toFixed(0)}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Total Spent
                      </Typography>
                    </Paper>
                  </Grid>
                </Grid>
              )}
            </Grid>

            {/* Decorative Cancellation Info Section */}
            <Grid item xs={12} md={4} sx={{ position: 'relative', top: '-840px', left: '882px' }}>
              <Card
                elevation={0}
                sx={{
                  border: `1px solid ${alpha(theme.palette.success.main, 0.2)}`,
                  borderRadius: 3,
                  width:570,
                  height: "fit-content",
                  background: "linear-gradient(135deg, #e2851aff 0%, #f53b0dff 100%)",
                  animation: "float 4s ease-in-out infinite",
                  "@keyframes float": {
                    "0%, 100%": { transform: "translateY(0)" },
                    "50%": { transform: "translateY(-10px)" },
                  },
                }}
              >
                <CardContent sx={{ p: 3, textAlign: "center" }}>
                  <Typography
                    variant="h6"
                    sx={{ color: theme.palette.success.main, fontWeight: "bold", mb: 2 }}
                  >
                    Cancellation Alert!
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    You can cancel your order and retrieve your credits within{" "}
                    <strong>4.5 hours</strong> of placing it. Act fast!
                  </Typography>
                  <CheckCircleIcon
                    sx={{ fontSize: 40, color: theme.palette.success.main, mb: 2 }}
                  />
            
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={4} sx={{ position: 'relative', top: '-840px', left: '882px' }}>
              <Card
                elevation={0}
                sx={{
                  border: `1px solid ${alpha('#00FFFF', 0.3)}`, // Neon blue border
                  borderRadius: 3,
                  width: 570,
                  height: "fit-content",
                  background: "linear-gradient(135deg, #4B0082 0%, #0000FF 100%)", // Purple to blue gradient
                  color: '#FFFFFF', // White text
                  animation: "pulse 4s ease-in-out infinite",
                  "@keyframes pulse": {
                    "0%, 100%": { transform: "scale(1)" },
                    "50%": { transform: "scale(1.05)" },
                  },
                }}
              >
                <CardContent sx={{ p: 3, textAlign: "center" }}>
                  <Typography
                    variant="h6"
                    sx={{ color: '#00FFFF', fontWeight: "bold", mb: 2 }} // Neon blue header
                  >
                    Shipping Info!
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 2 }}>
                    After few days placing the order (Approximately 3 or 4 days) shipping will be processed!
                  </Typography>
                  <LocalShippingIcon
                    sx={{ fontSize: 40, color: '#FF00FF', mb: 2 }} // Neon purple icon
                  />
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Fade>
      </Container>

      {/* Success Snackbar for Cancellation */}
      <Snackbar
        open={cancelSuccess}
        autoHideDuration={3000}
        onClose={() => setCancelSuccess(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        message={`Order ${cancelOrderId} cancelled successfully!`}
      />
    </Box>
  );
}