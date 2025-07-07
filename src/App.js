import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import Dashboard from "./pages/Dashboard";
import BookListPage from './pages/BookListPage';
import OrderPage from './pages/OrderPage';
import ProfileEditPage from "./pages/ProfileEditPage";


function PrivateRoute({ user, children }) {
  return user ? children : <Navigate to="/login" replace />;
}

function App() {
  const [user, setUser] = useState(null); // Store logged-in user info here

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage setUser={setUser} />} />
        <Route path="/register" element={<RegisterPage setUser={setUser} />} />

        <Route 
          path="/dashboard" 
          element={
            <PrivateRoute user={user}>
              <Dashboard user={user} />
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


        <Route path="/order" element={<BookListPage />} />
        <Route path="/order/:bookId" element={<OrderPage user={user} />} />
        

      </Routes>
    </Router>
  );
}

export default App;
