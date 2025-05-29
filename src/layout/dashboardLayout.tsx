import React, { useState } from 'react';
import { Box, CssBaseline } from '@mui/material';
import Sidebar from '../components/sideBar';
import Header from '../components/Header';

type DashboardLayoutProps = {
  children: React.ReactNode;
};

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const drawerWidthOpen = 240;
  const drawerWidthClosed = 64;

  const toggleDrawer = () => {
    setSidebarOpen((prev) => !prev);
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', width: '100vw' }}>
      <CssBaseline />
      <Sidebar open={sidebarOpen} toggleDrawer={toggleDrawer} />
      <Box
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          ml: `${sidebarOpen ? drawerWidthOpen : drawerWidthClosed}px`,
          transition: 'margin-left 0.9s ease',
        }}
      >
        <Header />
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            bgcolor: '#f9f9f9',
            transition: 'all 0.5s ease',
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
}
