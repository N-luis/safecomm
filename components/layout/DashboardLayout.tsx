'use client';

import { useState, ReactNode } from 'react';
import { Box } from '@mui/material';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import { useDashboardStore } from '@/store/dashboardStore';
import { motion } from 'framer-motion';

const SIDEBAR_WIDTH = 260;
const COLLAPSED_WIDTH = 72;

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { sidebarCollapsed } = useDashboardStore();
  const sidebarWidth = sidebarCollapsed ? COLLAPSED_WIDTH : SIDEBAR_WIDTH;

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar mobileOpen={mobileOpen} onMobileClose={() => setMobileOpen(false)} />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          ml: { xs: 0, md: `${sidebarWidth}px` },
          transition: 'margin-left 0.25s cubic-bezier(0.4,0,0.2,1)',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Navbar onMobileMenuOpen={() => setMobileOpen(true)} />
        <Box
          component={motion.div}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          sx={{
            flexGrow: 1,
            p: { xs: 2, sm: 3 },
            mt: '64px',
            background: 'background.default',
            minHeight: 'calc(100vh - 64px)',
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
}
