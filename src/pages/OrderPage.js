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
  Radio, RadioGroup, FormControlLabel, FormControl,
  useTheme,
  alpha,
  CircularProgress,
  Backdrop,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton as MuiIconButton,
  Input,
  Tooltip,
  Slide,
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
  Delete,
  Inventory,
  Schedule,
} from "@mui/icons-material"

// Helper functions (copied from BookListPage.js)
const getStockStatus = (book) => {
  const quantity = book.quantity || 0
  if (quantity > 12) return { label: "In Stock", color: "success", available: true }
  if (quantity > 5) return { label: "Limited Stock", color: "warning", available: true }
  if (quantity > 0) return { label: "Few Left", color: "error", available: true }
  return { label: "Out of Stock", color: "default", available: false }
}
const getDeliveryTime = (book) => {
  const deliveryDays = book.deliveryDays || Math.floor(Math.random() * 5) + 1
  if (deliveryDays === 1) return "Next Day"
  if (deliveryDays <= 3) return `${deliveryDays} Days`
  return `${deliveryDays}-7 Days`
}
const getDiscount = (book) => {
  const originalPrice = book.originalPrice || Math.round(book.price * 1.2)
  const discountPercent = Math.round(((originalPrice - book.price) / originalPrice) * 100)
  return { originalPrice, discountPercent }
}

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
  const [cart, setCart] = useState(() => {
    const storedCart = localStorage.getItem("cart")
    if (storedCart) {
      try {
        return JSON.parse(storedCart)
      } catch (e) {
        return []
      }
    }
    return []
  })
  const [cartOpen, setCartOpen] = useState(false)
  const [checkoutOpen, setCheckoutOpen] = useState(false)
  const [customer, setCustomer] = useState({
    name: "",
    address: "",
    contact: "",
    email: "",
    paymentMethod: "Cash On Delivery",
    cardHolderName: "",
    cardNumber: "",
    expirationDate: "",
    cvc: "",
  })
  const [cartErrors, setCartErrors] = useState({})
  const [orderSuccess, setOrderSuccess] = useState(false)
  const [orderSubmitting, setOrderSubmitting] = useState(false)

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart))
  }, [cart])

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

  // Add current book to cart
  const handleAddToCart = () => {
    if (!book) return
    const existing = cart.find((item) => item.bookId === book.id)
    if (existing) {
      setCart(
        cart.map((item) =>
          item.bookId === book.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      )
    } else {
      setCart([
        ...cart,
        {
          bookId: book.id,
          bookTitle: book.title,
          quantity: 1,
          price: book.price,
          imageUrl: book.imageUrl, // Add imageUrl to cart item
        },
      ])
    }
  }

  // Update quantity in cart
  const handleCartQuantityChange = (bookId, quantity) => {
    setCart(
      cart.map((item) =>
        item.bookId === bookId ? { ...item, quantity: Math.max(1, quantity) } : item
      )
    )
  }

  // Remove book from cart
  const handleRemoveFromCart = (bookId) => {
    setCart(cart.filter((item) => item.bookId !== bookId))
  }

  // Open checkout modal
  const handleCheckout = () => {
    setCheckoutOpen(true)
    setCartOpen(false)
  }

  // Handle customer input
  const handleCustomerChange = (e) => {
    setCustomer({ ...customer, [e.target.name]: e.target.value })
    if (cartErrors[e.target.name]) {
      setCartErrors({ ...cartErrors, [e.target.name]: "" })
    }
  }

  // Validate checkout form
const validateCheckout = () => {
  const errs = {};
  if (!customer.name.trim()) errs.name = "Name is required";
  if (!customer.address.trim()) errs.address = "Address is required";
  if (!customer.contact.trim()) errs.contact = "Contact is required";
  if (!customer.email.trim()) errs.email = "Email is required";
  else if (!/^\S+@\S+\.\S+$/.test(customer.email)) errs.email = "Invalid email address";
  if (["Mastercard", "Visa"].includes(customer.paymentMethod)) {
    if (!customer.cardHolderName.trim()) errs.cardHolderName = "Cardholder name is required";
    if (!customer.cardNumber.trim()) errs.cardNumber = "Card number is required";
    else if (!/^\d{16}$/.test(customer.cardNumber.replace(/\s/g, ""))) errs.cardNumber = "Card number must be 16 digits";
    if (!customer.expirationDate.trim()) errs.expirationDate = "Expiration date is required";
    else if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(customer.expirationDate)) errs.expirationDate = "Invalid expiration date (MM/YY)";
    if (!customer.cvc.trim()) errs.cvc = "CVC is required";
    else if (!/^\d{3,4}$/.test(customer.cvc)) errs.cvc = "CVC must be 3 or 4 digits";
  }
  setCartErrors(errs);
  return Object.keys(errs).length === 0;
};
  // Submit order
