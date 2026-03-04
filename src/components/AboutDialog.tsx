'use client';

import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Typography,
  Box,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

interface AboutDialogProps {
  open: boolean;
  onClose: () => void;
}

export function AboutDialog({ open, onClose }: AboutDialogProps) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          bgcolor: 'background.paper',
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 2,
        },
      }}
    >
      <DialogTitle
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '1px solid',
          borderColor: 'divider',
          pb: 2,
        }}
      >
        <Typography variant="h6" fontWeight={600}>
          About Inflynce Protocol
        </Typography>
        <IconButton onClick={onClose} size="small" sx={{ color: 'text.secondary' }} aria-label="Close">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ pt: 3 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Typography variant="body1" color="text.primary">
            Inflynce lets anyone boost a link using USDC and reward real users based on social
            influence (Mindshare).
          </Typography>
          <Typography variant="body1" color="text.primary">
            Boost budgets are paid onchain. Rewards go only to eligible Farcaster users.
          </Typography>
          <Typography variant="body1" color="text.primary">
            You keep your USDC in your wallet. We only spend up to your approved limit when a boost
            is active. Inflynce does not custody user funds.
          </Typography>
          <Typography variant="body1" color="text.primary">
            Built on Base.
          </Typography>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
