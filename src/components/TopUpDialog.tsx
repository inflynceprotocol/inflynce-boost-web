'use client';

import {
  Dialog,
  DialogTitle,
  DialogContent,
  Button,
  Typography,
  Box,
  CircularProgress,
  Stack,
  TextField,
  IconButton,
  InputAdornment,
} from '@mui/material';
import { useState, useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import CloseIcon from '@mui/icons-material/Close';
import { formatUnits, parseUnits } from 'viem';
import { useWriteContract } from 'wagmi';
import { useWaitForTransactionReceipt } from 'wagmi';
import { base } from 'wagmi/chains';
import { USDC_BASE, BOOSTS_CONTRACT } from '@/lib/constants';
import { erc20Abi } from '@/lib/erc20';
import { formatTxError } from '@/lib/formatTxError';

interface TopUpDialogProps {
  open: boolean;
  onClose: () => void;
  currentAllowance: bigint | null;
  refetchAllowance: () => void;
  address: string;
}

const budgetOptions = [
  [5, 10, 25],
  [50, 100, 250],
];

export function TopUpDialog({
  open,
  onClose,
  currentAllowance,
  refetchAllowance,
  address,
}: TopUpDialogProps) {
  const [budget, setBudget] = useState('5');
  const [error, setError] = useState<string | null>(null);
  const [isApproving, setIsApproving] = useState(false);
  const [isRevoking, setIsRevoking] = useState(false);
  const [hash, setHash] = useState<`0x${string}` | undefined>(undefined);

  const queryClient = useQueryClient();
  const { writeContractAsync } = useWriteContract();

  const personalBalance = Number(formatUnits(currentAllowance ?? BigInt(0), 6));

  const { data: receipt } = useWaitForTransactionReceipt({ hash, chainId: base.id });

  // Refresh allowance when dialog opens
  useEffect(() => {
    if (open) {
      refetchAllowance();
    }
  }, [open, refetchAllowance]);

  useEffect(() => {
    if (receipt?.status === 'success') {
      void refetchAllowance();
      queryClient.invalidateQueries({ queryKey: ['readContract'] });
      setHash(undefined);
      setIsApproving(false);
      setIsRevoking(false);
    }
  }, [receipt, refetchAllowance, queryClient]);

  const handleBudgetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9.]/g, '');
    const numValue = parseFloat(value);
    setBudget(value === '' || isNaN(numValue) ? '' : Math.max(1, numValue).toString());
    setError(null);
  };

  const handleApprove = async () => {
    const num = parseFloat(budget);
    if (isNaN(num) || num < 5) {
      setError('Budget must be at least $5');
      return;
    }
    setError(null);
    setIsApproving(true);
    try {
      const txHash = await writeContractAsync({
        address: USDC_BASE,
        abi: erc20Abi,
        functionName: 'approve',
        args: [BOOSTS_CONTRACT, parseUnits(budget, 6)],
      });
      setHash(txHash);
    } catch (err) {
      const msg = formatTxError(err);
      if (msg) setError(msg);
      setIsApproving(false);
    }
  };

  const handleRevoke = async () => {
    setIsRevoking(true);
    try {
      const txHash = await writeContractAsync({
        address: USDC_BASE,
        abi: erc20Abi,
        functionName: 'approve',
        args: [BOOSTS_CONTRACT, BigInt(0)],
      });
      setHash(txHash);
    } catch (err) {
      const msg = formatTxError(err);
      if (msg) setError(msg);
      setIsRevoking(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          bgcolor: 'background.paper',
          border: '1px solid',
          borderColor: 'divider',
          minWidth: 320,
        },
      }}
    >
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">Top Up Your Spending</Typography>
          <IconButton onClick={onClose} size="small" sx={{ color: 'text.secondary' }}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent>
        <Stack spacing={3}>
          <Box>
            <Typography variant="subtitle1" color="primary" sx={{ mb: 1 }}>
              Your Spending Limit: ${personalBalance.toFixed(2)}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Choose how much you want to approve for your marketing campaign. This amount will be
              used to reward eligible users, with a $5 minimum.
            </Typography>
            <TextField
              fullWidth
              value={budget}
              onChange={handleBudgetChange}
              InputProps={{
                startAdornment: <InputAdornment position="start">$</InputAdornment>,
              }}
              error={!!error}
              helperText={error}
              placeholder="$5"
              sx={{
                mb: 2,
                '& .MuiOutlinedInput-root': {
                  backgroundColor: 'rgba(0, 0, 0, 0.2)',
                },
                '& input': { textAlign: 'center', fontSize: '1.25rem' },
              }}
            />
            {budgetOptions.map((row, i) => (
              <Stack key={i} direction="row" spacing={1} sx={{ mb: i === 0 ? 1 : 0 }}>
                {row.map((amount) => (
                  <Button
                    key={amount}
                    variant="outlined"
                    size="small"
                    onClick={() => {
                      setBudget(amount.toString());
                      setError(null);
                    }}
                    sx={{
                      flex: 1,
                      bgcolor: 'rgba(255, 255, 255, 0.05)',
                      '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.1)' },
                    }}
                  >
                    ${amount}
                  </Button>
                ))}
              </Stack>
            ))}

            <Button
              variant="contained"
              fullWidth
              disabled={isApproving}
              onClick={handleApprove}
              startIcon={isApproving ? <CircularProgress size={20} color="inherit" /> : undefined}
              sx={{ mt: 2 }}
            >
              {isApproving ? 'Approving...' : 'Approve USDC'}
            </Button>

            {currentAllowance != null && currentAllowance > BigInt(0) && (
              <Button
                variant="outlined"
                fullWidth
                disabled={isRevoking}
                onClick={handleRevoke}
                startIcon={isRevoking ? <CircularProgress size={20} color="inherit" /> : undefined}
                sx={{ mt: 1 }}
              >
                {isRevoking ? 'Revoking...' : 'Revoke USDC'}
              </Button>
            )}
          </Box>
        </Stack>
      </DialogContent>
    </Dialog>
  );
}
