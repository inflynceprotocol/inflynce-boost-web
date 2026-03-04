'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider } from 'wagmi';
import { RainbowKitProvider, darkTheme } from '@rainbow-me/rainbowkit';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { config } from '@/lib/wagmi';
import theme from '@/theme/theme';
import '@rainbow-me/rainbowkit/styles.css';

const queryClient = new QueryClient();

const rainbowTheme = darkTheme({
  accentColor: '#FF6B00',
  accentColorForeground: '#FFFFFF',
});

export function Web3Provider({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <RainbowKitProvider theme={rainbowTheme}>
            {children}
          </RainbowKitProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
