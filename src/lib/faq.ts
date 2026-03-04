export const FAQ_ITEMS = [
  {
    question: '1. What is Inflynce Marketing?',
    answer:
      'Inflynce Marketing lets anyone boost a link using USDC and reward real users based on measurable social influence (Mindshare). You set a budget, and eligible Farcaster users engage with your link to earn rewards.',
  },
  {
    question: '2. What is Mindshare?',
    answer:
      "Mindshare is a score that measures social influence on Farcaster. It's calculated based on meaningful engagement and activity across Farcaster social network. Higher Mindshare means higher minimum reward per engagement.",
  },
  {
    question: '3. Who can launch a boosting campaign?',
    answer:
      'Anyone with a connected wallet and USDC on Base can launch a boosting campaign. You must hold sufficient USDC in your wallet and approve a spending limit before launching. Minimum campaign budget is $5.',
  },
  {
    question: '4. Who can earn rewards?',
    answer:
      'Only eligible Farcaster users can earn rewards, minimum required Mindshare is 0.003%. Earning happens through Inflynce Marketing app inside Base App or Farcaster. It is not available on web version.',
  },
  {
    question: '5. Do you custody my funds?',
    answer: 'No. Your USDC stays in your wallet. Inflynce does not hold or custody user funds.',
  },
  {
    question: '6. What is USDC spending limit (allowance)?',
    answer:
      'The spending limit is a standard USDC approval. It allows Inflynce contract to spend up to a set amount from your wallet for active boosts. You can change or revoke this approval anytime.',
  },
  {
    question: '7. When is my USDC actually spent?',
    answer:
      'USDC is only deducted when eligible users complete engagements on your boost. If no engagement happens, no funds are spent.',
  },
  {
    question: '8. Is there a protocol fee?',
    answer:
      'Yes, 10% protocol fee is added to your campaign cost. This supports infrastructure, scoring and distribution systems.',
  },
  {
    question: '9. What is minimum campaign budget?',
    answer: 'The minimum budget to launch a boost is $5.',
  },
  {
    question: '10. How is cost per engagement calculated?',
    answer: `Cost per engagement depends on user's 7D-Mindshare score. Higher Mindshare requires higher minimum reward. There are predefined minimum reward tiers to ensure fair distribution.

Cost per engagement = Mindshare × 100

A creator with 1.00% Mindshare will cost: 1.00% × 100 = $1.00 (additional 10% protocol fee is applied on top of campaign cost.)

Additional Rules:
0.01% ≤ Mindshare < 0.05% → $0.05 per engagement
0.005% ≤ Mindshare < 0.01% → $0.025 per engagement
0.003% ≤ Mindshare < 0.005% → $0.01 per engagement
Users with below 0.003% Mindshare are not eligible for rewards.`,
  },
  {
    question: '11. How does Inflynce prevent bots or farming?',
    answer:
      'Inflynce uses internal Mindshare scoring and strict eligibility thresholds to filter low-quality or automated accounts. Only users above a minimum influence level can earn rewards. Out of tens of thousands of active Farcaster users, typically around 1,500 users per day qualify as eligible. This significantly limits spam and farming behavior.',
  },
  {
    question: '12. What happens if my budget runs out?',
    answer: 'Your boost automatically stops once budget is fully spent.',
  },
  {
    question: '13. Can I stop or edit a boost?',
    answer:
      "You can stop a boost at any time. While a campaign is running, you can increase or decrease your maximum budget. Other campaign parameters cannot be edited after launch.",
  },
  {
    question: "14. Why can't I earn on web version?",
    answer:
      'Web version is designed for launching boosts. Earning is available through Inflynce Marketing app inside Base App or Farcaster.',
  },
  {
    question: '15. Which network is Inflynce built on?',
    answer: 'Inflynce operates on Base and distributes rewards to Farcaster users.',
  },
];
