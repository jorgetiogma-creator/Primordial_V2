import { StoredAccount, UserProfile } from '../types/discord';

export const RESERVED_OWNER_USERNAME = 'owner';

/**
 * Resolves the ONE AND ONLY private Owner account ID.
 * - Once pinned with `isOwnerAccount: true`, ONLY that single account ID is ever recognized.
 * - On first migration before pinning, matches the user's exact `Owner` (`Owen`) account.
 */
export function resolveSingleOwnerAccountId(accounts: StoredAccount[]): string | null {
  const pinned = accounts.find((acc) => acc.isOwnerAccount === true);
  if (pinned) return pinned.id;

  const exactOwenOwner = accounts.find(
    (acc) =>
      acc.user.username.trim().toLowerCase() === RESERVED_OWNER_USERNAME &&
      acc.user.displayName.trim().toLowerCase() === 'owen'
  );
  if (exactOwenOwner) return exactOwenOwner.id;

  const usernameOwner = accounts.find(
    (acc) => acc.user.username.trim().toLowerCase() === RESERVED_OWNER_USERNAME
  );
  return usernameOwner ? usernameOwner.id : null;
}

/**
 * Ensures at most ONE StoredAccount in the list holds `isOwnerAccount: true`.
 */
export function normalizeSingleOwnerAccounts(accounts: StoredAccount[]): StoredAccount[] {
  const ownerId = resolveSingleOwnerAccountId(accounts);
  if (!ownerId) return accounts;

  let changed = false;
  const next = accounts.map((acc) => {
    const shouldBeOwner = acc.id === ownerId;
    if (Boolean(acc.isOwnerAccount) !== shouldBeOwner) {
      changed = true;
      return { ...acc, isOwnerAccount: shouldBeOwner };
    }
    return acc;
  });

  return changed ? next : accounts;
}

/**
 * Strictly checks whether the currently active session belongs to the single private Owner account.
 */
export function isActiveAccountOwner(
  activeAccountId: string | null,
  accounts: StoredAccount[],
  currentUser: UserProfile
): boolean {
  if (!activeAccountId) return false;
  const ownerId = resolveSingleOwnerAccountId(accounts);
  if (!ownerId || activeAccountId !== ownerId) return false;
  const ownerAccount = accounts.find((acc) => acc.id === ownerId);
  if (!ownerAccount) return false;
  return ownerAccount.id === activeAccountId && ownerAccount.user.id === currentUser.id;
}
