"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"
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
} from "@mui/material"
import { ArrowBack, Edit, ShoppingBag, Receipt, Phone,Badge, LocationOn, CalendarToday, School } from "@mui/icons-material"

export default function Dashboard({ user }) {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const navigate = useNavigate()
  const theme = useTheme()

  useEffect(() => {
    if (!user) {
      setLoading(false)
      return
    }

    // Use the correct contact number from user.customer
    const contactNo = user.customer?.contactNo || user.contactNo

    if (contactNo) {
      axios
        .get(`http://localhost:8080/api/orders/byCustomer/${contactNo}`)
        .then((res) => {
          setOrders(res.data)
          setLoading(false)
        })
        .catch((err) => {
          console.error("Error fetching orders:", err)
          setError("Failed to load order history")
          setLoading(false)
        })
    } else {
      setError("Contact number not found")
      setLoading(false)
    }
  }, [user])

  if (!user) {
    return (
      <Container sx={{ py: 8, textAlign: "center" }}>
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Loading user data...
        </Typography>
      </Container>
    )
  }

  // Extract user data from the correct structure
  const userData = user.customer || user
  const userName = userData.name || userData.username || "User"
  const userContact = userData.contactNo || "Not provided"
  const accountNumber = userData.accountNumber || "Not assigned"
  const userAddress = userData.address || "Not provided"
  const userProfilePic = userData.profilePicUrl

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

      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Fade in timeout={800}>
          <Grid container spacing={4}>
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
            <Grid item xs={12} md={8}>
              <Card
                elevation={0}
                sx={{
                  border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                  borderRadius: 3,
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
                    <List sx={{ p: 0 }}>
                      {orders.map((order, index) => (
                        <ListItem
                          key={order.id}
                          sx={{
                            borderBottom: index < orders.length - 1 ? `1px solid ${theme.palette.divider}` : "none",
                            py: 2,
                            px: 3,
                          }}
                        >
                          <Box sx={{ width: "100%" }}>
                            <Box
                              sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "flex-start",
                                mb: 1,
                              }}
                            >
                              <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                                {order.bookTitle}
                              </Typography>
                              <Chip
                                label={`Rs. ${order.totalPrice?.toFixed(2) || "0.00"}`}
                                color="success"
                                size="small"
                                sx={{ fontWeight: "bold" }}
                              />
                            </Box>
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 2,
                                flexWrap: "wrap",
                              }}
                            >
                              <Typography variant="body2" color="text.secondary">
                                Quantity: {order.quantity}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                •
                              </Typography>
                              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                                <CalendarToday sx={{ fontSize: 16 }} />
                                <Typography variant="body2" color="text.secondary">
                                  {new Date(order.orderDate).toLocaleDateString()}
                                </Typography>
                              </Box>
                            </Box>
                          </Box>
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
          </Grid>
        </Fade>
      </Container>
    </Box>
  )
}
