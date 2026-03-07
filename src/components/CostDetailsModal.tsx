'use client';

import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Typography,
  Stack,
  Box,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

interface CostDetailsModalProps {
  open: boolean;
  onClose: () => void;
}

export function CostDetailsModal({ open, onClose }: CostDetailsModalProps) {
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
        component="div"
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '1px solid',
          borderColor: 'divider',
          pb: 2,
        }}
      >
        <Box component="span" sx={{ fontSize: '1.25rem', fontWeight: 600 }}>
          Cost Calculation Details
        </Box>
        <IconButton onClick={onClose} size="small" sx={{ color: 'text.secondary' }} aria-label="Close">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ pt: 3 }}>
        <Stack spacing={2}>
          <Typography variant="body1" color="text.primary">
            Your cost per engagement depends on creator&apos;s Mindshare on Farcaster social network.
          </Typography>
          <Typography variant="body1" color="text.primary">
            Cost per engagement = Mindshare × 100
          </Typography>
          <Typography variant="body1" color="text.primary">
            A creator with 1.00% Mindshare will cost:{' '}
            <Box component="span" fontWeight={600}>
              1.00% × 100 = $1.00
            </Box>{' '}
            (additional{' '}
            <Box component="span" fontWeight={600}>
              10% protocol fee
            </Box>{' '}
            is applied on top of campaign cost.)
          </Typography>
          <Typography variant="subtitle2" fontWeight={600} sx={{ mt: 1 }}>
            Additional Rules:
          </Typography>
          <Box component="ul" sx={{ m: 0, pl: 2.5 }}>
            <Typography component="li" variant="body1" sx={{ mb: 0.5 }}>
              0.01% ≤ Mindshare &lt; 0.05% → $0.05 per engagement
            </Typography>
            <Typography component="li" variant="body1" sx={{ mb: 0.5 }}>
              0.005% ≤ Mindshare &lt; 0.01% → $0.025 per engagement
            </Typography>
            <Typography component="li" variant="body1" sx={{ mb: 0.5 }}>
              0.003% ≤ Mindshare &lt; 0.005% → $0.01 per engagement
            </Typography>
            <Typography component="li" variant="body1">
              Users with below 0.003% Mindshare are not eligible for rewards.
            </Typography>
          </Box>
        </Stack>
      </DialogContent>
    </Dialog>
  );
}
