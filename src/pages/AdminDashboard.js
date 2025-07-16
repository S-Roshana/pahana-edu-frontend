import React, { useState } from "react"
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Box,
  Button,
  Avatar,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  useTheme,
} from "@mui/material"
import {
  Menu as MenuIcon,
  Logout,
  Book,
  People,
  Receipt,
  MoreHoriz,
  AdminPanelSettings,
  AccountCircle,
} from "@mui/icons-material"

function AdminDashboard({ admin, logoutAdmin }) {
  const [anchorEl, setAnchorEl] = useState(null)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [selectedSection, setSelectedSection] = useState("books")
  const theme = useTheme()

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget)
  }
  const handleProfileMenuClose = () => {
    setAnchorEl(null)
  }
  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen)
  }
  const handleSectionChange = (section) => {
    setSelectedSection(section)
    setDrawerOpen(false)
  }

  // Placeholder content for each section
  const renderSection = () => {
    switch (selectedSection) {
      case "books":
        return <Box p={3}><Typography variant="h5">Book Management (CRUD)</Typography><Typography variant="body1">Coming soon...</Typography></Box>
      case "customers":
        return <Box p={3}><Typography variant="h5">Customer Account Details</Typography><Typography variant="body1">Coming soon...</Typography></Box>
      case "billing":
        return <Box p={3}><Typography variant="h5">Billing</Typography><Typography variant="body1">Coming soon...</Typography></Box>
      case "other":
        return <Box p={3}><Typography variant="h5">Other Admin Features</Typography><Typography variant="body1">Coming soon...</Typography></Box>
      default:
        return null
    }
  }

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f5f6fa" }}>
      <AppBar position="static" color="default" elevation={2}>
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={handleDrawerToggle} sx={{ mr: 2 }}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1, color: theme.palette.secondary.main }}>
            Admin Dashboard
          </Typography>
          <IconButton onClick={handleProfileMenuOpen} color="inherit">
            <Avatar sx={{ bgcolor: theme.palette.secondary.main }}>
              <AdminPanelSettings />
            </Avatar>
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleProfileMenuClose}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            transformOrigin={{ vertical: "top", horizontal: "right" }}
          >
            <MenuItem disabled>
              <AccountCircle sx={{ mr: 1 }} />
              {admin?.admin?.username || "Admin"}
            </MenuItem>
            <Divider />
            <MenuItem onClick={() => { handleProfileMenuClose(); logoutAdmin(); }}>
              <Logout sx={{ mr: 1, color: "error.main" }} /> Logout
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
      <Drawer anchor="left" open={drawerOpen} onClose={handleDrawerToggle}>
        <Box sx={{ width: 240 }} role="presentation" onClick={handleDrawerToggle}>
          <List>
            <ListItem button selected={selectedSection === "books"} onClick={() => handleSectionChange("books")}> <ListItemIcon><Book /></ListItemIcon> <ListItemText primary="Book Management" /> </ListItem>
            <ListItem button selected={selectedSection === "customers"} onClick={() => handleSectionChange("customers")}> <ListItemIcon><People /></ListItemIcon> <ListItemText primary="Customer Details" /> </ListItem>
            <ListItem button selected={selectedSection === "billing"} onClick={() => handleSectionChange("billing")}> <ListItemIcon><Receipt /></ListItemIcon> <ListItemText primary="Billing" /> </ListItem>
            <ListItem button selected={selectedSection === "other"} onClick={() => handleSectionChange("other")}> <ListItemIcon><MoreHoriz /></ListItemIcon> <ListItemText primary="Other Features" /> </ListItem>
          </List>
        </Box>
      </Drawer>
      <Box sx={{ maxWidth: 1200, mx: "auto", mt: 4, bgcolor: "white", borderRadius: 3, boxShadow: 2, minHeight: 400 }}>
        {renderSection()}
      </Box>
    </Box>
  )
}

export default AdminDashboard 