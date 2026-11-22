import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  AvatarKey,
  DecorationId,
  NameplateId,
  PresenceStatus,
  ProfileEffectId,
  Server,
} from '../types/discord';

export const GENERATED_ASSETS = {
  madaraAvatar: '/src/assets/images/avatar_black_cat_1795349127144.jpg',
  snufAvatar: '/src/assets/images/avatar_tokyo_car_1795349126950.jpg',
  alexAvatar: '/src/assets/images/avatar_rooftop_dusk_1795349127113.jpg',
  joawasaAvatar: '/src/assets/images/avatar_shiba_portrait_1795349127656.jpg',
  dragonAvatar: '/src/assets/images/avatar_alpine_monolith_1795349126857.jpg',
  coffeeAvatar: '/src/assets/images/avatar_desk_coffee_1795349126809.jpg',
  hoyoverseIcon: '/src/assets/images/server_hoyoverse_1795280758930.jpg',
  reboIcon: '/src/assets/images/server_rebo_1795280759300.jpg',
  viceCityBanner: '/src/assets/images/banner_vice_city_1795280073889.jpg',
  zzzEllenBanner: '/src/assets/images/banner_zzz_ellen_1795280074875.jpg',
  deadpoolBanner: '/src/assets/images/banner_deadpool_duo_1795280758288.jpg',
  dbdBanner: '/src/assets/images/banner_dbd_1795280075129.jpg',
  duneBanner: '/src/assets/images/banner_dune_1795280073636.jpg',
  monopolyBanner: '/src/assets/images/banner_monopoly_city_1795280759244.jpg',
  shopMiyabiArt: '/src/assets/images/shop_miyabi_art_1795281106262.jpg',
  shopEllenArt: '/src/assets/images/shop_ellen_art_1795281108333.jpg',
  shopBurniceArt: '/src/assets/images/shop_burnice_art_1795281108082.jpg',
  shopLofiPlants: '/src/assets/images/shop_lofi_plants_1795281107687.jpg',
  shopCozyCat: '/src/assets/images/shop_cozy_cat_1795281108030.jpg',
  shopTrappedSouls: '/src/assets/images/shop_trapped_souls_1795281108312.jpg',
  shopObserverEyes: '/src/assets/images/shop_observer_eyes_1795281108045.jpg',
  shopGojoArt: '/src/assets/images/shop_gojo_art_1795286602337.jpg',
  shopSukunaArt: '/src/assets/images/shop_sukuna_art_1795286601954.jpg',
  shopYujiArt: '/src/assets/images/shop_yuji_art_1795286603030.jpg',
  shopCerberoArt: '/src/assets/images/shop_cerbero_art_1795286601612.jpg',
  shopLlamaInfernal: '/src/assets/images/shop_llama_infernal_1795286603800.jpg',
  shopRamaEnFlor: '/src/assets/images/shop_rama_en_flor_1795286601745.jpg',
  shopCondenacionEterna: '/src/assets/images/shop_condenacion_eterna_1795286601053.jpg',
  shopVamosAJugar: '/src/assets/images/shop_vamos_a_jugar_1795286601846.jpg',
  shopEspectroArt: '/src/assets/images/shop_espectro_art_1795286601969.jpg',
  shopGrabadoJapones: '/src/assets/images/shop_grabado_japones_1795286602758.jpg',
  shopLoboLuna: '/src/assets/images/shop_lobo_luna_1795286603884.jpg',
  shopPatoArt: '/src/assets/images/shop_el_mismo_pato_1795286960166.jpg',
  shopVaderArt: '/src/assets/images/shop_darth_vader_1795286979020.jpg',
  shopPesadillaArt: '/src/assets/images/shop_hora_pesadilla_1795286960539.jpg',
  zenithIcon: '/src/assets/images/server_zenith_icon_1795298975258.jpg',
  zenithBanner: '/src/assets/images/server_zenith_banner_1795298975451.jpg',
  shopCromaArt: '/src/assets/images/shop_croma_art_1795298975319.jpg',
  shopOrejasGato: '/src/assets/images/shop_orejas_gato_1795298975480.jpg',
  questBadgesBanner: '/src/assets/images/quest_badges_banner_1795298975739.jpg',
  questExterminautsBanner: '/src/assets/images/quest_exterminauts_banner_1795298975841.jpg',
  aldeaRoleplayIcon: '/src/assets/images/game_aldea_roleplay_1795298975176.jpg',
  boostPerksShowcase: '/src/assets/images/boost_perks_showcase_1795298974887.jpg',
  decoRingPesadilla: '/src/assets/images/deco_ring_pesadilla_1795335721769.jpg',
  decoRingGojo: '/src/assets/images/deco_ring_gojo_1795335722890.jpg',
  decoRingSukuna: '/src/assets/images/deco_ring_sukuna_1795335722623.jpg',
  decoRingGrabado: '/src/assets/images/deco_ring_grabado_1795335722748.jpg',
  decoRingLobo: '/src/assets/images/deco_ring_lobo_1795335722058.jpg',
};

export const SafeImage: React.FC<{
  src: string;
  alt: string;
  className?: string;
  style?: React.CSSProperties;
  fallbackGradient?: string;
  fallbackLabel?: string;
}> = ({
  src,
  alt,
  className = 'w-full h-full object-cover',
  style,
  fallbackGradient = 'from-indigo-950 via-slate-900 to-zinc-950',
  fallbackLabel,
}) => {
  const [errored, setErrored] = useState(false);

  if (errored || !src) {
    return (
      <div
        className={`w-full h-full bg-gradient-to-br ${fallbackGradient} flex items-center justify-center ${className}`}
        style={style}
      >
        {fallbackLabel && (
          <span className="font-display font-bold text-white/80 text-xs">{fallbackLabel}</span>
        )}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      onError={() => setErrored(true)}
      className={className}
      style={style}
    />
  );
};

export const PrimordialAppIcon: React.FC<{ className?: string }> = ({
  className = 'w-16 h-16 rounded-2xl',
}) => (
  <img
    src="/icon-192.png?v=2"
    alt="Primordial"
    className={`object-cover select-none ${className}`}
  />
);

export const DiscordLogo: React.FC<{ className?: string }> = ({ className = 'w-6 h-6' }) => (
  <svg viewBox="0 0 127.14 96.36" fill="currentColor" className={className} aria-hidden="true">
    <path d="M107.7,8.07A105.15,105.15,0,0,0,81.47,0a72.06,72.06,0,0,0-3.36,6.83A97.68,97.68,0,0,0,49,6.83,72.37,72.37,0,0,0,45.64,0,105.89,105.89,0,0,0,19.39,8.09C2.79,32.65-1.71,56.6.54,80.21h0A105.73,105.73,0,0,0,32.71,96.36,77.7,77.7,0,0,0,39.6,85.25a68.42,68.42,0,0,1-10.85-5.18c.91-.66,1.8-1.34,2.66-2a75.57,75.57,0,0,0,64.32,0c.87.71,1.76,1.39,2.66,2a68.68,68.68,0,0,1-10.87,5.19,77,77,0,0,0,6.89,11.1A105.25,105.25,0,0,0,126.6,80.22h0C129.24,52.84,122.09,29.11,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53s5-12.74,11.43-12.74S54,46,53.89,53,48.84,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.25,60,73.25,53s5-12.74,11.44-12.74S96.23,46,96.12,53,91.08,65.69,84.69,65.69Z" />
  </svg>
);

export const NitroWheelIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 15.5c-3.04 0-5.5-2.46-5.5-5.5S8.96 6.5 12 6.5s5.5 2.46 5.5 5.5-2.46 5.5-5.5 5.5z" />
    <circle cx="12" cy="12" r="2.6" />
    <path d="M2.5 8.5h4l1.5 2.5H2.1zM1.8 12.5h4.2l1.2 2H2.2z" opacity="0.85" />
  </svg>
);

export const OrbsCrystalIcon: React.FC<{ className?: string; colored?: boolean }> = ({
  className = 'w-5 h-5',
  colored = false,
}) =>
  colored ? (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="orbGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#60a5fa" />
          <stop offset="50%" stopColor="#818cf8" />
          <stop offset="100%" stopColor="#c084fc" />
        </linearGradient>
      </defs>
      <circle cx="24" cy="24" r="20" fill="#18181f" stroke="url(#orbGrad)" strokeWidth="2.5" />
      <polygon points="24,8 37,16 37,32 24,40 11,32 11,16" fill="url(#orbGrad)" opacity="0.9" />
      <path d="M24 14 L27 21 L34 24 L27 27 L24 34 L21 27 L14 24 L21 21 Z" fill="#ffffff" />
    </svg>
  ) : (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M12 2L3.5 7v10L12 22l8.5-5V7L12 2zm0 4.2l1.6 4.2L17.8 12l-4.2 1.6L12 17.8l-1.6-4.2L6.2 12l4.2-1.6L12 6.2z" />
    </svg>
  );

export const LaurelQuestIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M5.5 4.5C3.5 7 3 10.5 4.2 13.8c1 2.7 3.2 4.8 6 5.6l.6-1.9c-2.1-.6-3.7-2.2-4.5-4.3-.9-2.4-.5-5.1 1-7L5.5 4.5zm13 0l-1.8 1.7c1.5 1.9 1.9 4.6 1 7-.8 2.1-2.4 3.7-4.5 4.3l.6 1.9c2.8-.8 5-2.9 6-5.6 1.2-3.3.7-6.8-1.3-9.3z" />
    <path d="M9.5 19.5h5v1.8h-5z" />
    <circle cx="12" cy="11" r="2.2" opacity="0.35" />
  </svg>
);

