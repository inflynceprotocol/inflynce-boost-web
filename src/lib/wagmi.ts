import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { base } from 'wagmi/chains';

export const config = getDefaultConfig({
  appName: 'Inflynce Boost',
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 'inflynce-boost-web',
  chains: [base],
  ssr: true,
});
