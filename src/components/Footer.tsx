'use client';

import Link from 'next/link';
import {
  Box,
  Typography,
  IconButton,
  useTheme,
} from '@mui/material';

const SOCIAL_LINKS = [
  { href: 'https://x.com/inflynceprotocol', label: 'X', icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/x.svg' },
  { href: 'https://farcaster.xyz/miniapps/TrnTSlXGbRDg/inflynce', label: 'Farcaster', icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/farcaster.svg' },
  { href: 'https://base.org', label: 'Base', icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/coinbase.svg' },
] as const;

export function Footer() {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  return (
    <Box
      component="footer"
      sx={{
        mt: 'auto',
        borderTop: 1,
        borderColor: 'divider',
        bgcolor: isDark ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.02)',
        py: 3,
        px: 2,
      }}
    >
      <Box
        sx={{
          maxWidth: 560,
          mx: 'auto',
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 2,
        }}
      >
        {/* Left: Brand + links */}
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: { xs: 'center', sm: 'flex-start' }, gap: 0.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Typography variant="body2" color="text.secondary">
              Powered by Inflynce
            </Typography>
            <Typography variant="body2" color="text.disabled">·</Typography>
            <Link href="/faq" style={{ textDecoration: 'none' }}>
              <Typography
                variant="body2"
                component="span"
                sx={{
                  color: 'text.secondary',
                  '&:hover': { textDecoration: 'underline', color: 'text.primary' },
                }}
              >
                FAQ
              </Typography>
            </Link>
          </Box>
          <Typography variant="caption" color="text.disabled">
            © {new Date().getFullYear()} Inflynce · Base network
          </Typography>
        </Box>

        {/* Right: Social icons */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          {SOCIAL_LINKS.map(({ href, label, icon }) => (
            <IconButton
              key={label}
              component="a"
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              size="small"
              sx={{
                color: 'text.secondary',
                '&:hover': {
                  color: 'primary.main',
                  bgcolor: 'rgba(255,107,0,0.1)',
                  '& img': { filter: 'brightness(0) invert(1)' },
                },
              }}
            >
              <Box
                component="img"
                src={icon}
                alt={label}
                sx={{
                  width: 20,
                  height: 20,
                  filter: 'brightness(0) invert(0.8)',
                }}
              />
            </IconButton>
          ))}
        </Box>
      </Box>
    </Box>
  );
}
