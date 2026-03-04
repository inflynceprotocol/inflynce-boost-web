import { keccak256, toHex } from 'viem';

/**
 * Extract cast hash from Farcaster or Base App URL.
 * Supports: farcaster.xyz/.../0x..., base.app/post/0x..., warpcast.com, or raw 0x... hash.
 */
function extractCastHashFromUrl(urlOrHash: string): string | null {
  const trimmed = urlOrHash.trim();
  if (!trimmed) return null;

  // Raw hash
  if (trimmed.startsWith('0x') && /^0x[0-9a-fA-F]{8,64}$/.test(trimmed)) {
    return trimmed;
  }

  // farcaster.xyz/.../0x...
  if (trimmed.includes('farcaster.xyz')) {
    const parts = trimmed.split('/');
    const last = parts[parts.length - 1];
    if (last?.startsWith('0x') && /^0x[0-9a-fA-F]+$/.test(last)) return last;
  }

  // base.app/post/0x...
  if (trimmed.includes('base.app/post')) {
    const parts = trimmed.split('/');
    const last = parts[parts.length - 1];
    if (last?.startsWith('0x') && /^0x[0-9a-fA-F]+$/.test(last)) return last;
  }

  // warpcast.com/~/conversations/0x...
  if (trimmed.includes('warpcast.com')) {
    const parts = trimmed.split('/');
    const last = parts[parts.length - 1];
    if (last?.startsWith('0x') && /^0x[0-9a-fA-F]+$/.test(last)) return last;
  }

  return null;
}

/**
 * Validate URL is a valid https URL.
 */
export function isValidLink(url: string): boolean {
  const trimmed = url.trim();
  if (!trimmed) return false;
  try {
    const parsed = new URL(trimmed);
    return parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

/**
 * Get link identifier for open-type boost. For Farcaster/Base casts, returns cast hash.
 * For any other valid https URL, returns keccak256 hash of the URL.
 */
export function getLinkIdentifier(urlOrHash: string): string | null {
  const trimmed = urlOrHash.trim();
  if (!trimmed) return null;

  const castHash = extractCastHashFromUrl(trimmed);
  if (castHash) return castHash;

  if (isValidLink(trimmed)) {
    return keccak256(toHex(trimmed));
  }

  return null;
}

/** @deprecated Use getLinkIdentifier for open-type (any URL). Kept for compatibility. */
export function extractCastHash(urlOrHash: string): string | null {
  return getLinkIdentifier(urlOrHash);
}
