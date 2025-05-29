import React from 'react';
import { Box, CssBaseline } from '@mui/material';

type BlankLayoutProps = {
  children: React.ReactNode;
};

export default function BlankLayout({ children }: BlankLayoutProps) {
  return (
    <Box sx={{
      minHeight: '100vh',
      bgcolor: '#f9f9f9',
      minWidth: '100vw',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundImage: 'url("/images/bg-blank-layout.png")',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    }}>
      <CssBaseline />
      {children}
    </Box>
  );
}
