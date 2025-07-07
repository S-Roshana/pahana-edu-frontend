// src/pages/LoginPage.js

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// MUI imports
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';

export default function LoginPage(props) {
  const { setUser, user } = props;
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (user) navigate('/dashboard');
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:8080/api/auth/login', {
        username,
        password,
      });
      setUser(res.data);
      navigate('/dashboard');
    } catch (err) {
      setError('Invalid username or password');
    }
  };

  return React.createElement(
    Box,
    {
      sx: {
        minHeight: '100vh',
        bgcolor: '#f5f3f0', // soft warm background
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        p: 2,
      },
    },
    React.createElement(
      Paper,
      {
        elevation: 6,
        sx: {
          p: 4,
          maxWidth: 400,
          width: '100%',
          borderRadius: 3,
          boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
          background: '#fff8f0', // subtle cream background inside card
        },
      },
      React.createElement(
        Typography,
        {
          variant: 'h4',
          component: 'h1',
          align: 'center',
          gutterBottom: true,
          sx: { fontFamily: "'Georgia', serif", color: '#8b5e3c' }, // classic bookshop font/color
        },
        'Pahana Edu Login'
      ),
      React.createElement(
        'form',
        { onSubmit: handleSubmit, style: { display: 'flex', flexDirection: 'column', gap: 16 } },
        React.createElement(TextField, {
          label: 'Username',
          value: username,
          onChange: (e) => setUsername(e.target.value),
          required: true,
          fullWidth: true,
          variant: 'outlined',
          sx: { bgcolor: '#fff', borderRadius: 1 },
          autoFocus: true,
        }),
        React.createElement(TextField, {
          label: 'Password',
          type: 'password',
          value: password,
          onChange: (e) => setPassword(e.target.value),
          required: true,
          fullWidth: true,
          variant: 'outlined',
          sx: { bgcolor: '#fff', borderRadius: 1 },
        }),
        error && React.createElement(Typography, { color: 'error', align: 'center' }, error),
        React.createElement(
          Button,
          { type: 'submit', variant: 'contained', color: 'primary', size: 'large', sx: { mt: 2 } },
          'Login'
        ),
        React.createElement(
          Typography,
          { variant: 'body2', align: 'center', sx: { mt: 2, color: '#8b5e3c' } },
          'Welcome back to Pahana Edu — your trusted Colombo bookshop.'
        )
      )
    )
  );
}
