'use client';

import { useQuery } from '@tanstack/react-query';
import { useAccount } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  Avatar,
  AvatarGroup,
  Divider,
  CircularProgress,
  Stack,
  IconButton,
  Menu,
  MenuItem,
} from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PendingIcon from '@mui/icons-material/Pending';
import StopCircleIcon from '@mui/icons-material/StopCircle';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import { keyframes } from '@mui/material/styles';
import { getBoostsByWallet, type Boost } from '@/lib/getBoostsByWallet';

const allocatingSpin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

function formatSpent(amount: string | number | null | undefined): number {
  if (amount == null || amount === '') return 0;
  return Number(amount);
}

function StatusIcon({ status }: { status: string | null }) {
  switch (status) {
    case 'active':
      return <PlayCircleIcon sx={{ color: '#4CAF50', fontSize: 18 }} />;
    case 'completed':
      return <CheckCircleIcon sx={{ color: '#2196F3', fontSize: 18 }} />;
    case 'stopped':
      return <StopCircleIcon sx={{ color: '#F44336', fontSize: 18 }} />;
    case 'pending':
      return <PendingIcon sx={{ color: '#FF9800', fontSize: 18 }} />;
    case 'allocating':
      return (
        <AutorenewIcon
          sx={{
            color: '#9C27B0',
            fontSize: 18,
            animation: `${allocatingSpin} 1.2s linear infinite`,
          }}
        />
      );
    default:
      return null;
  }
}

function BoostCard({ boost }: { boost: Boost }) {
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const agg = boost.boostRecastRecordsAggregate?.aggregate;
  const confirmedAgg = boost.boostRecastRecordsAggregateConfirmed?.aggregate;
  const spentUsd = formatSpent(confirmedAgg?.sum?.creatorTotalCost);
  const engagementCount = agg?.count ?? 0;
  const maxBudget = Number(boost.maxBudget ?? 0);
  const creatorLabel = boost.creatorWallet
    ? `${boost.creatorWallet.slice(0, 6)}...${boost.creatorWallet.slice(-4)}`
    : 'Creator';
  const avatarLetters = boost.creatorWallet
    ? boost.creatorWallet.slice(2, 4).toUpperCase()
    : 'CR';

  return (
    <Paper
      sx={{
        p: 2,
        bgcolor: 'background.paper',
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 2,
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2 }}>
        <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
          <Avatar
            src={boost.user?.pfpUrl ?? undefined}
            alt={creatorLabel}
            sx={{
              width: 40,
              height: 40,
              mr: 1,
              bgcolor: 'primary.main',
              color: 'white',
              fontSize: 14,
            }}
          >
            {!boost.user?.pfpUrl && avatarLetters}
          </Avatar>
          <Box>
            <Typography variant="subtitle1" fontWeight={500}>
              {creatorLabel}
            </Typography>
          </Box>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 32,
              height: 32,
              borderRadius: '50%',
              bgcolor: 'rgba(255,255,255,0.1)',
            }}
          >
            <StatusIcon status={boost.boostStatus} />
          </Box>
          <IconButton
            size="small"
            onClick={(e) => setMenuAnchor(e.currentTarget)}
            sx={{ color: 'text.secondary' }}
            aria-label="Settings"
          >
            <SettingsIcon fontSize="small" />
          </IconButton>
          <Menu
            anchorEl={menuAnchor}
            open={!!menuAnchor}
            onClose={() => setMenuAnchor(null)}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          >
            <MenuItem
              component="a"
              href={boost.castUrl ?? '#'}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMenuAnchor(null)}
            >
              View Link
            </MenuItem>
          </Menu>
        </Box>
      </Box>

      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
        Spending: ${spentUsd.toFixed(3)} / ${maxBudget.toFixed(2)}
      </Typography>

      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <AvatarGroup
          total={engagementCount}
          max={8}
          sx={{ '& .MuiAvatar-root': { width: 28, height: 28, fontSize: 12 } }}
        >
          {(boost.boostRecastRecords ?? []).map((rec, i) => (
            <Avatar
              key={i}
              src={rec.user?.pfpUrl ?? ''}
              alt={rec.user?.displayName ?? ''}
              sx={{ width: 28, height: 28 }}
            />
          ))}
        </AvatarGroup>
      </Box>
    </Paper>
  );
}

export function MyBoosts({ onSwitchToBoost }: { onSwitchToBoost?: () => void }) {
  const { address, isConnected } = useAccount();
  const { data: boosts, isLoading } = useQuery({
    queryKey: ['boosts', 'wallet', address],
    queryFn: () => getBoostsByWallet(address!),
    enabled: !!address && isConnected,
  });

  const list = boosts ?? [];
  const totalSpent = list.reduce((sum, b) => {
    const confirmedAgg = b.boostRecastRecordsAggregateConfirmed?.aggregate;
    return sum + formatSpent(confirmedAgg?.sum?.creatorTotalCost);
  }, 0);

  const todayStart = new Date();
  todayStart.setUTCHours(0, 0, 0, 0);
  const todaySpent = 0; // Placeholder - would need date-filtered aggregate

  if (!isConnected || !address) {
    return (
      <Paper
        sx={{
          p: 4,
          textAlign: 'center',
          bgcolor: 'background.paper',
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 2,
        }}
      >
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          No boosts yet. Boost any link with USDC and track spend + results here.
        </Typography>
        <ConnectButton.Custom>
          {({ openConnectModal }) => (
            <Button
              variant="contained"
              color="primary"
              size="large"
              fullWidth
              onClick={openConnectModal}
              sx={{ py: 1.5 }}
            >
              Connect Wallet to Boost
            </Button>
          )}
        </ConnectButton.Custom>
      </Paper>
    );
  }

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%', maxWidth: 560 }}>
      {/* Spending summary - only when user has boosts */}
      {list.length > 0 && (
        <Paper
          sx={{
            p: 2,
            mb: 2,
            bgcolor: 'background.paper',
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 2,
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                Today&apos;s Spending
              </Typography>
              <Typography variant="h6" color="primary.main" fontWeight={600}>
                ${todaySpent.toFixed(3)}
              </Typography>
            </Box>
            <Divider orientation="vertical" flexItem sx={{ height: 40, borderColor: 'divider' }} />
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                Total Spending
              </Typography>
              <Typography variant="h6" color="primary.main" fontWeight={600}>
                ${totalSpent.toFixed(3)}
              </Typography>
            </Box>
          </Box>
        </Paper>
      )}

      {list.length === 0 ? (
        <Paper
          sx={{
            p: 4,
            textAlign: 'center',
            bgcolor: 'background.paper',
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 2,
          }}
        >
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            No boosts yet. Boost any link with USDC and track spend + results here.
          </Typography>
          <Button
            variant="contained"
            color="primary"
            size="large"
            fullWidth
            onClick={onSwitchToBoost}
            sx={{ py: 1.5 }}
          >
            Start Boosting
          </Button>
        </Paper>
      ) : (
        <Stack spacing={2}>
          {list.map((boost) => (
            <BoostCard key={boost.id} boost={boost} />
          ))}
        </Stack>
      )}
    </Box>
  );
}
