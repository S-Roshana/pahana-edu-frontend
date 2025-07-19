"use client"

import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import axios from "axios"
import {
  Container,
  Typography,
  Card,
  CardMedia,
  CardContent,
  TextField,
  Button,
  MenuItem,
  Grid,
  Snackbar,
  Alert,
  Box,
  Paper,
  Divider,
  Chip,
  Rating,
  Stepper,
  Step,
  StepLabel,
  Fade,
  Grow,
  IconButton,
  useTheme,
  alpha,
  CircularProgress,
  Backdrop,
} from "@mui/material"
import {
  ArrowBack,
  ShoppingCart,
  LocalShipping,
  Security,
  CheckCircle,
  Person,
  LocationOn,
  Phone,
  CreditCard,
  Receipt,
  Favorite,
  Share,
  Email,
} from "@mui/icons-material"

const OrderPage = () => {
  const { bookId } = useParams()
  const navigate = useNavigate()
  const theme = useTheme()
  const [book, setBook] = useState(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [activeStep, setActiveStep] = useState(0)
  const [form, setForm] = useState({
    customerName: "",
    customerAddress: "",
    customerContact: "",
    customerEmail: "",
    quantity: 1,
    paymentMethod: "Cash On Delivery",
  })
  const [success, setSuccess] = useState(false)
  const [errors, setErrors] = useState({})

  const steps = ["Book Details", "Customer Information", "Payment & Review"]

  useEffect(() => {
    setLoading(true)
    axios
      .get(`http://localhost:8080/api/books/${bookId}`)
      .then((res) => {
        setBook(res.data)
        setLoading(false)
      })
      .catch((err) => {
        console.error(err)
        setLoading(false)
      })
  }, [bookId])

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    // Clear error when user starts typing
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: "" })
    }
  }

  const validateForm = () => {
    const newErrors = {}
    if (!form.customerName.trim()) newErrors.customerName = "Name is required"
    if (!form.customerAddress.trim()) newErrors.customerAddress = "Address is required"
    if (!form.customerContact.trim()) newErrors.customerContact = "Contact is required"
    if (!form.customerEmail.trim()) newErrors.customerEmail = "Email is required"
    else if (!/^\S+@\S+\.\S+$/.test(form.customerEmail)) newErrors.customerEmail = "Invalid email address"
    if (form.quantity < 1) newErrors.quantity = "Quantity must be at least 1"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = () => {
    if (!validateForm()) return

    setSubmitting(true)
    const totalPrice = form.quantity * book.price
    const orderData = {
      bookId: book.id,
      bookTitle: book.title,
      customerName: form.customerName,
      customerAddress: form.customerAddress,
      customerContact: form.customerContact,
      customerEmail: form.customerEmail,
      quantity: form.quantity,
      totalPrice,
      orderDate: new Date().toISOString(),
    }

    axios
      .post("http://localhost:8080/api/orders", orderData)
      .then(() => {
        setSubmitting(false)
        setSuccess(true)
        setTimeout(() => navigate("/"), 4000)
      })
      .catch((err) => {
        console.error(err)
        setSubmitting(false)
      })
  }

  const totalPrice = book ? form.quantity * book.price : 0
  const deliveryFee = totalPrice > 2000 ? 0 : 250
  const finalTotal = totalPrice + deliveryFee

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "50vh",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <CircularProgress size={60} />
        <Typography variant="h6" color="text.secondary">
          Loading book details...
        </Typography>
      </Box>
    )
  }

  if (!book) {
    return (
      <Container sx={{ py: 8, textAlign: "center" }}>
        <Typography variant="h5" color="error" gutterBottom>
          Book not found
        </Typography>
        <Button variant="contained" onClick={() => navigate("/books")}>
          Browse Books
        </Button>
      </Container>
    )
  }

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      {/* Header */}
      <Box
        sx={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          color: "white",
          py: 4,
        }}
      >
        <Container>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
            <IconButton onClick={() => navigate(-1)} sx={{ color: "white", bgcolor: alpha("#fff", 0.2) }}>
              <ArrowBack />
            </IconButton>
            <Typography variant="h4" sx={{ fontWeight: "bold" }}>
              Complete Your Order
            </Typography>
          </Box>

          {/* Stepper */}
          <Stepper activeStep={activeStep} sx={{ "& .MuiStepIcon-root": { color: "white" } }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel sx={{ "& .MuiStepLabel-label": { color: "white" } }}>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </Container>
      </Box>

      <Container sx={{ py: 6 }}>
        <Grid container spacing={4}>
          {/* Book Details */}
          <Grid item xs={12} lg={5}>
            <Fade in timeout={800}>
              <Card
                elevation={0}
                sx={{
                  border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                  borderRadius: 3,
                  overflow: "hidden",
                  position: "sticky",
                  top: 20,
                }}
              >
                <Box sx={{ position: "relative" }}>
                  <CardMedia
                    component="img"
                    image={book.imageUrl || "/placeholder.svg?height=400&width=300"}
                    alt={book.title}
                    sx={{ height: 400, objectFit: "cover" }}
                  />
                  <Box
                    sx={{
                      position: "absolute",
                      top: 16,
                      right: 16,
                      display: "flex",
                      gap: 1,
                    }}
                  >
                    <IconButton
                      sx={{
                        bgcolor: alpha("#fff", 0.9),
                        "&:hover": { bgcolor: "white" },
                      }}
                    >
                      <Favorite color="error" />
                    </IconButton>
                    <IconButton
                      sx={{
                        bgcolor: alpha("#fff", 0.9),
                        "&:hover": { bgcolor: "white" },
                      }}
                    >
                      <Share color="primary" />
                    </IconButton>
                  </Box>
                  <Chip
                    label="Bestseller"
                    sx={{
                      position: "absolute",
                      top: 16,
                      left: 16,
                      bgcolor: theme.palette.error.main,
                      color: "white",
                      fontWeight: "bold",
                    }}
                  />
                </Box>

                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h5" sx={{ fontWeight: "bold", mb: 1 }}>
                    {book.title}
                  </Typography>
                  <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 2 }}>
                    by {book.author}
                  </Typography>

                  <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                    <Rating value={4.5} readOnly size="small" precision={0.5} />
                    <Typography variant="body2" color="text.secondary">
                      4.5 (89 reviews)
                    </Typography>
                  </Box>

                  <Typography variant="body2" sx={{ mb: 3, lineHeight: 1.6 }}>
                    {book.description}
                  </Typography>

                  <Box sx={{ display: "flex", gap: 1, mb: 3, flexWrap: "wrap" }}>
                    <Chip label="In Stock" size="small" color="success" />
                    <Chip label="Fast Delivery" size="small" color="primary" icon={<LocalShipping />} />
                    <Chip label="Secure Payment" size="small" color="secondary" icon={<Security />} />
                  </Box>

                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      p: 2,
                      bgcolor: alpha(theme.palette.success.main, 0.1),
                      borderRadius: 2,
                    }}
                  >
                    <Box>
                      <Typography variant="h4" sx={{ fontWeight: "bold", color: "success.main" }}>
                        Rs. {book.price}
                      </Typography>
                      <Typography variant="caption" sx={{ textDecoration: "line-through", color: "text.disabled" }}>
                        Rs. {Math.round(book.price * 1.2)}
                      </Typography>
                    </Box>
                    <Chip label="20% OFF" color="error" sx={{ fontWeight: "bold" }} />
                  </Box>
                </CardContent>
              </Card>
            </Fade>
          </Grid>

          {/* Order Form */}
          <Grid item xs={12} lg={7}>
            <Grow in timeout={1000}>
              <Paper
                elevation={0}
                sx={{
                  p: 4,
                  border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                  borderRadius: 3,
                }}
              >
                <Typography
                  variant="h5"
                  sx={{ fontWeight: "bold", mb: 3, display: "flex", alignItems: "center", gap: 1 }}
                >
                  <Person color="primary" />
                  Customer Information
                </Typography>

                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Full Name"
                      name="customerName"
                      value={form.customerName}
                      onChange={handleChange}
                      error={!!errors.customerName}
                      helperText={errors.customerName}
                      InputProps={{
                        startAdornment: <Person color="action" sx={{ mr: 1 }} />,
                      }}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: 2,
                        },
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Contact Number"
                      name="customerContact"
                      value={form.customerContact}
                      onChange={handleChange}
                      error={!!errors.customerContact}
                      helperText={errors.customerContact}
                      InputProps={{
                        startAdornment: <Phone color="action" sx={{ mr: 1 }} />,
                      }}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: 2,
                        },
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Email Address"
                      name="customerEmail"
                      value={form.customerEmail}
                      onChange={handleChange}
                      error={!!errors.customerEmail}
                      helperText={errors.customerEmail}
                      InputProps={{
                        startAdornment: <Email color="action" sx={{ mr: 1 }} />,
                      }}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: 2,
                        },
                      }}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Delivery Address"
                      name="customerAddress"
                      value={form.customerAddress}
                      onChange={handleChange}
                      error={!!errors.customerAddress}
                      helperText={errors.customerAddress}
                      multiline
                      rows={3}
                      InputProps={{
                        startAdornment: <LocationOn color="action" sx={{ mr: 1, alignSelf: "flex-start", mt: 1 }} />,
                      }}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: 2,
                        },
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Quantity"
                      name="quantity"
                      type="number"
                      value={form.quantity}
                      onChange={handleChange}
                      error={!!errors.quantity}
                      helperText={errors.quantity}
                      inputProps={{ min: 1, max: 10 }}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: 2,
                        },
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      select
                      label="Payment Method"
                      name="paymentMethod"
                      value={form.paymentMethod}
                      onChange={handleChange}
                      InputProps={{
                        startAdornment: <CreditCard color="action" sx={{ mr: 1 }} />,
                      }}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: 2,
                        },
                      }}
                    >
                      <MenuItem value="Cash On Delivery">Cash On Delivery</MenuItem>
                      <MenuItem value="Credit Card">Credit Card</MenuItem>
                      <MenuItem value="Bank Transfer">Bank Transfer</MenuItem>
                    </TextField>
                  </Grid>
                </Grid>

                <Divider sx={{ my: 4 }} />

                {/* Order Summary */}
                <Typography
                  variant="h5"
                  sx={{ fontWeight: "bold", mb: 3, display: "flex", alignItems: "center", gap: 1 }}
                >
                  <Receipt color="primary" />
                  Order Summary
                </Typography>

                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    bgcolor: alpha(theme.palette.primary.main, 0.05),
                    border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                    borderRadius: 2,
                    mb: 3,
                  }}
                >
                  <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
                    <Typography>Book Price × {form.quantity}</Typography>
                    <Typography sx={{ fontWeight: "bold" }}>Rs. {totalPrice}</Typography>
                  </Box>
                  <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
                    <Typography>Delivery Fee</Typography>
                    <Typography sx={{ fontWeight: "bold", color: deliveryFee === 0 ? "success.main" : "text.primary" }}>
                      {deliveryFee === 0 ? "FREE" : `Rs. ${deliveryFee}`}
                    </Typography>
                  </Box>
                  {deliveryFee === 0 && (
                    <Typography variant="caption" color="success.main" sx={{ display: "block", mb: 2 }}>
                      🎉 You saved Rs. 250 on delivery!
                    </Typography>
                  )}
                  <Divider sx={{ my: 2 }} />
                  <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                    <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                      Total Amount
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: "bold", color: "primary.main" }}>
                      Rs. {finalTotal}
                    </Typography>
                  </Box>
                </Paper>

                <Button
                  fullWidth
                  variant="contained"
                  size="large"
                  onClick={handleSubmit}
                  disabled={submitting}
                  startIcon={submitting ? <CircularProgress size={20} /> : <ShoppingCart />}
                  sx={{
                    py: 2,
                    fontSize: "1.1rem",
                    fontWeight: "bold",
                    borderRadius: 2,
                    background: "linear-gradient(45deg, #667eea 30%, #764ba2 90%)",
                    "&:hover": {
                      background: "linear-gradient(45deg, #5a6fd8 30%, #6a4190 90%)",
                      transform: "translateY(-2px)",
                      boxShadow: 6,
                    },
                    "&:disabled": {
                      background: "linear-gradient(45deg, #ccc 30%, #999 90%)",
                    },
                  }}
                >
                  {submitting ? "Processing Order..." : "Place Order"}
                </Button>

                <Box sx={{ mt: 3, display: "flex", alignItems: "center", justifyContent: "center", gap: 2 }}>
                  <Security color="success" />
                  <Typography variant="body2" color="text.secondary">
                    Your payment information is secure and encrypted
                  </Typography>
                </Box>
              </Paper>
            </Grow>
          </Grid>
        </Grid>
      </Container>

      {/* Success Snackbar */}
      <Snackbar open={success} autoHideDuration={4000} anchorOrigin={{ vertical: "top", horizontal: "center" }}>
        <Alert
          severity="success"
          sx={{
            width: "100%",
            fontSize: "1.1rem",
            "& .MuiAlert-icon": {
              fontSize: "1.5rem",
            },
          }}
          icon={<CheckCircle />}
        >
          🎉 Your order was placed successfully! Redirecting to home page...
        </Alert>
      </Snackbar>

      {/* Loading Backdrop */}
      <Backdrop open={submitting} sx={{ zIndex: 9999 }}>
        <Box sx={{ textAlign: "center", color: "white" }}>
          <CircularProgress size={60} sx={{ mb: 2 }} />
          <Typography variant="h6">Processing your order...</Typography>
          <Typography variant="body2">Please don't close this page</Typography>
        </Box>
      </Backdrop>
    </Box>
  )
}

export default OrderPage
