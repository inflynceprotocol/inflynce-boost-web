'use client';

import { useState } from 'react';
import { BoostForm } from '@/components/BoostForm';
import { MyBoosts } from '@/components/MyBoosts';
import { EarnTab } from '@/components/EarnTab';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Box, Typography, Tabs, Tab } from '@mui/material';

export default function Home() {
  const [tab, setTab] = useState(0);

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: 'background.default',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Header />

      <Box
        component="main"
        sx={{
          flex: 1,
          py: 4,
          px: 2,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Box sx={{ width: '100%', maxWidth: 560, mb: 3, textAlign: 'center' }}>
          <Typography variant="body1" sx={{ mb: 2, color: 'text.primary' }}>
            You can{' '}
            <Box component="span" sx={{ color: 'primary.main', fontWeight: 600 }}>
              BOOST
            </Box>{' '}
            any link (tweet, project website etc.) to get visibility.
          </Typography>

          {/* Process flow: Connect Wallet -> Approve USDC -> Launch Boost */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 1,
              mb: 3,
            }}
          >
            <Box
              sx={{
                px: 2,
                py: 1,
                borderRadius: 1,
                bgcolor: 'rgba(255,255,255,0.08)',
                border: '1px solid',
                borderColor: 'primary.main',
                color: 'primary.main',
                fontWeight: 600,
                fontSize: 14,
              }}
            >
              Connect Wallet
            </Box>
            <Typography color="text.secondary">→</Typography>
            <Box
              sx={{
                px: 2,
                py: 1,
                borderRadius: 1,
                bgcolor: 'rgba(255,255,255,0.08)',
                border: '1px solid',
                borderColor: 'primary.main',
                color: 'primary.main',
                fontWeight: 600,
                fontSize: 14,
              }}
            >
              Approve USDC
            </Box>
            <Typography color="text.secondary">→</Typography>
            <Box
              sx={{
                px: 2,
                py: 1,
                borderRadius: 1,
                bgcolor: 'rgba(255,255,255,0.08)',
                border: '1px solid',
                borderColor: 'primary.main',
                color: 'primary.main',
                fontWeight: 600,
                fontSize: 14,
              }}
            >
              Launch Boost
            </Box>
          </Box>
        </Box>

        <Tabs
          value={tab}
          onChange={(_, v) => setTab(v)}
          sx={{
            mb: 3,
            width: '100%',
            maxWidth: 560,
            borderBottom: 1,
            borderColor: 'divider',
            '& .MuiTab-root': { fontWeight: 600, textTransform: 'none', fontSize: 16 },
            '& .Mui-selected': { color: 'primary.main' },
            '& .MuiTabs-indicator': { backgroundColor: 'primary.main', height: 3 },
            '& .MuiTabs-flexContainer': { justifyContent: 'center' },
          }}
        >
          <Tab label="BOOST" />
          <Tab label="My Boosts" />
          <Tab label="Earn" />
        </Tabs>

        {tab === 0 && (
          <Box sx={{ width: '100%', maxWidth: 560 }}>
            <BoostForm />
          </Box>
        )}

        {tab === 1 && (
          <Box sx={{ width: '100%', maxWidth: 560 }}>
            <MyBoosts onSwitchToBoost={() => setTab(0)} />
          </Box>
        )}

        {tab === 2 && (
          <Box sx={{ width: '100%', maxWidth: 560 }}>
            <EarnTab />
          </Box>
        )}
      </Box>

      <Footer />

    </Box>
  );
}