export const StatusIndicator: React.FC<{
  status: PresenceStatus;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  borderColor?: string;
}> = ({ status, size = 'sm', borderColor = 'var(--dc-bg-sidebar)' }) => {
  const dim =
    size === 'xs'
      ? 'w-3 h-3 border-[2.5px] border-solid'
      : size === 'sm'
      ? 'w-3.5 h-3.5 border-[2.5px] border-solid'
      : size === 'md'
      ? 'w-[18px] h-[18px] border-[3.5px] border-solid'
      : 'w-5 h-5 border-[4px] border-solid';

  if (status === 'online') {
    return (
      <span
        style={{ borderColor }}
        className={`${dim} rounded-full bg-[#23a55a] inline-block shrink-0`}
        title="En línea"
      />
    );
  }
  if (status === 'dnd') {
    return (
      <span
        style={{ borderColor }}
        className={`${dim} rounded-full bg-[#da373c] inline-flex items-center justify-center shrink-0`}
        title="No molestar"
      >
        <span className="w-[55%] h-[2px] bg-white rounded-full" />
      </span>
    );
  }
  if (status === 'idle') {
    return (
      <span
        style={{ borderColor }}
        className={`${dim} rounded-full bg-[#f0b232] inline-flex items-center justify-center shrink-0 relative`}
        title="Ausente"
      >
        <span
          style={{ backgroundColor: borderColor }}
          className="w-[45%] h-[45%] rounded-full absolute -top-[1px] -left-[1px]"
        />
      </span>
    );
  }
  return (
    <span
      style={{ borderColor }}
      className={`${dim} rounded-full bg-[#80848e] inline-flex items-center justify-center shrink-0`}
      title="Desconectado"
    >
      <span style={{ backgroundColor: borderColor }} className="w-[46%] h-[46%] rounded-full" />
    </span>
  );
};

export const AvatarArtwork: React.FC<{ avatar: AvatarKey; className?: string }> = ({
  avatar,
  className = 'w-full h-full',
}) => {
  switch (avatar) {
    case 'madara':
      return (
        <img
          src={GENERATED_ASSETS.madaraAvatar}
          alt="Avatar Gato Noir"
          referrerPolicy="no-referrer"
          className={`${className} object-cover`}
        />
      );
    case 'snuf':
      return (
        <img
          src={GENERATED_ASSETS.snufAvatar}
          alt="Avatar Tokyo Night"
          referrerPolicy="no-referrer"
          className={`${className} object-cover`}
        />
      );
    case 'alex':
      return (
        <img
          src={GENERATED_ASSETS.alexAvatar}
          alt="Avatar Atardecer"
          referrerPolicy="no-referrer"
          className={`${className} object-cover`}
        />
      );
    case 'joawasa':
      return (
        <img
          src={GENERATED_ASSETS.joawasaAvatar}
          alt="Avatar Shiba Inu"
          referrerPolicy="no-referrer"
          className={`${className} object-cover`}
        />
      );
    case 'dragon':
      return (
        <img
          src={GENERATED_ASSETS.dragonAvatar}
          alt="Avatar Cumbre B&N"
          referrerPolicy="no-referrer"
          className={`${className} object-cover scale-110`}
        />
      );
    case 'coffee':
    case 'phibi':
      return (
        <img
          src={GENERATED_ASSETS.coffeeAvatar}
          alt="Avatar Café y Vinilo"
          referrerPolicy="no-referrer"
          className={`${className} object-cover`}
        />
      );
    case 'locke':
      return (
        <svg viewBox="0 0 100 100" className={className}>
          <defs>
            <linearGradient id="lockeClean" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#6366f1" />
              <stop offset="100%" stopColor="#312e81" />
            </linearGradient>
          </defs>
          <rect width="100" height="100" fill="url(#lockeClean)" />
          <circle cx="50" cy="50" r="30" fill="none" stroke="rgba(255,255,255,0.22)" strokeWidth="2" />
          <text
            x="50"
            y="59"
            textAnchor="middle"
            fill="#ffffff"
            fontSize="30"
            fontWeight="800"
            fontFamily="sans-serif"
            letterSpacing="-1"
          >
            LK
          </text>
        </svg>
      );
    case 'bumper':
    case 'yourbot':
      return (
        <svg viewBox="0 0 100 100" className={className}>
          <defs>
            <linearGradient id={`botClean-${avatar}`} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor={avatar === 'bumper' ? '#2563eb' : '#4f46e5'} />
              <stop offset="100%" stopColor="#0f172a" />
            </linearGradient>
          </defs>
          <rect width="100" height="100" fill={`url(#botClean-${avatar})`} />
          <rect x="26" y="32" width="48" height="36" rx="12" fill="rgba(255,255,255,0.14)" stroke="rgba(255,255,255,0.3)" strokeWidth="2" />
          <circle cx="41" cy="50" r="4.5" fill="#e0f2fe" />
          <circle cx="59" cy="50" r="4.5" fill="#e0f2fe" />
        </svg>
      );
    case 'discrofy':
      return (
        <svg viewBox="0 0 100 100" className={className}>
          <defs>
            <linearGradient id="discrofyGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#2c2f36" />
              <stop offset="100%" stopColor="#16171b" />
            </linearGradient>
          </defs>
          <rect width="100" height="100" fill="url(#discrofyGrad)" />
          <circle cx="50" cy="50" r="36" fill="#23252b" stroke="#3f424b" strokeWidth="2" />
          <text
            x="50"
            y="55"
            textAnchor="middle"
            fill="#e4e4e7"
            fontSize="14.5"
            fontWeight="800"
            fontFamily="sans-serif"
          >
            Discrofy
          </text>
        </svg>
      );
    case 'dev':
      return (
        <svg viewBox="0 0 100 100" className={className}>
          <defs>
            <linearGradient id="devGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="100%" stopColor="#1d4ed8" />
            </linearGradient>
          </defs>
          <rect width="100" height="100" fill="url(#devGrad)" />
          <g transform="translate(22, 27) scale(0.44)" fill="#ffffff">
            <path d="M107.7,8.07A105.15,105.15,0,0,0,81.47,0a72.06,72.06,0,0,0-3.36,6.83A97.68,97.68,0,0,0,49,6.83,72.37,72.37,0,0,0,45.64,0,105.89,105.89,0,0,0,19.39,8.09C2.79,32.65-1.71,56.6.54,80.21h0A105.73,105.73,0,0,0,32.71,96.36,77.7,77.7,0,0,0,39.6,85.25a68.42,68.42,0,0,1-10.85-5.18c.91-.66,1.8-1.34,2.66-2a75.57,75.57,0,0,0,64.32,0c.87.71,1.76,1.39,2.66,2a68.68,68.68,0,0,1-10.87,5.19,77,77,0,0,0,6.89,11.1A105.25,105.25,0,0,0,126.6,80.22h0C129.24,52.84,122.09,29.11,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53s5-12.74,11.43-12.74S54,46,53.89,53,48.84,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.25,60,73.25,53s5-12.74,11.44-12.74S96.23,46,96.12,53,91.08,65.69,84.69,65.69Z" />
          </g>
        </svg>
      );
    case 'welcomer':
      return (
        <svg viewBox="0 0 100 100" className={className}>
          <defs>
            <linearGradient id="welcGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#10b981" />
              <stop offset="100%" stopColor="#047857" />
            </linearGradient>
          </defs>
          <rect width="100" height="100" fill="url(#welcGrad)" />
          <text
            x="50"
            y="59"
            textAnchor="middle"
            fill="#ffffff"
            fontSize="30"
            fontWeight="800"
            fontFamily="sans-serif"
          >
            W
          </text>
        </svg>
      );
    case 'carioca':
      return (
        <svg viewBox="0 0 100 100" className={className}>
          <defs>
            <linearGradient id="cariocaClean" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#ec4899" />
              <stop offset="100%" stopColor="#831843" />
            </linearGradient>
          </defs>
          <rect width="100" height="100" fill="url(#cariocaClean)" />
          <text
            x="50"
            y="59"
            textAnchor="middle"
            fill="#ffffff"
            fontSize="30"
            fontWeight="800"
            fontFamily="sans-serif"
          >
            CR
          </text>
        </svg>
      );
    case 'jorge':
      return (
        <svg viewBox="0 0 100 100" className={className}>
          <defs>
            <linearGradient id="jorgeClean" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#e11d48" />
              <stop offset="100%" stopColor="#881337" />
            </linearGradient>
          </defs>
          <rect width="100" height="100" fill="url(#jorgeClean)" />
          <text
            x="50"
            y="59"
            textAnchor="middle"
            fill="#ffffff"
            fontSize="30"
            fontWeight="800"
            fontFamily="sans-serif"
          >
            JG
          </text>
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 100 100" className={className}>
          <defs>
            <linearGradient id="defaultClean" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#5865F2" />
              <stop offset="100%" stopColor="#312e81" />
            </linearGradient>
          </defs>
          <rect width="100" height="100" fill="url(#defaultClean)" />
          <g transform="translate(22, 27) scale(0.44)" fill="#ffffff">
            <path d="M107.7,8.07A105.15,105.15,0,0,0,81.47,0a72.06,72.06,0,0,0-3.36,6.83A97.68,97.68,0,0,0,49,6.83,72.37,72.37,0,0,0,45.64,0,105.89,105.89,0,0,0,19.39,8.09C2.79,32.65-1.71,56.6.54,80.21h0A105.73,105.73,0,0,0,32.71,96.36,77.7,77.7,0,0,0,39.6,85.25a68.42,68.42,0,0,1-10.85-5.18c.91-.66,1.8-1.34,2.66-2a75.57,75.57,0,0,0,64.32,0c.87.71,1.76,1.39,2.66,2a68.68,68.68,0,0,1-10.87,5.19,77,77,0,0,0,6.89,11.1A105.25,105.25,0,0,0,126.6,80.22h0C129.24,52.84,122.09,29.11,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53s5-12.74,11.43-12.74S54,46,53.89,53,48.84,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.25,60,73.25,53s5-12.74,11.44-12.74S96.23,46,96.12,53,91.08,65.69,84.69,65.69Z" />
          </g>
        </svg>
      );
  }
};

