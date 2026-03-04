'use client';

import Link from 'next/link';
import { Header } from '@/components/Header';
import { Box, Typography, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { FAQ_ITEMS } from '@/lib/faq';

export default function FAQPage() {
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
        <Box sx={{ width: '100%', maxWidth: 560 }}>
          <Link
            href="/"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 4,
              color: 'inherit',
              textDecoration: 'none',
              marginBottom: 24,
            }}
          >
            <ArrowBackIcon fontSize="small" />
            <Typography variant="body2" sx={{ color: 'primary.main', fontWeight: 500 }}>
              Back
            </Typography>
          </Link>

          <Typography variant="h5" fontWeight={600} sx={{ mb: 2 }}>
            FAQ
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Inflynce Protocol
          </Typography>

          {FAQ_ITEMS.map((item, i) => (
            <Accordion
              key={i}
              disableGutters
              sx={{
                bgcolor: 'background.paper',
                border: '1px solid',
                borderColor: 'divider',
                '&:before': { display: 'none' },
                '&:not(:last-child)': { mb: 1 },
              }}
            >
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="subtitle2" fontWeight={500}>
                  {item.question}
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: 'pre-line' }}>
                  {item.answer}
                </Typography>
              </AccordionDetails>
            </Accordion>
          ))}
        </Box>
      </Box>

      <Box
        component="footer"
        sx={{
          borderTop: 1,
          borderColor: 'divider',
          py: 2,
          textAlign: 'center',
        }}
      >
        <Typography variant="body2" color="text.secondary">
          Powered by Inflynce · Base network
        </Typography>
      </Box>
    </Box>
  );
}