const handleOrderSubmit = () => {
  if (!validateCheckout() || cart.length === 0) return;
  setOrderSubmitting(true);
  const orderData = {
    items: cart.map((item) => ({
      bookId: item.bookId,
      bookTitle: item.bookTitle,
      quantity: item.quantity,
      price: item.price,
    })),
    customerName: customer.name,
    customerAddress: customer.address,
    customerContact: customer.contact,
    customerEmail: customer.email,
    paymentMethod: customer.paymentMethod,
    cardDetails: ["Mastercard", "Visa"].includes(customer.paymentMethod)
      ? {
          cardHolderName: customer.cardHolderName,
          cardNumber: customer.cardNumber,
          expirationDate: customer.expirationDate,
          cvc: customer.cvc,
        }
      : null,
    totalPrice: cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
    orderDate: new Date().toISOString(),
  };
  axios
    .post("http://localhost:8080/api/orders", orderData)
    .then(() => {
      setOrderSubmitting(false);
      setOrderSuccess(true);
      localStorage.removeItem("cart");
      setCart([]);
      setTimeout(() => navigate("/books"), 3000);
    })
    .catch((err) => {
      setOrderSubmitting(false);
      alert("Order failed: " + (err.response?.data || err.message));
    });
};

  const totalPrice = book ? form.quantity * book.price : 0
  const deliveryFee = totalPrice > 2000 ? 0 : 250
  const finalTotal = totalPrice + deliveryFee

  // Cart total
  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)

  // For single book view (OrderPage is for one book at a time)
  const stockStatus = book ? getStockStatus(book) : null
  const deliveryTime = book ? getDeliveryTime(book) : null
  const { originalPrice, discountPercent } = book ? getDiscount(book) : { originalPrice: 0, discountPercent: 0 }
  const rating = book?.rating || 0
  const ratingCount = book?.ratingCount || 0

  // Cart Modal (Drawer)
  const CartDrawer = (
    <Drawer anchor="right" open={cartOpen} onClose={() => setCartOpen(false)}>
      <Box sx={{ width: 400, p: 3, display: 'flex', flexDirection: 'column', height: '100%' }}>
        <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2 }}>Your Cart</Typography>
        <Divider sx={{ mb: 2 }} />
        {cart.length === 0 ? (
          <Typography color="text.secondary">Your cart is empty.</Typography>
        ) : (
          <List sx={{ flex: 1, overflowY: 'auto' }}>
            {cart.map((item) => (
              <ListItem key={item.bookId} alignItems="flex-start" sx={{ mb: 2, borderRadius: 2, bgcolor: 'background.paper', boxShadow: 1 }}>
                <Box sx={{ mr: 2, minWidth: 60 }}>
                  <img
                    src={item.imageUrl || "/placeholder.svg?height=60&width=45"}
                    alt={item.bookTitle}
                    style={{ width: 45, height: 60, objectFit: 'cover', borderRadius: 6, background: '#f5f5f5', boxShadow: '0 2px 8px #eee' }}
                    onError={e => { e.target.src = "/placeholder.svg?height=60&width=45"; }}
                  />
                </Box>
                <ListItemText
                  primary={<Typography sx={{ fontWeight: 'bold' }}>{item.bookTitle}</Typography>}
                  secondary={
                    <>
                      <Typography variant="body2">Price: Rs. {item.price}</Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                        <Typography variant="body2" sx={{ mr: 1 }}>Qty:</Typography>
                        <Input
                          type="number"
                          value={item.quantity}
                          onChange={e => handleCartQuantityChange(item.bookId, parseInt(e.target.value) || 1)}
                          inputProps={{ min: 1, style: { width: 50 } }}
                          sx={{ mr: 2 }}
                        />
                        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>Total: Rs. {item.price * item.quantity}</Typography>
                      </Box>
                    </>
                  }
                />
                <ListItemSecondaryAction>
                  <Tooltip title="Remove from cart">
                    <IconButton edge="end" color="error" onClick={() => handleRemoveFromCart(item.bookId)}>
                      <Delete />
                    </IconButton>
                  </Tooltip>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        )}
        <Divider sx={{ my: 2 }} />
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">Total:</Typography>
          <Typography variant="h6" color="primary">Rs. {cartTotal}</Typography>
        </Box>
        <Button
          variant="contained"
          color="primary"
          fullWidth
          size="large"
          disabled={cart.length === 0}
          onClick={handleCheckout}
          sx={{ fontWeight: 'bold', borderRadius: 2, py: 1.5, fontSize: '1.1rem', boxShadow: 3 }}
        >
          Checkout
        </Button>
      </Box>
    </Drawer>
  )

  // Checkout Modal (Dialog)
 const CheckoutDialog = (
  <Dialog open={checkoutOpen} onClose={() => setCheckoutOpen(false)} maxWidth="sm" fullWidth TransitionComponent={Slide}>
    <DialogTitle sx={{
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      fontWeight: 'bold',
      fontSize: '2rem',
      textAlign: 'center',
      letterSpacing: 1,
      pb: 2,
    }}>
      Checkout
    </DialogTitle>
    <DialogContent sx={{ p: 4, bgcolor: 'background.default' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, gap: 3 }}>
        <CardMedia
          component="img"
          image={book?.imageUrl || "/placeholder.svg?height=120&width=90"}
          alt={book?.title}
          sx={{ width: 90, height: 120, objectFit: 'cover', borderRadius: 2, boxShadow: 2, bgcolor: '#f5f5f5' }}
        />
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 0.5 }}>{book?.title}</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>by {book?.author}</Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Rating value={rating} readOnly size="small" precision={0.1} />
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>{rating.toFixed(1)} ({ratingCount} ratings)</Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
            <Chip label={stockStatus?.label} size="small" color={stockStatus?.color} variant="outlined" icon={<Inventory />} />
            <Chip label={deliveryTime} size="small" color="primary" variant="outlined" icon={<Schedule />} />
            {discountPercent > 0 && (
              <Chip label={`${discountPercent}% OFF`} size="small" sx={{ bgcolor: theme.palette.error.main, color: 'white', fontWeight: 'bold' }} />
            )}
          </Box>
        </Box>
      </Box>
      <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold', color: 'primary.main' }}>Customer Details</Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Full Name"
            name="name"
            value={customer.name}
            onChange={handleCustomerChange}
            error={!!cartErrors.name}
            helperText={cartErrors.name}
            InputProps={{ startAdornment: <Person color="action" sx={{ mr: 1 }} /> }}
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Contact Number"
            name="contact"
            value={customer.contact}
            onChange={handleCustomerChange}
            error={!!cartErrors.contact}
            helperText={cartErrors.contact}
            InputProps={{ startAdornment: <Phone color="action" sx={{ mr: 1 }} /> }}
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Email Address"
            name="email"
            value={customer.email}
            onChange={handleCustomerChange}
            error={!!cartErrors.email}
            helperText={cartErrors.email}
            InputProps={{ startAdornment: <Email color="action" sx={{ mr: 1 }} /> }}
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Delivery Address"
            name="address"
            value={customer.address}
            onChange={handleCustomerChange}
            error={!!cartErrors.address}
            helperText={cartErrors.address || "Please provide a complete address including city, state, and ZIP code for accurate delivery."}
            multiline
            rows={3}
            InputProps={{ startAdornment: <LocationOn color="action" sx={{ mr: 1, alignSelf: 'flex-start', mt: 1 }} /> }}
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
          />
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', color: 'primary.main' }}>Payment Method</Typography>
          <FormControl component="fieldset">
            <RadioGroup name="paymentMethod" value={customer.paymentMethod} onChange={handleCustomerChange}>
              <FormControlLabel
                value="Cash On Delivery"
                control={<Radio />}
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CreditCard sx={{ fontSize: 24 }} />
                    <Typography>Cash On Delivery</Typography>
                  </Box>
                }
              />
              <FormControlLabel
                value="Mastercard"
                control={<Radio />}
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <img src="https://upload.wikimedia.org/wikipedia/commons/0/04/Mastercard-logo.png" alt="Mastercard" style={{ height: 24 }} />
                    <Typography>Mastercard</Typography>
                  </Box>
                }
              />
              <FormControlLabel
                value="Visa"
                control={<Radio />}
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <img src="https://upload.wikimedia.org/wikipedia/commons/4/41/Visa_Logo.png" alt="Visa" style={{ height: 24 }} />
                    <Typography>Visa</Typography>
                  </Box>
                }
              />
              <FormControlLabel
                value="Bank Transfer"
                control={<Radio />}
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CreditCard sx={{ fontSize: 24 }} />
                    <Typography>Bank Transfer</Typography>
                  </Box>
                }
              />
            </RadioGroup>
          </FormControl>
        </Grid>
        {(customer.paymentMethod === 'Mastercard' || customer.paymentMethod === 'Visa') && (
          <>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Card Holder Name"
                name="cardHolderName"
                value={customer.cardHolderName}
                onChange={handleCustomerChange}
                error={!!cartErrors.cardHolderName}
                helperText={cartErrors.cardHolderName}
                InputProps={{ startAdornment: <Person color="action" sx={{ mr: 1 }} /> }}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Card Number"
                name="cardNumber"
                value={customer.cardNumber}
                onChange={handleCustomerChange}
                error={!!cartErrors.cardNumber}
                helperText={cartErrors.cardNumber}
                InputProps={{ startAdornment: <CreditCard color="action" sx={{ mr: 1 }} /> }}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                fullWidth
                label="Expiration Date"
                name="expirationDate"
                value={customer.expirationDate}
                onChange={handleCustomerChange}
                error={!!cartErrors.expirationDate}
                helperText={cartErrors.expirationDate}
                placeholder="MM/YY"
                InputProps={{ startAdornment: <CreditCard color="action" sx={{ mr: 1 }} /> }}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                fullWidth
                label="CVC"
                name="cvc"
                value={customer.cvc}
                onChange={handleCustomerChange}
                error={!!cartErrors.cvc}
                helperText={cartErrors.cvc}
                InputProps={{ startAdornment: <CreditCard color="action" sx={{ mr: 1 }} /> }}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              />
            </Grid>
          </>
        )}
      </Grid>
      <Divider sx={{ my: 4 }} />
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">Order Total:</Typography>
        <Typography variant="h6" color="primary">Rs. {cartTotal}</Typography>
      </Box>
    </DialogContent>
    <DialogActions sx={{ p: 3, bgcolor: 'background.default' }}>
      <Button onClick={() => setCheckoutOpen(false)} color="secondary" variant="outlined" sx={{ borderRadius: 2, fontWeight: 'bold' }}>Cancel</Button>
      <Button
        onClick={handleOrderSubmit}
        color="primary"
        variant="contained"
        size="large"
        disabled={orderSubmitting}
        sx={{ borderRadius: 2, fontWeight: 'bold', px: 4, py: 1.5, fontSize: '1.1rem', boxShadow: 3 }}
      >
        {orderSubmitting ? <CircularProgress size={24} sx={{ color: 'white', mr: 2 }} /> : null}
        Place Order
      </Button>
    </DialogActions>
  </Dialog>
);

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
      {/* Header with Cart Icon */}
      <Box
        sx={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          color: "white",
          py: 4,
        }}
      >
        <Container>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3, justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <IconButton onClick={() => navigate(-1)} sx={{ color: "white", bgcolor: alpha("#fff", 0.2) }}>
                <ArrowBack />
              </IconButton>
              <Typography variant="h4" sx={{ fontWeight: "bold" }}>
                Complete Your Order
              </Typography>
            </Box>
            <Tooltip title="View Cart">
              <IconButton onClick={() => setCartOpen(true)} sx={{ color: 'white', bgcolor: alpha('#fff', 0.2), position: 'relative' }}>
                <ShoppingCart />
                {cart.length > 0 && (
                  <Box sx={{ position: 'absolute', top: 4, right: 4, bgcolor: 'error.main', color: 'white', borderRadius: '50%', width: 22, height: 22, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 'bold' }}>{cart.length}</Box>
                )}
              </IconButton>
            </Tooltip>
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
          <Grid item xs={8} lg={2}>
            <Fade in timeout={800}>
              <Card
                elevation={0}
                sx={{
                  border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                  borderRadius: 3,
                  overflow: "hidden",
                  position: "sticky",
                  top: 20,
                  width:460
                }}
              >
                <Box sx={{ position: "relative" }}>
                  <CardMedia
                    component="img"
                    image={book.imageUrl || "/placeholder.svg?height=400&width=300"}
                    alt={book.title}
                    sx={{ height: 530, width:460, objectFit: "cover"}}
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

                  {/* Ratings */}
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                    <Rating value={rating} readOnly size="small" precision={0.1} />
                    <Typography variant="caption" sx={{ color: "text.secondary" }}>
                      {rating.toFixed(1)} ({ratingCount} ratings)
                    </Typography>
                  </Box>

                  <Typography variant="body2" sx={{ mb: 3, lineHeight: 1.6 }}>
                    {book.description}
                  </Typography>

                  {/* Replace static chips and rating with: */}
                  <Box sx={{ display: "flex", gap: 1, mb: 2, flexWrap: "wrap" }}>
                    <Chip
                      label={stockStatus?.label}
                      size="small"
                      color={stockStatus?.color}
                      variant="outlined"
                      icon={<Inventory />}
                    />
                    <Chip
                      label={deliveryTime}
                      size="small"
                      color="primary"
                      variant="outlined"
                      icon={<Schedule />}
                    />
                    {discountPercent > 0 && (
                      <Chip
                        label={`${discountPercent}% OFF`}
                        size="small"
                        sx={{ bgcolor: theme.palette.error.main, color: "white", fontWeight: "bold" }}
                      />
                    )}
                    {book?.isBestseller && (
                      <Chip
                        label="Bestseller"
                        size="small"
                        sx={{ bgcolor: theme.palette.warning.main, color: "white", fontWeight: "bold" }}
                      />
                    )}
                  </Box>
                </CardContent>
              </Card>
            </Fade>
          </Grid>

          
        </Grid>
      </Container>

      {/* Add to Cart Button for current book */}
      <Container sx={{ py: 2 }}>
        <Button
          variant="contained"
          color="primary"
          size="large"
          startIcon={<ShoppingCart />}
          onClick={handleAddToCart}
          sx={{ fontWeight: 'bold', borderRadius: 2, py: 1.5, fontSize: '1.1rem', boxShadow: 3 }}
        >
          Add to Cart
        </Button>
      </Container>
      {/* Cart Drawer */}
      {CartDrawer}
      {/* Checkout Dialog */}
      {CheckoutDialog}
      

      {/* Success Snackbar */}
      <Snackbar open={orderSuccess} autoHideDuration={4000} anchorOrigin={{ vertical: "top", horizontal: "center" }}>
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
