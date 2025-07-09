"use client"

import { useState, useEffect } from "react"
import { useNavigate, Link } from "react-router-dom"
import axios from "axios"
import {
  Button,
  TextField,
  Box,
  Typography,
  Paper,
  Alert,
  CircularProgress,
  InputAdornment,
  IconButton,
  Divider,
  Fade,
  useTheme,
  alpha,
} from "@mui/material"
import { Visibility, VisibilityOff, Person, Lock, School, ArrowBack } from "@mui/icons-material"

export default function LoginPage(props) {
  const { setUser, user } = props
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const navigate = useNavigate()
  const theme = useTheme()

  useEffect(() => {
    setIsVisible(true)
    // Redirect if already logged in
    if (user?.token) {
      navigate("/books") // Changed from /dashboard to /books
    }
  }, [user, navigate])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const res = await axios.post("http://localhost:8080/api/auth/login", {
        username: username.trim(),
        password,
      })

      // Store user data and token
      const userData = {
        ...res.data,
        loginTime: new Date().toISOString(),
      }

      setUser(userData)

      // Store in localStorage for persistence
      localStorage.setItem("user", JSON.stringify(userData))

      // Set default authorization header for future requests
      if (userData.token) {
        axios.defaults.headers.common["Authorization"] = `Bearer ${userData.token}`
      }

      // Success feedback
      navigate("/books", {
        state: { message: "Login successful! Welcome back." },
      })
    } catch (err) {
      console.error("Login error:", err)

      if (err.response?.status === 401) {
        setError("Invalid username or password. Please try again.")
      } else if (err.response?.status === 500) {
        setError("Server error. Please try again later.")
      } else if (err.code === "NETWORK_ERROR") {
        setError("Network error. Please check your connection.")
      } else {
        setError("Login failed. Please try again.")
      }
    } finally {
      setLoading(false)
    }
  }

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  const handleGoBack = () => {
    navigate(-1)
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        p: 2,
        position: "relative",
      }}
    >
      {/* Background decoration */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "rgba(0,0,0,0.1)",
          zIndex: 1,
        }}
      />

      {/* Back button */}
      <IconButton
        onClick={handleGoBack}
        sx={{
          position: "absolute",
          top: 20,
          left: 20,
          color: "white",
          bgcolor: alpha("#fff", 0.2),
          backdropFilter: "blur(10px)",
          zIndex: 3,
          "&:hover": {
            bgcolor: alpha("#fff", 0.3),
          },
        }}
      >
        <ArrowBack />
      </IconButton>

      <Fade in={isVisible} timeout={800}>
        <Paper
          elevation={24}
          sx={{
            p: 4,
            maxWidth: 450,
            width: "100%",
            borderRadius: 4,
            background: "rgba(255, 255, 255, 0.95)",
            backdropFilter: "blur(20px)",
            border: `1px solid ${alpha("#fff", 0.2)}`,
            position: "relative",
            zIndex: 2,
          }}
        >
          {/* Logo and Title */}
          <Box sx={{ textAlign: "center", mb: 4 }}>
            <Box
              sx={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                width: 80,
                height: 80,
                bgcolor: theme.palette.primary.main,
                borderRadius: "50%",
                mb: 2,
                boxShadow: 3,
              }}
            >
              <School sx={{ fontSize: 40, color: "white" }} />
            </Box>

            <Typography
              variant="h4"
              component="h1"
              sx={{
                fontWeight: "bold",
                color: theme.palette.primary.main,
                mb: 1,
              }}
            >
              Welcome Back
            </Typography>

            <Typography
              variant="body1"
              sx={{
                color: "text.secondary",
                fontStyle: "italic",
              }}
            >
              Sign in to Pahana Edu Bookshop
            </Typography>
          </Box>

          {/* Error Alert */}
          {error && (
            <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }} onClose={() => setError("")}>
              {error}
            </Alert>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
              <TextField
                label="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                fullWidth
                variant="outlined"
                autoFocus
                disabled={loading}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Person color="action" />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                    bgcolor: "background.paper",
                  },
                }}
              />

              <TextField
                label="Password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                fullWidth
                variant="outlined"
                disabled={loading}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock color="action" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={handleTogglePasswordVisibility} edge="end" disabled={loading}>
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                    bgcolor: "background.paper",
                  },
                }}
              />

              <Button
                type="submit"
                variant="contained"
                size="large"
                disabled={loading || !username.trim() || !password}
                sx={{
                  py: 1.5,
                  borderRadius: 2,
                  fontWeight: "bold",
                  fontSize: "1.1rem",
                  textTransform: "none",
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
                {loading ? (
                  <>
                    <CircularProgress size={20} sx={{ mr: 1, color: "white" }} />
                    Signing In...
                  </>
                ) : (
                  "Sign In"
                )}
              </Button>
            </Box>
          </form>

          <Divider sx={{ my: 3 }} />

          {/* Additional Links */}
          <Box sx={{ textAlign: "center" }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Don't have an account?{" "}
              <Link
                to="/register"
                style={{
                  color: theme.palette.primary.main,
                  textDecoration: "none",
                  fontWeight: "bold",
                }}
              >
                Sign up here
              </Link>
            </Typography>

            <Typography variant="body2" color="text.secondary">
              <Link
                to="/forgot-password"
                style={{
                  color: theme.palette.secondary.main,
                  textDecoration: "none",
                }}
              >
                Forgot your password?
              </Link>
            </Typography>
          </Box>

          {/* Footer */}
          <Box sx={{ mt: 4, textAlign: "center" }}>
            <Typography variant="caption" color="text.secondary">
              Your trusted educational partner in Colombo
            </Typography>
          </Box>
        </Paper>
      </Fade>
    </Box>
  )
}
