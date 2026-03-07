'use client';

import { useState, useEffect, useMemo } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useAccount, useWriteContract, useReadContract } from 'wagmi';
import { parseUnits, formatUnits } from 'viem';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { createPublicClient, http } from 'viem';
import { base } from 'wagmi/chains';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Stack,
  InputAdornment,
  Alert,
  CircularProgress,
  IconButton,
  Snackbar,
} from '@mui/material';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { postBoostWeb } from '@/lib/postBoostWeb';
import { getLinkIdentifier } from '@/lib/castHash';
import {
  USDC_BASE,
  INFLYNCE_RECIPIENT,
  BOOSTS_CONTRACT,
  BOOST_FEE_USD,
  BOOST_FEE_RAW,
  MIN_BUDGET_USD,
  MIN_ALLOWANCE_USD,
  MIN_COST_PER_ENGAGEMENT,
  APP_TYPE_WEB,
  MINDSHARE_DURATION,
} from '@/lib/constants';
import { erc20Abi } from '@/lib/erc20';
import { formatTxError } from '@/lib/formatTxError';
import { ApproveSpendingModal } from './ApproveSpendingModal';
import { CostDetailsModal } from './CostDetailsModal';

const GRAPHQL_URL = process.env.NEXT_PUBLIC_GRAPHQL_URL;
const MIN_ALLOWANCE_WEI = parseUnits(MIN_ALLOWANCE_USD.toString(), 6);

