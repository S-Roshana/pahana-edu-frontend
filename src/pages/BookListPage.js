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
} from "@mui/icons-material"

const BookListPage = () => {
  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [favorites, setFavorites] = useState(new Set())
  const [showScrollTop, setShowScrollTop] = useState(false)
  const navigate = useNavigate()
  const theme = useTheme()

  useEffect(() => {
    setLoading(true)
    axios
      .get("http://localhost:8080/api/books")
      .then((response) => {
        setBooks(response.data)
        setLoading(false)
      })
      .catch((error) => {
        console.error("Error fetching books:", error)
        setLoading(false)
      })
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.pageYOffset > 300)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

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

  const LoadingSkeleton = () => (
    <Grid container spacing={3}>
      {[...Array(6)].map((_, index) => (
        <Grid item key={index} xs={12} sm={6} md={4}>
          <Card sx={{ height: "100%" }}>
            <Skeleton variant="rectangular" height={180} />
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
      {/* Hero Section */}
      <Box
        sx={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          color: "white",
          py: 8,
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
                  bgcolor: alpha("#fff", 0.95),
                  backdropFilter: "blur(10px)",
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
                    "& .MuiInputBase-input": {
                      fontSize: "1.1rem",
                      py: 1.5,
                    },
                  }}
                />
                <IconButton color="primary" sx={{ p: 1.5 }}>
                  <FilterList />
                </IconButton>
              </Paper>
            </Box>
          </Fade>
        </Container>
      </Box>

      {/* Stats Section */}
      <Container sx={{ py: 6 }}>
        <Grid container spacing={4}>
          <Grid item xs={6} md={3}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                textAlign: "center",
                bgcolor: alpha(theme.palette.primary.main, 0.05),
                border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
              }}
            >
              <Typography variant="h4" color="primary" sx={{ fontWeight: "bold" }}>
                {books.length}+
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Books Available
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={6} md={3}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                textAlign: "center",
                bgcolor: alpha(theme.palette.success.main, 0.05),
                border: `1px solid ${alpha(theme.palette.success.main, 0.1)}`,
              }}
            >
              <Typography variant="h4" color="success.main" sx={{ fontWeight: "bold" }}>
                24h
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Fast Delivery
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={6} md={3}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                textAlign: "center",
                bgcolor: alpha(theme.palette.warning.main, 0.05),
                border: `1px solid ${alpha(theme.palette.warning.main, 0.1)}`,
              }}
            >
              <Typography variant="h4" color="warning.main" sx={{ fontWeight: "bold" }}>
                4.8★
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Average Rating
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={6} md={3}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                textAlign: "center",
                bgcolor: alpha(theme.palette.secondary.main, 0.05),
                border: `1px solid ${alpha(theme.palette.secondary.main, 0.1)}`,
              }}
            >
              <Typography variant="h4" color="secondary.main" sx={{ fontWeight: "bold" }}>
                10K+
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Happy Customers
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Container>

      {/* Books Section */}
      <Container sx={{ pb: 8 }}>
        <Box sx={{ mb: 4, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: "bold", mb: 1 }}>
              Featured Books
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {filteredBooks.length} books found
              {searchTerm && ` for "${searchTerm}"`}
            </Typography>
          </Box>
          <Badge badgeContent={favorites.size} color="error">
            <IconButton color="primary" size="large">
              <Favorite />
            </IconButton>
          </Badge>
        </Box>

        {loading ? (
          <LoadingSkeleton />
        ) : (
          <Grid container spacing={3}>
            {filteredBooks.map((book, index) => (
              <Grid item key={book.id} xs={12} sm={6} md={4}>
                <Grow in timeout={800 + index * 100}>
                  <Card
                    sx={{
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      borderRadius: 3,
                      overflow: "hidden",
                      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                      border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                      "&:hover": {
                        transform: "translateY(-8px)",
                        boxShadow: `0 20px 40px ${alpha(theme.palette.primary.main, 0.15)}`,
                        "& .book-image": {
                          transform: "scale(1.05)",
                        },
                        "& .book-overlay": {
                          opacity: 1,
                        },
                      },
                    }}
                  >
                    <Box sx={{ position: "relative", overflow: "hidden" }}>
                      <CardMedia
                        component="img"
                        image={book.imageUrl || "/placeholder.svg?height=240&width=180"}
                        alt={book.title}
                        className="book-image"
                        sx={{
                          height: 240,
                          objectFit: "cover",
                          transition: "transform 0.3s ease",
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
                          opacity: 0,
                          transition: "opacity 0.3s ease",
                        }}
                      >
                        <IconButton
                          sx={{ color: "white", bgcolor: alpha("#fff", 0.2), mr: 1 }}
                          onClick={() => navigate(`/book/${book.id}`)}
                        >
                          <Visibility />
                        </IconButton>
                        <IconButton
                          sx={{ color: "white", bgcolor: alpha("#fff", 0.2) }}
                          onClick={() => toggleFavorite(book.id)}
                        >
                          {favorites.has(book.id) ? <Favorite /> : <FavoriteBorder />}
                        </IconButton>
                      </Box>
                      <Chip
                        label="Bestseller"
                        size="small"
                        sx={{
                          position: "absolute",
                          top: 12,
                          left: 12,
                          bgcolor: theme.palette.error.main,
                          color: "white",
                          fontWeight: "bold",
                        }}
                      />
                    </Box>

                    <CardContent sx={{ flexGrow: 1, p: 3 }}>
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
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                          lineHeight: 1.5,
                        }}
                      >
                        {book.description}
                      </Typography>

                      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                        <Rating value={4.5} readOnly size="small" precision={0.5} />
                        <Typography variant="caption" sx={{ ml: 1, color: "text.secondary" }}>
                          4.5 (128 reviews)
                        </Typography>
                      </Box>

                      <Box sx={{ display: "flex", gap: 1, mb: 2, flexWrap: "wrap" }}>
                        <Chip label="In Stock" size="small" color="success" variant="outlined" />
                        <Chip
                          label="Fast Delivery"
                          size="small"
                          color="primary"
                          variant="outlined"
                          icon={<LocalShipping />}
                        />
                      </Box>

                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
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
                          <Typography
                            variant="caption"
                            sx={{
                              textDecoration: "line-through",
                              color: "text.disabled",
                            }}
                          >
                            Rs. {Math.round(book.price * 1.2)}
                          </Typography>
                        </Box>
                        <Chip label="20% OFF" size="small" color="error" sx={{ fontWeight: "bold" }} />
                      </Box>
                    </CardContent>

                    <CardActions sx={{ p: 3, pt: 0 }}>
                      <Button
                        fullWidth
                        variant="contained"
                        size="large"
                        startIcon={<ShoppingCart />}
                        onClick={() => navigate(`/order/${book.id}`)}
                        sx={{
                          py: 1.5,
                          borderRadius: 2,
                          fontWeight: "bold",
                          textTransform: "none",
                          fontSize: "1rem",
                          background: "linear-gradient(45deg, #667eea 30%, #764ba2 90%)",
                          "&:hover": {
                            background: "linear-gradient(45deg, #5a6fd8 30%, #6a4190 90%)",
                            transform: "translateY(-2px)",
                            boxShadow: 4,
                          },
                        }}
                      >
                        Order Now
                      </Button>
                    </CardActions>
                  </Card>
                </Grow>
              </Grid>
            ))}
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
          <Grid container spacing={4} alignItems="center">
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
    </Box>
  )
}

export default BookListPage