export const AvatarDecorationRing: React.FC<{
  decoration: DecorationId;
  accentColor?: string;
}> = ({ decoration, accentColor }) => {
  if (decoration === 'none') return null;

  /* 1. Hoshimi Miyabi — Glacial Cyan Foxfire Halo, Kitsune Eye & Frost Talisman */
  if (decoration === 'miyabi') {
    return (
      <div className="absolute -inset-[22%] w-[144%] h-[144%] pointer-events-none z-10">
        <svg viewBox="0 0 120 120" className="w-full h-full overflow-visible">
          <defs>
            <linearGradient id="miyabiFlameGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#a5f3fc" />
              <stop offset="45%" stopColor="#22d3ee" />
              <stop offset="100%" stopColor="#0284c7" />
            </linearGradient>
            <linearGradient id="miyabiScarfGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#09090b" />
              <stop offset="50%" stopColor="#27272a" />
              <stop offset="100%" stopColor="#09090b" />
            </linearGradient>
            <filter id="miyabiGlow" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="2.4" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          <circle cx="60" cy="60" r="50" fill="none" stroke="url(#miyabiFlameGrad)" strokeWidth="2.2" opacity="0.65" />
          <g className="anim-flame" filter="url(#miyabiGlow)">
            <path
              d="M14 48 Q20 10 62 7 Q89 9 102 26 Q81 15 56 20 Q33 25 14 48 Z"
              fill="url(#miyabiFlameGrad)"
              opacity="0.95"
            />
            <path d="M24 26 Q47 3 80 13 Q57 10 38 22 Z" fill="#ecfeff" opacity="0.82" />
            <path d="M98 76 Q92 103 60 112 Q84 98 94 74 Z" fill="#22d3ee" opacity="0.7" />
          </g>
          {/* Floating Kitsune Spirit Mask */}
          <g className="anim-float">
            <circle cx="95" cy="28" r="14" fill="#09090b" stroke="#22d3ee" strokeWidth="2.2" />
            <circle cx="95" cy="28" r="11" fill="none" stroke="#67e8f9" strokeWidth="0.7" opacity="0.6" />
            <path d="M84 15 L89 21 M104 15 L99 21" stroke="#22d3ee" strokeWidth="2.6" strokeLinecap="round" />
            <g className="anim-eye-blink">
              <ellipse cx="95" cy="29" rx="7.2" ry="4" fill="#ef4444" />
              <ellipse cx="95" cy="29" rx="3" ry="3.8" fill="#09090b" />
              <circle cx="96.5" cy="27.5" r="1.1" fill="#ffffff" />
            </g>
          </g>
          {/* Traditional Hairpin & Collar */}
          <path d="M22 92 Q60 115 98 92" stroke="url(#miyabiScarfGrad)" strokeWidth="8" fill="none" strokeLinecap="round" />
          <path d="M26 92 Q60 111 94 92" stroke="#52525b" strokeWidth="2" fill="none" strokeLinecap="round" />
          <rect x="44" y="96" width="32" height="10" rx="5" fill="#f4f4f5" stroke="#18181b" strokeWidth="1.8" />
          <line x1="55" y1="97" x2="55" y2="105" stroke="#18181b" strokeWidth="1.4" />
          <line x1="65" y1="97" x2="65" y2="105" stroke="#18181b" strokeWidth="1.4" />
          {/* Frost Talisman */}
          <g className="anim-sway">
            <rect
              x="7"
              y="66"
              width="16"
              height="19"
              rx="2.5"
              fill="#f4f4f5"
              stroke="#18181b"
              strokeWidth="1.5"
              transform="rotate(-14 15 75)"
            />
            <path d="M12 70 L18 70 M15 70 L15 80 M12 75 L18 75" stroke="#0891b2" strokeWidth="1.8" strokeLinecap="round" transform="rotate(-14 15 75)" />
          </g>
        </svg>
      </div>
    );
  }

  /* 2. Ellen Joe — Shark Maid Headband, Dorsal Teeth & Crimson Tail Accent */
  if (decoration === 'ellen') {
    return (
      <div className="absolute -inset-[20%] w-[140%] h-[140%] pointer-events-none z-10">
        <svg viewBox="0 0 120 120" className="w-full h-full overflow-visible">
          <defs>
            <linearGradient id="ellenRing" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#f43f5e" />
              <stop offset="50%" stopColor="#e4e4e7" />
              <stop offset="100%" stopColor="#38bdf8" />
            </linearGradient>
          </defs>
          <circle cx="60" cy="60" r="50.5" fill="none" stroke="url(#ellenRing)" strokeWidth="2.5" opacity="0.7" />
          <g className="anim-float">
            <path d="M16 40 Q60 -2 104 40" stroke="#f8fafc" strokeWidth="9" fill="none" strokeLinecap="round" />
            <path d="M20 39 Q60 2 100 39" stroke="#e11d48" strokeWidth="3" fill="none" strokeLinecap="round" />
            <polygon points="31,27 39,40 47,24" fill="#ffffff" stroke="#18181b" strokeWidth="1.2" strokeLinejoin="round" />
            <polygon points="52,17 60,33 68,17" fill="#ffffff" stroke="#18181b" strokeWidth="1.2" strokeLinejoin="round" />
            <polygon points="73,24 81,40 89,27" fill="#ffffff" stroke="#18181b" strokeWidth="1.2" strokeLinejoin="round" />
          </g>
          <path d="M22 86 Q60 117 98 86" stroke="#09090b" strokeWidth="8.5" fill="none" strokeLinecap="round" />
          <path d="M25 86 Q60 114 95 86" stroke="#27272a" strokeWidth="3" fill="none" strokeLinecap="round" />
          <polygon points="38,96 45,83 52,99" fill="#f8fafc" stroke="#18181b" strokeWidth="1" />
          <polygon points="68,99 75,83 82,96" fill="#f8fafc" stroke="#18181b" strokeWidth="1" />
          <circle cx="96" cy="84" r="7.5" fill="#e11d48" stroke="#ffffff" strokeWidth="1.8" />
          <circle cx="96" cy="84" r="2.6" fill="#fef2f2" />
        </svg>
      </div>
    );
  }

  /* 3. Burnice White — Nitro-Fuel Blazing Pyromaniac Halo */
  if (decoration === 'burnice') {
    return (
      <div className="absolute -inset-[22%] w-[144%] h-[144%] pointer-events-none z-10">
        <svg viewBox="0 0 120 120" className="w-full h-full overflow-visible anim-ember">
          <defs>
            <linearGradient id="burniceRing" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#fef08a" />
              <stop offset="45%" stopColor="#f97316" />
              <stop offset="100%" stopColor="#dc2626" />
            </linearGradient>
          </defs>
          <circle cx="60" cy="60" r="51" fill="none" stroke="url(#burniceRing)" strokeWidth="5.5" />
          <circle cx="60" cy="60" r="48" fill="none" stroke="#fef9c3" strokeWidth="1" opacity="0.65" />
          <path d="M14 48 Q8 14 36 10 Q27 26 39 30 Q24 35 14 48 Z" fill="url(#burniceRing)" />
          <path d="M106 48 Q112 14 84 10 Q93 26 81 30 Q96 35 106 48 Z" fill="url(#burniceRing)" />
          <circle cx="22" cy="95" r="5" fill="#fde047" />
          <circle cx="98" cy="95" r="5" fill="#fb923c" />
          <circle cx="60" cy="7" r="3" fill="#fef08a" />
        </svg>
      </div>
    );
  }

  /* 4. Lofi Plants — Botanical Terrarium Vine & Morning Dew Ring */
  if (decoration === 'plantas' || decoration === 'lofi') {
    return (
      <div className="absolute -inset-[20%] w-[140%] h-[140%] pointer-events-none z-10">
        <svg viewBox="0 0 120 120" className="w-full h-full overflow-visible anim-sway">
          <defs>
            <linearGradient id="lofiVineGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#84cc16" />
              <stop offset="50%" stopColor="#4d7c0f" />
              <stop offset="100%" stopColor="#15803d" />
            </linearGradient>
          </defs>
          <circle cx="60" cy="60" r="50.5" fill="none" stroke="url(#lofiVineGrad)" strokeWidth="4.2" opacity="0.92" />
          <path d="M18 42 Q32 8 64 11 Q95 15 102 48" stroke="#65a30d" strokeWidth="2.8" fill="none" strokeLinecap="round" />
          <path d="M20 76 Q32 108 62 108 Q92 106 100 76" stroke="#84cc16" strokeWidth="2.4" fill="none" strokeLinecap="round" opacity="0.85" />
          <ellipse cx="21" cy="46" rx="7" ry="10.5" fill="#65a30d" stroke="#365314" strokeWidth="1" transform="rotate(-24 21 46)" />
          <ellipse cx="15" cy="68" rx="6" ry="9" fill="#84cc16" stroke="#365314" strokeWidth="1" transform="rotate(14 15 68)" />
          <ellipse cx="99" cy="44" rx="7" ry="10.5" fill="#4d7c0f" stroke="#365314" strokeWidth="1" transform="rotate(24 99 44)" />
          <ellipse cx="101" cy="67" rx="6" ry="9" fill="#65a30d" stroke="#365314" strokeWidth="1" transform="rotate(-14 101 67)" />
          <circle cx="50" cy="12" r="5.2" fill="#fef08a" />
          <circle cx="50" cy="12" r="2.2" fill="#f97316" />
          <circle cx="78" cy="17" r="4.2" fill="#fde047" />
          <circle cx="78" cy="17" r="1.8" fill="#ea580c" />
          <circle cx="88" cy="98" r="4.5" fill="#7dd3fc" opacity="0.9" />
        </svg>
      </div>
    );
  }

  /* 5. Onda cromática — Studio Liquid Iridescent Prism Swirl */
  if (decoration === 'croma') {
    return (
      <div className="absolute -inset-[26%] w-[152%] h-[152%] pointer-events-none z-10">
        <div
          className="w-full h-full rounded-full overflow-hidden anim-spin-slow"
          style={{
            WebkitMaskImage:
              'radial-gradient(circle, transparent 42%, rgba(0,0,0,0.9) 50%, black 66%, transparent 94%)',
            maskImage:
              'radial-gradient(circle, transparent 42%, rgba(0,0,0,0.9) 50%, black 66%, transparent 94%)',
            mixBlendMode: 'screen',
            filter: 'saturate(1.25) contrast(1.1) drop-shadow(0 0 12px rgba(168,85,247,0.65))',
          }}
        >
          <img
            src={GENERATED_ASSETS.shopCromaArt}
            alt=""
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover scale-115"
          />
        </div>
        <svg viewBox="0 0 120 120" className="absolute inset-0 w-full h-full overflow-visible">
          <circle cx="60" cy="60" r="44" fill="none" stroke="rgba(255,255,255,0.45)" strokeWidth="1.2" />
        </svg>
      </div>
    );
  }

  /* 6. Gato cómodo — Sleeping Ginger Tabby Purring Above Avatar */
  if (decoration === 'gato') {
    return (
      <div className="absolute -inset-[21%] w-[142%] h-[142%] pointer-events-none z-10">
        <svg viewBox="0 0 120 120" className="w-full h-full overflow-visible anim-float">
          <defs>
            <linearGradient id="tabbyFur" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#fb923c" />
              <stop offset="100%" stopColor="#c2410c" />
            </linearGradient>
          </defs>
          <circle cx="60" cy="60" r="50" fill="none" stroke="#fb923c" strokeWidth="2.5" opacity="0.5" />
          <ellipse cx="60" cy="19" rx="25" ry="13.5" fill="url(#tabbyFur)" stroke="#7c2d12" strokeWidth="1.6" />
          <path d="M47 11 Q51 19 47 26 M58 9 Q62 19 58 27 M69 10 Q73 19 69 26" stroke="#7c2d12" strokeWidth="2.4" fill="none" strokeLinecap="round" />
          <polygon points="41,14 46,2 54,12" fill="#ea580c" stroke="#7c2d12" strokeWidth="1.4" strokeLinejoin="round" />
          <polygon points="66,12 74,2 79,14" fill="#ea580c" stroke="#7c2d12" strokeWidth="1.4" strokeLinejoin="round" />
          <polygon points="44,12 47,5 51,11" fill="#fed7aa" />
          <polygon points="69,11 73,5 76,12" fill="#fed7aa" />
          <path d="M49 19 Q53 22 57 19 M63 19 Q67 22 71 19" stroke="#fef3c7" strokeWidth="1.9" fill="none" strokeLinecap="round" />
          <path d="M82 22 Q100 26 94 40" stroke="#c2410c" strokeWidth="5.5" fill="none" strokeLinecap="round" />
          <text x="90" y="13" fill="#fde047" fontSize="9.5" fontWeight="900">
            Zzz
          </text>
        </svg>
      </div>
    );
  }

  /* 7. Alex Cyber Ring */
  if (decoration === 'alex') {
    return (
      <div className="absolute -inset-[18%] w-[136%] h-[136%] pointer-events-none z-10">
        <svg viewBox="0 0 120 120" className="w-full h-full overflow-visible">
          <defs>
            <linearGradient id="alexRingGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="50%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#60a5fa" />
            </linearGradient>
          </defs>
          <g className="anim-spin-slow" style={{ transformOrigin: '60px 60px' }}>
            <circle cx="60" cy="60" r="51" fill="none" stroke="url(#alexRingGrad)" strokeWidth="4.5" strokeDasharray="22 7" />
            <circle cx="96" cy="24" r="5" fill="#fbbf24" />
          </g>
        </svg>
      </div>
    );
  }

  /* 8. Marvel Deadpool & Wolverine — Crossed Adamantium Claws & Twin Katanas */
  if (decoration === 'deadpool' || decoration === 'wolverine') {
    const isWolv = decoration === 'wolverine';
    return (
      <div className="absolute -inset-[20%] w-[140%] h-[140%] pointer-events-none z-10">
        <svg viewBox="0 0 120 120" className="w-full h-full overflow-visible anim-ember">
          <defs>
            <linearGradient id="katanaSteel" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#f8fafc" />
              <stop offset="50%" stopColor="#94a3b8" />
              <stop offset="100%" stopColor="#ef4444" />
            </linearGradient>
          </defs>
          {isWolv ? (
            <>
              <circle cx="60" cy="60" r="51" fill="none" stroke="#eab308" strokeWidth="4.5" />
              <path d="M12 24 L37 44 M8 34 L34 52 M17 15 L41 37" stroke="#fef08a" strokeWidth="4.2" strokeLinecap="round" />
              <path d="M108 24 L83 44 M112 34 L86 52 M103 15 L79 37" stroke="#facc15" strokeWidth="4.2" strokeLinecap="round" />
            </>
          ) : (
            <>
              <line x1="12" y1="12" x2="108" y2="108" stroke="#991b1b" strokeWidth="6" strokeLinecap="round" />
              <line x1="108" y1="12" x2="12" y2="108" stroke="url(#katanaSteel)" strokeWidth="4.5" strokeLinecap="round" />
              <circle cx="60" cy="60" r="51" fill="none" stroke="#dc2626" strokeWidth="4.8" />
              <circle cx="60" cy="60" r="47.5" fill="none" stroke="#fca5a5" strokeWidth="1" opacity="0.6" />
            </>
          )}
        </svg>
      </div>
    );
  }

  /* 9. Dead by Daylight — The Entity's Jagged Claw Ring & Embers */
  if (decoration === 'dbd') {
    return (
      <div className="absolute -inset-[20%] w-[140%] h-[140%] pointer-events-none z-10">
        <svg viewBox="0 0 120 120" className="w-full h-full overflow-visible anim-ember">
          <defs>
            <linearGradient id="dbdFireRing" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#f97316" />
              <stop offset="50%" stopColor="#dc2626" />
              <stop offset="100%" stopColor="#7f1d1d" />
            </linearGradient>
          </defs>
          <circle cx="60" cy="60" r="50.5" fill="none" stroke="url(#dbdFireRing)" strokeWidth="4.2" />
          <path d="M12 24 L34 44 L22 39 Z" fill="#ea580c" stroke="#18181b" strokeWidth="1.2" />
          <path d="M108 24 L86 44 L98 39 Z" fill="#dc2626" stroke="#18181b" strokeWidth="1.2" />
          <path d="M14 94 L35 76 L24 89 Z" fill="#f97316" stroke="#18181b" strokeWidth="1.2" />
          <path d="M106 94 L85 76 L96 89 Z" fill="#ea580c" stroke="#18181b" strokeWidth="1.2" />
          <circle cx="26" cy="16" r="2.6" fill="#fde047" />
          <circle cx="98" cy="90" r="2.6" fill="#fb923c" />
        </svg>
      </div>
    );
  }

  /* 10. Almas atrapadas / Observador — Spectral Eyes & Mist Ring */
  if (decoration === 'almas' || decoration === 'observador') {
    return (
      <div className="absolute -inset-[20%] w-[140%] h-[140%] pointer-events-none z-10">
        <svg viewBox="0 0 120 120" className="w-full h-full overflow-visible anim-ghost">
          <circle cx="60" cy="60" r="50.5" fill="none" stroke="#e4e4e7" strokeWidth="3" strokeDasharray="16 5 5 5" opacity="0.85" />
          <g className="anim-eye-blink">
            <ellipse cx="95" cy="28" rx="11.5" ry="6" fill="#ffffff" stroke="#09090b" strokeWidth="1.6" />
            <circle cx="95" cy="28" r="3.4" fill="#09090b" />
            <circle cx="96.3" cy="26.7" r="1.1" fill="#ffffff" />
          </g>
          <g className="anim-eye-blink">
            <ellipse cx="25" cy="90" rx="9.5" ry="5" fill="#e4e4e7" stroke="#09090b" strokeWidth="1.6" />
            <circle cx="25" cy="90" r="2.7" fill="#09090b" />
            <circle cx="26" cy="88.8" r="0.9" fill="#ffffff" />
          </g>
        </svg>
      </div>
    );
  }

  /* 11. Llama infernal & Cerbero — Studio-Painted Swirling Hellfire Ring */
  if (decoration === 'llama' || decoration === 'cerbero') {
    const isCerb = decoration === 'cerbero';
    return (
      <div className="absolute -inset-[28%] w-[156%] h-[156%] pointer-events-none z-10">
        <div
          className="w-full h-full rounded-full overflow-hidden anim-spin-slow"
          style={{
            WebkitMaskImage:
              'radial-gradient(circle, transparent 41%, rgba(0,0,0,0.92) 49%, black 66%, transparent 94%)',
            maskImage:
              'radial-gradient(circle, transparent 41%, rgba(0,0,0,0.92) 49%, black 66%, transparent 94%)',
            mixBlendMode: 'screen',
            filter: 'saturate(1.25) drop-shadow(0 0 14px rgba(236,72,153,0.85))',
          }}
        >
          <img
            src={GENERATED_ASSETS.shopLlamaInfernal}
            alt=""
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover scale-120"
          />
        </div>
        {isCerb && (
          <svg viewBox="0 0 120 120" className="absolute inset-0 w-full h-full overflow-visible anim-ember">
            <circle cx="98" cy="22" r="4.5" fill="#f472b6" />
            <circle cx="22" cy="98" r="4" fill="#fde047" />
          </svg>
        )}
      </div>
    );
  }

  /* 12. Orejas de gato — Ultra-Plush Multi-Swatch Cat Ears & Tapered Whiskers */
  if (decoration === 'orejas') {
    const innerTint = accentColor || '#f9a8d4';
    const outerTint =
      accentColor === '#fde047'
        ? '#fefce8'
        : accentColor === '#86efac'
        ? '#f0fdf4'
        : accentColor === '#c084fc'
        ? '#faf5ff'
        : '#f8fafc';
    const shadowTint =
      accentColor === '#fde047'
        ? '#fef08a'
        : accentColor === '#86efac'
        ? '#bbf7d0'
        : accentColor === '#c084fc'
        ? '#e9d5ff'
        : '#e2e8f0';
    return (
      <div className="absolute -inset-[22%] w-[144%] h-[144%] pointer-events-none z-10">
        <svg viewBox="0 0 120 120" className="w-full h-full overflow-visible anim-float">
          <defs>
            <linearGradient id="catEarOuterL" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="65%" stopColor={outerTint} />
              <stop offset="100%" stopColor={shadowTint} />
            </linearGradient>
            <linearGradient id="catEarInner" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={innerTint} />
              <stop offset="100%" stopColor={innerTint} stopOpacity="0.55" />
            </linearGradient>
            <filter id="plushShadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#000000" floodOpacity="0.45" />
            </filter>
          </defs>
          <g filter="url(#plushShadow)">
            {/* Left Plush Ear */}
            <path
              d="M15 49 Q13 13 24 8 Q37 12 49 28 Q32 36 15 49 Z"
              fill="url(#catEarOuterL)"
              stroke="#18181b"
              strokeWidth="2.2"
              strokeLinejoin="round"
            />
            <path d="M20 42 Q20 19 26 15 Q35 19 43 29 Q31 35 20 42 Z" fill="url(#catEarInner)" />
            <path d="M23 38 L29 29 M28 36 L34 28" stroke="#ffffff" strokeWidth="1.5" opacity="0.8" strokeLinecap="round" />
            {/* Right Plush Ear */}
            <path
              d="M105 49 Q107 13 96 8 Q83 12 71 28 Q88 36 105 49 Z"
              fill="url(#catEarOuterL)"
              stroke="#18181b"
              strokeWidth="2.2"
              strokeLinejoin="round"
            />
            <path d="M100 42 Q100 19 94 15 Q85 19 77 29 Q89 35 100 42 Z" fill="url(#catEarInner)" />
            <path d="M97 38 L91 29 M92 36 L86 28" stroke="#ffffff" strokeWidth="1.5" opacity="0.8" strokeLinecap="round" />
          </g>
          {/* Tapered Double-Tone Whiskers */}
          <g strokeLinecap="round">
            <path d="M2 53 L22 58 M0 64 L21 64 M3 75 L22 70" stroke="#09090b" strokeWidth="3.6" />
            <path d="M118 53 L98 58 M120 64 L99 64 M117 75 L98 70" stroke="#09090b" strokeWidth="3.6" />
            <path d="M2 53 L22 58 M0 64 L21 64 M3 75 L22 70" stroke="#f8fafc" strokeWidth="1.3" opacity="0.85" />
            <path d="M118 53 L98 58 M120 64 L99 64 M117 75 L98 70" stroke="#f8fafc" strokeWidth="1.3" opacity="0.85" />
          </g>
        </svg>
      </div>
    );
  }

  /* 13. Hora de pesadilla — Studio-Inked Manga Horror Maw & Claws Ring */
  if (decoration === 'pesadilla') {
    return (
      <div className="absolute -inset-[26%] w-[152%] h-[152%] pointer-events-none z-10">
        <div
          className="w-full h-full rounded-full overflow-hidden anim-ghost"
          style={{
            WebkitMaskImage:
              'radial-gradient(circle, transparent 41%, black 45%, black 75%, transparent 90%)',
            maskImage:
              'radial-gradient(circle, transparent 41%, black 45%, black 75%, transparent 90%)',
            filter: 'contrast(1.18) drop-shadow(0 2px 10px rgba(0,0,0,0.9))',
          }}
        >
          <img
            src={GENERATED_ASSETS.decoRingPesadilla}
            alt=""
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover scale-105"
          />
        </div>
      </div>
    );
  }

  /* 14. Espectro — Studio-Painted Monochrome Manga Wraith */
  if (decoration === 'espectro') {
    return (
      <div className="absolute -inset-[28%] w-[156%] h-[156%] pointer-events-none z-10">
        <div
          className="w-full h-full rounded-full overflow-hidden anim-ghost"
          style={{
            WebkitMaskImage:
              'radial-gradient(circle, transparent 41%, rgba(0,0,0,0.92) 49%, black 76%, transparent 96%)',
            maskImage:
              'radial-gradient(circle, transparent 41%, rgba(0,0,0,0.92) 49%, black 76%, transparent 96%)',
            filter: 'contrast(1.12) drop-shadow(0 2px 10px rgba(0,0,0,0.85))',
          }}
        >
          <img
            src={GENERATED_ASSETS.shopEspectroArt}
            alt=""
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover scale-105"
          />
        </div>
      </div>
    );
  }

  /* 15. el mismo pato — Crystalline Pond Ripple & Illustrated Diving Duck */
  if (decoration === 'pato') {
    return (
      <div className="absolute -inset-[22%] w-[144%] h-[144%] pointer-events-none z-10">
        <svg viewBox="0 0 120 120" className="w-full h-full overflow-visible">
          <defs>
            <linearGradient id="duckPondRing" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#e0f2fe" />
              <stop offset="50%" stopColor="#38bdf8" />
              <stop offset="100%" stopColor="#7dd3fc" />
            </linearGradient>
            <linearGradient id="duckFeather" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="100%" stopColor="#e2e8f0" />
            </linearGradient>
          </defs>
          <circle cx="60" cy="60" r="51" fill="none" stroke="url(#duckPondRing)" strokeWidth="3.5" opacity="0.92" />
          <circle cx="60" cy="60" r="55" fill="none" stroke="#bae6fd" strokeWidth="1.2" strokeDasharray="16 8" opacity="0.65" />
          <ellipse cx="22" cy="24" rx="12" ry="5" fill="#4ade80" stroke="#166534" strokeWidth="1.2" transform="rotate(-16 22 24)" />
          <path d="M14 25 L22 24" stroke="#166534" strokeWidth="1" transform="rotate(-16 22 24)" />
          <g className="anim-float">
            <ellipse cx="92" cy="23" rx="16.5" ry="12.5" fill="url(#duckFeather)" stroke="#94a3b8" strokeWidth="1.2" />
            <ellipse cx="87" cy="19" rx="10" ry="6" fill="#ffffff" />
            <path d="M96 30 L103 44 L110 39 Z" fill="#fb923c" stroke="#c2410c" strokeWidth="1" strokeLinejoin="round" />
            <path d="M102 27 L112 37 L116 31 Z" fill="#f97316" stroke="#c2410c" strokeWidth="1" strokeLinejoin="round" />
            <circle cx="80" cy="36" r="10.5" fill="url(#duckFeather)" stroke="#cbd5e1" strokeWidth="1.2" />
            <path d="M70 36 Q57 38 58 43 Q62 46 72 43 Z" fill="#fb923c" stroke="#c2410c" strokeWidth="1" strokeLinejoin="round" />
            <circle cx="75.5" cy="34.5" r="2" fill="#0f172a" />
            <circle cx="76.2" cy="33.8" r="0.7" fill="#ffffff" />
            <circle cx="61" cy="22" r="2.7" fill="#e0f2fe" opacity="0.95" />
            <circle cx="52" cy="16" r="1.9" fill="#e0f2fe" opacity="0.85" />
          </g>
        </svg>
      </div>
    );
  }

  /* 16. Satoru Gojo — Studio-Rendered Electric Cyan & Violet Infinity Halo */
  if (decoration === 'gojo') {
    return (
      <div className="absolute -inset-[28%] w-[156%] h-[156%] pointer-events-none z-10">
        <div
          className="w-full h-full rounded-full overflow-hidden anim-spin-slow"
          style={{
            WebkitMaskImage:
              'radial-gradient(circle, transparent 41%, rgba(0,0,0,0.92) 48%, black 70%, transparent 95%)',
            maskImage:
              'radial-gradient(circle, transparent 41%, rgba(0,0,0,0.92) 48%, black 70%, transparent 95%)',
            mixBlendMode: 'screen',
            filter: 'saturate(1.25) drop-shadow(0 0 14px rgba(56,189,248,0.85))',
          }}
        >
          <img
            src={GENERATED_ASSETS.decoRingGojo}
            alt=""
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover scale-115"
          />
        </div>
        <svg viewBox="0 0 120 120" className="absolute inset-0 w-full h-full overflow-visible">
          <circle cx="60" cy="60" r="44" fill="none" stroke="#bae6fd" strokeWidth="1.2" opacity="0.7" />
        </svg>
      </div>
    );
  }

  /* 17. Ryomen Sukuna — Studio-Rendered Malevolent Shrine Fire & Slash Ring */
  if (decoration === 'sukuna') {
    return (
      <div className="absolute -inset-[28%] w-[156%] h-[156%] pointer-events-none z-10">
        <div
          className="w-full h-full rounded-full overflow-hidden anim-ember"
          style={{
            WebkitMaskImage:
              'radial-gradient(circle, transparent 41%, rgba(0,0,0,0.92) 48%, black 70%, transparent 95%)',
            maskImage:
              'radial-gradient(circle, transparent 41%, rgba(0,0,0,0.92) 48%, black 70%, transparent 95%)',
            mixBlendMode: 'screen',
            filter: 'saturate(1.25) drop-shadow(0 0 14px rgba(239,68,68,0.85))',
          }}
        >
          <img
            src={GENERATED_ASSETS.decoRingSukuna}
            alt=""
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover scale-115"
          />
        </div>
        <svg viewBox="0 0 120 120" className="absolute inset-0 w-full h-full overflow-visible">
          <circle cx="60" cy="60" r="44" fill="none" stroke="#fca5a5" strokeWidth="1.1" opacity="0.55" />
        </svg>
      </div>
    );
  }

  /* 18. Yuji Itadori — Layered Crimson Jujutsu Collar & Black Flash Lightning */
  if (decoration === 'yuji') {
    return (
      <div className="absolute -inset-[22%] w-[144%] h-[144%] pointer-events-none z-10">
        <svg viewBox="0 0 120 120" className="w-full h-full overflow-visible">
          <defs>
            <linearGradient id="yujiHood" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#dc2626" />
              <stop offset="50%" stopColor="#991b1b" />
              <stop offset="100%" stopColor="#450a0a" />
            </linearGradient>
            <filter id="blackFlashGlow" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="2.2" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          <circle cx="60" cy="60" r="50.5" fill="none" stroke="#ef4444" strokeWidth="2.4" opacity="0.65" />
          {/* Draped Crimson Collar */}
          <path
            d="M14 78 Q60 123 106 78 Q88 100 60 103 Q32 100 14 78 Z"
            fill="url(#yujiHood)"
            stroke="#270606"
            strokeWidth="2.2"
            strokeLinejoin="round"
          />
          <path d="M22 86 Q60 114 98 86" stroke="#f87171" strokeWidth="2.4" fill="none" opacity="0.7" />
          <path d="M32 95 Q60 112 88 95" stroke="#450a0a" strokeWidth="2" fill="none" opacity="0.6" />
          {/* Black Flash Cursed Sparks */}
          <g filter="url(#blackFlashGlow)" className="anim-flame">
            <path d="M95 10 L74 30 L88 33 L67 55" stroke="#09090b" strokeWidth="6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M95 10 L74 30 L88 33 L67 55" stroke="#fb7185" strokeWidth="3.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M95 10 L74 30 L88 33 L67 55" stroke="#ffffff" strokeWidth="1.2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M25 14 L38 28 L29 31 L42 44" stroke="#ef4444" strokeWidth="2.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </g>
        </svg>
      </div>
    );
  }

  /* 19. Grabado japonés — Studio-Rendered Sumi-e Brush Circle, Red Seal & Sakura Petals */
  if (decoration === 'grabado') {
    return (
      <div className="absolute -inset-[27%] w-[154%] h-[154%] pointer-events-none z-10">
        <div
          className="w-full h-full rounded-full overflow-hidden"
          style={{
            WebkitMaskImage:
              'radial-gradient(circle, transparent 41%, black 46%, black 80%, transparent 96%)',
            maskImage:
              'radial-gradient(circle, transparent 41%, black 46%, black 80%, transparent 96%)',
            filter: 'drop-shadow(0 0 8px rgba(255,255,255,0.22))',
          }}
        >
          <img
            src={GENERATED_ASSETS.decoRingGrabado}
            alt=""
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover scale-108"
          />
        </div>
      </div>
    );
  }

  /* 20. Lobo y Luna — Studio-Rendered Filigree Crescent Moon & Twilight Mist Halo */
  if (decoration === 'lobo') {
    return (
      <div className="absolute -inset-[28%] w-[156%] h-[156%] pointer-events-none z-10">
        <div
          className="w-full h-full rounded-full overflow-hidden anim-float"
          style={{
            WebkitMaskImage:
              'radial-gradient(circle, transparent 41%, rgba(0,0,0,0.95) 47%, black 75%, transparent 96%)',
            maskImage:
              'radial-gradient(circle, transparent 41%, rgba(0,0,0,0.95) 47%, black 75%, transparent 96%)',
            mixBlendMode: 'screen',
            filter: 'saturate(1.2) drop-shadow(0 0 12px rgba(192,132,252,0.8))',
          }}
        >
          <img
            src={GENERATED_ASSETS.decoRingLobo}
            alt=""
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover scale-110"
          />
        </div>
      </div>
    );
  }

  return (
    <svg viewBox="0 0 120 120" className="absolute -inset-[12%] w-[124%] h-[124%] pointer-events-none z-10">
      <circle cx="60" cy="60" r="52" fill="none" stroke="#a855f7" strokeWidth="4" />
    </svg>
  );
};

