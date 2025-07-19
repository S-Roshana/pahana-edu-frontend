"use client"

import { useState, useEffect } from "react"
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import axios from "axios"
import LandingPage from "./pages/LandingPage"
import LoginPage from "./pages/LoginPage"
import RegisterPage from "./pages/RegisterPage"
import Dashboard from "./pages/Dashboard"
import BookListPage from "./pages/BookListPage"
import OrderPage from "./pages/OrderPage"
import ProfileEditPage from "./pages/ProfileEditPage"
import AdminLoginPage from "./pages/AdminLoginPage"
import AdminDashboard from "./pages/AdminDashboard"
import ManageBooksPage from "./pages/ManageBooksPage";
import ManageCustomersPage from "./pages/ManageCustomersPage";
import ViewOrdersPage from "./pages/ViewOrdersPage";
import BillingPage from "./pages/BillingPage";
import { jwtDecode } from "jwt-decode";
import { Snackbar, Alert } from "@mui/material";

function PrivateRoute({ user, children }) {
  return user ? children : <Navigate to="/login" replace />
}

function PrivateAdminRoute({ admin, children }) {
  return admin ? children : <Navigate to="/admin/login" replace />
}

function App() {
  const [user, setUser] = useState(null) // Store logged-in user info here
  const [loading, setLoading] = useState(true)
  const [admin, setAdmin] = useState(null)
  const [sessionExpired, setSessionExpired] = useState(false)

  // 🔧 Load user from localStorage on app start
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user")
      if (storedUser) {
        const userData = JSON.parse(storedUser)

        // Check if token exists and set user
        if (userData.token) {
          setUser(userData)
          // Set default authorization header for axios
          axios.defaults.headers.common["Authorization"] = `Bearer ${userData.token}`
        }
      }
    } catch (error) {
      console.error("Error loading user from localStorage:", error)
      localStorage.removeItem("user") // Clear corrupted data
    } finally {
      setLoading(false)
    }
  }, [])

  // 🔧 Save user to localStorage whenever user state changes
  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user))
      if (user.token) {
        axios.defaults.headers.common["Authorization"] = `Bearer ${user.token}`
      }
    } else {
      localStorage.removeItem("user")
      delete axios.defaults.headers.common["Authorization"]
    }
  }, [user])

  // 🔧 Load admin from localStorage
  useEffect(() => {
    const storedAdmin = localStorage.getItem("admin")
    if (storedAdmin) {
      const adminData = JSON.parse(storedAdmin)
      if (adminData.token) {
        setAdmin(adminData)
        axios.defaults.headers.common["Authorization"] = `Bearer ${adminData.token}`
      }
    }
  }, [])

  useEffect(() => {
    if (admin) {
      localStorage.setItem("admin", JSON.stringify(admin))
      if (admin.token) {
        axios.defaults.headers.common["Authorization"] = `Bearer ${admin.token}`
      }
    } else {
      localStorage.removeItem("admin")
      delete axios.defaults.headers.common["Authorization"]
    }
  }, [admin])

  const logout = () => {
    setUser(null)
    localStorage.removeItem("user")
    delete axios.defaults.headers.common["Authorization"]
  }

  const logoutAdmin = () => {
    setAdmin(null)
    localStorage.removeItem("admin")
    delete axios.defaults.headers.common["Authorization"]
  }

  // Helper to check token expiry
  const isTokenExpired = (token) => {
    try {
      const decoded = jwtDecode(token)
      if (!decoded.exp) return false
      // exp is in seconds, Date.now() in ms
      return Date.now() >= decoded.exp * 1000
    } catch {
      return false
    }
  }

  // Check token expiry on route change and periodically
  useEffect(() => {
    const checkExpiry = () => {
      // Check user
      const storedUser = localStorage.getItem("user")
      if (storedUser) {
        const userData = JSON.parse(storedUser)
        if (userData.token && isTokenExpired(userData.token)) {
          logout()
          setSessionExpired(true)
        }
      }
      // Check admin
      const storedAdmin = localStorage.getItem("admin")
      if (storedAdmin) {
        const adminData = JSON.parse(storedAdmin)
        if (adminData.token && isTokenExpired(adminData.token)) {
          logoutAdmin()
          setSessionExpired(true)
        }
      }
    }
    checkExpiry()
    const interval = setInterval(checkExpiry, 60 * 1000) // check every minute
    return () => clearInterval(interval)
  }, [])

  // Show loading while checking authentication
  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          fontSize: "18px",
          fontFamily: "Arial, sans-serif",
        }}
      >
        Loading...
      </div>
    )
  }

  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />

          {/* Redirect to books if already logged in */}
          <Route
            path="/login"
            element={user ? <Navigate to="/books" replace /> : <LoginPage setUser={setUser} user={user} />}
          />

<Route path="/register" element={<RegisterPage setUser={setUser} user={user} />} />

          <Route
            path="/dashboard"
            element={
              <PrivateRoute user={user}>
                <Dashboard user={user} logout={logout} />
              </PrivateRoute>
            }
          />

          <Route
            path="/profile/edit"
            element={
              <PrivateRoute user={user}>
                <ProfileEditPage user={user} setUser={setUser} />
              </PrivateRoute>
            }
          />

          {/* 🎯 FIX: Pass user prop to BookListPage */}
          <Route path="/books" element={<BookListPage user={user} logout={logout} />} />

          {/* Keep the old /order route for backward compatibility, but redirect to /books */}
          <Route path="/order" element={<Navigate to="/books" replace />} />

          <Route
            path="/order/:bookId"
            element={<OrderPage user={user} />}
          />

          <Route
            path="/admin/login"
            element={admin ? <Navigate to="/admin/dashboard" replace /> : <AdminLoginPage setAdmin={setAdmin} admin={admin} />}
          />
          <Route
            path="/admin/dashboard"
            element={
              <PrivateAdminRoute admin={admin}>
                <AdminDashboard admin={admin} logoutAdmin={logoutAdmin} />
              </PrivateAdminRoute>
            }
          />
          <Route path="/admin/books" element={<ManageBooksPage />} />
          <Route path="/admin/customers" element={<ManageCustomersPage />} />
          <Route path="/admin/orders" element={<ViewOrdersPage />} />
          <Route path="/admin/billing" element={<BillingPage />} />

          {/* Catch all route - redirect to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
      <Snackbar
        open={sessionExpired}
        autoHideDuration={6000}
        onClose={() => setSessionExpired(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity="warning" sx={{ width: '100%' }} onClose={() => setSessionExpired(false)}>
          Your session has expired. Please log in again.
        </Alert>
      </Snackbar>
    </>
  )
}

export default App
