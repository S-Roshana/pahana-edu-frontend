"use client"

import React, { useState, useEffect } from "react"
import { Container, Typography, Box, Button, Grid, Paper, Card, Chip, Fade, Grow, useTheme, alpha } from "@mui/material"
import {
  School,
  People,
  CreditCard,
  LocalShipping,
  Security,
  Star,
  CheckCircle,
  ArrowForward,
  Phone,
  Email,
  LocationOn,
  MenuBook,
  TrendingUp,
  SupportAgent,
} from "@mui/icons-material"
import { useNavigate } from "react-router-dom"

const LandingPage = () => {
  const navigate = useNavigate()
  const theme = useTheme()
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const handleNavigation = (path) => {
    navigate(path)
  }

  const services = [
    {
      icon: <People sx={{ fontSize: 40 }} />,
      title: "Account Management",
      description: "Effortlessly create and manage your personalized bookshop account with our intuitive dashboard",
      color: theme.palette.primary.main,
    },
    {
      icon: <CreditCard sx={{ fontSize: 40 }} />,
      title: "Smart Billing",
      description: "Lightning-fast, accurate billing and invoicing system for all your educational purchases",
      color: theme.palette.success.main,
    },
    {
      icon: <MenuBook sx={{ fontSize: 40 }} />,
      title: "Premium Books",
      description: "Extensive collection of school and university books from top publishers worldwide",
      color: theme.palette.secondary.main,
    },
    {
      icon: <LocalShipping sx={{ fontSize: 40 }} />,
      title: "Fast Delivery",
      description: "Quick and reliable delivery service bringing your books right to your doorstep",
      color: theme.palette.warning.main,
    },
  ]

  const features = [
    {
      icon: <CheckCircle />,
      title: "Intuitive Platform",
      description: "User-friendly interface designed for seamless navigation and effortless book discovery",
    },
    {
      icon: <Security />,
      title: "Bank-Level Security",
      description: "Advanced encryption and secure authentication protecting your personal information",
    },
    {
      icon: <Star />,
      title: "Smart Automation",
      description: "Intelligent billing system with automated invoicing and payment processing",
    },
  ]

  // Updated with static metrics that don't change frequently
  const stats = [
    { number: "24/7", label: "Customer Support", icon: <SupportAgent />, color: theme.palette.primary.main },
    { number: "FREE", label: "Island-wide Delivery", icon: <LocalShipping />, color: theme.palette.success.main },
    { number: "15+", label: "Years Experience", icon: <TrendingUp />, color: theme.palette.info.main },
    { number: "100%", label: "Secure Payments", icon: <Security />, color: theme.palette.warning.main },
  ]

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      {/* Hero Section */}
      <Box
        sx={{
          background: "linear-gradient(135deg, #1976d2 0%, #9c27b0 50%, #1976d2 100%)",
          position: "relative",
          overflow: "hidden",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0,0,0,0.2)",
            zIndex: 1,
          },
        }}
      >
        <Container maxWidth="lg" sx={{ position: "relative", zIndex: 2, py: 10 }}>
          <Fade in={isVisible} timeout={1000}>
            <Box textAlign="center" color="white">
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
                <School sx={{ fontSize: 40, color: "white" }} />
              </Box>

              <Typography
                variant="h2"
                component="h1"
                sx={{
                  fontWeight: "bold",
                  mb: 2,
                  fontSize: { xs: "2.5rem", md: "4rem" },
                  textShadow: "2px 2px 4px rgba(0,0,0,0.3)",
                }}
              >
                Pahana Edu
              </Typography>

              <Typography
                variant="h4"
                sx={{
                  fontWeight: 300,
                  mb: 4,
                  fontSize: { xs: "1.5rem", md: "2rem" },
                  color: alpha("#fff", 0.9),
                }}
              >
                Bookshop
              </Typography>

              <Typography
                variant="h5"
                sx={{
                  mb: 6,
                  maxWidth: "800px",
                  mx: "auto",
                  lineHeight: 1.6,
                  fontSize: { xs: "1.1rem", md: "1.5rem" },
                  color: alpha("#fff", 0.95),
                }}
              >
                Colombo's most trusted educational partner — premium books, seamless billing, and exceptional service!
              </Typography>

              <Box
                sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, gap: 2, justifyContent: "center" }}
              >
                <Button
                  variant="contained"
                  size="large"
                  endIcon={<ArrowForward />}
                  onClick={() => handleNavigation("/login")}
                  sx={{
                    bgcolor: "white",
                    color: "primary.main",
                    px: 4,
                    py: 1.5,
                    fontSize: "1.1rem",
                    fontWeight: "bold",
                    boxShadow: 3,
                    "&:hover": {
                      bgcolor: alpha("#fff", 0.9),
                      transform: "translateY(-2px)",
                      boxShadow: 6,
                    },
                    transition: "all 0.3s ease",
                  }}
                >
                  Get Started
                </Button>

                <Button
                  variant="outlined"
                  size="large"
                  onClick={() => handleNavigation("/register")}
                  sx={{
                    borderColor: "white",
                    color: "white",
                    px: 4,
                    py: 1.5,
                    fontSize: "1.1rem",
                    fontWeight: "bold",
                    "&:hover": {
                      bgcolor: "white",
                      color: "primary.main",
                      transform: "translateY(-2px)",
                    },
                    transition: "all 0.3s ease",
                  }}
                >
                  Create Account
                </Button>

                <Button
                  variant="outlined"
                  size="large"
                  onClick={() => handleNavigation("/order")}
                  sx={{
                    borderColor: "white",
                    color: "white",
                    px: 4,
                    py: 1.5,
                    fontSize: "1.1rem",
                    fontWeight: "bold",
                    "&:hover": {
                      bgcolor: "white",
                      color: "primary.main",
                      transform: "translateY(-2px)",
                    },
                    transition: "all 0.3s ease",
                  }}
                >
                  Browse Books
                </Button>
              </Box>
            </Box>
          </Fade>
        </Container>

        {/* Wave decoration */}
        <Box
          sx={{
            position: "absolute",
            bottom: 0,
            left: 0,
            width: "100%",
            overflow: "hidden",
            lineHeight: 0,
            transform: "rotate(180deg)",
          }}
        >
          <svg
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
            style={{ position: "relative", display: "block", width: "100%", height: "60px" }}
          >
            <path
              d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z"
              fill="white"
            />
          </svg>
        </Box>
      </Box>

      {/* Stats Section - Fixed Alignment */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Grid container spacing={4} justifyContent="center" alignItems="center">
          {stats.map((stat, index) => (
            <Grid item xs={6} sm={3} md={3} key={index}>
              <Grow in={isVisible} timeout={1000 + index * 200}>
                <Paper
                  elevation={0}
                  sx={{
                    p: { xs: 2, sm: 3 },
                    textAlign: "center",
                    bgcolor: alpha(stat.color, 0.05),
                    border: `2px solid ${alpha(stat.color, 0.1)}`,
                    borderRadius: 3,
                    transition: "all 0.3s ease",
                    "&:hover": {
                      transform: "translateY(-8px)",
                      boxShadow: `0 12px 24px ${alpha(stat.color, 0.2)}`,
                      borderColor: stat.color,
                      bgcolor: alpha(stat.color, 0.1),
                    },
                  }}
                >
                  <Box sx={{ color: stat.color, mb: 2 }}>
                    {React.cloneElement(stat.icon, { sx: { fontSize: { xs: 32, sm: 40 } } })}
                  </Box>
                  <Typography
                    variant="h3"
                    component="div"
                    sx={{
                      fontWeight: "bold",
                      color: stat.color,
                      mb: 1,
                      fontSize: { xs: "1.8rem", sm: "2.5rem", md: "3rem" },
                    }}
                  >
                    {stat.number}
                  </Typography>
                  <Typography
                    variant="body1"
                    color="text.secondary"
                    sx={{
                      fontWeight: 500,
                      fontSize: { xs: "0.85rem", sm: "1rem" },
                    }}
                  >
                    {stat.label}
                  </Typography>
                </Paper>
              </Grow>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* About Section */}
      <Box sx={{ bgcolor: alpha(theme.palette.primary.main, 0.05), py: 10 }}>
        <Container maxWidth="lg">
          <Box textAlign="center" maxWidth="800px" mx="auto">
            <Chip
              label="About Us"
              sx={{
                mb: 3,
                bgcolor: alpha(theme.palette.primary.main, 0.1),
                color: "primary.main",
                fontWeight: "bold",
              }}
            />
            <Typography variant="h3" component="h2" sx={{ fontWeight: "bold", mb: 4, color: "text.primary" }}>
              Your Educational Success Partner
            </Typography>
            <Typography variant="h6" sx={{ lineHeight: 1.8, color: "text.secondary" }}>
              At Pahana Edu, we've been transforming educational experiences in Colombo for over a decade. Our
              cutting-edge online platform seamlessly integrates premium educational resources with intelligent account
              management, making learning accessible, affordable, and absolutely delightful.
            </Typography>
          </Box>
        </Container>
      </Box>

      {/* Services Section */}
      <Container maxWidth="xl" sx={{ py: 10 }}>
        <Box textAlign="center" mb={8}>
          <Chip
            label="Our Services"
            sx={{
              mb: 3,
              bgcolor: alpha(theme.palette.secondary.main, 0.1),
              color: "secondary.main",
              fontWeight: "bold",
            }}
          />
          <Typography variant="h3" component="h2" sx={{ fontWeight: "bold", mb: 3 }}>
            Everything You Need to Succeed
          </Typography>
          <Typography variant="h6" color="text.secondary" maxWidth="600px" mx="auto">
            Comprehensive educational solutions designed to empower your learning journey
          </Typography>
        </Box>

        <Grid container spacing={4} justifyContent="center" alignItems="stretch">
          {services.map((service, index) => (
            <Grid item xs={12} sm={6} md={6} lg={3} key={index}>
              <Grow in={isVisible} timeout={1200 + index * 200}>
                <Card
                  elevation={0}
                  sx={{
                    height: "100%",
                    p: 3,
                    textAlign: "center",
                    border: "1px solid",
                    borderColor: alpha(service.color, 0.2),
                    borderRadius: 3,
                    transition: "all 0.3s ease",
                    "&:hover": {
                      transform: "translateY(-10px)",
                      boxShadow: `0 20px 40px ${alpha(service.color, 0.2)}`,
                      borderColor: service.color,
                    },
                  }}
                >
                  <Box
                    sx={{
                      width: 80,
                      height: 80,
                      borderRadius: "50%",
                      bgcolor: alpha(service.color, 0.1),
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      mx: "auto",
                      mb: 3,
                      color: service.color,
                      transition: "all 0.3s ease",
                    }}
                  >
                    {service.icon}
                  </Box>
                  <Typography variant="h6" component="h3" sx={{ fontWeight: "bold", mb: 2 }}>
                    {service.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                    {service.description}
                  </Typography>
                </Card>
              </Grow>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Features Section */}
      <Box
        sx={{
          background: "linear-gradient(135deg, #1976d2 0%, #9c27b0 100%)",
          py: 10,
          color: "white",
        }}
      >
        <Container maxWidth="lg">
          <Box textAlign="center" mb={8}>
            <Chip
              label="Why Choose Us"
              sx={{
                mb: 3,
                bgcolor: alpha("#fff", 0.2),
                color: "white",
                fontWeight: "bold",
              }}
            />
            <Typography variant="h3" component="h2" sx={{ fontWeight: "bold", mb: 3 }}>
              The Pahana Edu Advantage
            </Typography>
            <Typography variant="h6" sx={{ color: alpha("#fff", 0.9), maxWidth: "600px", mx: "auto" }}>
              Experience the difference with our premium features and exceptional service
            </Typography>
          </Box>

          <Grid container spacing={4}>
            {features.map((feature, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 2,
                    p: 3,
                    bgcolor: alpha("#fff", 0.1),
                    borderRadius: 2,
                    backdropFilter: "blur(10px)",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      bgcolor: alpha("#fff", 0.2),
                      transform: "translateY(-5px)",
                    },
                  }}
                >
                  <Box sx={{ color: "#4caf50", mt: 0.5 }}>
                    {React.cloneElement(feature.icon, { sx: { fontSize: 24 } })}
                  </Box>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
                      {feature.title}
                    </Typography>
                    <Typography variant="body2" sx={{ color: alpha("#fff", 0.9), lineHeight: 1.6 }}>
                      {feature.description}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Contact Section */}
      <Box sx={{ bgcolor: "#1a1a1a", color: "white", py: 10 }}>
        <Container maxWidth="lg">
          <Box textAlign="center" mb={8}>
            <Typography variant="h3" component="h2" sx={{ fontWeight: "bold", mb: 2 }}>
              Get in Touch
            </Typography>
            <Typography variant="h6" sx={{ color: alpha("#fff", 0.7) }}>
              Ready to start your educational journey with us?
            </Typography>
          </Box>

          <Grid container spacing={6}>
            <Grid item xs={12} md={4}>
              <Box textAlign="center">
                <Box
                  sx={{
                    width: 60,
                    height: 60,
                    borderRadius: "50%",
                    bgcolor: "primary.main",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mx: "auto",
                    mb: 3,
                  }}
                >
                  <LocationOn sx={{ fontSize: 30 }} />
                </Box>
                <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
                  Visit Us
                </Typography>
                <Typography variant="body1" sx={{ color: alpha("#fff", 0.7) }}>
                  123 Main Street
                  <br />
                  Colombo, Sri Lanka
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={12} md={4}>
              <Box textAlign="center">
                <Box
                  sx={{
                    width: 60,
                    height: 60,
                    borderRadius: "50%",
                    bgcolor: "success.main",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mx: "auto",
                    mb: 3,
                  }}
                >
                  <Phone sx={{ fontSize: 30 }} />
                </Box>
                <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
                  Call Us
                </Typography>
                <Typography variant="body1" sx={{ color: alpha("#fff", 0.7) }}>
                  011-2345678
                  <br />
                  Available 9 AM - 6 PM
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={12} md={4}>
              <Box textAlign="center">
                <Box
                  sx={{
                    width: 60,
                    height: 60,
                    borderRadius: "50%",
                    bgcolor: "secondary.main",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mx: "auto",
                    mb: 3,
                  }}
                >
                  <Email sx={{ fontSize: 30 }} />
                </Box>
                <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
                  Email Us
                </Typography>
                <Typography variant="body1" sx={{ color: alpha("#fff", 0.7) }}>
                  info@pahanaedu.lk
                  <br />
                  Quick response guaranteed
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Footer */}
      <Box sx={{ bgcolor: "#000", color: "white", py: 4 }}>
        <Container maxWidth="lg">
          <Box textAlign="center">
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 1, mb: 2 }}>
              <School sx={{ color: "primary.main" }} />
              <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                Pahana Edu Bookshop
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ color: alpha("#fff", 0.6) }}>
              © 2024 Pahana Edu Bookshop. All rights reserved. Empowering education, one book at a time.
            </Typography>
          </Box>
        </Container>
      </Box>
    </Box>
  )
}

export default LandingPage
