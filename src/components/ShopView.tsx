import React, { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  Check,
  ChevronRight,
  Eye,
  Gift,
  Heart,
  Image as ImageIcon,
  Layers,
  Menu,
  RotateCcw,
  Search,
  Sparkles,
  Store,
  X,
} from 'lucide-react';
import { DirectMessageThread, NameplateId, ShopBundle, UserProfile } from '../types/discord';
import {
  AvatarArtwork,
  AvatarDecorationRing,
  DiscordLogo,
  GENERATED_ASSETS,
  NameplateRowDecor,
  NameplateStripBackground,
  OrbsCrystalIcon,
  ProfileEffectAnimationOverlay,
  SafeImage,
  UserAvatar,
} from './DiscordArt';

interface ShopViewProps {
  user: UserProfile;
  bundles: ShopBundle[];
  dms: DirectMessageThread[];
  wishlistIds: string[];
  ownedBundleIds: string[];
  selectedBundle: ShopBundle | null;
  onSelectBundle: (bundle: ShopBundle | null) => void;
  onToggleWishlist: (bundleId: string) => void;
  onBuyBundle: (bundle: ShopBundle, useOrbs: boolean) => void;
  onEquipBundle: (bundle: ShopBundle) => void;
  onGiftBundle: (bundle: ShopBundle, recipientId: string, recipientName: string) => void;
  onBack: () => void;
}

const getBundleArtUrl = (variant: ShopBundle['artVariant']): string | null => {
  switch (variant) {
    case 'miyabi':
      return GENERATED_ASSETS.shopMiyabiArt;
    case 'ellen':
      return GENERATED_ASSETS.shopEllenArt;
    case 'burnice':
      return GENERATED_ASSETS.shopBurniceArt;
    case 'deadpool':
    case 'wolverine':
      return GENERATED_ASSETS.deadpoolBanner;
    case 'dbd':
      return GENERATED_ASSETS.dbdBanner;
    case 'plantas':
      return GENERATED_ASSETS.shopLofiPlants;
    case 'gato':
      return GENERATED_ASSETS.shopCozyCat;
    case 'almas':
      return GENERATED_ASSETS.shopTrappedSouls;
    case 'observador':
      return GENERATED_ASSETS.shopObserverEyes;
    case 'pesadilla':
      return GENERATED_ASSETS.shopPesadillaArt;
    case 'pato':
      return GENERATED_ASSETS.shopPatoArt;
    case 'vader':
      return GENERATED_ASSETS.shopVaderArt;
    case 'gojo':
      return GENERATED_ASSETS.shopGojoArt;
    case 'sukuna':
      return GENERATED_ASSETS.shopSukunaArt;
    case 'yuji':
      return GENERATED_ASSETS.shopYujiArt;
    case 'cerbero':
      return GENERATED_ASSETS.shopCerberoArt;
    case 'llama':
      return GENERATED_ASSETS.shopLlamaInfernal;
    case 'rama':
      return GENERATED_ASSETS.shopRamaEnFlor;
    case 'condenacion':
      return GENERATED_ASSETS.shopCondenacionEterna;
    case 'jugar':
      return GENERATED_ASSETS.shopVamosAJugar;
    case 'espectro':
      return GENERATED_ASSETS.shopEspectroArt;
    case 'grabado':
      return GENERATED_ASSETS.shopGrabadoJapones;
    case 'lobo':
      return GENERATED_ASSETS.shopLoboLuna;
    case 'vice-city':
      return GENERATED_ASSETS.viceCityBanner;
    case 'dune':
      return GENERATED_ASSETS.duneBanner;
    case 'croma':
      return GENERATED_ASSETS.shopCromaArt;
    case 'orejas':
      return GENERATED_ASSETS.shopOrejasGato;
    default:
      return null;
  }
};

interface BundleThemeMeta {
  gradient: string;
  glow: string;
  stageBg: string;
}

const getBundleTheme = (variant: ShopBundle['artVariant']): BundleThemeMeta => {
  switch (variant) {
    case 'miyabi':
      return {
        gradient: 'from-[#071a24] via-[#0c111b] to-[#1a0a12]',
        glow: 'rgba(34, 211, 238, 0.36)',
        stageBg: '#070c12',
      };
    case 'ellen':
      return {
        gradient: 'from-[#161822] via-[#11131a] to-[#260b14]',
        glow: 'rgba(244, 63, 94, 0.34)',
        stageBg: '#0c0d12',
      };
    case 'burnice':
      return {
        gradient: 'from-[#241307] via-[#170e09] to-[#290b08]',
        glow: 'rgba(249, 115, 22, 0.38)',
        stageBg: '#110a07',
      };
    case 'plantas':
      return {
        gradient: 'from-[#0b1f15] via-[#0a1714] to-[#121310]',
        glow: 'rgba(132, 204, 22, 0.3)',
        stageBg: '#09110d',
      };
    case 'croma':
      return {
        gradient: 'from-[#160b24] via-[#0d1024] to-[#081b24]',
        glow: 'rgba(192, 132, 252, 0.42)',
        stageBg: '#090a12',
      };
    case 'gato':
      return {
        gradient: 'from-[#231409] via-[#17100b] to-[#0e0c0a]',
        glow: 'rgba(251, 146, 60, 0.34)',
        stageBg: '#100c08',
      };
    case 'almas':
    case 'pesadilla':
    case 'espectro':
    case 'jugar':
    case 'observador':
      return {
        gradient: 'from-[#141418] via-[#0c0c10] to-[#050507]',
        glow: 'rgba(228, 228, 231, 0.22)',
        stageBg: '#08080b',
      };
    case 'gojo':
      return {
        gradient: 'from-[#07192b] via-[#110e29] to-[#090b14]',
        glow: 'rgba(56, 189, 248, 0.42)',
        stageBg: '#070b14',
      };
    case 'sukuna':
      return {
        gradient: 'from-[#2a0909] via-[#1a0a07] to-[#090506]',
        glow: 'rgba(239, 68, 68, 0.42)',
        stageBg: '#100606',
      };
    case 'yuji':
      return {
        gradient: 'from-[#260912] via-[#19080f] to-[#090507]',
        glow: 'rgba(251, 113, 133, 0.38)',
        stageBg: '#10060a',
      };
    case 'cerbero':
    case 'llama':
      return {
        gradient: 'from-[#1f0729] via-[#13071c] to-[#08040c]',
        glow: 'rgba(236, 72, 153, 0.42)',
        stageBg: '#0e0614',
      };
    case 'lobo':
      return {
        gradient: 'from-[#1a0e2e] via-[#110d26] to-[#090b16]',
        glow: 'rgba(192, 132, 252, 0.38)',
        stageBg: '#0b0916',
      };
    case 'grabado':
      return {
        gradient: 'from-[#1e1d1b] via-[#131312] to-[#090909]',
        glow: 'rgba(244, 114, 182, 0.25)',
        stageBg: '#0e0e0e',
      };
    case 'pato':
      return {
        gradient: 'from-[#0284c7] via-[#0ea5e9] to-[#0369a1]',
        glow: 'rgba(56, 189, 248, 0.45)',
        stageBg: '#0c4a6e',
      };
    case 'vader':
      return {
        gradient: 'from-[#24080a] via-[#120a0d] to-[#08080a]',
        glow: 'rgba(220, 38, 38, 0.36)',
        stageBg: '#0d0708',
      };
    case 'rama':
      return {
        gradient: 'from-[#241216] via-[#160f12] to-[#0b090b]',
        glow: 'rgba(251, 113, 133, 0.3)',
        stageBg: '#110b0e',
      };
    case 'condenacion':
      return {
        gradient: 'from-[#081d24] via-[#0a131a] to-[#06090d]',
        glow: 'rgba(34, 211, 238, 0.36)',
        stageBg: '#060c10',
      };
    case 'orejas':
      return {
        gradient: 'from-[#1a1624] via-[#12111a] to-[#09090e]',
        glow: 'rgba(249, 168, 212, 0.32)',
        stageBg: '#0d0c13',
      };
    case 'vice-city':
      return {
        gradient: 'from-[#2b0b29] via-[#1c0c2e] to-[#26160a]',
        glow: 'rgba(232, 121, 249, 0.38)',
        stageBg: '#14091e',
      };
    case 'dune':
      return {
        gradient: 'from-[#26180a] via-[#16110d] to-[#0b0a09]',
        glow: 'rgba(245, 158, 11, 0.32)',
        stageBg: '#120d08',
      };
    default:
      return {
        gradient: 'from-slate-900 to-zinc-950',
        glow: 'rgba(88, 101, 242, 0.28)',
        stageBg: '#0c0d12',
      };
  }
};

