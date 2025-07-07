// src/pages/ProfileEditPage.js

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

export default function ProfileEditPage({ user, setUser }) {
  const [form, setForm] = useState({
    name: '',
    contactNo: '',
    address: '',
    profilePicUrl: '',
    username: '',
    password: '',
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || '',
        contactNo: user.contactNo || '',
        address: user.address || '',
        profilePicUrl: user.profilePicUrl || '',
        username: user.username || '',
        password: user.password || '',
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put(`http://localhost:8080/api/customers/${user.id}`, form);
      setUser(res.data);
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      setError('Failed to update profile');
    }
  };

  return React.createElement(
    Box,
    {
      sx: {
        minHeight: '100vh',
        bgcolor: '#f5f3f0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2,
      },
    },
    React.createElement(
      Paper,
      {
        elevation: 4,
        sx: {
          p: 3,
          maxWidth: 500,
          width: '100%',
          borderRadius: 3,
          bgcolor: '#fff8f0',
        },
      },
      React.createElement(
        Typography,
        {
          variant: 'h5',
          align: 'center',
          gutterBottom: true,
          sx: { fontFamily: "'Georgia', serif", color: '#8b5e3c' },
        },
        'Edit Your Profile'
      ),
      React.createElement(
        'form',
        { onSubmit: handleSubmit, style: { display: 'flex', flexDirection: 'column', gap: 16 } },
        React.createElement(TextField, {
          name: 'name',
          label: 'Name',
          value: form.name,
          onChange: handleChange,
          required: true,
          fullWidth: true,
        }),
        React.createElement(TextField, {
          name: 'contactNo',
          label: 'Contact No',
          value: form.contactNo,
          onChange: handleChange,
          required: true,
          fullWidth: true,
        }),
        React.createElement(TextField, {
          name: 'address',
          label: 'Address',
          value: form.address,
          onChange: handleChange,
          fullWidth: true,
        }),
        React.createElement(TextField, {
          name: 'profilePicUrl',
          label: 'Profile Picture URL',
          value: form.profilePicUrl,
          onChange: handleChange,
          fullWidth: true,
        }),
        React.createElement(TextField, {
          name: 'username',
          label: 'Username',
          value: form.username,
          onChange: handleChange,
          required: true,
          fullWidth: true,
        }),
        React.createElement(TextField, {
          name: 'password',
          label: 'Password',
          type: 'password',
          value: form.password,
          onChange: handleChange,
          required: true,
          fullWidth: true,
        }),
        error && React.createElement(Typography, { color: 'error', align: 'center' }, error),
        React.createElement(Button, {
          type: 'submit',
          variant: 'contained',
          color: 'primary',
          sx: { mt: 2 },
        }, 'Update Profile')
      )
    )
  );
}
