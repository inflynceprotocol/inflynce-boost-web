'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAccount, useDisconnect } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import {
  Box,
  Typography,
  Container,
  IconButton,
  Button,
  Menu,
  MenuItem,
} from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import AddIcon from '@mui/icons-material/Add';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { formatUnits } from 'viem';
import { useReadContract } from 'wagmi';
import { USDC_BASE, BOOSTS_CONTRACT } from '@/lib/constants';
import { erc20Abi } from '@/lib/erc20';
import { AboutDialog } from './AboutDialog';
import { TopUpDialog } from './TopUpDialog';

export function Header() {
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const [walletMenuAnchor, setWalletMenuAnchor] = useState<null | HTMLElement>(null);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [topUpOpen, setTopUpOpen] = useState(false);

  const { data: allowance, refetch: refetchAllowance } = useReadContract({
    address: USDC_BASE,
    abi: erc20Abi,
    functionName: 'allowance',
    args: [address ?? '0x0000000000000000000000000000000000000000', BOOSTS_CONTRACT],
    query: { enabled: !!address },
  });

  const spendingLimit = allowance ? Number(formatUnits(allowance, 6)) : 0;

  return (
    <>
      <Box
        component="header"
        sx={{
          borderBottom: 1,
          borderColor: 'divider',
          bgcolor: 'background.default',
        }}
      >
        <Container maxWidth="lg">
          <Box
            sx={{
              py: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 2,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 1.5, textDecoration: 'none', color: 'inherit' }}>
                <Box
                  component="img"
                  src="/logo.png"
                  alt="Inflynce"
                  sx={{ width: 32, height: 32, objectFit: 'contain' }}
                />
                <Typography variant="h6" sx={{ fontWeight: 600, color: 'text.primary' }}>
                  Inflynce Protocol
                </Typography>
              </Link>
              <IconButton
                size="small"
                onClick={() => setAboutOpen(true)}
                sx={{ color: 'text.secondary' }}
                aria-label="About Inflynce Protocol"
              >
                <InfoOutlinedIcon fontSize="small" />
              </IconButton>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              {isConnected && address ? (
                <>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Typography variant="body2" color="text.primary">
                      Spending Limit: ${spendingLimit.toFixed(2)}
                    </Typography>
                    <IconButton
                      size="small"
                      onClick={() => setTopUpOpen(true)}
                      sx={{
                        color: 'primary.main',
                        bgcolor: 'rgba(255,107,0,0.15)',
                        '&:hover': { bgcolor: 'rgba(255,107,0,0.25)' },
                      }}
                      aria-label="Top up spending limit"
                    >
                      <AddIcon fontSize="small" />
                    </IconButton>
                  </Box>
                  <Button
                    variant="contained"
                    color="primary"
                    size="small"
                    endIcon={<ExpandMoreIcon />}
                    onClick={(e) => setWalletMenuAnchor(e.currentTarget)}
                    sx={{ textTransform: 'none' }}
                  >
                    0x...{address.slice(-4)}
                  </Button>
                  <Menu
                    anchorEl={walletMenuAnchor}
                    open={!!walletMenuAnchor}
                    onClose={() => setWalletMenuAnchor(null)}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                    transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                    PaperProps={{
                      sx: {
                        bgcolor: 'background.paper',
                        border: '1px solid',
                        borderColor: 'divider',
                      },
                    }}
                  >
                    <MenuItem
                      component={Link}
                      href="/faq"
                      onClick={() => setWalletMenuAnchor(null)}
                      sx={{ textDecoration: 'none', color: 'text.primary' }}
                    >
                      FAQ
                    </MenuItem>
                    <MenuItem
                      onClick={() => {
                        disconnect();
                        setWalletMenuAnchor(null);
                      }}
                    >
                      Disconnect
                    </MenuItem>
                  </Menu>
                </>
              ) : (
                <ConnectButton />
              )}
            </Box>
          </Box>
        </Container>
      </Box>

      <AboutDialog open={aboutOpen} onClose={() => setAboutOpen(false)} />

      {address && (
        <TopUpDialog
          open={topUpOpen}
          onClose={() => setTopUpOpen(false)}
          currentAllowance={allowance ?? null}
          refetchAllowance={refetchAllowance}
          address={address}
        />
      )}
    </>
  );
}