export const UserAvatar: React.FC<{
  avatar: AvatarKey;
  customAvatarUrl?: string;
  status?: PresenceStatus;
  decoration?: DecorationId;
  decorationAccent?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  borderColor?: string;
  showStatus?: boolean;
}> = ({
  avatar,
  customAvatarUrl,
  status = 'online',
  decoration = 'none',
  decorationAccent,
  size = 'md',
  borderColor = 'var(--dc-bg-sidebar)',
  showStatus = true,
}) => {
  const sizeClass =
    size === 'xs'
      ? 'w-6 h-6'
      : size === 'sm'
      ? 'w-8 h-8'
      : size === 'md'
      ? 'w-10 h-10'
      : size === 'lg'
      ? 'w-12 h-12'
      : size === 'xl'
      ? 'w-20 h-20'
      : 'w-28 h-28';

  const statusSize = size === 'xl' || size === '2xl' ? 'lg' : size === 'lg' ? 'md' : size === 'xs' ? 'xs' : 'sm';

  return (
    <div className={`relative inline-flex shrink-0 ${sizeClass}`}>
      <div className="w-full h-full rounded-full overflow-hidden bg-[var(--dc-bg-card)]">
        {customAvatarUrl ? (
          <img
            src={customAvatarUrl}
            alt="Avatar personalizado"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
        ) : (
          <AvatarArtwork avatar={avatar} />
        )}
      </div>
      <AvatarDecorationRing decoration={decoration} accentColor={decorationAccent} />
      {showStatus && (
        <span className="absolute -bottom-0.5 -right-0.5 z-20 flex">
          <StatusIndicator status={status} size={statusSize} borderColor={borderColor} />
        </span>
      )}
    </div>
  );
};

