'use client';

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Stack,
} from '@mui/material';
import { APPROVE_AMOUNT_OPTIONS, BOOST_FEE_USD } from '@/lib/constants';

interface ApproveSpendingModalProps {
  open: boolean;
  onClose: () => void;
  approveAmount: number;
  onApproveAmountChange: (amount: number) => void;
  onApprove: () => void;
  isApproving: boolean;
}

export function ApproveSpendingModal({
  open,
  onClose,
  approveAmount,
  onApproveAmountChange,
  onApprove,
  isApproving,
}: ApproveSpendingModalProps) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle component="div">Approve Spending</DialogTitle>
      <DialogContent>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Approve the Inflynce Boosts contract to spend USDC on your behalf. This is a standard
          ERC-20 approval. You can approve a specific amount for convenience.
        </Typography>
        <Typography variant="subtitle2" sx={{ mb: 1 }}>
          Approval amount (USDC)
        </Typography>
        <Stack direction="row" flexWrap="wrap" gap={1} sx={{ mb: 2 }}>
          {APPROVE_AMOUNT_OPTIONS.map((amt) => (
            <Button
              key={amt}
              variant={approveAmount === amt ? 'contained' : 'outlined'}
              size="small"
              onClick={() => onApproveAmountChange(amt)}
              disabled={isApproving}
              sx={{ minWidth: 56 }}
            >
              ${amt}
            </Button>
          ))}
        </Stack>
        <Typography variant="caption" color="text.secondary">
          Platform fee: ${BOOST_FEE_USD} USDC per boost. Your daily rewards budget can be up to this
          allowance.
        </Typography>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} disabled={isApproving}>
          Cancel
        </Button>
        <Button variant="contained" onClick={onApprove} disabled={isApproving}>
          {isApproving ? 'Approving...' : `Approve ${approveAmount} USDC`}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