const getCategoryLabel = (category: ShopBundle['category']): string => {
  switch (category) {
    case 'anime':
      return 'Anime';
    case 'horror':
      return 'Terror';
    case 'fantasia':
      return 'Fantasía';
    case 'lofi':
      return 'Lofi';
    case 'estilo':
      return 'Estilo';
    case 'zzz':
      return 'Zenless Zone Zero';
    case 'marvel':
      return 'Marvel';
    case 'dbd':
      return 'Dead by Daylight';
    case 'banners':
      return 'Banner';
    default:
      return 'Colección';
  }
};

const ThematicBundleArtwork: React.FC<{
  variant: ShopBundle['artVariant'];
  accentHex?: string;
}> = ({ variant, accentHex }) => {
  const artUrl = getBundleArtUrl(variant);
  const theme = getBundleTheme(variant);
  if (artUrl) {
    return (
      <SafeImage
        src={artUrl}
        alt=""
        fallbackGradient={theme.gradient}
        className="w-full h-full object-cover"
      />
    );
  }

  return (
    <div
      className={`w-full h-full bg-gradient-to-br ${theme.gradient}`}
      style={accentHex ? { backgroundColor: accentHex } : undefined}
    />
  );
};

/* Museum-Grade Collectible Stage Renderer for Shop Cards */
const CollectibleCardStage: React.FC<{
  bundle: ShopBundle;
  activeSwatch?: string;
}> = ({ bundle, activeSwatch }) => {
  const artUrl = getBundleArtUrl(bundle.artVariant);
  const theme = getBundleTheme(bundle.artVariant);
  const firstDeco = bundle.items.find((i) => i.decorationId)?.decorationId;
  const nameplateItem = bundle.items.find((i) => i.nameplateId);

  /* 1. Standalone Profile Banner Stage */
  if (bundle.category === 'banners' && artUrl) {
    return (
      <div className="relative w-full aspect-[4/3] overflow-hidden bg-[#08090d]">
        <img
          src={artUrl}
          alt={bundle.title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center transition-transform duration-500 ease-out group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/15 to-transparent" />
        {/* Profile Collar Hint */}
        <div className="absolute bottom-2.5 left-3 right-3 flex items-center gap-2.5 z-10">
          <div className="w-9 h-9 rounded-full bg-[#0c0d12] p-0.5 border border-white/25 shadow-xl shrink-0">
            <div className="w-full h-full rounded-full bg-[#5865F2] flex items-center justify-center">
              <DiscordLogo className="w-4.5 h-4.5 text-white" />
            </div>
          </div>
          <div className="min-w-0">
            <div className="h-2 w-16 rounded-full bg-white/85" />
            <div className="h-1.5 w-10 rounded-full bg-white/45 mt-1" />
          </div>
        </div>
      </div>
    );
  }

  /* 2. Signature Full-Scene Pond Stage for "el mismo pato" */
  if (bundle.artVariant === 'pato') {
    return (
      <div className="relative w-full aspect-[4/3] overflow-hidden bg-[#0c4a6e]">
        <SafeImage
          src={GENERATED_ASSETS.shopPatoArt}
          alt={bundle.title}
          fallbackGradient={theme.gradient}
          className="absolute inset-0 w-full h-full object-cover object-right transition-transform duration-500 ease-out group-hover:scale-105"
        />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'linear-gradient(90deg, rgba(14,116,144,0.82) 0%, rgba(56,189,248,0.28) 42%, transparent 72%)',
          }}
        />
        {/* Submerged Discord Avatar in the Pond Water */}
        <div className="absolute left-4 bottom-4 z-10 flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
          <div className="absolute -inset-3 rounded-full border border-sky-100/50 animate-ping opacity-30" />
          <div className="absolute -inset-1.5 rounded-full border-2 border-sky-200/75" />
          <div className="w-[70px] h-[70px] rounded-full bg-sky-900/45 border border-white/45 backdrop-blur-xs flex items-center justify-center shadow-xl">
            <DiscordLogo className="w-9 h-9 text-white/95 drop-shadow" />
          </div>
        </div>
      </div>
    );
  }

  /* 3. Authentic Discord Member-List Nameplate Stage */
  if (
    (bundle.items.length === 1 && bundle.items[0]?.kind === 'Placa de identificación') ||
    bundle.artVariant === 'observador' ||
    bundle.artVariant === 'almas'
  ) {
    const plateId: NameplateId = nameplateItem?.nameplateId || 'observador';
    const isLightPlate = plateId === 'rama';
    return (
      <div
        className="relative w-full aspect-[4/3] overflow-hidden p-3 flex flex-col justify-center gap-2.5"
        style={{ backgroundColor: '#111218' }}
      >
        {/* Subtle studio radial glow behind the active member strip */}
        <div
          className="absolute inset-0 pointer-events-none opacity-65 transition-opacity duration-300 group-hover:opacity-95"
          style={{
            background: `radial-gradient(circle at 60% 50%, ${activeSwatch || theme.glow}, transparent 72%)`,
          }}
        />

        {/* Top muted member row */}
        <div className="relative z-10 flex items-center gap-2 opacity-45 px-2">
          <div className="w-5 h-5 rounded-full overflow-hidden border border-white/15 shrink-0">
            <AvatarArtwork avatar="phibi" />
          </div>
          <span className="h-2 w-16 rounded-full bg-white/35" />
        </div>

        {/* Highlighted Nameplate Bar */}
        <div className="relative z-10 h-14 rounded-xl overflow-hidden border border-white/25 shadow-[0_10px_24px_-6px_rgba(0,0,0,0.7)] flex items-center justify-between px-2.5 bg-[#191a23] anim-shimmer group-hover:scale-[1.025] transition-transform duration-300">
          <NameplateStripBackground nameplate={plateId} accentColor={activeSwatch} />
          <div className="relative z-10 flex items-center gap-2 min-w-0">
            <span className="w-7 h-7 rounded-full overflow-hidden border border-white/50 shadow-md shrink-0">
              <AvatarArtwork avatar="madara" />
            </span>
            <span
              className={`text-[11.5px] font-display font-extrabold truncate ${
                isLightPlate
                  ? 'text-zinc-900 drop-shadow-[0_1px_2px_rgba(255,255,255,0.85)]'
                  : 'text-white drop-shadow-[0_1px_4px_rgba(0,0,0,0.9)]'
              }`}
            >
              {bundle.shortTitle || bundle.title}
            </span>
          </div>
          <NameplateRowDecor nameplate={plateId} />
        </div>

        {/* Bottom muted member row */}
        <div className="relative z-10 flex items-center gap-2 opacity-45 px-2">
          <div className="w-5 h-5 rounded-full overflow-hidden border border-white/15 shrink-0">
            <AvatarArtwork avatar="locke" />
          </div>
          <span className="h-2 w-12 rounded-full bg-white/30" />
        </div>
      </div>
    );
  }

  /* 4. Centered Studio Avatar Decoration Pedestal Stage (Llama infernal, Orejas de gato, Espectro, Onda cromática) */
  if (bundle.items.length === 1 && firstDeco) {
    const spotlightColor = activeSwatch ? `${activeSwatch}55` : theme.glow;
    return (
      <div
        className={`relative w-full aspect-[4/3] overflow-hidden bg-gradient-to-br ${theme.gradient} flex items-center justify-center`}
      >
        {/* Clean studio radial spotlight — keeps intricate ring art crisp without muddy photo noise */}
        <div
          className="absolute inset-0 pointer-events-none transition-opacity duration-300 opacity-85 group-hover:opacity-100"
          style={{
            background: `radial-gradient(circle at 50% 48%, ${spotlightColor} 0%, rgba(10,11,16,0.65) 55%, rgba(5,5,8,0.96) 100%)`,
          }}
        />
        <div
          className="absolute w-36 h-36 rounded-full blur-2xl opacity-45 transition-all duration-300 group-hover:scale-110 group-hover:opacity-65"
          style={{ backgroundColor: activeSwatch || theme.glow }}
        />

        <div className="relative z-10 flex items-center justify-center transition-transform duration-300 ease-out group-hover:scale-108">
          <div
            className="w-[74px] h-[74px] rounded-full border border-white/25 flex items-center justify-center shadow-[0_12px_30px_rgba(0,0,0,0.85)] overflow-hidden relative"
            style={{
              backgroundColor: activeSwatch ? `${activeSwatch}22` : '#171822',
            }}
          >
            <DiscordLogo className="w-9 h-9 text-white/90 drop-shadow" />
          </div>
          <AvatarDecorationRing decoration={firstDeco} accentColor={activeSwatch} />
        </div>
      </div>
    );
  }

  /* 5. Single Profile Effect Showcase Stage (Vamos a jugar) */
  if (bundle.items.length === 1 && bundle.items[0]?.kind === 'Efecto de perfil') {
    return (
      <div className="relative w-full aspect-[4/3] overflow-hidden bg-[#0a0a0e]">
        <div className="w-full h-full transition-transform duration-500 ease-out group-hover:scale-105">
          <ThematicBundleArtwork variant={bundle.artVariant} />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/15 to-transparent" />
        {/* Mini Profile Frame Overlay Hint */}
        <div className="absolute inset-x-3 bottom-2.5 flex items-center justify-between gap-2 z-10">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-[#111218] border border-white/30 flex items-center justify-center shadow-lg">
              <DiscordLogo className="w-3.5 h-3.5 text-white" />
            </div>
            <div className="space-y-1">
              <div className="h-1.5 w-12 rounded-full bg-white/80" />
              <div className="h-1 w-8 rounded-full bg-white/45" />
            </div>
          </div>
          <Sparkles className="w-4 h-4 text-white/80" />
        </div>
      </div>
    );
  }

  /* 6. Multi-Item Collector Bundle Collage (Avatar Deco + Nameplate Strip + Tilted Profile Effect Card) */
  return (
    <div
      className={`relative w-full aspect-[4/3] overflow-hidden bg-gradient-to-br ${theme.gradient}`}
    >
      {/* Calibrated Ambient Studio Glow */}
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-300 opacity-80 group-hover:opacity-100"
        style={{
          background: `radial-gradient(circle at 28% 34%, ${theme.glow} 0%, transparent 56%), radial-gradient(circle at 75% 65%, rgba(255,255,255,0.08) 0%, transparent 60%)`,
        }}
      />

      {/* Right Tilted Profile Effect Card with High-Craft Artwork */}
      <div className="absolute right-2.5 top-2.5 bottom-2.5 w-[58%] rounded-xl overflow-hidden border border-white/25 shadow-[0_14px_28px_-6px_rgba(0,0,0,0.85)] transform rotate-3 group-hover:rotate-1 group-hover:translate-x-0.5 transition-transform duration-300 ease-out bg-[#0d0e13]">
        <ThematicBundleArtwork variant={bundle.artVariant} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/15 to-black/20" />
        <div className="absolute top-2 left-2 w-6 h-6 rounded-full bg-black/60 border border-white/35 flex items-center justify-center backdrop-blur-xs shadow">
          <DiscordLogo className="w-3.5 h-3.5 text-white" />
        </div>
        <div className="absolute bottom-2.5 left-2.5 right-2.5 space-y-1">
          <div className="h-1.5 w-12 rounded-full bg-white/75" />
          <div className="h-1 w-16 rounded-full bg-white/40" />
        </div>
      </div>

      {/* Slanted Bottom-Left Nameplate Strip */}
      {nameplateItem ? (
        <div className="absolute left-2 bottom-3 w-[68%] h-8 rounded-lg bg-[#14151c] border border-white/25 shadow-[0_8px_18px_rgba(0,0,0,0.75)] transform -rotate-5 group-hover:-rotate-3 transition-transform duration-300 flex items-center justify-between px-2 z-10 overflow-hidden">
          <NameplateStripBackground nameplate={nameplateItem.nameplateId || 'none'} />
          <span className="relative z-10 w-4.5 h-4.5 rounded-full overflow-hidden border border-white/45 shrink-0">
            <AvatarArtwork avatar="madara" />
          </span>
          <NameplateRowDecor nameplate={nameplateItem.nameplateId || 'none'} />
        </div>
      ) : (
        <div className="absolute left-2.5 bottom-3 w-[56%] h-7 rounded-lg bg-[#14151c]/90 border border-white/20 shadow-lg transform -rotate-4 flex items-center gap-2 px-2 z-10">
          <span className="w-4 h-4 rounded-full overflow-hidden border border-white/30 shrink-0">
            <AvatarArtwork avatar="madara" />
          </span>
          <span className="h-1.5 w-14 rounded-full bg-white/50" />
        </div>
      )}

      {/* Floating Top-Left Hero Avatar Decoration */}
      {firstDeco && (
        <div className="absolute top-3.5 left-3.5 z-20 w-14 h-14 flex items-center justify-center transition-transform duration-300 ease-out group-hover:scale-110 group-hover:-translate-y-0.5">
          <div className="w-11 h-11 rounded-full bg-[#171923] border border-white/30 flex items-center justify-center shadow-[0_10px_24px_rgba(0,0,0,0.9)]">
            <DiscordLogo className="w-5.5 h-5.5 text-white/95" />
          </div>
          <AvatarDecorationRing decoration={firstDeco} accentColor={activeSwatch} />
        </div>
      )}
    </div>
  );
};