export const ServerIconArt: React.FC<{ server: Server; className?: string }> = ({
  server,
  className = 'w-full h-full',
}) => {
  if (server.customIconUrl) {
    return (
      <div className={`${className} bg-[#09090b] relative overflow-hidden`}>
        <SafeImage
          src={server.customIconUrl}
          alt={server.name}
          fallbackGradient="from-[#1e1b4b] via-[#312e81] to-[#0f172a]"
          fallbackLabel={server.shortCode}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 ring-1 ring-inset ring-white/15 pointer-events-none" />
      </div>
    );
  }

  switch (server.iconStyle) {
    case 'jmt':
      return (
        <div className={`${className} bg-gradient-to-br from-[#0d111a] via-[#090b12] to-[#020305] flex flex-col items-center justify-center relative overflow-hidden`}>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(59,130,246,0.42),transparent_68%)]" />
          <div className="absolute inset-y-0 left-2 w-1 bg-gradient-to-b from-white via-sky-200 to-white/40 opacity-85" />
          <div className="absolute inset-y-0 right-2 w-1 bg-gradient-to-b from-white via-sky-200 to-white/40 opacity-85" />
          <span className="z-10 px-1.5 py-0.5 rounded-md bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-700 text-white font-display font-black text-[9.5px] tracking-tighter shadow-[0_2px_10px_rgba(37,99,235,0.8)] border border-white/25">
            JMT
          </span>
        </div>
      );
    case 'hoyoverse':
      return (
        <div className={`${className} bg-gradient-to-br from-pink-200 via-sky-200 to-purple-200 relative overflow-hidden`}>
          <SafeImage
            src={GENERATED_ASSETS.hoyoverseIcon}
            alt="HoYoverse Oficial"
            className="w-full h-full object-cover"
          />
          <span className="absolute bottom-0 inset-x-0 bg-black/75 text-[6px] font-extrabold tracking-wider text-white text-center py-[1px] backdrop-blur-[1px]">
            HOYOVERSE
          </span>
        </div>
      );
    case 'mtg':
      return (
        <div className={`${className} bg-gradient-to-br from-sky-400 via-slate-900 to-orange-600 flex items-center justify-center relative overflow-hidden`}>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.35),transparent_58%)]" />
          <svg viewBox="0 0 24 24" className="w-6 h-6 text-white drop-shadow-[0_2px_6px_rgba(0,0,0,0.75)] relative z-10" fill="currentColor">
            <path d="M12 2L9 10l-4-2 3 11h8l3-11-4 2-3-8z" />
          </svg>
        </div>
      );
    case 'zn':
      return (
        <div className={`${className} bg-[#140407] relative overflow-hidden`}>
          <SafeImage
            src={GENERATED_ASSETS.zenithIcon}
            alt={server.name}
            fallbackGradient="from-red-950 via-[#1a050a] to-black"
            fallbackLabel="Zn"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-white/10 pointer-events-none" />
          <div className="absolute inset-0 ring-1 ring-inset ring-red-400/25 pointer-events-none" />
        </div>
      );
    case 'tnu':
      return (
        <div className={`${className} bg-gradient-to-br from-[#0a2342] via-[#051426] to-[#020812] flex items-center justify-center relative overflow-hidden`}>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(56,189,248,0.48),transparent_65%)]" />
          <span className="relative z-10 font-display font-black text-[13px] tracking-tight text-sky-100 drop-shadow-[0_0_12px_rgba(56,189,248,0.95)]">
            TNU
          </span>
          <div className="absolute inset-0 ring-1 ring-inset ring-sky-400/30 pointer-events-none" />
        </div>
      );
    case 'b':
      return (
        <div className={`${className} bg-gradient-to-br from-fuchsia-500 via-amber-400 to-cyan-400 flex items-center justify-center relative overflow-hidden`}>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_20%,rgba(255,255,255,0.4),transparent_55%)]" />
          <span className="relative z-10 font-display font-black text-2xl text-white drop-shadow-[0_2px_6px_rgba(0,0,0,0.45)]">
            B
          </span>
        </div>
      );
    case 'imperio':
      return (
        <div className={`${className} bg-gradient-to-br from-[#1b3b82] via-[#0f2454] to-[#060f24] flex flex-col items-center justify-center relative overflow-hidden`}>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(251,191,36,0.22),transparent_60%)]" />
          <svg viewBox="0 0 24 24" className="w-4.5 h-4.5 text-amber-300 drop-shadow-[0_0_8px_rgba(251,191,36,0.85)] relative z-10" fill="currentColor">
            <path d="M3 18h18v2H3v-2zm0-2l2-9 4.5 4L12 5l2.5 6L19 7l2 9H3z" />
          </svg>
          <span className="relative z-10 text-[7px] font-extrabold tracking-wider text-sky-100 mt-0.5">IMPERIO</span>
          <div className="absolute inset-0 ring-1 ring-inset ring-sky-400/30 pointer-events-none" />
        </div>
      );
    case 'fl':
      return (
        <div className={`${className} bg-gradient-to-br from-[#062840] via-[#031525] to-[#010b14] flex items-center justify-center relative overflow-hidden`}>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_25%,rgba(34,211,238,0.45),transparent_65%)]" />
          <span className="relative z-10 font-display font-black text-xl text-cyan-100 drop-shadow-[0_0_12px_rgba(34,211,238,0.95)]">
            FL
          </span>
          <div className="absolute inset-0 ring-1 ring-inset ring-cyan-400/30 pointer-events-none" />
        </div>
      );
    case 'au':
      return (
        <div className={`${className} bg-gradient-to-br from-[#450a0a] via-[#2b0404] to-[#0f0202] flex items-center justify-center relative overflow-hidden`}>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_25%,rgba(248,113,113,0.4),transparent_65%)]" />
          <span className="relative z-10 font-display font-black text-lg text-red-200 tracking-tighter drop-shadow">
            AU
          </span>
          <div className="absolute inset-0 ring-1 ring-inset ring-red-500/30 pointer-events-none" />
        </div>
      );
    case 'zevr':
      return (
        <div className={`${className} bg-gradient-to-br from-sky-400 via-blue-600 to-indigo-900 flex flex-col items-center justify-center relative overflow-hidden`}>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_20%,rgba(255,255,255,0.35),transparent_55%)]" />
          <span className="relative z-10 font-display font-black italic text-[12px] text-white leading-none drop-shadow">ZEVR</span>
          <span className="relative z-10 text-[6px] text-sky-100 uppercase tracking-tight font-bold">Uncopy</span>
        </div>
      );
    case 'slbr':
      return (
        <div className={`${className} bg-gradient-to-br from-fuchsia-600 via-purple-700 to-cyan-500 flex items-center justify-center relative overflow-hidden`}>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_20%,rgba(255,255,255,0.35),transparent_60%)]" />
          <span className="relative z-10 font-display font-black text-[12px] text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.45)]">
            SLBR
          </span>
        </div>
      );
    case 'rebo':
      return (
        <div className={`${className} bg-zinc-900 relative overflow-hidden border border-amber-500/45`}>
          <SafeImage
            src={GENERATED_ASSETS.reboIcon}
            alt="REBO Uncopylocked"
            className="w-full h-full object-cover"
          />
        </div>
      );
    case 'arrow':
      return (
        <div className={`${className} bg-gradient-to-br from-[#14141c] via-[#09090d] to-[#040406] flex items-center justify-center relative overflow-hidden`}>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(255,255,255,0.22),transparent_65%)]" />
          <svg viewBox="0 0 24 24" className="w-6 h-6 text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.6)] relative z-10" fill="currentColor">
            <path d="M12 4L4 19l8-4 8 4L12 4zm0 5.5l2.5 5-2.5-1.2-2.5 1.2 2.5-5z" />
          </svg>
        </div>
      );
    default:
      return (
        <div
          className={`${className} flex items-center justify-center font-display font-bold text-white text-base relative overflow-hidden`}
          style={{
            background: `linear-gradient(135deg, ${server.accentColor || '#5865F2'} 0%, #11121a 100%)`,
          }}
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.28),transparent_60%)]" />
          <span className={`relative z-10 drop-shadow ${server.customEmoji ? 'text-2xl leading-none' : ''}`}>
            {server.customEmoji || server.shortCode}
          </span>
        </div>
      );
  }
};

