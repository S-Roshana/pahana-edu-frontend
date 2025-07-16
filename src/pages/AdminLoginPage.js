import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
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
import { Visibility, VisibilityOff, Person, Lock, AdminPanelSettings, ArrowBack } from "@mui/icons-material"

export default function AdminLoginPage({ setAdmin, admin }) {
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
    if (admin?.token) {
      navigate("/admin/dashboard")
    }
  }, [admin, navigate])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)
    try {
      const res = await axios.post("http://localhost:8080/api/auth/admin/login", {
        username: username.trim(),
        password,
      })
      const adminData = {
        ...res.data,
        loginTime: new Date().toISOString(),
      }
      setAdmin(adminData)
      localStorage.setItem("admin", JSON.stringify(adminData))
      if (adminData.token) {
        axios.defaults.headers.common["Authorization"] = `Bearer ${adminData.token}`
      }
      navigate("/admin/dashboard", {
        state: { message: "Admin login successful!" },
      })
    } catch (err) {
      if (err.response?.status === 401) {
        setError("Invalid admin username or password.")
      } else {
        setError("Admin login failed. Please try again.")
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
        background: "linear-gradient(135deg, #232526 0%, #414345 100%)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        p: 2,
        position: "relative",
      }}
    >
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
      <Fade in={isVisible}>
        <Paper
          elevation={24}
          sx={{
            p: 4,
            maxWidth: 450,
            width: "100%",
            borderRadius: 4,
            background: "rgba(255, 255, 255, 0.97)",
            backdropFilter: "blur(20px)",
            border: `1px solid ${alpha("#fff", 0.2)}`,
            position: "relative",
            zIndex: 2,
          }}
        >
          <Box sx={{ textAlign: "center", mb: 4 }}>
            <Box
              sx={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                width: 80,
                height: 80,
                bgcolor: theme.palette.secondary.main,
                borderRadius: "50%",
                mb: 2,
                boxShadow: 3,
              }}
            >
              <AdminPanelSettings sx={{ fontSize: 40, color: "white" }} />
            </Box>
            <Typography variant="h4" component="h1" sx={{ fontWeight: "bold", color: theme.palette.secondary.main, mb: 1 }}>
              Admin Login
            </Typography>
            <Typography variant="body1" sx={{ color: "text.secondary", fontStyle: "italic" }}>
              Sign in to Admin Dashboard
            </Typography>
          </Box>
          {error && (
            <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }} onClose={() => setError("")}>
              {error}
            </Alert>
          )}
          <form onSubmit={handleSubmit}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
              <TextField
                label="Admin Username"
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
                  background: "linear-gradient(45deg, #232526 30%, #414345 90%)",
                  "&:hover": {
                    background: "linear-gradient(45deg, #232526 30%, #232526 90%)",
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
                  "Sign In as Admin"
                )}
              </Button>
            </Box>
          </form>
          <Divider sx={{ my: 3 }} />
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2, textAlign: "center" }}>
            Not an admin? <span style={{ color: theme.palette.secondary.main, fontWeight: "bold" }} onClick={() => navigate("/login")}>Go to User Login</span>
          </Typography>
        </Paper>
      </Fade>
    </Box>
  )
} 