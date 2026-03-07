export const USDC_BASE = '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913' as const;
export const INFLYNCE_RECIPIENT = (process.env.NEXT_PUBLIC_INFLYNCE_ADDRESS || '0xA61529732F4E71ef1586252dDC97202Ce198A38A') as `0x${string}`;
export const BOOSTS_CONTRACT = (process.env.NEXT_PUBLIC_BOOSTS_CONTRACT_ADDRESS_BASE_V2 || '0x6e6A6128bB0c175989066eb0e2bf54F06688207b') as `0x${string}`;
export const BOOST_FEE_USD = 0.25;
/** 0.25 USDC in raw units (6 decimals) - use for contract calls */
export const BOOST_FEE_RAW = BigInt(250000);
export const MIN_BUDGET_USD = 5;
export const MIN_COST_PER_ENGAGEMENT = 0.011; // Fixed minimum cost (open-type tier)
export const MIN_ALLOWANCE_USD = 5;
export const MIN_REQUIRED_BALANCE_USD = 5.25; // 0.25 fee + 5 min budget
export const APPROVE_AMOUNT_OPTIONS = [5, 10, 25, 50, 100, 250, 500, 1000] as const;
/** App type for inflynce-boost-web (wallet-only, no Farcaster context) */
export const APP_TYPE_WEB = 1;
/** Miniapp URL for earning (Farcaster/Base App) */
export const MINIAPP_URL = process.env.NEXT_PUBLIC_MINIAPP_URL || 'https://miniapp.inflynce.com';
/** Farcaster miniapp direct link */
export const FARCASTER_MINIAPP_URL = 'https://farcaster.xyz/miniapps/TrnTSlXGbRDg/inflynce';
export const MINDSHARE_DURATION = 7;