export const getNameplateArtworkUrl = (nameplate: NameplateId): string | null => {
  switch (nameplate) {
    case 'rama':
    case 'sakura':
      return GENERATED_ASSETS.shopRamaEnFlor;
    case 'condenacion':
      return GENERATED_ASSETS.shopCondenacionEterna;
    case 'almas':
      return GENERATED_ASSETS.shopTrappedSouls;
    case 'observador':
      return GENERATED_ASSETS.shopObserverEyes;
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
    case 'lobo':
      return GENERATED_ASSETS.shopLoboLuna;
    case 'miyabi':
      return GENERATED_ASSETS.shopMiyabiArt;
    case 'deadpool':
    case 'wolverine':
      return GENERATED_ASSETS.deadpoolBanner;
    case 'dbd':
      return GENERATED_ASSETS.dbdBanner;
    case 'vice-city':
      return GENERATED_ASSETS.viceCityBanner;
    default:
      return null;
  }
};

/* Full seamless painted background strip for Discord Nameplates (used in Shop cards, Modals, Profile, and Member Lists) */
export const NameplateStripBackground: React.FC<{
  nameplate: NameplateId;
  accentColor?: string;
}> = ({ nameplate, accentColor }) => {
  if (nameplate === 'none') return null;
  const artUrl = getNameplateArtworkUrl(nameplate);

  if (artUrl) {
    const isCoralCondenacion = nameplate === 'condenacion' && accentColor === '#fb7185';
    const isLightWash = nameplate === 'rama' || nameplate === 'sakura';
    const isVader = nameplate === 'vader';
    return (
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <img
          src={artUrl}
          alt=""
          referrerPolicy="no-referrer"
          className="absolute right-0 inset-y-0 w-full h-full object-cover object-center transition-all duration-300"
          style={{
            filter: isCoralCondenacion
              ? 'hue-rotate(155deg) saturate(1.3) contrast(1.06)'
              : 'saturate(1.12) contrast(1.04)',
            WebkitMaskImage: isLightWash
              ? 'linear-gradient(90deg, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.88) 42%, black 75%)'
              : 'linear-gradient(90deg, rgba(0,0,0,0.18) 0%, rgba(0,0,0,0.68) 38%, black 70%)',
            maskImage: isLightWash
              ? 'linear-gradient(90deg, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.88) 42%, black 75%)'
              : 'linear-gradient(90deg, rgba(0,0,0,0.18) 0%, rgba(0,0,0,0.68) 38%, black 70%)',
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background: isLightWash
              ? 'linear-gradient(90deg, rgba(252,235,238,0.72) 0%, rgba(252,235,238,0.28) 42%, transparent 78%)'
              : isVader
              ? 'linear-gradient(90deg, rgba(28,8,12,0.88) 0%, rgba(69,10,10,0.35) 45%, transparent 82%)'
              : 'linear-gradient(90deg, rgba(14,15,20,0.85) 0%, rgba(14,15,20,0.42) 44%, transparent 85%)',
          }}
        />
        <div className="absolute inset-x-0 top-0 h-[1px] bg-white/25" />
      </div>
    );
  }

  return null;
};

