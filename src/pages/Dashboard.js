// src/pages/Dashboard.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';

import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import { useNavigate } from 'react-router-dom';

export default function Dashboard({ user }) {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;
    axios.get(`http://localhost:8080/api/orders/byCustomer/${user.contactNo}`)
      .then(res => setOrders(res.data))
      .catch(console.error);
  }, [user]);

  if (!user) {
    return React.createElement(
      Typography,
      { variant: 'h6', align: 'center', sx: { mt: 4 } },
      'Loading...'
    );
  }

  return React.createElement(
    Box,
    {
      sx: {
        minHeight: '100vh',
        bgcolor: '#f5f3f0',
        p: 3,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      },
    },
    React.createElement(
      Paper,
      {
        elevation: 4,
        sx: {
          p: 3,
          maxWidth: 600,
          width: '100%',
          borderRadius: 3,
          bgcolor: '#fff8f0',
          mb: 3,
        },
      },
      React.createElement(
        Box,
        { sx: { display: 'flex', alignItems: 'center', gap: 2 } },
        React.createElement(Avatar, {
          alt: user.name,
          src: user.profilePicUrl || 'https://via.placeholder.com/100',
          sx: { width: 80, height: 80 },
        }),
        React.createElement(
          Box,
          null,
          React.createElement(
            Typography,
            { variant: 'h5', sx: { fontFamily: "'Georgia', serif", color: '#8b5e3c' } },
            user.name
          ),
          React.createElement(
            Typography,
            { variant: 'body1', sx: { color: '#6b4c35' } },
            `Contact: ${user.contactNo}`
          ),
          React.createElement(
            Typography,
            { variant: 'body2', sx: { color: '#6b4c35' } },
            `Address: ${user.address}`
          )
        )
      ),
      React.createElement(
        Button,
        {
          variant: 'outlined',
          color: 'primary',
          sx: { mt: 2 },
          onClick: () => navigate('/profile/edit')
        },
        'Edit Profile'
      )
    ),

    React.createElement(
      Paper,
      {
        elevation: 2,
        sx: {
          p: 2,
          maxWidth: 600,
          width: '100%',
          borderRadius: 3,
          bgcolor: '#ffffff',
        },
      },
      React.createElement(
        Typography,
        { variant: 'h6', sx: { color: '#8b5e3c', mb: 1 } },
        'Your Order History'
      ),
      orders.length === 0
        ? React.createElement(
            Typography,
            { variant: 'body2', sx: { color: '#777' } },
            'No orders found.'
          )
        : React.createElement(
            List,
            null,
            orders.map(order =>
              React.createElement(
                ListItem,
                { key: order.id, sx: { borderBottom: '1px solid #eee' } },
                React.createElement(ListItemText, {
                  primary: `${order.bookTitle} (x${order.quantity})`,
                  secondary: `Total: $${order.totalPrice.toFixed(2)} | ${new Date(order.orderDate).toLocaleString()}`,
                })
              )
            )
          )
    )
  );
}
