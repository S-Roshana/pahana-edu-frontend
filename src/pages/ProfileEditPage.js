"use client"

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';



// MUI Components
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
  InputAdornment,
  IconButton,
  Fade,
  useTheme,
  alpha,
  Avatar,
  Divider,
  Snackbar,
} from '@mui/material';

// MUI Icons
import {
  Visibility,
  VisibilityOff,
  Person,
  Lock,
  School,
  ArrowBack,
  Phone,
  LocationOn,
  AccountCircle,
  Edit,
  Save,
} from '@mui/icons-material';

const jwtDecode = typeof window !== 'undefined' ? require('jwt-decode') : null;

export default function ProfileEditPage({ user, setUser }) {
  const navigate = useNavigate();
  const theme = useTheme();
  

  // Form state
  const [form, setForm] = useState({
    name: '',
    contactNo: '',
    address: '',
    profilePicUrl: '',
    username: '',
    password: '',
  });
  
  // UI state
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [success, setSuccess] = useState(false);

  // Update form state whenever user prop changes
useEffect(() => {
    setIsVisible(true);
    if (user && user.customer) { // Use user.customer since login returns { customer, token, role }
      setForm({
        name: user.customer.name || '',
        contactNo: user.customer.contactNo || '',
        address: user.customer.address || '',
        username: user.customer.username || '',
        password: '', // Do not pre-fill password for security
      });
    } else {
      setSuccess('Please log in again.');
    }
  }, [user]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const customerId = user?.customer?.id || user?.id;
      const res = await axios.put(`http://localhost:8080/api/customers/${customerId}`, form);
      setUser(res.data);
      setSuccess(true);
      // Delay redirection to show success message for 5 seconds
      setTimeout(() => {
        localStorage.removeItem('token'); // Adjust based on your storage
        setUser(null);
        navigate('/login');
      }, 5000); // 5000 milliseconds = 5 seconds
    } catch (err) {
      console.error(err);
      setError('Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        p: 2,
        position: 'relative',
      }}
    >
      {/* Background decoration */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.1)',
          zIndex: 1,
        }}
      />

      {/* Back button */}
      <IconButton
        onClick={handleGoBack}
        sx={{
          position: 'absolute',
          top: 20,
          left: 20,
          color: 'white',
          bgcolor: alpha('#fff', 0.2),
          backdropFilter: 'blur(10px)',
          zIndex: 3,
          '&:hover': {
            bgcolor: alpha('#fff', 0.3),
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
            maxWidth: 500,
            width: '100%',
            borderRadius: 4,
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(20px)',
            border: `1px solid ${alpha('#fff', 0.2)}`,
            position: 'relative',
            zIndex: 2,
          }}
        >
          {/* Logo and Title */}
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Box
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 80,
                height: 80,
                bgcolor: theme.palette.primary.main,
                borderRadius: '50%',
                mb: 2,
                boxShadow: 3,
              }}
            >
              <Edit sx={{ fontSize: 40, color: 'white' }} />
            </Box>

            <Typography
              variant="h4"
              component="h1"
              sx={{
                fontWeight: 'bold',
                color: theme.palette.primary.main,
                mb: 1,
              }}
            >
              Edit Your Profile
            </Typography>

            <Typography
              variant="body1"
              sx={{
                color: 'text.secondary',
                fontStyle: 'italic',
              }}
            >
              Update your information and keep your profile current
            </Typography>
          </Box>

          {/* Error Alert */}
          {error && (
            <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }} onClose={() => setError('')}>
              {error}
            </Alert>
          )}

          {/* Profile Form */}
          <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {/* Profile Picture Preview */}
            {form.profilePicUrl && (
              <Box sx={{ textAlign: 'center', mb: 2 }}>
                <Avatar
                  src={form.profilePicUrl}
                  sx={{
                    width: 80,
                    height: 80,
                    mx: 'auto',
                    mb: 1,
                    border: `3px solid ${theme.palette.primary.main}`,
                  }}
                />
                <Typography variant="caption" color="text.secondary">
                  Profile Picture Preview
                </Typography>
              </Box>
            )}

            {/* Full Name */}
            <TextField
              name="name"
              label="Full Name"
              value={form.name}
              onChange={handleChange}
              required
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Person color="action" />
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  '&:hover fieldset': {
                    borderColor: theme.palette.primary.main,
                  },
                },
              }}
            />

            {/* Username */}
            <TextField
              name="username"
              label="Username"
              value={form.username}
              onChange={handleChange}
              required
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <AccountCircle color="action" />
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  '&:hover fieldset': {
                    borderColor: theme.palette.primary.main,
                  },
                },
              }}
            />

            {/* Password */}
            <TextField
              name="password"
              label="Password"
              type={showPassword ? 'text' : 'password'}
              value={form.password}
              onChange={handleChange}
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock color="action" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={handleTogglePasswordVisibility}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  '&:hover fieldset': {
                    borderColor: theme.palette.primary.main,
                  },
                },
              }}
            />

            {/* Contact Number */}
            <TextField
              name="contactNo"
              label="Contact Number"
              value={form.contactNo}
              onChange={handleChange}
              required
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Phone color="action" />
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  '&:hover fieldset': {
                    borderColor: theme.palette.primary.main,
                  },
                },
              }}
            />

            {/* Address */}
            <TextField
              name="address"
              label="Address"
              value={form.address}
              onChange={handleChange}
              fullWidth
              multiline
              rows={2}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LocationOn color="action" />
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  '&:hover fieldset': {
                    borderColor: theme.palette.primary.main,
                  },
                },
              }}
            />

            {/* Profile Picture URL */}


            {/* Submit Button */}
            <Button
              type="submit"
              variant="contained"
              size="large"
              disabled={loading}
              sx={{
                mt: 3,
                py: 1.5,
                borderRadius: 2,
                fontSize: '1.1rem',
                fontWeight: 'bold',
                textTransform: 'none',
                background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
                boxShadow: '0 3px 5px 2px rgba(102, 126, 234, .3)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #5a6fd8 30%, #6a4190 90%)',
                },
              }}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                <>
                  <Save sx={{ mr: 1 }} />
                  Save Changes
                </>
              )}
            </Button>

            {/* Cancel Button */}
            <Button
              variant="outlined"
              size="large"
              onClick={handleGoBack}
              sx={{
                mt: 1,
                py: 1.5,
                borderRadius: 2,
                fontSize: '1rem',
                textTransform: 'none',
                borderColor: theme.palette.primary.main,
                color: theme.palette.primary.main,
                '&:hover': {
                  borderColor: theme.palette.primary.dark,
                  backgroundColor: alpha(theme.palette.primary.main, 0.04),
                },
              }}
            >
              Cancel
            </Button>
          </Box>
        </Paper>
      </Fade>
      <Snackbar
        open={success}
        autoHideDuration={4000}
        onClose={() => setSuccess(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        message="Profile updated successfully!"
      />
    </Box>
  );
}