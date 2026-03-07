/**
 * Maps transaction errors to user-friendly messages.
 * Returns null for user rejection (intentional cancel) - no error shown.
 */
export function formatTxError(err: unknown): string | null {
  const msg = err instanceof Error ? err.message : String(err);
  const lower = msg.toLowerCase();

  // User intentionally rejected in wallet - don't show error
  if (
    lower.includes('user denied') ||
    lower.includes('user rejected') ||
    lower.includes('user cancelled') ||
    lower.includes('rejected the request') ||
    lower.includes('rejected the transaction')
  ) {
    return null;
  }

  // Known errors with friendly messages
  if (lower.includes('insufficient funds') || lower.includes('insufficient balance')) {
    return 'Insufficient USDC balance.';
  }
  if (lower.includes('allowance') || lower.includes('approve')) {
    return 'Approval failed. Please try again.';
  }
  if (lower.includes('transfer')) {
    return 'Transfer failed. Please try again.';
  }
  if (lower.includes('network') || lower.includes('connection')) {
    return 'Network error. Please check your connection and try again.';
  }

  // Generic fallback - avoid exposing raw technical details
  return 'Something went wrong. Please try again.';
}