export function BoostForm() {
  const { address, isConnected } = useAccount();
  const [castUrl, setCastUrl] = useState('');
  const [mindshare, setMindshare] = useState(0.003);
  const [multiplier, setMultiplier] = useState(1);
  const [budgetInput, setBudgetInput] = useState('5');
  const maxBudget = parseFloat(budgetInput) || 0;
  const [step, setStep] = useState<'form' | 'approving' | 'paying' | 'creating'>('form');
  const [error, setError] = useState<string | null>(null);
  const [successSnackbar, setSuccessSnackbar] = useState<string | null>(null);
  const [approveModalOpen, setApproveModalOpen] = useState(false);
  const [costDetailsOpen, setCostDetailsOpen] = useState(false);
  const [approveAmount, setApproveAmount] = useState(Math.max(MIN_ALLOWANCE_USD, MIN_BUDGET_USD));

  const queryClient = useQueryClient();
  const { writeContractAsync } = useWriteContract();

  const { data: allowance, refetch: refetchAllowance } = useReadContract({
    address: USDC_BASE,
    abi: erc20Abi,
    functionName: 'allowance',
    args: [address ?? '0x0000000000000000000000000000000000000000', BOOSTS_CONTRACT],
    query: { enabled: !!address },
  });

  const { data: balance, refetch: refetchBalance } = useReadContract({
    address: USDC_BASE,
    abi: erc20Abi,
    functionName: 'balanceOf',
    args: [address ?? '0x0000000000000000000000000000000000000000'],
    query: { enabled: !!address },
  });

  const currentAllowance = allowance ?? BigInt(0);
  const currentBalance = balance ?? BigInt(0);
  const remainingAllowance = Number(formatUnits(currentAllowance, 6));
  const defaultMaxBudgetFromAllowance = Math.max(MIN_BUDGET_USD, Math.floor(remainingAllowance));
  const requiredBalance = BOOST_FEE_USD + maxBudget;
  const hasInsufficientAllowance = currentAllowance < MIN_ALLOWANCE_WEI;
  const hasInsufficientBalance = currentBalance < parseUnits(requiredBalance.toFixed(2), 6);
  const requiredAllowanceWei = parseUnits(maxBudget.toString(), 6);
  // Allow 1-unit tolerance for display rounding (e.g. 4.999999 shown as 5.00)
  const hasInsufficientAllowanceForBudget =
    maxBudget >= MIN_BUDGET_USD && currentAllowance < requiredAllowanceWei - 1n;

  useEffect(() => {
    setApproveAmount((prev) => Math.max(prev, Math.max(maxBudget, MIN_ALLOWANCE_USD)));
  }, [maxBudget]);

  const linkId = getLinkIdentifier(castUrl);
  const isValidLink = linkId !== null;

  async function handleApprove() {
    if (!address) return;
    setError(null);
    setStep('approving');
    try {
      const amount = parseUnits(approveAmount.toString(), 6);
      await writeContractAsync({
        address: USDC_BASE,
        abi: erc20Abi,
        functionName: 'approve',
        args: [BOOSTS_CONTRACT, amount],
      });
      queryClient.invalidateQueries({ queryKey: ['readContract'] });
      await refetchAllowance();
      setApproveModalOpen(false);
      setStep('form');
    } catch (err) {
      const msg = formatTxError(err);
      if (msg) setError(msg);
      setStep('form');
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!address || !isValidLink) {
      setError(!isValidLink ? 'Enter a valid URL (must begin with https://)' : 'Connect wallet first');
      return;
    }

    if (maxBudget < MIN_BUDGET_USD) {
      setError(`Minimum budget is $${MIN_BUDGET_USD.toFixed(2)}.`);
      return;
    }

    if (currentAllowance < MIN_ALLOWANCE_WEI) {
      setError('Approve minimum 5 USDC to start boosting.');
      setApproveModalOpen(true);
      return;
    }

    const requiredAmount = parseUnits(requiredBalance.toFixed(2), 6);
    if (currentBalance < requiredAmount) {
      setError(`Insufficient USDC balance. You need at least ${requiredBalance.toFixed(2)} USDC.`);
      return;
    }

    if (currentAllowance < parseUnits(maxBudget.toString(), 6)) {
      setError(
        `Allowance (${remainingAllowance.toFixed(2)} USDC) is less than max budget (${maxBudget} USDC). Approve more.`
      );
      setApproveModalOpen(true);
      return;
    }

    setStep('paying');
    try {
      const hash = await writeContractAsync({
        address: USDC_BASE,
        abi: erc20Abi,
        functionName: 'transfer',
        args: [INFLYNCE_RECIPIENT, BOOST_FEE_RAW],
        chainId: base.id,
      });
      if (!hash) throw new Error('Transaction failed');

      setStep('creating');
      const client = createPublicClient({ chain: base, transport: http() });
      await client.waitForTransactionReceipt({ hash });

      const result = await postBoostWeb(GRAPHQL_URL, {
        castUrl: castUrl.trim(),
        castHash: linkId,
        creatorWallet: address,
        mindshareFilterDuration: MINDSHARE_DURATION,
        minMindshare: mindshare.toString(),
        multiplier,
        paymentHash: hash,
        maxBudget: maxBudget.toString(),
        appType: APP_TYPE_WEB,
      });

      setSuccessSnackbar('Campaign created!');
      setCastUrl('');
      setBudgetInput(Math.max(MIN_BUDGET_USD, defaultMaxBudgetFromAllowance).toString());
      setStep('form');
      queryClient.invalidateQueries({ queryKey: ['readContract'] });
      refetchAllowance();
      refetchBalance();
    } catch (err) {
      const msg = formatTxError(err);
      if (msg) setError(msg);
      setStep('form');
    }
  }

  const isLaunchDisabled =
    step !== 'form' ||
    !isValidLink ||
    hasInsufficientAllowance ||
    hasInsufficientBalance ||
    hasInsufficientAllowanceForBudget;

  // Step-based primary CTA (wireframe: Connect → Approve → Launch)
  const isConnectStep = !isConnected;
  const isApproveStep = isConnected && hasInsufficientAllowance;
  const isLaunchStep = isConnected && !hasInsufficientAllowance;

  return (
    <>
      <Paper
        elevation={0}
        sx={{
          p: 3,
          maxWidth: 480,
          mx: 'auto',
          borderRadius: 2,
          border: '1px solid',
          borderColor: 'divider',
          bgcolor: 'background.paper',
        }}
      >
        <Box component="form" onSubmit={handleSubmit}>
            <Stack spacing={2.5}>
              <TextField
                fullWidth
                label="Link:"
                placeholder="Link must begin with: https://"
                value={castUrl}
                onChange={(e) => setCastUrl(e.target.value)}
                error={!!castUrl && !isValidLink}
                helperText={castUrl && !isValidLink ? 'Enter a valid URL (must begin with https://)' : undefined}
                disabled={step !== 'form'}
                InputProps={{
                  endAdornment: castUrl && (
                    <InputAdornment position="end">
                      <OpenInNewIcon fontSize="small" sx={{ color: 'text.secondary' }} />
                    </InputAdornment>
                  ),
                }}
              />

              <Box>
                <Typography
                  variant="body2"
                  sx={{ mb: 0.5, display: 'flex', alignItems: 'center', gap: 0.5 }}
                >
                  Minimum cost per engagement:
                  <IconButton
                    size="small"
                    onClick={() => setCostDetailsOpen(true)}
                    sx={{ color: 'text.secondary', p: 0.25 }}
                    aria-label="Cost calculation details"
                  >
                    <InfoOutlinedIcon fontSize="small" />
                  </IconButton>
                </Typography>
                <Typography variant="body1" sx={{ color: 'primary.main', fontWeight: 500 }}>
                  ${MIN_COST_PER_ENGAGEMENT.toFixed(3)}
                </Typography>
              </Box>

              <TextField
                fullWidth
                type="text"
                inputMode="decimal"
                label={`Max. Budget (min. $${MIN_BUDGET_USD.toFixed(2)})`}
                value={budgetInput}
                onChange={(e) => {
                  const raw = e.target.value.replace(/[^0-9.]/g, '');
                  setBudgetInput(raw);
                }}
                inputProps={{ min: MIN_BUDGET_USD, step: 1 }}
                disabled={step !== 'form'}
                helperText={
                  remainingAllowance > 0
                    ? `Up to ${defaultMaxBudgetFromAllowance} USDC based on allowance`
                    : undefined
                }
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                  endAdornment: <InputAdornment position="end">.00</InputAdornment>,
                }}
              />

              {isLaunchStep && address && (
                <Typography variant="body2" color="text.secondary">
                  Your balance: ${Number(formatUnits(currentBalance, 6)).toFixed(2)} USDC
                  {hasInsufficientBalance && (
                    <Box component="span" sx={{ color: 'error.main', display: 'block', mt: 0.5 }}>
                      Need at least ${requiredBalance.toFixed(2)} USDC (fee + budget) to launch
                    </Box>
                  )}
                  {hasInsufficientAllowanceForBudget && (
                    <Box sx={{ mt: 0.5, display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                      <Box component="span" sx={{ color: 'error.main' }}>
                        Spending limit (${remainingAllowance.toFixed(2)}) is less than budget (${maxBudget}). Approve more.
                      </Box>
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => {
                          setApproveAmount(Math.max(approveAmount, maxBudget));
                          setApproveModalOpen(true);
                        }}
                        sx={{ textTransform: 'none' }}
                      >
                        Approve more
                      </Button>
                    </Box>
                  )}
                  {!isValidLink && isLaunchStep && (
                    <Box component="span" sx={{ color: 'text.secondary', display: 'block', mt: 0.5 }}>
                      Enter a link above to boost
                    </Box>
                  )}
                </Typography>
              )}

              {error && (
                <Alert severity="error" onClose={() => setError(null)}>
                  {error}
                </Alert>
              )}

              {/* Primary CTA - wireframe flow: Connect → Approve → Launch */}
              {isConnectStep ? (
                <ConnectButton.Custom>
                  {({ openConnectModal }) => (
                    <Button
                      variant="contained"
                      color="primary"
                      fullWidth
                      size="large"
                      onClick={openConnectModal}
                      sx={{ py: 1.5 }}
                    >
                      Connect Wallet to Boost
                    </Button>
                  )}
                </ConnectButton.Custom>
              ) : isApproveStep ? (
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  size="large"
                  onClick={() => setApproveModalOpen(true)}
                  disabled={step === 'approving'}
                  startIcon={step === 'approving' ? <CircularProgress size={20} color="inherit" /> : undefined}
                  sx={{ py: 1.5 }}
                >
                  {step === 'approving' ? 'Approving...' : 'Approve USDC to Boost'}
                </Button>
              ) : (
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                  size="large"
                  disabled={isLaunchDisabled}
                  startIcon={
                    step === 'paying' || step === 'creating' ? (
                      <CircularProgress size={20} color="inherit" />
                    ) : undefined
                  }
                  sx={{ py: 1.5 }}
                >
                  {step === 'paying' && 'Confirm payment...'}
                  {step === 'creating' && 'Creating campaign...'}
                  {step === 'form' && `Start Boosting ($${BOOST_FEE_USD} fee)`}
                </Button>
              )}
            </Stack>
          </Box>
      </Paper>

      <Snackbar
        open={!!successSnackbar}
        autoHideDuration={6000}
        onClose={() => setSuccessSnackbar(null)}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        message={successSnackbar}
        ContentProps={{
          sx: {
            bgcolor: 'success.main',
            color: 'white',
            '& .MuiSnackbarContent-message': { fontWeight: 500 },
          },
        }}
      />

      <ApproveSpendingModal
        open={approveModalOpen}
        onClose={() => setApproveModalOpen(false)}
        approveAmount={approveAmount}
        onApproveAmountChange={setApproveAmount}
        onApprove={handleApprove}
        isApproving={step === 'approving'}
      />

      <CostDetailsModal open={costDetailsOpen} onClose={() => setCostDetailsOpen(false)} />
    </>
  );
}
