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

function PrivateRoute({ user, children }) {
  return user ? children : <Navigate to="/login" replace />
}

function App() {
  const [user, setUser] = useState(null) // Store logged-in user info here
  const [loading, setLoading] = useState(true)

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

  // 🔧 Logout function
  const logout = () => {
    setUser(null)
    localStorage.removeItem("user")
    delete axios.defaults.headers.common["Authorization"]
  }

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
          element={
            <PrivateRoute user={user}>
              <OrderPage user={user} />
            </PrivateRoute>
          }
        />

        {/* Catch all route - redirect to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  )
}

export default App
