'use client';

import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Box,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const faqItems = [
  {
    question: 'What is the fee?',
    answer:
      'The Inflynce platform charges a 0.25 USDC platform fee per boost, in addition to your desired rewards budget for your boosted post.',
  },
  {
    question: 'How to approve USDC?',
    answer:
      'To approve USDC for boosts, you will be prompted to approve the Inflynce Boosts contract to spend USDC on your behalf. This is a standard ERC-20 token approval process. You can approve a specific amount or give unlimited approval for convenience.',
  },
];

export function FAQ() {
  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
        Frequently Asked Questions
      </Typography>
      {faqItems.map((item, i) => (
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
            <Typography variant="subtitle2">{item.question}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="body2" color="text.secondary">
              {item.answer}
            </Typography>
          </AccordionDetails>
        </Accordion>
      ))}
    </Box>
  );
}