const ProfileEffectShowcase: React.FC<{
  bundle: ShopBundle;
  user: UserProfile;
  playKey: number;
}> = ({ bundle, user, playKey }) => {
  const effectId = bundle.items.find((i) => i.profileEffectId)?.profileEffectId;
  const decoId = bundle.items.find((i) => i.decorationId)?.decorationId || 'none';
  const nameplateId = bundle.items.find((i) => i.nameplateId)?.nameplateId || 'none';

  return (
    <div className="my-2 mx-auto w-[304px] rounded-2xl overflow-hidden border border-white/15 bg-[#0e0f14] shadow-2xl relative">
      <div className="h-24 w-full relative overflow-hidden" style={{ backgroundColor: user.bannerColor }}>
        {user.bannerImage && (
          <img
            src={user.bannerImage}
            alt=""
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 to-transparent" />
      </div>

      <div className="px-4 pb-5 -mt-10 relative z-10">
        <div className="inline-block p-1 rounded-full bg-[#0e0f14] shadow-lg">
          <UserAvatar
            avatar={user.avatar}
            customAvatarUrl={user.customAvatarUrl}
            decoration={decoId}
            size="lg"
            showStatus={false}
          />
        </div>
        <p className="font-display font-extrabold text-lg text-white mt-1">
          {user.displayName}
        </p>
        <p className="text-xs text-zinc-400">{user.username}</p>

        {nameplateId !== 'none' && (
          <div className="mt-2.5 h-9 rounded-xl overflow-hidden border border-white/15 relative flex items-center px-2.5 bg-[#15161e]">
            <NameplateStripBackground nameplate={nameplateId} />
            <span className="relative z-10 text-xs font-display font-bold text-white drop-shadow">
              {user.displayName}
            </span>
          </div>
        )}

        <p className="text-[11px] text-zinc-400 mt-3 tabular-nums">
          Miembro desde · {user.memberSince}
        </p>
      </div>

      {/* Live Kinetic Profile Effect Overlay */}
      <ProfileEffectAnimationOverlay effect={effectId} playKey={playKey} />
    </div>
  );
};

const BannerProfilePreview: React.FC<{
  bannerUrl: string;
  bundle: ShopBundle;
  user: UserProfile;
  showFullBundle?: boolean;
}> = ({ bannerUrl, bundle, user, showFullBundle = false }) => {
  const deco = showFullBundle
    ? bundle.items.find((i) => i.decorationId)?.decorationId || user.decoration
    : user.decoration;
  const effectId = showFullBundle
    ? bundle.items.find((i) => i.profileEffectId)?.profileEffectId
    : undefined;

  return (
    <div className="my-2 mx-auto w-[304px] rounded-2xl overflow-hidden border border-white/15 bg-[#0e0f14] shadow-2xl relative">
      <div className="h-28 w-full relative overflow-hidden anim-shimmer">
        <img
          src={bannerUrl}
          alt={bundle.title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
      </div>
      <div className="px-4 pb-4 -mt-10 relative z-10">
        <div className="inline-block p-1 rounded-full bg-[#0e0f14] shadow-lg">
          <UserAvatar
            avatar={user.avatar}
            customAvatarUrl={user.customAvatarUrl}
            decoration={deco}
            size="lg"
            showStatus={false}
          />
        </div>
        <p className="font-display font-extrabold text-lg text-white mt-1">
          {user.displayName}
        </p>
        <p className="text-xs text-zinc-400">{user.username}</p>
        <p className="text-[11px] text-[#8b95ff] font-semibold mt-2">
          {showFullBundle
            ? 'Vista previa completa del lote equipado'
            : 'Así lucirá este banner en tu perfil'}
        </p>
      </div>
      {effectId && <ProfileEffectAnimationOverlay effect={effectId} playKey={bundle.id} />}
    </div>
  );
};

const BundleCard: React.FC<{
  bundle: ShopBundle;
  wishlisted: boolean;
  owned: boolean;
  onSelect: (activeSwatch?: string) => void;
  onToggleWishlist: (e: React.MouseEvent) => void;
}> = ({ bundle, wishlisted, owned, onSelect, onToggleWishlist }) => {
  const [selectedSwatch, setSelectedSwatch] = useState<string | undefined>(
    bundle.colorSwatches?.[0]
  );

  const itemSummary =
    bundle.items.length > 1
      ? `${bundle.items.length} artículos`
      : bundle.items[0]?.kind === 'Decoración de avatar'
      ? 'Decoración'
      : bundle.items[0]?.kind === 'Placa de identificación'
      ? 'Placa'
      : bundle.items[0]?.kind === 'Efecto de perfil'
      ? 'Efecto'
      : 'Banner';

  return (
    <motion.div
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.985 }}
      transition={{ duration: 0.14, ease: 'easeOut' }}
      onClick={() => onSelect(selectedSwatch)}
      className="group rounded-2xl bg-[#0d0e14] hover:bg-[#13151e] border border-white/[0.08] hover:border-white/[0.18] overflow-hidden relative cursor-pointer transition-colors shadow-[0_8px_24px_-8px_rgba(0,0,0,0.65)] flex flex-col"
    >
      <button
        type="button"
        onClick={onToggleWishlist}
        aria-label="Añadir a lista de deseos"
        className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-black/55 hover:bg-black/80 border border-white/15 backdrop-blur-xs flex items-center justify-center z-20 cursor-pointer transition-transform active:scale-90"
      >
        <Heart
          className={`w-4 h-4 transition-transform ${
            wishlisted ? 'text-red-500 fill-red-500 scale-110' : 'text-white'
          }`}
        />
      </button>

      <CollectibleCardStage bundle={bundle} activeSwatch={selectedSwatch} />

      <div className="p-3 flex-1 flex flex-col justify-between gap-2">
        <div>
          <p className="text-[11px] font-medium text-zinc-400 truncate">
            {itemSummary} · {getCategoryLabel(bundle.category)}
          </p>
          <h3 className="font-display font-bold text-[14.5px] text-white truncate leading-snug mt-0.5">
            {bundle.shortTitle || bundle.title}
          </h3>
        </div>

        <div className="flex items-center justify-between gap-2 pt-0.5">
          <span
            className={`inline-flex items-center gap-1 text-[12px] font-bold tabular-nums ${
              owned ? 'text-[#23a55a]' : 'text-zinc-100'
            }`}
          >
            {owned ? (
              <>
                <Check className="w-3.5 h-3.5 shrink-0" />
                <span>En propiedad</span>
              </>
            ) : (
              <>
                <OrbsCrystalIcon className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                <span>{bundle.priceOrbs}</span>
              </>
            )}
          </span>

          {bundle.colorSwatches && bundle.colorSwatches.length > 0 ? (
            <div
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-1 shrink-0"
            >
              {bundle.colorSwatches.map((hex) => (
                <button
                  key={hex}
                  type="button"
                  onClick={() => setSelectedSwatch(hex)}
                  aria-label={`Color ${hex}`}
                  style={{ backgroundColor: hex }}
                  className={`w-3.5 h-3.5 rounded-full border cursor-pointer transition-transform ${
                    selectedSwatch === hex
                      ? 'border-white scale-120 shadow'
                      : 'border-black/70 opacity-80 hover:opacity-100'
                  }`}
                />
              ))}
              {bundle.hasExtraSwatches && (
                <span className="w-3.5 h-3.5 rounded-full bg-zinc-700 text-white text-[9px] font-bold flex items-center justify-center">
                  +
                </span>
              )}
            </div>
          ) : (
            <span className="text-[11px] font-medium text-zinc-500 tabular-nums">
              {bundle.priceUsd}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
};

const CATEGORIES = [
  { id: 'all', label: 'Todo' },
  { id: 'anime', label: 'Anime y Shonen' },
  { id: 'horror', label: 'Terror y Sombras' },
  { id: 'fantasia', label: 'Fantasía y Fuego' },
  { id: 'lofi', label: 'Vibras lofi' },
  { id: 'estilo', label: 'Encuentra tu estilo' },
  { id: 'zzz', label: 'Zenless Zone Zero' },
  { id: 'marvel', label: 'Marvel' },
  { id: 'dbd', label: 'Dead by Daylight' },
  { id: 'banners', label: 'Banners' },
];

export const ShopView: React.FC<ShopViewProps> = ({
  user,
  bundles,
  dms,
  wishlistIds,
  ownedBundleIds,
  selectedBundle,
  onSelectBundle,
  onToggleWishlist,
  onBuyBundle,
  onEquipBundle,
  onGiftBundle,
  onBack,
}) => {
  const [selectedItemIndex, setSelectedItemIndex] = useState(0);
  const [modalSwatch, setModalSwatch] = useState<string | undefined>(undefined);
  const [filterWishlistOnly, setFilterWishlistOnly] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showMenuSheet, setShowMenuSheet] = useState(false);
  const [giftSentToast, setGiftSentToast] = useState<string | null>(null);
  const [justBoughtId, setJustBoughtId] = useState<string | null>(null);
  const [showGiftModal, setShowGiftModal] = useState(false);
  const [previewKey, setPreviewKey] = useState(1);
  const [fullPreviewMode, setFullPreviewMode] = useState(false);

  const openBundleModal = (bundle: ShopBundle, swatch?: string) => {
    setSelectedItemIndex(0);
    setModalSwatch(swatch ?? bundle.colorSwatches?.[0]);
    setFullPreviewMode(false);
    setPreviewKey((k) => k + 1);
    onSelectBundle(bundle);
  };

  const visibleBundles = bundles.filter((b) => {
    if (filterWishlistOnly && !wishlistIds.includes(b.id)) return false;
    if (activeCategory !== 'all' && b.category !== activeCategory) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      if (
        !b.title.toLowerCase().includes(q) &&
        !b.shortTitle.toLowerCase().includes(q) &&
        !b.items.some((i) => i.name.toLowerCase().includes(q))
      ) {
        return false;
      }
    }
    return true;
  });

  const featuredScreenshotGrid = visibleBundles.filter((b) =>
    [
      'bundle-pesadilla',
      'bundle-pato',
      'bundle-rama',
      'bundle-vader',
      'bundle-condenacion',
      'bundle-cerbero',
      'bundle-llama',
      'bundle-jugar',
      'bundle-gojo',
      'bundle-orejas',
      'bundle-grabado',
      'bundle-almas',
      'bundle-sukuna',
      'bundle-espectro',
      'bundle-lobo',
      'bundle-yuji',
    ].includes(b.id)
  );
  const lofiBundles = visibleBundles.filter((b) => b.category === 'lofi');
  const zzzBundles = visibleBundles.filter((b) => b.category === 'zzz');
  const bannerBundles = visibleBundles.filter((b) => b.category === 'banners');
  const deadpoolBundle = bundles.find((b) => b.id === 'bundle-deadpool')!;
  const dbdBundle = bundles.find((b) => b.id === 'bundle-dbd')!;

  const activeModalItem = selectedBundle
    ? selectedBundle.items[selectedItemIndex] || selectedBundle.items[0]
    : null;
  const isSelectedOwned = selectedBundle ? ownedBundleIds.includes(selectedBundle.id) : false;
  const isSelectedWishlisted = selectedBundle ? wishlistIds.includes(selectedBundle.id) : false;
  const modalTheme = selectedBundle ? getBundleTheme(selectedBundle.artVariant) : null;
  const modalBannerUrl = selectedBundle
    ? selectedBundle.items.find((i) => i.bannerUrl)?.bannerUrl || getBundleArtUrl(selectedBundle.artVariant)
    : null;

  return (
    <div className="flex-1 flex flex-col h-full bg-[#050507] text-[var(--dc-text-primary)] relative overflow-hidden">
      {/* Top Header */}
      <header className="h-14 px-3 md:px-5 flex items-center justify-between gap-2 bg-[#09090d] border-b border-white/[0.08] shrink-0">
        <div className="flex items-center gap-2.5">
          <button
            onClick={onBack}
            aria-label="Cerrar tienda"
            className="relative w-9 h-9 rounded-full hover:bg-white/10 flex items-center justify-center text-white cursor-pointer"
          >
            <X className="w-5 h-5" />
            <span className="absolute -bottom-0.5 -right-0.5 px-1.5 py-[1px] rounded-full bg-[#da373c] text-white text-[10px] font-bold tabular-nums leading-tight border-2 border-[#09090d]">
              99
            </span>
          </button>
          <Store className="w-5 h-5 text-white ml-1" />
          <h1 className="font-display font-bold text-[19px] text-white">Tienda</h1>
        </div>

        <div className="flex items-center gap-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#13141a] border border-white/10 text-white text-xs sm:text-sm font-bold tabular-nums whitespace-nowrap">
            <OrbsCrystalIcon className="w-4 h-4 text-indigo-400 shrink-0" />
            <span>{user.orbs.toLocaleString('es-ES')}</span>
          </div>

          <button
            onClick={() => setFilterWishlistOnly((w) => !w)}
            aria-label="Lista de deseos"
            className={`w-9 h-9 rounded-full flex items-center justify-center cursor-pointer ${
              filterWishlistOnly ? 'dc-btn-danger' : 'hover:bg-white/10 text-white'
            }`}
          >
            <Heart className={`w-5 h-5 ${filterWishlistOnly ? 'fill-white text-white' : ''}`} />
          </button>

          <button
            onClick={() => setShowMenuSheet(true)}
            aria-label="Categorías de tienda"
            className="w-9 h-9 rounded-full hover:bg-white/10 flex items-center justify-center text-white cursor-pointer"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Interactive Category Segmented Bar */}
      <div className="px-3 md:px-5 py-2.5 border-b border-white/[0.06] bg-[#09090d] shrink-0">
        <div className="max-w-4xl mx-auto flex items-center gap-2 overflow-x-auto no-scrollbar">
          {CATEGORIES.map((cat) => {
            const active = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => {
                  setActiveCategory(cat.id);
                  setFilterWishlistOnly(false);
                }}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap shrink-0 cursor-pointer ${
                  active ? 'dc-btn-primary' : 'dc-btn-secondary'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Scrollable Storefront */}
      <div className="flex-1 overflow-y-auto pb-16">
        <div className="max-w-4xl mx-auto">
          {filterWishlistOnly || activeCategory !== 'all' || searchQuery.trim() ? (
            <div className="px-3.5 pt-4 space-y-3">
              <div className="flex items-center justify-between gap-2">
                <h2 className="font-display font-bold text-lg text-white">
                  {filterWishlistOnly
                    ? `Tu lista de deseos (${visibleBundles.length})`
                    : `${
                        CATEGORIES.find((c) => c.id === activeCategory)?.label || 'Resultados'
                      } (${visibleBundles.length})`}
                </h2>
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="text-xs text-[#7b85ff] font-semibold cursor-pointer"
                  >
                    Limpiar búsqueda
                  </button>
                )}
              </div>

              {visibleBundles.length === 0 ? (
                <div className="text-center py-16 px-4 rounded-2xl bg-[#0d0e13] border border-white/10">
                  <Heart className="w-10 h-10 text-zinc-500 mx-auto mb-2" />
                  <p className="text-white font-semibold">No se encontraron artículos</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3.5">
                  {visibleBundles.map((b) => (
                    <BundleCard
                      key={b.id}
                      bundle={b}
                      wishlisted={wishlistIds.includes(b.id)}
                      owned={ownedBundleIds.includes(b.id)}
                      onSelect={(swatch) => openBundleModal(b, swatch)}
                      onToggleWishlist={(e) => {
                        e.stopPropagation();
                        onToggleWishlist(b.id);
                      }}
                    />
                  ))}
                </div>
              )}
            </div>
          ) : (
            <>
              {/* Hero Campaigns: Marvel & Dead by Daylight */}
              <section className="px-3.5 pt-4 space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  <motion.button
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.985 }}
                    onClick={() => openBundleModal(deadpoolBundle)}
                    className="w-full h-40 rounded-3xl overflow-hidden relative text-left border border-white/15 p-4 flex items-end justify-between cursor-pointer group shadow-lg anim-shimmer"
                  >
                    <img
                      src={GENERATED_ASSETS.deadpoolBanner}
                      alt="Marvel Deadpool & Wolverine"
                      referrerPolicy="no-referrer"
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/45 to-black/15" />
                    <div className="z-10">
                      <span className="text-[11px] font-semibold text-red-400">
                        Marvel · {deadpoolBundle.items.length} artículos
                      </span>
                      <div className="font-display font-black italic text-xl leading-none text-white mt-1">
                        DEADPOOL / <span className="text-yellow-300">WOLVERINE</span>
                      </div>
                      <p className="text-xs text-zinc-200 mt-1 tabular-nums">
                        ◈ {deadpoolBundle.priceOrbs} Orbs · {deadpoolBundle.priceUsd}
                      </p>
                    </div>
                    <div className="relative z-10 w-14 h-14 flex items-center justify-center shrink-0">
                      <div className="w-10 h-10 rounded-full bg-black/75 flex items-center justify-center border border-white/25">
                        <DiscordLogo className="w-5 h-5 text-white" />
                      </div>
                      <AvatarDecorationRing decoration="deadpool" />
                    </div>
                  </motion.button>

                  <motion.button
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.985 }}
                    onClick={() => openBundleModal(dbdBundle)}
                    className="w-full h-40 rounded-3xl overflow-hidden relative text-left border border-orange-500/20 p-4 flex items-end justify-between cursor-pointer group shadow-lg anim-shimmer"
                  >
                    <img
                      src={GENERATED_ASSETS.dbdBanner}
                      alt="Dead by Daylight"
                      referrerPolicy="no-referrer"
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/45 to-black/15" />
                    <div className="z-10">
                      <span className="text-[11px] font-semibold text-orange-400">
                        Behaviour Interactive · {dbdBundle.items.length} artículos
                      </span>
                      <div className="font-display font-black text-xl leading-none text-white mt-1">
                        DEAD BY DAYLIGHT
                      </div>
                      <p className="text-xs text-zinc-200 mt-1 tabular-nums">
                        ◈ {dbdBundle.priceOrbs} Orbs · {dbdBundle.priceUsd}
                      </p>
                    </div>
                    <div className="relative z-10 w-14 h-14 flex items-center justify-center shrink-0">
                      <div className="w-10 h-10 rounded-full bg-black/75 flex items-center justify-center border border-white/25">
                        <DiscordLogo className="w-5 h-5 text-zinc-200" />
                      </div>
                      <AvatarDecorationRing decoration="dbd" />
                    </div>
                  </motion.button>
                </div>
              </section>

              {/* Featured Collector Catalog Grid */}
              <section className="px-3.5 mt-6 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="font-display font-bold text-[19px] text-white">
                      Colección Destacada
                    </h2>
                    <p className="text-xs text-zinc-400">
                      Lotes de anime, placas de identificación y decoraciones animadas
                    </p>
                  </div>
                  <button
                    onClick={() => setActiveCategory('anime')}
                    className="px-3.5 py-1.5 rounded-full dc-btn-primary text-xs font-semibold cursor-pointer whitespace-nowrap shrink-0"
                  >
                    Mostrar todos
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3.5">
                  {featuredScreenshotGrid.map((b) => (
                    <BundleCard
                      key={b.id}
                      bundle={b}
                      wishlisted={wishlistIds.includes(b.id)}
                      owned={ownedBundleIds.includes(b.id)}
                      onSelect={(swatch) => openBundleModal(b, swatch)}
                      onToggleWishlist={(e) => {
                        e.stopPropagation();
                        onToggleWishlist(b.id);
                      }}
                    />
                  ))}
                </div>
              </section>

              {/* Vibras lofi Section */}
              <section className="px-3.5 mt-7 space-y-3">
                <div className="flex items-center justify-between">
                  <h2 className="font-display font-bold text-[19px] text-white">Vibras lofi</h2>
                  <button
                    onClick={() => setActiveCategory('lofi')}
                    className="px-3.5 py-1.5 rounded-full dc-btn-secondary text-xs font-semibold cursor-pointer whitespace-nowrap shrink-0"
                  >
                    Mostrar todos
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3.5">
                  {lofiBundles.map((b) => (
                    <BundleCard
                      key={b.id}
                      bundle={b}
                      wishlisted={wishlistIds.includes(b.id)}
                      owned={ownedBundleIds.includes(b.id)}
                      onSelect={(swatch) => openBundleModal(b, swatch)}
                      onToggleWishlist={(e) => {
                        e.stopPropagation();
                        onToggleWishlist(b.id);
                      }}
                    />
                  ))}
                </div>
              </section>

              {/* Hero Campaign: Zenless Zone Zero */}
              <section className="px-3.5 mt-7 space-y-3">
                <div className="relative h-48 md:h-56 w-full rounded-3xl overflow-hidden bg-[#13151b] border border-white/10 shadow-xl anim-shimmer">
                  <img
                    src={GENERATED_ASSETS.zzzEllenBanner}
                    alt="Zenless Zone Zero"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-transparent" />
                  <div className="absolute left-5 bottom-4 right-5 flex items-end justify-between gap-4 z-10">
                    <div>
                      <p className="text-[11px] font-semibold text-teal-300">
                        Colección oficial · New Eridu
                      </p>
                      <h2 className="font-display font-black text-2xl tracking-tight text-white mt-0.5">
                        ZENLESS <span className="text-teal-300">ZONE ZERO</span>
                      </h2>
                    </div>
                    <button
                      onClick={() => openBundleModal(bundles[0])}
                      className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-full dc-btn-white font-bold text-xs whitespace-nowrap shrink-0 cursor-pointer"
                    >
                      <span>Ver lote Miyabi</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5">
                  {zzzBundles.map((b) => (
                    <BundleCard
                      key={b.id}
                      bundle={b}
                      wishlisted={wishlistIds.includes(b.id)}
                      owned={ownedBundleIds.includes(b.id)}
                      onSelect={(swatch) => openBundleModal(b, swatch)}
                      onToggleWishlist={(e) => {
                        e.stopPropagation();
                        onToggleWishlist(b.id);
                      }}
                    />
                  ))}
                </div>
              </section>

              {/* Banners de perfil Section */}
              {bannerBundles.length > 0 && (
                <section className="px-3.5 mt-7 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="font-display font-bold text-[19px] text-white flex items-center gap-2">
                        <ImageIcon className="w-5 h-5 text-[#5865F2]" />
                        <span>Banners de perfil</span>
                      </h2>
                      <p className="text-xs text-zinc-400">
                        Cómpralos y equípalos directamente en la cabecera de tu perfil
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3.5">
                    {bannerBundles.map((b) => (
                      <BundleCard
                        key={b.id}
                        bundle={b}
                        wishlisted={wishlistIds.includes(b.id)}
                        owned={ownedBundleIds.includes(b.id)}
                        onSelect={(swatch) => openBundleModal(b, swatch)}
                        onToggleWishlist={(e) => {
                          e.stopPropagation();
                          onToggleWishlist(b.id);
                        }}
                      />
                    ))}
                  </div>
                </section>
              )}
            </>
          )}
        </div>
      </div>

      {/* Gift Toast Notification */}
      <AnimatePresence>
        {giftSentToast && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            className="fixed bottom-20 left-1/2 -translate-x-1/2 z-[70] px-4 py-2.5 rounded-full bg-[#23a55a] text-white text-xs font-bold shadow-2xl border border-white/20 whitespace-nowrap"
          >
            {giftSentToast}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Category & Search Sheet Modal */}
      {showMenuSheet && (
        <div
          onClick={() => setShowMenuSheet(false)}
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-end md:items-center justify-center p-0 md:p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md bg-[#0e0f14] rounded-t-3xl md:rounded-3xl border border-white/10 p-5 space-y-4 shadow-2xl"
          >
            <div className="flex items-center justify-between">
              <h3 className="font-display font-bold text-base text-white">Explorar tienda</h3>
              <button
                onClick={() => setShowMenuSheet(false)}
                className="w-8 h-8 rounded-full dc-btn-icon flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="relative">
              <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar Gojo, Sukuna, Cerbero, Darth Vader, Orejas..."
                className="w-full h-11 rounded-xl bg-[#07080a] border border-white/10 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-[#5865F2]"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => {
                    setActiveCategory(cat.id);
                    setFilterWishlistOnly(false);
                    setShowMenuSheet(false);
                  }}
                  className={`px-3.5 py-2.5 rounded-xl text-xs font-semibold text-left cursor-pointer border ${
                    activeCategory === cat.id
                      ? 'bg-[#5865F2]/20 border-[#5865F2] text-white'
                      : 'bg-[#14151b] border-white/10 text-zinc-300'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Bundle Inspection & Live Try-On Modal */}
      <AnimatePresence>
        {selectedBundle && activeModalItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            onClick={() => onSelectBundle(null)}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-end md:items-center justify-center"
          >
            <motion.div
              initial={{ y: 48, opacity: 0, scale: 0.97 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 36, opacity: 0, scale: 0.97 }}
              transition={{ type: 'spring', damping: 26, stiffness: 320 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md bg-[#0e0f14] rounded-t-3xl md:rounded-3xl border border-white/12 p-5 pb-6 shadow-2xl max-h-[92vh] overflow-y-auto flex flex-col"
            >
              <div className="w-10 h-1 bg-white/25 rounded-full mx-auto mb-3 shrink-0" />

              <div className="flex items-center justify-between gap-2 shrink-0 mb-2">
                <span className="text-xs font-semibold text-zinc-400">
                  {isSelectedOwned ? 'En tu inventario de perfil' : 'Probador en vivo'}
                </span>
                <div className="flex items-center gap-2">
                  {selectedBundle.items.length > 1 && (
                    <button
                      onClick={() => {
                        setFullPreviewMode((v) => !v);
                        setPreviewKey((k) => k + 1);
                      }}
                      title="Probar todo el lote combinado"
                      className={`h-8 px-2.5 rounded-full text-[11px] font-semibold inline-flex items-center gap-1 cursor-pointer whitespace-nowrap ${
                        fullPreviewMode ? 'dc-btn-primary' : 'dc-btn-secondary'
                      }`}
                    >
                      <Layers className="w-3.5 h-3.5" />
                      <span>Conjunto</span>
                    </button>
                  )}
                  <button
                    onClick={() => {
                      if (isSelectedOwned && !fullPreviewMode) {
                        onEquipBundle(selectedBundle);
                      } else {
                        setPreviewKey((k) => k + 1);
                      }
                    }}
                    title="Repetir animación de vista previa"
                    className="w-8 h-8 rounded-full dc-btn-icon flex items-center justify-center cursor-pointer"
                  >
                    {isSelectedOwned ? <Eye className="w-4 h-4" /> : <RotateCcw className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={() => onToggleWishlist(selectedBundle.id)}
                    aria-label="Favorito"
                    className="w-8 h-8 rounded-full dc-btn-icon flex items-center justify-center cursor-pointer"
                  >
                    <Heart
                      className={`w-4 h-4 ${
                        isSelectedWishlisted ? 'text-red-500 fill-red-500' : 'text-white'
                      }`}
                    />
                  </button>
                </div>
              </div>

              <AnimatePresence mode="wait">
                {fullPreviewMode && modalBannerUrl ? (
                  <motion.div
                    key={`full-${selectedBundle.id}-${previewKey}`}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                  >
                    <BannerProfilePreview
                      bannerUrl={modalBannerUrl}
                      bundle={selectedBundle}
                      user={user}
                      showFullBundle
                    />
                  </motion.div>
                ) : activeModalItem.kind === 'Banner de perfil' && activeModalItem.bannerUrl ? (
                  <motion.div
                    key={`banner-${selectedBundle.id}-${activeModalItem.id}-${previewKey}`}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                  >
                    <BannerProfilePreview
                      bannerUrl={activeModalItem.bannerUrl}
                      bundle={selectedBundle}
                      user={user}
                    />
                  </motion.div>
                ) : activeModalItem.kind === 'Placa de identificación' ? (
                  <motion.div
                    key={`plate-${selectedBundle.id}-${previewKey}`}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="my-2 space-y-2"
                  >
                    <p className="text-xs font-semibold text-zinc-400 px-1">
                      Vista previa en lista de miembros
                    </p>
                    <div className="rounded-2xl bg-[#13141a] border border-white/10 overflow-hidden divide-y divide-white/[0.06]">
                      <div className="px-3 py-2 flex items-center gap-3 opacity-55">
                        <UserAvatar avatar="phibi" size="md" showStatus={false} />
                        <span className="text-sm font-semibold text-white">Phibi</span>
                      </div>

                      <div className="px-3 py-2.5 flex items-center justify-between relative overflow-hidden anim-shimmer bg-[#16171f]">
                        <NameplateStripBackground
                          nameplate={activeModalItem.nameplateId || 'miyabi'}
                          accentColor={modalSwatch}
                        />
                        <div className="flex items-center gap-3 z-10">
                          <UserAvatar
                            avatar={user.avatar}
                            customAvatarUrl={user.customAvatarUrl}
                            decoration={selectedBundle.items[0]?.decorationId || 'none'}
                            decorationAccent={modalSwatch}
                            size="md"
                            showStatus={false}
                          />
                          <span
                            className={`font-display font-extrabold text-[15px] drop-shadow ${
                              activeModalItem.nameplateId === 'rama'
                                ? 'text-zinc-900'
                                : 'text-white'
                            }`}
                          >
                            {user.displayName}
                          </span>
                        </div>
                        <NameplateRowDecor
                          nameplate={activeModalItem.nameplateId || 'miyabi'}
                        />
                      </div>

                      <div className="px-3 py-2 flex items-center gap-3 opacity-55">
                        <UserAvatar avatar="locke" size="md" showStatus={false} />
                        <span className="text-sm font-semibold text-white">Locke</span>
                      </div>
                    </div>
                  </motion.div>
                ) : activeModalItem.kind === 'Efecto de perfil' ? (
                  <motion.div
                    key={`effect-${selectedBundle.id}-${previewKey}`}
                    initial={{ opacity: 0, scale: 0.94 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.94 }}
                  >
                    <ProfileEffectShowcase
                      bundle={selectedBundle}
                      user={user}
                      playKey={previewKey}
                    />
                  </motion.div>
                ) : (
                  <motion.div
                    key={`deco-${selectedBundle.id}-${activeModalItem.id}-${previewKey}`}
                    initial={{ opacity: 0, scale: 0.92 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.92 }}
                    className={`my-2 h-52 rounded-2xl overflow-hidden relative flex items-center justify-center bg-gradient-to-br ${
                      modalTheme?.gradient || 'from-slate-900 to-zinc-950'
                    } border border-white/15`}
                  >
                    <div
                      className="absolute inset-0 pointer-events-none"
                      style={{
                        background: `radial-gradient(circle at 50% 50%, ${
                          modalSwatch ? `${modalSwatch}55` : modalTheme?.glow || 'rgba(88,101,242,0.35)'
                        } 0%, rgba(8,9,13,0.85) 75%)`,
                      }}
                    />
                    <div className="relative z-10">
                      <UserAvatar
                        avatar={user.avatar}
                        customAvatarUrl={user.customAvatarUrl}
                        decoration={activeModalItem.decorationId || 'none'}
                        decorationAccent={modalSwatch}
                        size="2xl"
                        showStatus={false}
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="mt-2">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h2 className="font-display font-bold text-[21px] text-white leading-tight">
                      {selectedBundle.title}
                    </h2>
                    <p className="text-[13px] text-zinc-400 mt-0.5">
                      {fullPreviewMode
                        ? `${selectedBundle.items.length} artículos combinados · ${getCategoryLabel(
                            selectedBundle.category
                          )}`
                        : `${activeModalItem.name} · ${activeModalItem.kind}`}
                    </p>
                  </div>
                  {selectedBundle.colorSwatches && selectedBundle.colorSwatches.length > 0 && (
                    <div className="flex items-center gap-1.5 pt-1">
                      {selectedBundle.colorSwatches.map((hex) => (
                        <button
                          key={hex}
                          type="button"
                          onClick={() => setModalSwatch(hex)}
                          aria-label={`Color ${hex}`}
                          style={{ backgroundColor: hex }}
                          className={`w-5 h-5 rounded-full border-2 cursor-pointer transition-transform ${
                            modalSwatch === hex
                              ? 'border-white scale-115 shadow-lg'
                              : 'border-black/60 opacity-75 hover:opacity-100'
                          }`}
                        />
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2.5 mt-3.5 overflow-x-auto no-scrollbar py-0.5">
                  {selectedBundle.items.map((item, idx) => {
                    const selected = !fullPreviewMode && idx === selectedItemIndex;
                    return (
                      <motion.button
                        key={item.id}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.94 }}
                        onClick={() => {
                          setFullPreviewMode(false);
                          setSelectedItemIndex(idx);
                          setPreviewKey((k) => k + 1);
                        }}
                        className={`w-16 h-16 shrink-0 rounded-2xl bg-[#14151b] border flex items-center justify-center relative overflow-hidden cursor-pointer transition-all ${
                          selected
                            ? 'ring-2 ring-[#5865F2] border-transparent shadow-md'
                            : 'border-white/10 opacity-75 hover:opacity-100'
                        }`}
                      >
                        {item.kind === 'Decoración de avatar' && item.decorationId ? (
                          <div className="w-10 h-10 relative flex items-center justify-center">
                            <DiscordLogo className="w-6 h-6 text-zinc-400" />
                            <AvatarDecorationRing
                              decoration={item.decorationId}
                              accentColor={modalSwatch}
                            />
                          </div>
                        ) : item.kind === 'Banner de perfil' && item.bannerUrl ? (
                          <div className="w-full h-full relative flex items-center justify-center bg-zinc-900">
                            <img
                              src={item.bannerUrl}
                              alt=""
                              referrerPolicy="no-referrer"
                              className="absolute inset-0 w-full h-full object-cover"
                            />
                            <span className="relative z-10 text-[10px] font-bold text-white bg-black/70 px-1.5 py-0.5 rounded">
                              Banner
                            </span>
                          </div>
                        ) : item.kind === 'Placa de identificación' && item.nameplateId ? (
                          <div className="w-full h-full relative flex items-center justify-center bg-zinc-900">
                            <NameplateStripBackground
                              nameplate={item.nameplateId}
                              accentColor={modalSwatch}
                            />
                            <span className="relative z-10 text-[10px] font-bold text-white bg-black/70 px-1.5 py-0.5 rounded">
                              Placa
                            </span>
                          </div>
                        ) : (
                          <div className="w-full h-full relative flex items-center justify-center bg-zinc-900">
                            <div className="absolute inset-0 opacity-85">
                              <ThematicBundleArtwork variant={selectedBundle.artVariant} />
                            </div>
                            <span className="relative z-10 text-[10px] font-bold text-white bg-black/70 px-1.5 py-0.5 rounded">
                              Efecto
                            </span>
                          </div>
                        )}
                      </motion.button>
                    );
                  })}
                </div>

                <div className="mt-3.5 px-3.5 py-2.5 rounded-xl bg-[#14151b] border border-white/10 flex items-center justify-between">
                  <span className="text-xs font-semibold text-zinc-400">Precio del lote</span>
                  <span className="text-sm font-bold text-white tabular-nums">
                    ◈ {selectedBundle.priceOrbs} Orbs · {selectedBundle.priceUsd}
                  </span>
                </div>
              </div>

              <div className="mt-4 space-y-2.5">
                <div className="flex items-center gap-2.5">
                  {isSelectedOwned ? (
                    <motion.button
                      whileTap={{ scale: 0.97 }}
                      onClick={() => {
                        onEquipBundle(selectedBundle);
                        onSelectBundle(null);
                      }}
                      className="flex-1 h-12 rounded-full dc-btn-success font-bold text-[15px] flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap"
                    >
                      <Check className="w-4 h-4" />
                      <span>Equipar en tu perfil</span>
                    </motion.button>
                  ) : (
                    <motion.button
                      whileTap={{ scale: 0.97 }}
                      onClick={() => {
                        onBuyBundle(selectedBundle, user.orbs >= selectedBundle.priceOrbs);
                        setJustBoughtId(selectedBundle.id);
                        setTimeout(() => setJustBoughtId(null), 1600);
                      }}
                      className="flex-1 h-12 rounded-full dc-btn-primary font-bold text-[15px] cursor-pointer flex items-center justify-center gap-2 whitespace-nowrap"
                    >
                      {justBoughtId === selectedBundle.id && (
                        <Sparkles className="w-4 h-4 animate-spin" />
                      )}
                      <span>
                        {user.orbs >= selectedBundle.priceOrbs
                          ? `Comprar lote (◈ ${selectedBundle.priceOrbs})`
                          : `Comprar lote (${selectedBundle.priceUsd})`}
                      </span>
                    </motion.button>
                  )}

                  <motion.button
                    whileTap={{ scale: 0.94 }}
                    onClick={() => setShowGiftModal(true)}
                    aria-label="Regalar lote"
                    title="Enviar regalo (desbloquea insignia Hacer regalos)"
                    className="w-12 h-12 rounded-2xl dc-btn-primary flex items-center justify-center shrink-0 cursor-pointer"
                  >
                    <Gift className="w-5 h-5" />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Gift Recipient Modal */}
      <AnimatePresence>
        {showGiftModal && selectedBundle && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowGiftModal(false)}
            className="fixed inset-0 z-[60] bg-black/75 backdrop-blur-xs flex items-end md:items-center justify-center p-0 md:p-4"
          >
            <motion.div
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 30, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-sm bg-[#0e0f14] rounded-t-3xl md:rounded-3xl border border-white/10 p-5 space-y-4 shadow-2xl"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Gift className="w-5 h-5 text-[#5865F2]" />
                  <h3 className="font-display font-bold text-base text-white">Enviar regalo</h3>
                </div>
                <button
                  onClick={() => setShowGiftModal(false)}
                  className="w-8 h-8 rounded-full dc-btn-icon flex items-center justify-center cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <p className="text-xs text-zinc-400">
                Elige a un amigo para regalarle <strong className="text-white">{selectedBundle.title}</strong> (◈{' '}
                {selectedBundle.priceOrbs} Orbs). ¡Desbloquearás o subirás la insignia{' '}
                <strong className="text-white">Hacer regalos</strong>!
              </p>

              <div className="space-y-1.5 max-h-60 overflow-y-auto">
                {dms
                  .filter((d) => !d.isGroup && !d.isBot)
                  .map((friend) => (
                    <button
                      key={friend.id}
                      onClick={() => {
                        onGiftBundle(selectedBundle, friend.id, friend.name);
                        setShowGiftModal(false);
                        setGiftSentToast(`¡Regalo enviado a ${friend.name}! 🎁`);
                        setTimeout(() => setGiftSentToast(null), 2800);
                      }}
                      className="w-full p-2.5 rounded-2xl bg-[#14151b] hover:bg-[#1c1e26] border border-white/10 flex items-center justify-between gap-3 cursor-pointer transition-colors"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <UserAvatar
                          avatar={friend.avatar}
                          status={friend.status}
                          size="sm"
                          borderColor="#14151b"
                        />
                        <span className="text-sm font-bold text-white truncate">
                          {friend.name}
                        </span>
                      </div>
                      <span className="px-3 py-1 rounded-full dc-btn-primary text-xs font-bold shrink-0">
                        Regalar
                      </span>
                    </button>
                  ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