export const NameplateRowDecor: React.FC<{ nameplate: NameplateId }> = ({ nameplate }) => {
  if (nameplate === 'miyabi') {
    return (
      <div className="flex items-center justify-end gap-2 shrink-0 z-10">
        <svg viewBox="0 0 80 48" className="w-16 h-10 shrink-0 overflow-visible">
          <path d="M5 42 Q25 10 60 18 Q42 36 18 46 Z" fill="#22d3ee" opacity="0.5" className="anim-flame" />
          <g className="anim-float">
            <circle cx="52" cy="24" r="13" fill="#18181b" stroke="#38bdf8" strokeWidth="2" />
            <g className="anim-eye-blink">
              <ellipse cx="52" cy="25" rx="7" ry="4" fill="#ef4444" />
              <circle cx="52" cy="25" r="2" fill="#000" />
            </g>
          </g>
        </svg>
      </div>
    );
  }

  if (nameplate === 'deadpool' || nameplate === 'wolverine') {
    return (
      <span className="text-lg z-10 anim-float drop-shadow">
        {nameplate === 'wolverine' ? '⚔️' : '🫶'}
      </span>
    );
  }

  if (nameplate === 'dbd') {
    return <span className="text-lg z-10 anim-ember drop-shadow">🔥</span>;
  }

  return null;
};

export const PROFILE_EFFECT_META: Record<
  Exclude<ProfileEffectId, 'none'>,
  {
    title: string;
    primary: string;
    secondary: string;
    artUrl?: string;
    particles: 'sparks' | 'slashes' | 'embers' | 'petals' | 'lightning' | 'horror' | 'cyber';
  }
> = {
  gojo: {
    title: 'VACÍO PÚRPURA',
    primary: '#38bdf8',
    secondary: '#a855f7',
    artUrl: GENERATED_ASSETS.shopGojoArt,
    particles: 'lightning',
  },
  sukuna: {
    title: 'SANTUARIO MALÉVOLO',
    primary: '#f97316',
    secondary: '#ef4444',
    artUrl: GENERATED_ASSETS.shopSukunaArt,
    particles: 'slashes',
  },
  yuji: {
    title: 'DESTELLO NEGRO',
    primary: '#fb7185',
    secondary: '#dc2626',
    artUrl: GENERATED_ASSETS.shopYujiArt,
    particles: 'lightning',
  },
  cerbero: {
    title: 'CERBERO',
    primary: '#ec4899',
    secondary: '#a855f7',
    artUrl: GENERATED_ASSETS.shopCerberoArt,
    particles: 'embers',
  },
  pesadilla: {
    title: 'HORA DE PESADILLA',
    primary: '#e4e4e7',
    secondary: '#52525b',
    artUrl: GENERATED_ASSETS.shopPesadillaArt,
    particles: 'horror',
  },
  jugar: {
    title: 'VAMOS A JUGAR',
    primary: '#f4f4f5',
    secondary: '#71717a',
    artUrl: GENERATED_ASSETS.shopVamosAJugar,
    particles: 'horror',
  },
  grabado: {
    title: 'GRABADO JAPONÉS',
    primary: '#f472b6',
    secondary: '#dc2626',
    artUrl: GENERATED_ASSETS.shopGrabadoJapones,
    particles: 'petals',
  },
  lobo: {
    title: 'LOBO Y LUNA',
    primary: '#c084fc',
    secondary: '#fef08a',
    artUrl: GENERATED_ASSETS.shopLoboLuna,
    particles: 'sparks',
  },
  miyabi: {
    title: 'HOSHIMI MIYABI',
    primary: '#38bdf8',
    secondary: '#ef4444',
    artUrl: GENERATED_ASSETS.shopMiyabiArt,
    particles: 'slashes',
  },
  ellen: {
    title: 'ELLEN JOE',
    primary: '#38bdf8',
    secondary: '#f43f5e',
    artUrl: GENERATED_ASSETS.shopEllenArt,
    particles: 'slashes',
  },
  burnice: {
    title: 'BURNICE',
    primary: '#fb923c',
    secondary: '#fde047',
    artUrl: GENERATED_ASSETS.shopBurniceArt,
    particles: 'embers',
  },
  deadpool: {
    title: 'DEADPOOL & WOLVERINE',
    primary: '#ef4444',
    secondary: '#facc15',
    artUrl: GENERATED_ASSETS.deadpoolBanner,
    particles: 'slashes',
  },
  dbd: {
    title: 'LA ENTIDAD',
    primary: '#dc2626',
    secondary: '#f97316',
    artUrl: GENERATED_ASSETS.dbdBanner,
    particles: 'embers',
  },
  sparks: {
    title: 'CHISPAS NEÓN',
    primary: '#38bdf8',
    secondary: '#fde047',
    particles: 'sparks',
  },
  cyber: {
    title: 'LLUVIA CIBERNÉTICA',
    primary: '#22d3ee',
    secondary: '#818cf8',
    particles: 'cyber',
  },
  crimson: {
    title: 'AURA CARMESÍ',
    primary: '#ef4444',
    secondary: '#fb7185',
    particles: 'embers',
  },
};

