# Inflynce Boost Web

Web app for creating open-type boost campaigns from a connected wallet. No Farcaster sign-in required.

## Features

- Wallet connect (RainbowKit)
- Pay $0.25 USDC campaign fee
- Set cast URL, min mindshare, multiplier, max budget
- Submit to `postBoostWeb` API

## Setup

```bash
npm install
cp .env.example .env.local
# Edit .env.local with NEXT_PUBLIC_API_URL and NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID
npm run dev
```

## Env vars

| Variable | Description |
|----------|-------------|
| `GRAPHQL_URL` | Hasura GraphQL endpoint (e.g. `http://localhost:8080/v1/graphql`). Used by Next.js rewrite: `/api/graphql` → `GRAPHQL_URL` |
| `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` | WalletConnect Cloud project ID |
| `NEXT_PUBLIC_GRAPHQL_URL` | Optional. If set, client calls this directly instead of `/api/graphql` |
| `NEXT_PUBLIC_INFLYNCE_ADDRESS` | Optional. USDC recipient for the $0.25 fee |

## Design

To align with Canva or Figma designs, share the design link and we can refine the UI.
