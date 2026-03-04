'use client';

import {
  Box,
  Typography,
  Paper,
  Button,
  Stack,
} from '@mui/material';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { MINIAPP_URL, FARCASTER_MINIAPP_URL } from '@/lib/constants';

export function EarnTab() {
  return (
    <Box sx={{ width: '100%', maxWidth: 560 }}>
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
        <Typography variant="body1" color="text.primary" sx={{ mb: 2 }}>
          Earning isn&apos;t available on web yet. To earn rewards, open Inflynce in Base App or
          Farcaster.
        </Typography>
        <Stack direction="row" spacing={2} justifyContent="center" flexWrap="wrap" useFlexGap>
          <Button
            variant="outlined"
            href={FARCASTER_MINIAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            startIcon={
              <Box
                component="img"
                src="https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/farcaster.svg"
                alt="Farcaster"
                sx={{ width: 20, height: 20, filter: 'brightness(0) invert(1)' }}
              />
            }
            endIcon={<OpenInNewIcon fontSize="small" />}
            sx={{
              borderColor: 'primary.main',
              color: 'primary.main',
              textTransform: 'none',
              '&:hover': { borderColor: 'primary.dark', bgcolor: 'rgba(255,255,255,0.04)' },
            }}
          >
            Farcaster
          </Button>
          <Button
            variant="outlined"
            href={MINIAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            endIcon={<OpenInNewIcon fontSize="small" />}
            sx={{
              borderColor: 'primary.main',
              color: 'primary.main',
              textTransform: 'none',
              '&:hover': { borderColor: 'primary.dark', bgcolor: 'rgba(255,255,255,0.04)' },
            }}
          >
            Base App
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
}