export const ProfileEffectAnimationOverlay: React.FC<{
  effect?: ProfileEffectId;
  playKey?: number | string;
  className?: string;
}> = ({ effect, playKey = 0, className = '' }) => {
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    if (!effect || effect === 'none') {
      setPlaying(false);
      return;
    }
    setPlaying(true);
    const timer = setTimeout(() => {
      setPlaying(false);
    }, 3550);
    return () => clearTimeout(timer);
  }, [effect, playKey]);

  if (!effect || effect === 'none') return null;
  const meta = PROFILE_EFFECT_META[effect];
  if (!meta) return null;

  return (
    <AnimatePresence>
      {playing && (
        <motion.div
          key={`${effect}-${playKey}`}
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{
            opacity: [0, 1, 1, 0],
            scale: [0.96, 1, 1.01, 1.04],
          }}
          exit={{ opacity: 0 }}
          transition={{
            duration: 3.45,
            times: [0, 0.13, 0.74, 1],
            ease: 'easeInOut',
          }}
          className={`absolute inset-0 pointer-events-none overflow-hidden z-20 ${className}`}
        >
          {/* Ambient theme radial glow */}
          <div
            className="absolute inset-0"
            style={{
              background: `radial-gradient(circle at 76% 24%, ${meta.primary}48 0%, ${meta.secondary}26 42%, transparent 78%)`,
            }}
          />

          {/* Studio artwork entrance sweep */}
          {meta.artUrl && (
            <motion.img
              src={meta.artUrl}
              alt=""
              referrerPolicy="no-referrer"
              initial={{ x: 26, scale: 1.08, opacity: 0 }}
              animate={{ x: [26, 0, -6], scale: [1.08, 1.02, 1.06], opacity: [0, 0.88, 0.78] }}
              transition={{ duration: 2.6, ease: 'easeOut' }}
              className="absolute inset-0 w-full h-full object-cover object-center mix-blend-screen"
              style={{
                maskImage:
                  'radial-gradient(ellipse 80% 85% at 78% 35%, black 22%, rgba(0,0,0,0.45) 58%, transparent 88%)',
                WebkitMaskImage:
                  'radial-gradient(ellipse 80% 85% at 78% 35%, black 22%, rgba(0,0,0,0.45) 58%, transparent 88%)',
              }}
            />
          )}

          {/* Diagonal energy slash / beam flash on entry */}
          <motion.div
            initial={{ x: '-120%', opacity: 0 }}
            animate={{ x: ['-120%', '135%'], opacity: [0, 0.85, 0] }}
            transition={{ duration: 1.15, ease: 'easeOut' }}
            className="absolute inset-y-0 w-1/2 -skew-x-12"
            style={{
              background: `linear-gradient(90deg, transparent, ${meta.primary}55, #ffffff70, ${meta.secondary}45, transparent)`,
            }}
          />

          {/* Kinetic particle system matching effect style */}
          {meta.particles === 'slashes' && (
            <svg viewBox="0 0 400 260" className="absolute inset-0 w-full h-full">
              <motion.path
                d="M 40 210 Q 190 105 390 25"
                fill="none"
                stroke={meta.primary}
                strokeWidth="6"
                strokeLinecap="round"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: [0, 1, 1], opacity: [0, 1, 0] }}
                transition={{ duration: 1.5, times: [0, 0.35, 1] }}
              />
              <motion.path
                d="M 85 240 Q 245 140 395 75"
                fill="none"
                stroke="#ffffff"
                strokeWidth="3"
                strokeLinecap="round"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: [0, 1, 1], opacity: [0, 0.95, 0] }}
                transition={{ duration: 1.5, delay: 0.14, times: [0, 0.35, 1] }}
              />
              <motion.path
                d="M 10 130 Q 180 45 360 12"
                fill="none"
                stroke={meta.secondary}
                strokeWidth="4"
                strokeLinecap="round"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: [0, 1, 1], opacity: [0, 0.9, 0] }}
                transition={{ duration: 1.4, delay: 0.25, times: [0, 0.35, 1] }}
              />
            </svg>
          )}

          {meta.particles === 'lightning' && (
            <svg viewBox="0 0 400 260" className="absolute inset-0 w-full h-full">
              <motion.path
                d="M 290 8 L 255 72 L 288 86 L 235 162"
                fill="none"
                stroke={meta.primary}
                strokeWidth="4.5"
                strokeLinecap="round"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: [0, 1, 1], opacity: [0, 1, 0] }}
                transition={{ duration: 1.2, repeat: 1, repeatDelay: 0.25 }}
              />
              <motion.path
                d="M 340 32 L 308 92 L 336 105 L 286 184"
                fill="none"
                stroke={meta.secondary}
                strokeWidth="3.5"
                strokeLinecap="round"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: [0, 1, 1], opacity: [0, 0.95, 0] }}
                transition={{ duration: 1.15, delay: 0.2, repeat: 1, repeatDelay: 0.25 }}
              />
              <motion.circle
                cx="315"
                cy="70"
                r="26"
                fill={meta.primary}
                initial={{ scale: 0.4, opacity: 0.7 }}
                animate={{ scale: [0.4, 1.5, 2.2], opacity: [0.7, 0.35, 0] }}
                transition={{ duration: 1.4, repeat: 1 }}
              />
            </svg>
          )}

          {(meta.particles === 'embers' ||
            meta.particles === 'sparks' ||
            meta.particles === 'petals' ||
            meta.particles === 'cyber' ||
            meta.particles === 'horror') && (
            <div className="absolute inset-0">
              {[
                { left: '62%', top: '18%', size: 8, delay: 0 },
                { left: '78%', top: '34%', size: 10, delay: 0.15 },
                { left: '88%', top: '22%', size: 6, delay: 0.3 },
                { left: '54%', top: '44%', size: 7, delay: 0.45 },
                { left: '72%', top: '56%', size: 9, delay: 0.2 },
                { left: '91%', top: '48%', size: 6, delay: 0.5 },
                { left: '44%', top: '24%', size: 5, delay: 0.35 },
              ].map((dot, idx) => (
                <motion.span
                  key={idx}
                  initial={{ opacity: 0, y: 18, scale: 0.4 }}
                  animate={{
                    opacity: [0, 1, 0.85, 0],
                    y: meta.particles === 'petals' ? [0, 28, 52] : [18, -14, -36],
                    x: meta.particles === 'petals' ? [0, -14, -26] : [0, 6, -4],
                    scale: [0.4, 1.15, 0.7],
                  }}
                  transition={{ duration: 2.3, delay: dot.delay, ease: 'easeOut' }}
                  className="absolute rounded-full"
                  style={{
                    left: dot.left,
                    top: dot.top,
                    width: meta.particles === 'cyber' ? 2 : dot.size,
                    height: meta.particles === 'cyber' ? 24 : dot.size,
                    backgroundColor: idx % 2 === 0 ? meta.primary : meta.secondary,
                    boxShadow: `0 0 12px ${idx % 2 === 0 ? meta.primary : meta.secondary}`,
                  }}
                />
              ))}
            </div>
          )}

          {/* Stylized Effect Title Signature */}
          <motion.div
            initial={{ opacity: 0, x: 18 }}
            animate={{ opacity: [0, 0.95, 0.9, 0], x: [18, 0, -4, -10] }}
            transition={{ duration: 2.8, times: [0, 0.16, 0.72, 1], ease: 'easeOut' }}
            className="absolute top-3.5 right-4 z-10 text-right"
          >
            <span
              className="inline-block font-display font-black text-base sm:text-xl tracking-wider uppercase drop-shadow-[0_2px_12px_rgba(0,0,0,0.95)]"
              style={{
                color: '#ffffff',
                textShadow: `0 0 16px ${meta.primary}, 0 2px 8px rgba(0,0,0,0.95)`,
              }}
            >
              {meta.title}
            </span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export const WumpusNitroFly: React.FC = () => (
  <svg viewBox="0 0 140 120" className="w-28 h-24 shrink-0 anim-float" aria-hidden="true">
    <path d="M12 36 Q26 24 44 34 Q58 24 70 36 Z" fill="#a855f7" opacity="0.35" />
    <path d="M62 85 Q76 74 96 84 Q108 75 120 86 Z" fill="#a855f7" opacity="0.3" />
    <path d="M84 44 L126 16 L112 44 L132 48 L96 62 Z" fill="#e2e8f0" />
    <path d="M84 48 L118 28 L108 46 Z" fill="#cbd5e1" />
    <ellipse cx="66" cy="64" rx="22" ry="26" fill="#7c93e6" />
    <path d="M46 46 Q66 26 86 46 L86 58 Q66 64 46 58 Z" fill="#ffffff" />
    <rect x="44" y="42" width="32" height="16" rx="8" fill="#1e293b" />
    <circle cx="54" cy="50" r="2.5" fill="#38bdf8" />
    <circle cx="67" cy="50" r="2.5" fill="#38bdf8" />
    <ellipse cx="52" cy="62" rx="11" ry="8" fill="#a5b4fc" />
    <circle cx="48" cy="62" r="2" fill="#4338ca" />
    <circle cx="55" cy="62" r="2" fill="#4338ca" />
    <path d="M84 68 L108 82 L88 86 Z" fill="#fb923c" />
  </svg>
);

export const WumpusScooter: React.FC = () => (
  <svg viewBox="0 0 140 120" className="w-28 h-24 shrink-0 anim-float" aria-hidden="true">
    <path d="M18 32 Q36 22 52 34 Z" fill="#1d4ed8" opacity="0.35" />
    <circle cx="48" cy="94" r="14" fill="#1e293b" stroke="#94a3b8" strokeWidth="4" />
    <circle cx="94" cy="94" r="12" fill="#1e293b" stroke="#94a3b8" strokeWidth="4" />
    <path d="M44 74 Q68 68 88 88 L46 88 Z" fill="#f97316" />
    <line x1="56" y1="42" x2="48" y2="80" stroke="#e2e8f0" strokeWidth="5" strokeLinecap="round" />
    <ellipse cx="76" cy="58" rx="18" ry="20" fill="#7c93e6" />
    <path d="M58 44 Q76 24 94 44 Z" fill="#f8fafc" />
    <ellipse cx="64" cy="52" rx="10" ry="7" fill="#a5b4fc" />
    <circle cx="60" cy="52" r="1.8" fill="#4338ca" />
    <circle cx="67" cy="52" r="1.8" fill="#4338ca" />
    <line x1="102" y1="62" x2="102" y2="88" stroke="#e2e8f0" strokeWidth="2.5" />
    <polygon points="102,62 120,68 102,74" fill="#fb923c" />
  </svg>
);
