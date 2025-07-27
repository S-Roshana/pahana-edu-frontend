"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import {
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Button,
  Typography,
  Grid,
  Container,
  Chip,
  Box,
  Rating,
  Divider,
  Tooltip,
  TextField,
  InputAdornment,
  Fade,
  Grow,
  Paper,
  IconButton,
  Badge,
  Skeleton,
  useTheme,
  alpha,
  Fab,
  Alert,
  Snackbar,
  Avatar,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  AppBar,
  Toolbar,
} from "@mui/material"
import {
  Search,
  FilterList,
  Favorite,
  FavoriteBorder,
  ShoppingCart,
  LocalShipping,
  Visibility,
  School,
  KeyboardArrowUp,
  Inventory,
  Schedule,
  Delete,
  Dashboard as DashboardIcon,
  Edit,
  Logout,
} from "@mui/icons-material"

const BookListPage = ({ user: propUser, logout }) => {
  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [favorites, setFavorites] = useState(new Set())
  const [showScrollTop, setShowScrollTop] = useState(false)
  const [stats, setStats] = useState({
    totalBooks: 0,
    averageRating: 0,
    totalCustomers: 0,
  })
  const [userRatings, setUserRatings] = useState({}) // bookId -> user's rating
  const [notification, setNotification] = useState({ open: false, message: "", severity: "success" })

  // Profile menu state
  const [profileAnchorEl, setProfileAnchorEl] = useState(null)
  const profileMenuOpen = Boolean(profileAnchorEl)

  const navigate = useNavigate()
  const theme = useTheme()

  // Add user state management
  const [user, setUser] = useState(propUser || null)

  // Load user from localStorage if not passed as prop
  useEffect(() => {
    if (!propUser) {
      try {
        const storedUser = localStorage.getItem("user")
        if (storedUser) {
          const userData = JSON.parse(storedUser)
          setUser(userData)
        }
      } catch (error) {
        console.error("Error loading user from localStorage:", error)
      }
    } else {
      setUser(propUser)
    }
  }, [propUser])

  // Configure axios defaults for JWT
  useEffect(() => {
    if (user?.token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${user.token}`
    } else {
      delete axios.defaults.headers.common["Authorization"]
    }
  }, [user])

  useEffect(() => {
    setLoading(true)
    // Fetch books
    axios
      .get("http://localhost:8080/api/books")
      .then((response) => {
        setBooks(response.data)
        // Calculate dynamic stats
        const totalBooks = response.data.length
        const averageRating = response.data.reduce((sum, book) => sum + (book.rating || 0), 0) / totalBooks
        setStats({
          totalBooks,
          averageRating: averageRating.toFixed(1),
          totalCustomers: Math.floor(totalBooks * 2.5), // Estimated customers
        })
        setLoading(false)

        // Load user ratings if authenticated
        if (user?.token) {
          loadUserRatings(response.data)
        }
      })
      .catch((error) => {
        console.error("Error fetching books:", error)
        setLoading(false)
      })
  }, [user])

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.pageYOffset > 300)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const loadUserRatings = async (booksList) => {
    if (!user?.token) return

    const ratings = {}
    for (const book of booksList) {
      try {
        const response = await axios.get(`http://localhost:8080/api/books/${book.id}/user-rating`)
        if (response.data.hasRated) {
          ratings[book.id] = response.data.rating
        }
      } catch (error) {
        console.error(`Error loading rating for book ${book.id}:`, error)
      }
    }
    setUserRatings(ratings)
  }

  // Profile menu handlers
  const handleProfileMenuOpen = (event) => {
    setProfileAnchorEl(event.currentTarget)
  }

  const handleProfileMenuClose = () => {
    setProfileAnchorEl(null)
  }

  const handleViewProfile = () => {
    handleProfileMenuClose()
    navigate("/dashboard")
  }

  const handleEditProfile = () => {
    handleProfileMenuClose()
    navigate("/profile/edit")
  }

  const handleLogout = () => {
    handleProfileMenuClose()
    if (logout) {
      logout()
    }
    showNotification("Logged out successfully!", "success")
    navigate("/")
  }

  const filteredBooks = books.filter(
    (book) =>
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const toggleFavorite = (bookId) => {
    const newFavorites = new Set(favorites)
    if (newFavorites.has(bookId)) {
      newFavorites.delete(bookId)
    } else {
      newFavorites.add(bookId)
    }
    setFavorites(newFavorites)
  }

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const showNotification = (message, severity = "success") => {
    setNotification({ open: true, message, severity })
  }

  // Helper function to get stock status using real quantity
  const getStockStatus = (book) => {
    const quantity = book.quantity || 0
    if (quantity > 20) return { label: "In Stock", color: "success", available: true }
    if (quantity > 5) return { label: "Limited Stock", color: "warning", available: true }
    if (quantity > 0) return { label: "Few Left", color: "error", available: true }
    return { label: "Out of Stock", color: "default", available: false }
  }

  // Function to submit user rating with JWT authentication
  const submitRating = async (bookId, newRating) => {
    if (!user?.token) {
      showNotification("Please log in to rate books", "warning")
      navigate("/login")
      return
    }

    try {
      await axios.put(`http://localhost:8080/api/books/${bookId}/rating`, {
        rating: newRating,
      })

      // Update local user ratings
      const updatedUserRatings = { ...userRatings, [bookId]: newRating }
      setUserRatings(updatedUserRatings)

      // Refresh books list after rating
      const { data } = await axios.get("http://localhost:8080/api/books")
      setBooks(data)

      showNotification(
        userRatings[bookId] ? "Rating updated successfully!" : "Rating submitted successfully!",
        "success",
      )
    } catch (error) {
      console.error("Error submitting rating", error)
      if (error.response?.status === 401) {
        showNotification("Please log in to rate books", "warning")
        navigate("/login")
      } else {
        showNotification("Failed to submit rating. Please try again.", "error")
      }
    }
  }

  // Function to delete user rating
  const deleteRating = async (bookId) => {
    if (!user?.token) {
      showNotification("Please log in to manage ratings", "warning")
      return
    }

    try {
      await axios.delete(`http://localhost:8080/api/books/${bookId}/rating`)

      // Update local user ratings
      const updatedUserRatings = { ...userRatings }
      delete updatedUserRatings[bookId]
      setUserRatings(updatedUserRatings)

      // Refresh books list after deleting rating
      const { data } = await axios.get("http://localhost:8080/api/books")
      setBooks(data)

      showNotification("Rating deleted successfully!", "success")
    } catch (error) {
      console.error("Error deleting rating", error)
      showNotification("Failed to delete rating. Please try again.", "error")
    }
  }

  // Helper function to get delivery time
  const getDeliveryTime = (book) => {
    const deliveryDays = book.deliveryDays || Math.floor(Math.random() * 5) + 1
    if (deliveryDays === 1) return "Next Day"
    if (deliveryDays <= 3) return `${deliveryDays} Days`
    return `${deliveryDays}-7 Days`
  }

  // Helper function to calculate discount
  const getDiscount = (book) => {
    const originalPrice = book.originalPrice || Math.round(book.price * 1.2)
    const discountPercent = Math.round(((originalPrice - book.price) / originalPrice) * 100)
    return { originalPrice, discountPercent }
  }

  const LoadingSkeleton = () => (
    <Grid container spacing={3}>
      {[...Array(6)].map((_, index) => (
        <Grid item key={index} xs={12} sm={6} md={4}>
          <Card sx={{ height: "100%" }}>
            <Skeleton variant="rectangular" height={280} />
            <CardContent>
              <Skeleton variant="text" height={32} />
              <Skeleton variant="text" height={20} width="60%" />
              <Skeleton variant="text" height={60} />
              <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
                <Skeleton variant="text" width={80} />
                <Skeleton variant="rectangular" width={100} height={24} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  )

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      {/* Top Navigation Bar with Profile */}
      {user && (
        <AppBar
          position="sticky"
          elevation={0}
          sx={{
            bgcolor: alpha(theme.palette.primary.main, 0.95),
            backdropFilter: "blur(10px)",
            borderBottom: `1px solid ${alpha("#fff", 0.1)}`,
          }}
        >
          <Toolbar sx={{ justifyContent: "space-between" }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <School sx={{ color: "white" }} />
              <Typography variant="h6" sx={{ color: "white", fontWeight: "bold" }}>
                Pahana Edu
              </Typography>
            </Box>

            {/* Profile Section */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Box sx={{ display: { xs: "none", sm: "block" } }}>
                <Typography variant="body2" sx={{ color: alpha("#fff", 0.9) }}>
                  Welcome back,
                </Typography>
                <Typography variant="body1" sx={{ color: "white", fontWeight: "bold" }}>
                  {user.customer?.name || user.customer?.username}
                </Typography>
              </Box>

              <Tooltip title="Profile Menu">
                <IconButton
                  onClick={handleProfileMenuOpen}
                  sx={{
                    bgcolor: alpha("#fff", 0.1),
                    "&:hover": { bgcolor: alpha("#fff", 0.2) },
                  }}
                >
                  <Avatar
                    src={user.customer?.profilePicUrl}
                    sx={{
                      width: 40,
                      height: 40,
                      bgcolor: alpha("#fff", 0.2),
                      color: "white",
                    }}
                  >
                    {user.customer?.name?.charAt(0) || user.customer?.username?.charAt(0) || "U"}
                  </Avatar>
                </IconButton>
              </Tooltip>

              {/* Profile Menu */}
              <Menu
                anchorEl={profileAnchorEl}
                open={profileMenuOpen}
                onClose={handleProfileMenuClose}
                onClick={handleProfileMenuClose}
                PaperProps={{
                  elevation: 8,
                  sx: {
                    overflow: "visible",
                    filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                    mt: 1.5,
                    minWidth: 200,
                    borderRadius: 2,
                    "&:before": {
                      content: '""',
                      display: "block",
                      position: "absolute",
                      top: 0,
                      right: 14,
                      width: 10,
                      height: 10,
                      bgcolor: "background.paper",
                      transform: "translateY(-50%) rotate(45deg)",
                      zIndex: 0,
                    },
                  },
                }}
                transformOrigin={{ horizontal: "right", vertical: "top" }}
                anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
              >
                {/* Profile Header */}
                <Box sx={{ px: 2, py: 1.5, borderBottom: `1px solid ${theme.palette.divider}` }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Avatar src={user.customer?.profilePicUrl} sx={{ width: 32, height: 32 }}>
                      {user.customer?.name?.charAt(0) || user.customer?.username?.charAt(0) || "U"}
                    </Avatar>
                    <Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: "bold" }}>
                        {user.customer?.name || user.customer?.username}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {user.customer?.contactNo}
                      </Typography>
                    </Box>
                  </Box>
                </Box>

                {/* Menu Items */}
                <MenuItem onClick={handleViewProfile} sx={{ py: 1.5 }}>
                  <ListItemIcon>
                    <DashboardIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>
                    <Typography variant="body2">Dashboard</Typography>
                    <Typography variant="caption" color="text.secondary">
                      View orders & profile
                    </Typography>
                  </ListItemText>
                </MenuItem>

                <MenuItem onClick={handleEditProfile} sx={{ py: 1.5 }}>
                  <ListItemIcon>
                    <Edit fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>
                    <Typography variant="body2">Edit Profile</Typography>
                    <Typography variant="caption" color="text.secondary">
                      Update your information
                    </Typography>
                  </ListItemText>
                </MenuItem>

                <Divider />

                <MenuItem onClick={handleLogout} sx={{ py: 1.5, color: "error.main" }}>
                  <ListItemIcon>
                    <Logout fontSize="small" sx={{ color: "error.main" }} />
                  </ListItemIcon>
                  <ListItemText>
                    <Typography variant="body2">Logout</Typography>
                    <Typography variant="caption" color="text.secondary">
                      Sign out of your account
                    </Typography>
                  </ListItemText>
                </MenuItem>
              </Menu>
            </Box>
          </Toolbar>
        </AppBar>
      )}

      {/* Hero Section */}
      <Box
        sx={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          color: "white",
          py: user ? 6 : 8, // Smaller padding if user is logged in (nav bar takes space)
          position: "relative",
          overflow: "hidden",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0,0,0,0.1)",
            zIndex: 1,
          },
        }}
      >
        <Container sx={{ position: "relative", zIndex: 2 }}>
          <Fade in timeout={1000}>
            <Box textAlign="center">
              <Box
                sx={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 80,
                  height: 80,
                  bgcolor: alpha("#fff", 0.2),
                  borderRadius: "50%",
                  mb: 3,
                  backdropFilter: "blur(10px)",
                }}
              >
                <School sx={{ fontSize: 40 }} />
              </Box>

              <Typography
                variant="h2"
                sx={{
                  fontWeight: "bold",
                  mb: 2,
                  fontSize: { xs: "2.5rem", md: "3.5rem" },
                  textShadow: "2px 2px 4px rgba(0,0,0,0.3)",
                }}
              >
                📚 Discover Amazing Books
              </Typography>

              <Typography
                variant="h5"
                sx={{
                  mb: 4,
                  color: alpha("#fff", 0.9),
                  maxWidth: "600px",
                  mx: "auto",
                }}
              >
                Handpicked educational books for every learner. Fast delivery guaranteed!
              </Typography>

              {/* Search Bar */}
              <Paper
                elevation={3}
                sx={{
                  maxWidth: 600,
                  mx: "auto",
                  p: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  bgcolor: alpha("#fff", 0.95),
                  backdropFilter: "blur(10px)",
                  borderRadius: 3,
                }}
              >
                <TextField
                  fullWidth
                  placeholder="Search books by title or author..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search color="action" />
                      </InputAdornment>
                    ),
                    disableUnderline: true,
                  }}
                  variant="standard"
                  sx={{
                    flex: 1,
                    "& .MuiInputBase-input": {
                      fontSize: "1.1rem",
                      py: 1.5,
                    },
                  }}
                />
                <IconButton color="primary" sx={{ p: 1.5, flexShrink: 0 }}>
                  <FilterList />
                </IconButton>
              </Paper>
            </Box>
          </Fade>
        </Container>
      </Box>

      {/* Stats Section - Fixed Alignment */}
      <Container sx={{ py: 6 }}>
        <Grid container spacing={4} justifyContent="center" alignItems="stretch">
          <Grid item xs={6} sm={3} md={3}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                textAlign: "center",
                bgcolor: alpha(theme.palette.primary.main, 0.05),
                border: `2px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                borderRadius: 3,
                height: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                transition: "all 0.3s ease",
                "&:hover": {
                  transform: "translateY(-5px)",
                  borderColor: theme.palette.primary.main,
                  boxShadow: `0 8px 25px ${alpha(theme.palette.primary.main, 0.15)}`,
                },
              }}
            >
              <Typography variant="h4" color="primary" sx={{ fontWeight: "bold", mb: 1 }}>
                {loading ? "..." : `${stats.totalBooks}+`}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                Books Available
              </Typography>
            </Paper>
          </Grid>

          <Grid item xs={6} sm={3} md={3}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                textAlign: "center",
                bgcolor: alpha(theme.palette.success.main, 0.05),
                border: `2px solid ${alpha(theme.palette.success.main, 0.1)}`,
                borderRadius: 3,
                height: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                transition: "all 0.3s ease",
                "&:hover": {
                  transform: "translateY(-5px)",
                  borderColor: theme.palette.success.main,
                  boxShadow: `0 8px 25px ${alpha(theme.palette.success.main, 0.15)}`,
                },
              }}
            >
              <Typography variant="h4" color="success.main" sx={{ fontWeight: "bold", mb: 1 }}>
                24h
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                Fast Delivery
              </Typography>
            </Paper>
          </Grid>

          <Grid item xs={6} sm={3} md={3}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                textAlign: "center",
                bgcolor: alpha(theme.palette.warning.main, 0.05),
                border: `2px solid ${alpha(theme.palette.warning.main, 0.1)}`,
                borderRadius: 3,
                height: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                transition: "all 0.3s ease",
                "&:hover": {
                  transform: "translateY(-5px)",
                  borderColor: theme.palette.warning.main,
                  boxShadow: `0 8px 25px ${alpha(theme.palette.warning.main, 0.15)}`,
                },
              }}
            >
              <Typography variant="h4" color="warning.main" sx={{ fontWeight: "bold", mb: 1 }}>
                {loading ? "..." : `${stats.averageRating}★`}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                Average Rating
              </Typography>
            </Paper>
          </Grid>

          <Grid item xs={6} sm={3} md={3}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                textAlign: "center",
                bgcolor: alpha(theme.palette.secondary.main, 0.05),
                border: `2px solid ${alpha(theme.palette.secondary.main, 0.1)}`,
                borderRadius: 3,
                height: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                transition: "all 0.3s ease",
                "&:hover": {
                  transform: "translateY(-5px)",
                  borderColor: theme.palette.secondary.main,
                  boxShadow: `0 8px 25px ${alpha(theme.palette.secondary.main, 0.15)}`,
                },
              }}
            >
              <Typography variant="h4" color="secondary.main" sx={{ fontWeight: "bold", mb: 1 }}>
                {loading ? "..." : `${stats.totalCustomers}+`}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                Happy Customers
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Container>

      {/* Books Section */}
      <Container sx={{ pb: 8 }}>
        <Box sx={{ mb: 4, display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 2 }}>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography variant="h4" sx={{ fontWeight: "bold", mb: 1 }}>
              Featured Books
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {filteredBooks.length} books found
              {searchTerm && ` for "${searchTerm}"`}
            </Typography>
          </Box>
          <Box sx={{ display: "flex", gap: 2, alignItems: "center", flexShrink: 0 }}>
            {!user && (
              <Button variant="outlined" color="primary" onClick={() => navigate("/login")} sx={{ fontWeight: "bold" }}>
                Login to Rate Books
              </Button>
            )}
            <Badge badgeContent={favorites.size} color="error">
              <IconButton color="primary" size="large">
                <Favorite />
              </IconButton>
            </Badge>
          </Box>
        </Box>
          
           
            
        {loading ? (
          <LoadingSkeleton />
        ) : (
          
          <Grid container spacing={3}>
            {filteredBooks.map((book, index) => {
              const stockStatus = getStockStatus(book)
              const deliveryTime = getDeliveryTime(book)
              const { originalPrice, discountPercent } = getDiscount(book)
              const rating = book.rating || 0 // Use backend's calculated average rating
              const userRating = userRatings[book.id] || 0

              return (
                <Grid item xs={8} sm={6} md={4} lg={3} key={book.id} sx={{ display: "flex", flexDirection: "row" }}>
                  <Grow in timeout={800 + index * 100}>
                    <Card
                      sx={{
                        height: 550,
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        borderRadius: 3,
                        overflow: "hidden",
                        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                        border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                        maxWidth: "350px",
                        "&:hover": {
                          transform: "translateY(-8px)",
                          boxShadow: `0 20px 40px ${alpha(theme.palette.primary.main, 0.15)}`,
                          "& .book-image": {
                            transform: "scale(1.02)",
                          },
                         
                        },
                      }}
                    >
                      <Box sx={{ overflow: "hidden", backgroundColor: "#f8f9fa" }}>
                      <CardMedia
                        component="img"
                        image={book.imageUrl || "/placeholder.svg?height=300&width=200"}
                        alt={book.title}
                        className="book-image"
                        height="400"
                        sx={{
                          width: "100%",
                          objectFit: "cover",
                          objectPosition: "top",
                          backgroundColor: "#f5f5f5",
                          transition: "transform 0.3s ease",
                        }}
                        onError={(e) => {
                          e.target.src = "/placeholder.svg?height=300&width=200";
                        }}
                      />

                        <Box
                          className="book-overlay"
                          sx={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            bgcolor: "rgba(0,0,0,0.5)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: 1,
                            opacity: 0,
                            zIndex: 1,
                          }}
                        >
                         
                        </Box>

                        {/* Dynamic badges */}
                        <Box
                          sx={{
                            position: "absolute",
                            top: 12,
                            left: 12,
                            display: "flex",
                            flexDirection: "column",
                            gap: 1,
                            zIndex: 2,
                          }}
                        >
                          {discountPercent > 0 && (
                            <Chip
                              label={`${discountPercent}% OFF`}
                              size="small"
                              sx={{
                                bgcolor: theme.palette.error.main,
                                color: "white",
                                fontWeight: "bold",
                              }}
                            />
                          )}
                          {book.isBestseller && (
                            <Chip
                              label="Bestseller"
                              size="small"
                              sx={{
                                bgcolor: theme.palette.warning.main,
                                color: "white",
                                fontWeight: "bold",
                              }}
                            />
                          )}
                        </Box>
                      </Box>

                      <CardContent sx={{ flexGrow: 1, p: 3, display: "flex", flexDirection: "column" }}>
                        <Tooltip title={book.title} arrow placement="top">
                          <Typography
                            variant="h6"
                            sx={{
                              fontWeight: "bold",
                              mb: 1,
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {book.title}
                          </Typography>
                        </Tooltip>

                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2, fontStyle: "italic" }}>
                          by {book.author}
                        </Typography>

                        <Typography
                          variant="body2"
                          sx={{
                            mb: 2,
                            color: "text.secondary",
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                            lineHeight: 1.5,
                            minHeight: "2.5em",
                            flexGrow: 1,
                          }}
                        >
                          {book.description}
                        </Typography>

                        {/* Interactive Rating with JWT Authentication */}
                        <Box sx={{ mb: 2 }}>
                          <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                            <Rating value={rating} readOnly size="small" precision={0.1} />
                            <Typography variant="caption" sx={{ ml: 1, color: "text.secondary" }}>
                              {rating.toFixed(1)} ({book.ratingCount || 0} ratings)
                            </Typography>
                          </Box>

                          {user ? (
                            <Box>
                              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                                <Typography variant="caption" color="text.secondary">
                                  {userRating > 0 ? "Your rating:" : "Rate this book:"}
                                </Typography>
                                <Rating
                                  value={userRating}
                                  precision={0.5}
                                  size="small"
                                  onChange={(e, newValue) => submitRating(book.id, newValue)}
                                  sx={{
                                    "& .MuiRating-iconFilled": {
                                      color: theme.palette.warning.main,
                                    },
                                    "& .MuiRating-iconHover": {
                                      color: theme.palette.warning.dark,
                                    },
                                  }}
                                />
                                {userRating > 0 && (
                                  <Tooltip title="Delete your rating">
                                    <IconButton
                                      size="small"
                                      onClick={() => deleteRating(book.id)}
                                      sx={{ color: "error.main" }}
                                    >
                                      <Delete fontSize="small" />
                                    </IconButton>
                                  </Tooltip>
                                )}
                              </Box>
                              {userRating > 0 && (
                                <Typography variant="caption" color="primary.main" sx={{ fontStyle: "italic" }}>
                                  You rated this book {userRating} stars
                                </Typography>
                              )}
                            </Box>
                          ) : (
                            <Typography variant="caption" color="text.secondary" sx={{ fontStyle: "italic" }}>
                              Login to rate this book
                            </Typography>
                          )}
                        </Box>

                        {/* Dynamic Status Chips */}
                        <Box sx={{ display: "flex", gap: 1, mb: 2, flexWrap: "wrap" }}>
                          <Chip
                            label={stockStatus.label}
                            size="small"
                            color={stockStatus.color}
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
                        </Box>

                        {/* Dynamic Pricing */}
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            mt: "auto",
                          }}
                        >
                          <Box>
                            <Typography
                              variant="h5"
                              sx={{
                                fontWeight: "bold",
                                color: theme.palette.success.main,
                              }}
                            >
                              Rs. {book.price}
                            </Typography>
                            {discountPercent > 0 && (
                              <Typography
                                variant="caption"
                                sx={{
                                  textDecoration: "line-through",
                                  color: "text.disabled",
                                }}
                              >
                                Rs. {originalPrice}
                              </Typography>
                            )}
                          </Box>
                          {discountPercent > 0 && (
                            <Chip
                              label={`Save Rs. ${originalPrice - book.price}`}
                              size="small"
                              color="success"
                              sx={{ fontWeight: "bold" }}
                            />
                          )}
                        </Box>
                      </CardContent>

                      <CardActions sx={{ p: 3, pt: 0 }}>
                        <Button
                          fullWidth
                          variant="contained"
                          size="large"
                          startIcon={<ShoppingCart />}
                          onClick={() => navigate(`/order/${book.id}`)}
                          disabled={!stockStatus.available}
                          sx={{
                            py: 1.5,
                            borderRadius: 2,
                            fontWeight: "bold",
                            textTransform: "none",
                            fontSize: "1rem",
                            background: stockStatus.available
                              ? "linear-gradient(45deg, #667eea 30%, #764ba2 90%)"
                              : "linear-gradient(45deg, #ccc 30%, #999 90%)",
                            "&:hover": stockStatus.available
                              ? {
                                  background: "linear-gradient(45deg, #5a6fd8 30%, #6a4190 90%)",
                                  transform: "translateY(-2px)",
                                  boxShadow: 4,
                                }
                              : {},
                          }}
                        >
                          {stockStatus.available ? "Order Now" : "Out of Stock"}
                        </Button>
                      </CardActions>
                    </Card>
                  </Grow>
                </Grid>
              )
            })}
          </Grid>
        )}

        {filteredBooks.length === 0 && !loading && (
          <Paper
            elevation={0}
            sx={{
              p: 8,
              textAlign: "center",
              bgcolor: alpha(theme.palette.primary.main, 0.05),
              border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
              borderRadius: 3,
            }}
          >
            <Typography variant="h5" color="text.secondary" sx={{ mb: 2 }}>
              No books found
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Try adjusting your search terms or browse all books
            </Typography>
            <Button variant="contained" sx={{ mt: 2 }} onClick={() => setSearchTerm("")}>
              Show All Books
            </Button>
          </Paper>
        )}
      </Container>

      {/* Footer */}
      <Box
        sx={{
          bgcolor: alpha(theme.palette.primary.main, 0.05),
          py: 6,
          borderTop: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
        }}
      >
        <Container>
          <Grid container spacing={4} alignItems="stretch">
            <Grid item xs={12} md={8}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
                <LocalShipping color="primary" />
                <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                  Free Delivery Benefits
                </Typography>
              </Box>
              <Typography variant="body1" color="text.secondary">
                📦 Free delivery on orders above Rs. 2000 | Island-wide delivery within 3-5 working days
              </Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  textAlign: "center",
                  bgcolor: theme.palette.primary.main,
                  color: "white",
                  borderRadius: 2,
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
                  Need Help?
                </Typography>
                <Typography variant="body2" sx={{ mb: 2 }}>
                  Contact our support team
                </Typography>
                <Button
                  variant="outlined"
                  sx={{
                    color: "white",
                    borderColor: "white",
                    "&:hover": {
                      bgcolor: alpha("#fff", 0.1),
                      borderColor: "white",
                    },
                  }}
                >
                  Get Support
                </Button>
              </Paper>
            </Grid>
          </Grid>
          <Divider sx={{ my: 3 }} />
          <Typography variant="body2" color="text.secondary" textAlign="center">
            © 2025 Pahana Edu Bookstore. All rights reserved. Empowering education through quality books.
          </Typography>
        </Container>
      </Box>

      {/* Scroll to Top Button */}
      <Fade in={showScrollTop}>
        <Fab
          color="primary"
          size="medium"
          onClick={scrollToTop}
          sx={{
            position: "fixed",
            bottom: 24,
            right: 24,
            zIndex: 1000,
          }}
        >
          <KeyboardArrowUp />
        </Fab>
      </Fade>

      {/* Notification Snackbar */}
      <Snackbar
        open={notification.open}
        autoHideDuration={4000}
        onClose={() => setNotification({ ...notification, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={() => setNotification({ ...notification, open: false })}
          severity={notification.severity}
          sx={{ width: "100%" }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  )
}

// At the end of the file, change the export
export default function BookListPageWrapper(props) {
  return <BookListPage {...props} />
}
