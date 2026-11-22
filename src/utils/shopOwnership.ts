import { INITIAL_SHOP_BUNDLES } from '../data/discordData';
import {
  DecorationId,
  NameplateId,
  ProfileEffectId,
  ShopBundle,
  UserProfile,
} from '../types/discord';

export interface OwnedCosmetics {
  decorations: Set<DecorationId>;
  effects: Set<ProfileEffectId>;
  nameplates: Set<NameplateId>;
  banners: Set<string>;
}

export function getOwnedCosmetics(
  ownedBundleIds: string[],
  bundles: ShopBundle[] = INITIAL_SHOP_BUNDLES
): OwnedCosmetics {
  const decorations = new Set<DecorationId>(['none']);
  const effects = new Set<ProfileEffectId>(['none']);
  const nameplates = new Set<NameplateId>(['none']);
  const banners = new Set<string>();

  for (const bundle of bundles) {
    if (!ownedBundleIds.includes(bundle.id)) continue;
    for (const item of bundle.items) {
      if (item.decorationId) decorations.add(item.decorationId);
      if (item.profileEffectId) effects.add(item.profileEffectId);
      if (item.nameplateId) nameplates.add(item.nameplateId);
      if (item.bannerUrl) banners.add(item.bannerUrl);
    }
    // Companion variants included inside matching bundles
    if (bundle.id === 'bundle-deadpool') {
      decorations.add('wolverine');
      nameplates.add('wolverine');
    }
    if (bundle.id === 'bundle-rama') {
      nameplates.add('sakura');
    }
    if (bundle.id === 'bundle-banner-vice') {
      nameplates.add('vice-city');
    }
  }

  return { decorations, effects, nameplates, banners };
}

export function findBundleForCosmetic(
  params: {
    decorationId?: DecorationId;
    profileEffectId?: ProfileEffectId;
    nameplateId?: NameplateId;
    bannerUrl?: string;
  },
  bundles: ShopBundle[] = INITIAL_SHOP_BUNDLES
): ShopBundle | undefined {
  return bundles.find((b) =>
    b.items.some(
      (item) =>
        (params.decorationId && item.decorationId === params.decorationId) ||
        (params.profileEffectId && item.profileEffectId === params.profileEffectId) ||
        (params.nameplateId && item.nameplateId === params.nameplateId) ||
        (params.bannerUrl && item.bannerUrl === params.bannerUrl)
    )
  );
}

/**
 * Ensures a user profile only has shop cosmetics equipped if they actually own
 * the corresponding bundle (user-uploaded data: URLs are preserved).
 */
export function sanitizeUserShopCosmetics(
  user: UserProfile,
  ownedBundleIds: string[],
  bundles: ShopBundle[] = INITIAL_SHOP_BUNDLES
): UserProfile {
  const owned = getOwnedCosmetics(ownedBundleIds, bundles);
  const nitroUnlockedEffects = new Set<ProfileEffectId>(
    user.nitroTier !== 'none' ? ['sparks', 'cyber', 'crimson'] : []
  );

  const safeDecoration: DecorationId = owned.decorations.has(user.decoration)
    ? user.decoration
    : 'none';

  const currentEffect = user.profileEffect || 'none';
  const safeEffect: ProfileEffectId =
    owned.effects.has(currentEffect) || nitroUnlockedEffects.has(currentEffect)
      ? currentEffect
      : 'none';

  const safeNameplate: NameplateId = owned.nameplates.has(user.nameplate)
    ? user.nameplate
    : 'none';

  const isCustomUploadBanner = Boolean(user.bannerImage && user.bannerImage.startsWith('data:'));
  const safeBannerImage =
    user.bannerImage && (isCustomUploadBanner || owned.banners.has(user.bannerImage))
      ? user.bannerImage
      : undefined;

  return {
    ...user,
    decoration: safeDecoration,
    profileEffect: safeEffect,
    nameplate: safeNameplate,
    bannerImage: safeBannerImage,
  };
}
