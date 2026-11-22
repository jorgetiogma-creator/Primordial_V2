import React, { useEffect, useRef, useState } from 'react';
import {
  Award,
  Ban,
  Check,
  ChevronDown,
  ChevronRight,
  Clock,
  FileText,
  Heart,
  Image as ImageIcon,
  Lock,
  Pencil,
  Plus,
  Search,
  Settings,
  ShoppingBag,
  Smile,
  Sparkles,
  Store,
  Upload,
  X,
} from 'lucide-react';
import {
  AvatarKey,
  BadgeId,
  DecorationId,
  DisplayNameStyle,
  MainScreen,
  NameplateId,
  PresenceStatus,
  ProfileEffectId,
  ProfileFrameId,
  Server,
  ShopBundle,
  UserProfile,
} from '../types/discord';
import { BADGE_DEFINITIONS } from '../data/discordData';
import { BadgeArtwork, isBadgeUnlocked } from './BadgesView';
import { BoostGemIcon } from './ServerBoostView';
import {
  DiscordLogo,
  LaurelQuestIcon,
  NameplateStripBackground,
  NitroWheelIcon,
  OrbsCrystalIcon,
  ProfileEffectAnimationOverlay,
  ProfileFrameArtwork,
  ServerIconArt,
  StatusIndicator,
  UserAvatar,
} from './DiscordArt';
import { findBundleForCosmetic, getOwnedCosmetics } from '../utils/shopOwnership';

interface ProfileViewProps {
  user: UserProfile;
  servers: Server[];
  unreadTotal: number;
  wishlistIds: string[];
  ownedBundleIds: string[];
  shopBundles: ShopBundle[];
  hasUnclaimedQuests: boolean;
  profileViewTrigger?: number;
  initialEditorRequest?: { tab: 'principal' | 'servidor'; serverId?: string } | null;
  onConsumeEditorRequest?: () => void;
  onClose: () => void;
  onNavigate: (screen: MainScreen) => void;
  onUpdateUser: (patch: Partial<UserProfile>) => void;
  onOpenBundle: (bundle: ShopBundle) => void;
}

const BANNER_PRESETS = ['#C41212', '#5865F2', '#10b981', '#dc2626', '#f59e0b', '#18181b'];

const DECORATION_OPTIONS: { id: DecorationId; label: string }[] = [
  { id: 'none', label: 'Ninguno' },
  { id: 'tentempie', label: 'Tentempié de medianoche' },
  { id: 'espectro', label: 'Espectro' },
  { id: 'almas', label: 'Almas atrapadas' },
  { id: 'observador', label: 'Observador' },
  { id: 'polilla', label: 'Polilla fantasma' },
  { id: 'flores-luna', label: 'Flores de luna' },
  { id: 'cuernos', label: 'Cuernos de demonio' },
  { id: 'fuegos-fatuos', label: 'Fuegos fatuos' },
  { id: 'el-ente', label: 'El Ente' },
  { id: 'luna-oscura', label: 'Luna oscura' },
  { id: 'red-sangre', label: 'Red de Sangre' },
  { id: 'calabazas', label: 'Calabazas inquietantes' },
  { id: 'luces-camara', label: '¡Luces, cámara!' },
  { id: 'onda-cosmica', label: '¡Onda cósmica!' },
  { id: 'boveda', label: 'La bóveda' },
  { id: 'claptrap', label: '¡Estoy bailando!' },
  { id: 'saqueo', label: '¡Saqueo!' },
  { id: 'luna-mistica', label: 'Luna mística' },
  { id: 'estrella-nocturna', label: 'Estrella nocturna' },
  { id: 'flores-lunares', label: 'Flores lunares' },
  { id: 'trebol', label: 'Trébol de cuatro hojas' },
  { id: 'jardin-secreto', label: 'Jardín secreto' },
  { id: 'lirio', label: 'Estanque de nenúfares' },
  { id: 'adorable', label: '¡Adorable!' },
  { id: 'random-xd', label: '¡So random!' },
  { id: 'scene-xd', label: 'Estética scene' },
  { id: 'gojo', label: 'Satoru Gojo' },
  { id: 'sukuna', label: 'Ryomen Sukuna' },
  { id: 'yuji', label: 'Yuji Itadori' },
  { id: 'orejas', label: 'Orejas de gato' },
  { id: 'llama', label: 'Llama infernal' },
  { id: 'cerbero', label: 'Cerbero' },
  { id: 'pesadilla', label: 'Hora de pesadilla' },
  { id: 'pato', label: 'el mismo pato' },
  { id: 'grabado', label: 'Grabado japonés' },
  { id: 'lobo', label: 'Lobo y Luna' },
  { id: 'miyabi', label: 'Hoshimi Miyabi' },
  { id: 'ellen', label: 'Ellen Joe' },
  { id: 'burnice', label: 'Burnice' },
  { id: 'deadpool', label: 'Deadpool' },
  { id: 'wolverine', label: 'Wolverine' },
  { id: 'dbd', label: 'Dead by Daylight' },
  { id: 'plantas', label: 'Vibras lofi' },
  { id: 'croma', label: 'Onda cromática' },
  { id: 'gato', label: 'Gato cómodo' },
];

const PROFILE_EFFECT_OPTIONS: { id: ProfileEffectId; label: string; desc: string }[] = [
  { id: 'none', label: 'Ninguno', desc: 'Sin efecto animado' },
  { id: 'observador', label: 'Observador', desc: 'Ojos que emergen desde la oscuridad' },
  { id: 'almas', label: 'Almas atrapadas', desc: 'Manos espectrales sobre el perfil' },
  { id: 'hombre-polilla', label: 'Hombre Polilla', desc: 'Alas sombrías y ojos luminosos' },
  { id: 'flores-luna', label: 'Flores de luna', desc: 'Resplandor floral nocturno' },
  { id: 'diablo-jersey', label: 'Diablo de Jersey', desc: 'Bruma oscura y silueta alada' },
  { id: 'llorona', label: 'La Llorona', desc: 'Aparición espectral entre niebla' },
  { id: 'jackalope', label: 'Jackalope', desc: 'Chispas místicas del bosque' },
  { id: 'gancho', label: 'En el gancho', desc: 'Niebla y destellos de gancho DBD' },
  { id: 'cuervos-luna', label: 'Cuervos bajo la luna', desc: 'Bandada bajo luna llena' },
  { id: 'red-sangre', label: 'Red de Sangre', desc: 'Cristales y energía carmesí' },
  { id: 'el-ente', label: 'El Ente · DBD', desc: 'Garras ígneas del Ente' },
  { id: 'boveda', label: 'Más allá de la bóveda', desc: 'Portal eridio de Borderlands 4' },
  { id: 'saqueo', label: 'Saqueo legendario', desc: 'Haces de botín dorado y violeta' },
  { id: 'trebol', label: 'Lluvia de tréboles', desc: 'Brisa esmeralda de buena suerte' },
  { id: 'jardin-secreto', label: 'Jardín secreto', desc: 'Luciérnagas y pétalos dorados' },
  { id: 'luna-mistica', label: 'Eclipse místico', desc: 'Polvo estelar violeta celestial' },
  { id: 'adorable', label: 'Explosión kawaii', desc: 'Corazones, estrellas y brillo neón' },
  { id: 'scene-xd', label: 'Caos Rawr xD', desc: 'Destellos scene Y2K eléctricos' },
  { id: 'gojo', label: 'Satoru Gojo · Vacío Púrpura', desc: 'Energía infinita azul y púrpura' },
  { id: 'sukuna', label: 'Ryomen Sukuna · Santuario', desc: 'Cortes y llamas carmesí' },
  { id: 'yuji', label: 'Yuji Itadori · Destello Negro', desc: 'Relámpagos de energía maldita' },
  { id: 'cerbero', label: 'Cerbero · Inframundo', desc: 'Fuego espectral y neblina magenta' },
  { id: 'pesadilla', label: 'Hora de pesadilla', desc: 'Destello monocromático abisal' },
  { id: 'jugar', label: 'Vamos a jugar', desc: 'Aparición de manga de terror' },
  { id: 'grabado', label: 'Grabado japonés', desc: 'Tinta sumi-e y pétalos sakura' },
  { id: 'lobo', label: 'Lobo y Luna', desc: 'Luz lunar violeta y destellos' },
  { id: 'miyabi', label: 'Corte de Escarcha · Miyabi', desc: 'Tajo azul glacial animado' },
  { id: 'ellen', label: 'Mordida Glacial · Ellen', desc: 'Destello glacial tiburón' },
  { id: 'burnice', label: 'Chispas de Fuego · Burnice', desc: 'Explosión Nitro Fuel' },
  { id: 'deadpool', label: 'Deadpool & Wolverine', desc: 'Cortes de garras y katanas' },
  { id: 'dbd', label: 'La Entidad · DBD', desc: 'Niebla carmesí del Ente' },
  { id: 'sparks', label: 'Chispas Neón', desc: 'Destellos eléctricos flotantes' },
  { id: 'cyber', label: 'Lluvia Cibernética', desc: 'Holograma táctico oscuro' },
  { id: 'crimson', label: 'Aura Carmesí', desc: 'Resplandor rojo intenso GTA' },
];

const PROFILE_FRAME_OPTIONS: {
  id: ProfileFrameId;
  label: string;
  borderClass: string;
  ornate?: boolean;
}[] = [
  { id: 'none', label: 'Ninguno', borderClass: '' },
  {
    id: 'obsidian',
    label: 'Obsidiana',
    borderClass: 'ring-1 ring-white/25 shadow-[0_0_25px_rgba(255,255,255,0.08)]',
  },
  {
    id: 'crimson',
    label: 'Carmesí GTA',
    borderClass: 'ring-2 ring-[#ef4444]/80 shadow-[0_0_28px_rgba(239,68,68,0.28)]',
  },
  {
    id: 'neon-blue',
    label: 'Neón Azul',
    borderClass: 'ring-2 ring-[#38bdf8]/80 shadow-[0_0_28px_rgba(56,189,248,0.3)]',
  },
  {
    id: 'gold',
    label: 'Dorado Real',
    borderClass: 'ring-2 ring-[#f59e0b]/85 shadow-[0_0_28px_rgba(245,158,11,0.28)]',
  },
  {
    id: 'glitch',
    label: 'Cyber Glitch',
    borderClass: 'ring-2 ring-[#5865F2]/85 shadow-[0_0_28px_rgba(88,101,242,0.35)]',
  },
  {
    id: 'espectro',
    label: 'Espectro',
    borderClass: 'ring-1 ring-zinc-200/35 shadow-[0_0_24px_rgba(255,255,255,0.12)]',
    ornate: true,
  },
  {
    id: 'observador',
    label: 'Observador',
    borderClass: 'ring-2 ring-white/30 shadow-[0_0_28px_rgba(0,0,0,0.85)]',
    ornate: true,
  },
  {
    id: 'ramas-desnudas',
    label: 'Ramas desnudas',
    borderClass: 'ring-1 ring-zinc-400/45 shadow-[0_0_20px_rgba(228,228,231,0.12)]',
    ornate: true,
  },
  {
    id: 'flores-luna',
    label: 'Flores de luna',
    borderClass: 'ring-2 ring-emerald-400/50 shadow-[0_0_24px_rgba(74,222,128,0.22)]',
    ornate: true,
  },
  {
    id: 'diablo-jersey',
    label: 'Diablo de Jersey',
    borderClass: 'ring-2 ring-slate-400/55 shadow-[0_0_24px_rgba(148,163,184,0.22)]',
    ornate: true,
  },
  {
    id: 'el-ente',
    label: 'El Ente',
    borderClass: 'ring-2 ring-orange-500/65 shadow-[0_0_26px_rgba(249,115,22,0.28)]',
    ornate: true,
  },
  {
    id: 'luna-oscura',
    label: 'Luna oscura',
    borderClass: 'ring-2 ring-slate-300/45 shadow-[0_0_24px_rgba(148,163,184,0.2)]',
    ornate: true,
  },
];

const NAMEPLATE_OPTIONS: { id: NameplateId; label: string; gradient?: string }[] = [
  { id: 'none', label: 'Ninguno' },
  { id: 'observador', label: 'Observador', gradient: 'from-zinc-400/25 to-black/70' },
  { id: 'acechador', label: 'Acechador acuático', gradient: 'from-zinc-500/30 to-slate-950/85' },
  { id: 'almas', label: 'Almas atrapadas', gradient: 'from-zinc-400/25 to-black/85' },
  { id: 'polilla', label: 'Polilla fantasma', gradient: 'from-slate-500/35 to-zinc-950/85' },
  { id: 'flores-luna', label: 'Flores de luna', gradient: 'from-emerald-500/30 to-lime-950/80' },
  { id: 'diablo-jersey', label: 'Diablo de Jersey', gradient: 'from-slate-600/35 to-zinc-950/85' },
  { id: 'fuegos-fatuos', label: 'Fuegos fatuos', gradient: 'from-teal-500/30 to-emerald-950/85' },
  { id: 'jackalope', label: 'Jackalope', gradient: 'from-amber-500/30 to-stone-950/80' },
  { id: 'marcas-aranazos', label: 'Marcas de arañazos', gradient: 'from-red-600/35 to-black/85' },
  { id: 'luna-oscura', label: 'Luna oscura', gradient: 'from-slate-400/25 to-slate-950/90' },
  { id: 'red-sangre', label: 'Red de Sangre', gradient: 'from-rose-700/40 to-black/85' },
  { id: 'conejito-fresero', label: 'Conejito fresero', gradient: 'from-pink-500/35 to-rose-950/75' },
  { id: 'el-mismo-pato', label: 'El mismo pato', gradient: 'from-cyan-500/35 to-sky-950/80' },
  { id: 'marea-lluvia', label: 'Marea de lluvia', gradient: 'from-indigo-500/35 to-slate-950/80' },
  { id: 'jardin-secreto', label: 'Jardín secreto', gradient: 'from-emerald-600/35 to-teal-950/80' },
  { id: 'rama', label: 'Rama en flor', gradient: 'from-rose-500/35 to-red-950/60' },
  { id: 'vader', label: 'Darth Vader', gradient: 'from-red-700/40 to-black/80' },
  { id: 'condenacion', label: 'Condenación eterna', gradient: 'from-cyan-500/35 to-slate-950/80' },
  { id: 'cerbero', label: 'Cerbero', gradient: 'from-fuchsia-600/35 to-amber-900/50' },
  { id: 'gojo', label: 'Satoru Gojo', gradient: 'from-sky-500/35 to-indigo-950/70' },
  { id: 'sukuna', label: 'Ryomen Sukuna', gradient: 'from-orange-600/35 to-red-950/75' },
  { id: 'yuji', label: 'Yuji Itadori', gradient: 'from-pink-500/35 to-rose-950/70' },
  { id: 'lobo', label: 'Lobo y Luna', gradient: 'from-violet-600/35 to-indigo-950/75' },
  { id: 'sakura', label: 'Sakura', gradient: 'from-pink-500/30 to-rose-900/40' },
  { id: 'vice-city', label: 'Vice City', gradient: 'from-cyan-500/30 to-amber-500/30' },
  { id: 'miyabi', label: 'Miyabi', gradient: 'from-sky-500/30 to-slate-900/50' },
  { id: 'deadpool', label: 'Deadpool', gradient: 'from-red-600/35 to-zinc-900/60' },
  { id: 'wolverine', label: 'Wolverine', gradient: 'from-yellow-500/30 to-zinc-900/60' },
  { id: 'dbd', label: 'Dead by Daylight', gradient: 'from-orange-700/35 to-black/70' },
];

const AVATAR_PRESETS: { id: AvatarKey; label: string }[] = [
  { id: 'madara', label: 'Gato Noir' },
  { id: 'snuf', label: 'Tokyo' },
  { id: 'alex', label: 'Atardecer' },
  { id: 'joawasa', label: 'Shiba' },
  { id: 'dragon', label: 'Cumbre' },
  { id: 'coffee', label: 'Café' },
];

function getDisplayNameStyleClass(style?: DisplayNameStyle): string {
  switch (style) {
    case 'gta':
      return 'font-gta';
    case 'neon':
      return 'font-neon text-sky-300';
    case 'retro':
      return 'font-retro';
    default:
      return 'font-display font-extrabold';
  }
}

const ProfileEffectOverlay: React.FC<{ effect?: ProfileEffectId }> = ({ effect }) => {
  if (!effect || effect === 'none') return null;
  if (effect === 'miyabi') {
    return (
      <svg
        viewBox="0 0 360 120"
        className="absolute right-0 bottom-0 h-full w-48 pointer-events-none opacity-70 anim-slash"
      >
        <path d="M40 105 Q150 55 340 20 Q230 95 95 110 Z" fill="#38bdf8" />
      </svg>
    );
  }
  if (effect === 'crimson') {
    return (
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_80%_20%,rgba(239,68,68,0.38),transparent_60%)]" />
    );
  }
  if (effect === 'cyber') {
    return (
      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(135deg,rgba(56,189,248,0.18)_0%,transparent_50%,rgba(88,101,242,0.22)_100%)]" />
    );
  }
  if (effect === 'sparks') {
    return (
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <span className="absolute top-4 right-12 w-1.5 h-1.5 rounded-full bg-amber-300 animate-ping" />
        <span className="absolute bottom-6 left-16 w-1.5 h-1.5 rounded-full bg-sky-300 animate-pulse" />
        <span className="absolute top-10 left-1/2 w-1 h-1 rounded-full bg-white animate-ping" />
      </div>
    );
  }
  return null;
};

export const ProfileView: React.FC<ProfileViewProps> = ({
  user,
  servers,
  unreadTotal,
  wishlistIds,
  ownedBundleIds,
  shopBundles,
  hasUnclaimedQuests,
  profileViewTrigger = 0,
  initialEditorRequest,
  onConsumeEditorRequest,
  onClose,
  onNavigate,
  onUpdateUser,
  onOpenBundle,
}) => {
  const [activeTab, setActiveTab] = useState<'principal' | 'actividad' | 'deseos'>('principal');
  const [showTuneaCard, setShowTuneaCard] = useState(true);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [editorTab, setEditorTab] = useState<'principal' | 'servidor'>('principal');
  const [selectedEditorServerId, setSelectedEditorServerId] = useState<string>(
    servers[0]?.id || ''
  );
  const [effectPlayKey, setEffectPlayKey] = useState(1);
  const [editorEffectPlayKey, setEditorEffectPlayKey] = useState(1);

  const [showStatusSheet, setShowStatusSheet] = useState(false);
  const [showCustomStatusModal, setShowCustomStatusModal] = useState(false);
  const [editingNote, setEditingNote] = useState(false);
  const [editingInlineBio, setEditingInlineBio] = useState(false);
  const [inlineBioDraft, setInlineBioDraft] = useState(user.bio);

  // Picker sheets inside full-screen Perfil editor
  const [activePickerSheet, setActivePickerSheet] = useState<
    | null
    | 'banner'
    | 'avatar'
    | 'name-style-info'
    | 'decoration'
    | 'effect'
    | 'frame'
    | 'nameplate'
    | 'server-tag'
  >(null);
  const [serverTagSearch, setServerTagSearch] = useState('');
  const [nitroPreviewActive, setNitroPreviewActive] = useState(false);

  // Draft state for editor
  const [draftName, setDraftName] = useState(user.displayName);
  const [draftNameStyle, setDraftNameStyle] = useState<DisplayNameStyle>(
    user.displayNameStyle || 'gta'
  );
  const [draftPronouns, setDraftPronouns] = useState(user.pronouns || '');
  const [draftBio, setDraftBio] = useState(user.bio);
  const [draftBanner, setDraftBanner] = useState(user.bannerColor);
  const [draftBannerImage, setDraftBannerImage] = useState<string | undefined>(user.bannerImage);
  const [draftAvatar, setDraftAvatar] = useState<AvatarKey>(user.avatar);
  const [draftCustomAvatarUrl, setDraftCustomAvatarUrl] = useState<string | undefined>(
    user.customAvatarUrl
  );
  const [draftDeco, setDraftDeco] = useState<DecorationId>(user.decoration);
  const [draftEffect, setDraftEffect] = useState<ProfileEffectId>(user.profileEffect || 'none');
  const [draftFrame, setDraftFrame] = useState<ProfileFrameId>(user.profileFrame || 'none');
  const [draftNameplate, setDraftNameplate] = useState<NameplateId>(user.nameplate);
  const [draftServerTag, setDraftServerTag] = useState<string>(user.serverTag || '');
  const [draftPerServer, setDraftPerServer] = useState(user.perServerProfiles || {});
  const [draftCustomStatus, setDraftCustomStatus] = useState(user.customStatus);

  const bannerFileRef = useRef<HTMLInputElement>(null);
  const avatarFileRef = useRef<HTMLInputElement>(null);
  const serverBannerFileRef = useRef<HTMLInputElement>(null);

  const wishlistedBundles = shopBundles.filter((b) => wishlistIds.includes(b.id));
  const ownedCosmetics = getOwnedCosmetics(ownedBundleIds, shopBundles);
  const nitroEffectsUnlocked = user.nitroTier !== 'none';
  const ownedBundles = shopBundles.filter((b) => ownedBundleIds.includes(b.id));

  const isDecoOwned = (id: DecorationId) => ownedCosmetics.decorations.has(id);
  const isEffectOwned = (id: ProfileEffectId) =>
    ownedCosmetics.effects.has(id) ||
    (nitroEffectsUnlocked && (id === 'sparks' || id === 'cyber' || id === 'crimson'));
  const isNameplateOwned = (id: NameplateId) => ownedCosmetics.nameplates.has(id);
  const isFrameOwned = (id: ProfileFrameId) => ownedCosmetics.frames.has(id);

  const ownedBanners = shopBundles.flatMap((bundle) => {
    if (!ownedBundleIds.includes(bundle.id)) return [];
    const bannerItem = bundle.items.find((item) => item.bannerUrl);
    if (!bannerItem?.bannerUrl) return [];
    return [
      {
        id: bannerItem.id,
        name: bannerItem.name,
        bundleTitle: bundle.title,
        bannerUrl: bannerItem.bannerUrl,
      },
    ];
  });

  const syncDraftFromUser = () => {
    setDraftName(user.displayName);
    setDraftNameStyle(user.displayNameStyle || 'gta');
    setDraftPronouns(user.pronouns || '');
    setDraftBio(user.bio);
    setDraftBanner(user.bannerColor);
    setDraftBannerImage(user.bannerImage);
    setDraftAvatar(user.avatar);
    setDraftCustomAvatarUrl(user.customAvatarUrl);
    setDraftDeco(user.decoration);
    setDraftEffect(user.profileEffect || 'none');
    setDraftFrame(user.profileFrame || 'none');
    setDraftNameplate(user.nameplate);
    setDraftServerTag(user.serverTag || '');
    setDraftPerServer(user.perServerProfiles || {});
    setNitroPreviewActive(false);
  };

  const openEditor = (tab: 'principal' | 'servidor' = 'principal', srvId?: string) => {
    syncDraftFromUser();
    setEditorTab(tab);
    setSelectedEditorServerId(srvId || servers[0]?.id || '');
    setShowEditProfile(true);
  };

  useEffect(() => {
    if (initialEditorRequest) {
      openEditor(initialEditorRequest.tab, initialEditorRequest.serverId);
      onConsumeEditorRequest?.();
    }
  }, [initialEditorRequest]);

  useEffect(() => {
    setEffectPlayKey((k) => k + 1);
  }, [profileViewTrigger, user.profileEffect]);

  const activeProfileEffect: ProfileEffectId =
    user.profileEffect && user.profileEffect !== 'none' ? user.profileEffect : 'none';

  const saveProfile = () => {
    onUpdateUser({
      displayName: draftName.trim() || user.displayName,
      displayNameStyle: draftNameStyle,
      pronouns: draftPronouns.trim(),
      bio: draftBio.slice(0, 300),
      bannerColor: draftBanner,
      bannerImage: draftBannerImage,
      avatar: draftAvatar,
      customAvatarUrl: draftCustomAvatarUrl,
      decoration: draftDeco,
      profileEffect: draftEffect,
      profileFrame: draftFrame,
      nameplate: draftNameplate,
      serverTag: draftServerTag,
      perServerProfiles: draftPerServer,
    });
    setShowEditProfile(false);
    setActivePickerSheet(null);
    setEffectPlayKey((k) => k + 1);
  };

  const saveCustomStatus = () => {
    onUpdateUser({ customStatus: draftCustomStatus.trim() });
    setShowCustomStatusModal(false);
  };

  const readFileAsDataUrl = (file: File, onLoad: (url: string) => void) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') onLoad(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const activeFrameClass =
    PROFILE_FRAME_OPTIONS.find((f) => f.id === (user.profileFrame || 'none'))?.borderClass || '';

  const draftFrameClass =
    PROFILE_FRAME_OPTIONS.find((f) => f.id === (nitroPreviewActive ? 'neon-blue' : draftFrame))
      ?.borderClass || '';

  const getServerTagLabel = (srv: Server) => {
    const raw = (srv.activeServerTag || srv.shortCode || 'ZN').trim();
    return raw.includes('⚡') || raw.includes('⚔') ? raw : `⚡ ${raw}`;
  };

  const filteredServersForTag = servers.filter((srv) => {
    const q = serverTagSearch.trim().toLowerCase();
    if (!q) return true;
    return (
      srv.name.toLowerCase().includes(q) ||
      srv.shortCode.toLowerCase().includes(q) ||
      (srv.activeServerTag || '').toLowerCase().includes(q)
    );
  });

  const currentServerProfileTarget =
    servers.find((s) => s.id === selectedEditorServerId) || servers[0];
  const currentServerDraft = currentServerProfileTarget
    ? draftPerServer[currentServerProfileTarget.id] || {}
    : {};

  const updateCurrentServerDraft = (patch: Partial<(typeof draftPerServer)[string]>) => {
    if (!currentServerProfileTarget) return;
    setDraftPerServer((prev) => ({
      ...prev,
      [currentServerProfileTarget.id]: {
        ...(prev[currentServerProfileTarget.id] || {}),
        ...patch,
      },
    }));
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[var(--dc-bg-chat)] text-[var(--dc-text-primary)] relative overflow-hidden">
      <div className="flex-1 overflow-y-auto pb-28">
        <div
          className={`relative ${
            PROFILE_FRAME_OPTIONS.find((f) => f.id === (user.profileFrame || 'none'))?.ornate
              ? 'mx-2.5 mt-5 rounded-2xl overflow-visible'
              : ''
          } ${activeFrameClass}`}
        >
          <ProfileFrameArtwork frame={user.profileFrame} />
          {/* Full-Profile Entrance Effect (plays when opening profile and fades out) */}
          <ProfileEffectAnimationOverlay
            effect={activeProfileEffect}
            playKey={effectPlayKey}
            className="z-30"
          />

          {/* Top Banner (supports Shop Banner Image + Solid Fallback Color + Profile Effects) */}
          <div
            className={`h-36 md:h-44 w-full relative transition-colors overflow-hidden ${
              user.decoration !== 'none' || user.nameplate !== 'none' || user.bannerImage
                ? 'anim-shimmer'
                : ''
            }`}
            style={{ backgroundColor: user.bannerColor }}
          >
            {user.bannerImage && (
              <img
                src={user.bannerImage}
                alt="Banner de perfil"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/10 to-white/10 pointer-events-none" />
            <ProfileEffectOverlay effect={activeProfileEffect} />

            <button
              onClick={onClose}
              className="absolute top-3 left-3 inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-black/55 hover:bg-black/75 border border-white/15 text-white transition-all cursor-pointer z-30 shadow-md backdrop-blur-xs active:scale-95"
            >
              <X className="w-5 h-5" />
              <span className="px-1.5 py-0.5 rounded-full bg-[#da373c] text-white text-[11px] font-bold tabular-nums leading-none">
                {unreadTotal}
              </span>
            </button>

            <div className="absolute top-3 right-3 flex items-center gap-1.5 z-30">
              {activeProfileEffect !== 'none' && (
                <button
                  onClick={() => setEffectPlayKey((k) => k + 1)}
                  title="Volver a reproducir efecto de perfil"
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-black/55 hover:bg-black/75 border border-white/15 text-sky-300 text-xs font-semibold transition-all cursor-pointer shadow-md backdrop-blur-xs active:scale-95"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Efecto</span>
                </button>
              )}
              <button
                onClick={() => openEditor('principal')}
                aria-label="Cambiar banner"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/55 hover:bg-black/75 border border-white/15 text-white text-xs font-semibold transition-all cursor-pointer shadow-md backdrop-blur-xs active:scale-95"
              >
                <ImageIcon className="w-3.5 h-3.5" />
                <span>Banner</span>
              </button>
            </div>
          </div>

          <div className="max-w-2xl mx-auto px-4 pb-2">
            {/* Overlapping Avatar + Thought Bubble */}
            <div className="relative flex items-end justify-between -mt-12 mb-3">
              <div className="relative">
                <div className="p-1.5 rounded-full bg-[var(--dc-bg-chat)] inline-block shadow-lg">
                  <UserAvatar
                    avatar={user.avatar}
                    customAvatarUrl={user.customAvatarUrl}
                    status={user.status}
                    decoration={user.decoration}
                    size="xl"
                    borderColor="var(--dc-bg-chat)"
                  />
                </div>
              </div>

              <button
                onClick={() => {
                  setDraftCustomStatus(user.customStatus);
                  setShowCustomStatusModal(true);
                }}
                className="relative mb-2 ml-2 flex-1 max-w-[250px] dc-btn-secondary rounded-2xl px-3.5 py-2 flex items-center gap-2 text-left cursor-pointer"
              >
                <span className="w-2.5 h-2.5 rounded-full bg-[var(--dc-bg-elevated)] border border-[var(--dc-border)] absolute -left-2 bottom-1.5" />
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--dc-bg-elevated)] border border-[var(--dc-border)] absolute -left-4 bottom-0" />
                <span className="w-5 h-5 rounded-full bg-[var(--dc-text-muted)]/20 flex items-center justify-center shrink-0">
                  <Plus className="w-3.5 h-3.5 text-[var(--dc-text-primary)]" />
                </span>
                <span className="text-[13px] italic text-[var(--dc-text-secondary)] line-clamp-2 leading-tight">
                  {user.customStatus || 'Añadir estado'}
                </span>
              </button>
            </div>

            {/* Display Name & Username & Badges & Server Tag */}
            <div className="relative">
              <button
                onClick={() => setShowStatusSheet(true)}
                className={`inline-flex items-center gap-1.5 text-[24px] text-[var(--dc-text-primary)] tracking-tight hover:opacity-90 cursor-pointer ${getDisplayNameStyleClass(
                  user.displayNameStyle
                )}`}
              >
                <span>{user.displayName}</span>
                <ChevronDown className="w-5 h-5 text-[var(--dc-text-secondary)]" />
              </button>

              <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                <span className="text-[14px] text-[var(--dc-text-secondary)]">{user.username}</span>
                {user.pronouns && (
                  <span className="text-[13px] text-[var(--dc-text-muted)]">· {user.pronouns}</span>
                )}
                {user.serverTag && (
                  <button
                    onClick={() => {
                      openEditor('principal');
                      setActivePickerSheet('server-tag');
                    }}
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-[#181920] border border-white/10 text-[11.5px] font-bold text-white cursor-pointer hover:bg-[#22242e]"
                  >
                    {user.serverTag}
                  </button>
                )}
                <button
                  onClick={() => onNavigate('insignias')}
                  title="Ver y personalizar tus insignias"
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-[var(--dc-bg-card)] hover:bg-[var(--dc-bg-elevated)] border border-[var(--dc-border)] transition-colors cursor-pointer"
                >
                  {(user.equippedBadgeIds || ['hypesquad', 'misiones'])
                    .filter((id) => isBadgeUnlocked(id as BadgeId, user))
                    .map((badgeId) => (
                      <span key={badgeId} className="inline-flex items-center justify-center">
                        <BadgeArtwork badgeId={badgeId as BadgeId} unlocked size="sm" />
                      </span>
                    ))}
                  <ChevronRight className="w-3.5 h-3.5 text-[var(--dc-text-muted)]" />
                </button>
              </div>

              {/* Quick Inline Status Selector */}
              <div className="mt-3 flex flex-wrap items-center gap-1.5">
                {(
                  [
                    { id: 'online', label: 'En línea' },
                    { id: 'idle', label: 'Ausente' },
                    { id: 'dnd', label: 'No molestar' },
                    { id: 'offline', label: 'Invisible' },
                  ] as { id: PresenceStatus; label: string }[]
                ).map((st) => {
                  const active = user.status === st.id;
                  return (
                    <button
                      key={st.id}
                      type="button"
                      onClick={() => onUpdateUser({ status: st.id })}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors cursor-pointer whitespace-nowrap ${
                        active
                          ? 'bg-[#5865F2]/20 border-[#5865F2] text-white'
                          : 'bg-[var(--dc-bg-card)] border-[var(--dc-border)] text-[var(--dc-text-secondary)] hover:text-white'
                      }`}
                    >
                      <StatusIndicator
                        status={st.id}
                        size="sm"
                        borderColor={active ? '#1d2142' : 'var(--dc-bg-card)'}
                      />
                      <span>{st.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Direct Inline Bio Card */}
              <div className="mt-3 rounded-2xl bg-[var(--dc-bg-card)] border border-[var(--dc-border)] p-3.5">
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--dc-text-muted)]">
                    Sobre mí (Biografía)
                  </span>
                  {!editingInlineBio && (
                    <button
                      type="button"
                      onClick={() => {
                        setInlineBioDraft(user.bio);
                        setEditingInlineBio(true);
                      }}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-[#7b85ff] hover:text-white cursor-pointer"
                    >
                      <Pencil className="w-3 h-3" />
                      <span>Editar</span>
                    </button>
                  )}
                </div>

                {editingInlineBio ? (
                  <div className="space-y-2">
                    <textarea
                      rows={3}
                      maxLength={300}
                      autoFocus
                      value={inlineBioDraft}
                      onChange={(e) => setInlineBioDraft(e.target.value)}
                      placeholder="Cuéntale a la comunidad sobre ti..."
                      className="w-full rounded-xl bg-[var(--dc-bg-input)] border border-[#5865F2] px-3 py-2 text-sm text-[var(--dc-text-primary)] focus:outline-none resize-none"
                    />
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] text-[var(--dc-text-muted)] tabular-nums">
                        {inlineBioDraft.length}/300
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setEditingInlineBio(false)}
                          className="px-3 py-1 rounded-full dc-btn-secondary text-xs font-semibold cursor-pointer"
                        >
                          Cancelar
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            onUpdateUser({ bio: inlineBioDraft.slice(0, 300) });
                            setEditingInlineBio(false);
                          }}
                          className="px-3.5 py-1 rounded-full dc-btn-primary text-xs font-bold cursor-pointer"
                        >
                          Guardar
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-[13.5px] text-[var(--dc-text-secondary)] whitespace-pre-wrap">
                    {user.bio || 'Sin biografía todavía. Toca Editar para añadir una.'}
                  </p>
                )}
              </div>
            </div>

            {/* Editar perfil CTA */}
            <button
              onClick={() => openEditor('principal')}
              className="w-full mt-4 h-11 rounded-full dc-btn-primary font-semibold text-[15px] flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap"
            >
              <Pencil className="w-4 h-4" />
              <span>Editar perfil completo</span>
            </button>
          </div>
        </div>

        <div className="max-w-2xl mx-auto px-4">
          {/* Profile Tabs */}
          <div className="grid grid-cols-3 border-b border-[var(--dc-border)] mt-4">
            {(
              [
                { id: 'principal', label: 'Principal' },
                { id: 'actividad', label: 'Actividad' },
                { id: 'deseos', label: 'Lista de deseos' },
              ] as const
            ).map((tab) => {
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-3 text-[14px] font-semibold relative transition-colors cursor-pointer ${
                    active
                      ? 'text-[#5865F2]'
                      : 'text-[var(--dc-text-muted)] hover:text-[var(--dc-text-primary)]'
                  }`}
                >
                  {tab.label}
                  {active && (
                    <span className="absolute bottom-0 inset-x-4 h-[2.5px] rounded-full bg-[#5865F2]" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Tab Content */}
          {activeTab === 'principal' && (
            <div className="space-y-3 mt-4">
              {showTuneaCard && (
                <div className="rounded-2xl bg-[var(--dc-bg-card)] border border-white/12 p-3.5 shadow-md">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[14px] font-semibold text-[var(--dc-text-primary)]">
                      Tunea tu perfil
                    </span>
                    <button
                      onClick={() => setShowTuneaCard(false)}
                      aria-label="Cerrar tarjeta"
                      className="w-7 h-7 rounded-full dc-btn-icon flex items-center justify-center cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      onClick={() => onNavigate('nitro')}
                      className="h-10 rounded-full dc-btn-secondary text-[12.5px] font-semibold flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap px-2"
                    >
                      <NitroWheelIcon className="w-4 h-4 text-[#5865F2] shrink-0" />
                      <span>Nitro</span>
                    </button>
                    <button
                      onClick={() => onNavigate('tienda')}
                      className="h-10 rounded-full dc-btn-secondary text-[12.5px] font-semibold flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap px-2"
                    >
                      <Store className="w-4 h-4 text-indigo-400 shrink-0" />
                      <span>Tienda</span>
                    </button>
                    <button
                      onClick={() => onNavigate('mejoras')}
                      className="h-10 rounded-full dc-btn-secondary text-[12.5px] font-semibold flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap px-2"
                    >
                      <BoostGemIcon className="w-4 h-4 shrink-0" />
                      <span>Mejorar</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Tus insignias Entry Card */}
              <button
                onClick={() => onNavigate('insignias')}
                className="w-full rounded-2xl bg-[var(--dc-bg-card)] hover:bg-[var(--dc-bg-elevated)] border border-[var(--dc-border)] p-4 flex items-center justify-between gap-3 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-[#5865F2]/15 text-[#5865F2] flex items-center justify-center shrink-0">
                    <Award className="w-5 h-5" />
                  </div>
                  <div className="text-left min-w-0">
                    <p className="text-[14.5px] font-semibold text-[var(--dc-text-primary)]">
                      Tus insignias
                    </p>
                    <p className="text-xs text-[var(--dc-text-muted)]">
                      {BADGE_DEFINITIONS.filter((b) => isBadgeUnlocked(b.id, user)).length}/
                      {BADGE_DEFINITIONS.length} desbloqueadas · Toca para conseguir más
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <div className="flex items-center gap-1">
                    {BADGE_DEFINITIONS.filter((b) => isBadgeUnlocked(b.id, user))
                      .slice(0, 3)
                      .map((b) => (
                        <BadgeArtwork key={b.id} badgeId={b.id} unlocked size="sm" />
                      ))}
                  </div>
                  <ChevronRight className="w-4 h-4 text-[var(--dc-text-muted)]" />
                </div>
              </button>

              {/* Purchased Shop Inventory Card */}
              <div className="rounded-2xl bg-[var(--dc-bg-card)] border border-[var(--dc-border)] p-4 space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-9 h-9 rounded-xl bg-indigo-500/15 text-indigo-400 flex items-center justify-center shrink-0">
                      <ShoppingBag className="w-4.5 h-4.5" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[14px] font-semibold text-[var(--dc-text-primary)] truncate">
                        Objetos de Tienda en tu perfil ({ownedBundles.length})
                      </p>
                      <p className="text-xs text-[var(--dc-text-muted)]">
                        Solo puedes equipar artículos que hayas comprado
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => onNavigate('tienda')}
                    className="px-3.5 py-1.5 rounded-full dc-btn-primary text-xs font-bold whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    Ir a Tienda
                  </button>
                </div>

                {ownedBundles.length === 0 ? (
                  <div className="rounded-xl bg-[var(--dc-bg-input)] border border-[var(--dc-border)] px-3.5 py-3 text-xs text-[var(--dc-text-muted)]">
                    Aún no has comprado lotes en la Tienda. Visita la Tienda para adquirir decoraciones, placas, efectos y banners y dejarlos en tu perfil.
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {ownedBundles.map((bundle) => {
                        const deco = bundle.items.find((i) => i.decorationId)?.decorationId;
                        const plate = bundle.items.find((i) => i.nameplateId)?.nameplateId;
                        const effect = bundle.items.find((i) => i.profileEffectId)?.profileEffectId;
                        const frame = bundle.items.find((i) => i.profileFrameId)?.profileFrameId;
                        const banner = bundle.items.find((i) => i.bannerUrl)?.bannerUrl;
                        const isEquipped =
                          (deco && user.decoration === deco) ||
                          (plate && user.nameplate === plate) ||
                          (effect && user.profileEffect === effect) ||
                          (frame && user.profileFrame === frame) ||
                          (banner && user.bannerImage === banner);

                        return (
                          <div
                            key={bundle.id}
                            className={`rounded-xl p-2.5 border flex items-center justify-between gap-2.5 ${
                              isEquipped
                                ? 'bg-[#5865F2]/12 border-[#5865F2]/50'
                                : 'bg-[var(--dc-bg-input)] border-[var(--dc-border)]'
                            }`}
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              {!deco && frame ? (
                                <div className="relative w-8 h-8 rounded-lg bg-[#1a1c24] border border-white/15 shrink-0 flex items-center justify-center overflow-visible">
                                  <ProfileFrameArtwork frame={frame} />
                                </div>
                              ) : (
                                <UserAvatar
                                  avatar={user.avatar}
                                  customAvatarUrl={user.customAvatarUrl}
                                  decoration={deco || 'none'}
                                  size="sm"
                                  showStatus={false}
                                />
                              )}
                              <div className="min-w-0">
                                <p className="text-xs font-bold text-[var(--dc-text-primary)] truncate">
                                  {bundle.title}
                                </p>
                                <p className="text-[11px] text-[var(--dc-text-muted)] truncate">
                                  {bundle.items.map((i) => i.kind.split(' ')[0]).join(' · ')}
                                </p>
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                if (isEquipped) {
                                  onUpdateUser({
                                    ...(deco && user.decoration === deco ? { decoration: 'none' } : {}),
                                    ...(plate && user.nameplate === plate ? { nameplate: 'none' } : {}),
                                    ...(effect && user.profileEffect === effect ? { profileEffect: 'none' } : {}),
                                    ...(frame && user.profileFrame === frame ? { profileFrame: 'none' } : {}),
                                    ...(banner && user.bannerImage === banner ? { bannerImage: undefined } : {}),
                                  });
                                } else {
                                  onUpdateUser({
                                    ...(deco ? { decoration: deco } : {}),
                                    ...(plate ? { nameplate: plate } : {}),
                                    ...(effect ? { profileEffect: effect } : {}),
                                    ...(frame ? { profileFrame: frame } : {}),
                                    ...(banner ? { bannerImage: banner } : {}),
                                  });
                                }
                              }}
                              className={`px-2.5 py-1 rounded-full text-[11px] font-bold shrink-0 cursor-pointer ${
                                isEquipped ? 'dc-btn-secondary' : 'dc-btn-success'
                              }`}
                            >
                              {isEquipped ? 'Quitar' : 'Equipar'}
                            </button>
                          </div>
                        );
                      })}
                    </div>

                    {ownedBanners.length > 0 && (
                      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pt-1">
                        <button
                          onClick={() => onUpdateUser({ bannerImage: undefined })}
                          className={`h-11 px-3 rounded-xl border text-xs font-semibold shrink-0 cursor-pointer transition-all ${
                            !user.bannerImage
                              ? 'ring-2 ring-[#5865F2] border-transparent bg-[var(--dc-bg-elevated)] text-[var(--dc-text-primary)]'
                              : 'border-[var(--dc-border)] bg-[var(--dc-bg-input)] text-[var(--dc-text-secondary)]'
                          }`}
                        >
                          Color sólido
                        </button>
                        {ownedBanners.map((b) => {
                          const equipped = user.bannerImage === b.bannerUrl;
                          return (
                            <button
                              key={b.id}
                              onClick={() => onUpdateUser({ bannerImage: b.bannerUrl })}
                              className={`relative w-24 h-11 rounded-xl overflow-hidden shrink-0 border cursor-pointer transition-all ${
                                equipped
                                  ? 'ring-2 ring-[#23a55a] border-transparent shadow-md'
                                  : 'border-[var(--dc-border)] opacity-80 hover:opacity-100'
                              }`}
                              title={b.name}
                            >
                              <img
                                src={b.bannerUrl}
                                alt={b.name}
                                referrerPolicy="no-referrer"
                                className="w-full h-full object-cover"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                              <span className="absolute bottom-1 left-1.5 right-1.5 text-[10px] font-bold text-white truncate text-left">
                                {b.name}
                              </span>
                              {equipped && (
                                <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-[#23a55a] text-white flex items-center justify-center">
                                  <Check className="w-2.5 h-2.5" />
                                </span>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}
              </div>

              <button
                onClick={() => onNavigate('misiones')}
                className="w-full rounded-2xl bg-[var(--dc-bg-card)] hover:bg-[var(--dc-bg-elevated)] border border-[var(--dc-border)] p-4 flex items-center justify-between transition-colors cursor-pointer"
              >
                <span className="text-[14.5px] font-semibold text-[var(--dc-text-secondary)]">
                  Saldo de Orbs
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--dc-bg-elevated)] text-[var(--dc-text-primary)] text-[14px] font-bold tabular-nums">
                  <OrbsCrystalIcon className="w-4 h-4" />
                  <span>{user.orbs.toLocaleString('es-ES')}</span>
                </span>
              </button>

              <div className="rounded-2xl bg-[var(--dc-bg-card)] border border-[var(--dc-border)] p-4 space-y-2">
                <p className="text-[13.5px] font-semibold text-[var(--dc-text-secondary)]">
                  Miembro desde
                </p>
                <div className="flex items-center gap-2 text-[14px] text-[var(--dc-text-primary)]">
                  <DiscordLogo className="w-4 h-4 text-[var(--dc-text-secondary)]" />
                  <span>{user.memberSince}</span>
                </div>
              </div>

              <button
                onClick={() => onNavigate('amigos')}
                className="w-full rounded-2xl bg-[var(--dc-bg-card)] hover:bg-[var(--dc-bg-elevated)] border border-[var(--dc-border)] p-4 flex items-center justify-between transition-colors cursor-pointer"
              >
                <span className="text-[14.5px] font-semibold text-[var(--dc-text-secondary)]">
                  Amigos
                </span>
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-2">
                    {(['dragon', 'snuf', 'alex', 'joawasa', 'carioca'] as const).map((av) => (
                      <div
                        key={av}
                        className="w-7 h-7 rounded-full overflow-hidden ring-2 ring-[var(--dc-bg-card)]"
                      >
                        <UserAvatar avatar={av} size="xs" showStatus={false} />
                      </div>
                    ))}
                  </div>
                  <ChevronRight className="w-4 h-4 text-[var(--dc-text-muted)]" />
                </div>
              </button>

              <div className="rounded-2xl bg-[var(--dc-bg-card)] border border-[var(--dc-border)] p-4">
                <div
                  onClick={() => setEditingNote(true)}
                  className="flex items-center justify-between gap-3 cursor-pointer"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-[14px] font-semibold text-[var(--dc-text-secondary)]">
                      Nota (solo es visible para ti)
                    </p>
                    {editingNote ? (
                      <input
                        type="text"
                        autoFocus
                        value={user.note}
                        onChange={(e) => onUpdateUser({ note: e.target.value })}
                        onBlur={() => setEditingNote(false)}
                        onKeyDown={(e) => e.key === 'Enter' && setEditingNote(false)}
                        placeholder="Toca para añadir una nota..."
                        className="w-full mt-1.5 bg-[var(--dc-bg-input)] rounded-lg px-2.5 py-1.5 text-sm text-[var(--dc-text-primary)] focus:outline-none"
                      />
                    ) : user.note ? (
                      <p className="text-sm text-[var(--dc-text-primary)] mt-1">{user.note}</p>
                    ) : null}
                  </div>
                  <FileText className="w-5 h-5 text-[var(--dc-text-secondary)] shrink-0" />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'actividad' && (
            <div className="space-y-3 mt-4">
              <div className="rounded-2xl bg-[var(--dc-bg-card)] border border-[var(--dc-border)] p-4">
                <p className="text-xs font-bold uppercase tracking-wider text-[var(--dc-text-muted)]">
                  Actividad reciente
                </p>
                <div className="mt-3 flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-600 to-rose-900 flex items-center justify-center font-display font-black text-white">
                    Zn
                  </div>
                  <div>
                    <p className="font-semibold text-[var(--dc-text-primary)]">Zenith Studio</p>
                    <p className="text-xs text-[var(--dc-text-muted)]">
                      Alcanzó 102 miembros · Hace 2 min
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'deseos' && (
            <div className="space-y-3 mt-4">
              {wishlistedBundles.length === 0 ? (
                <div className="rounded-2xl bg-[var(--dc-bg-card)] border border-[var(--dc-border)] p-6 text-center">
                  <Heart className="w-8 h-8 text-[var(--dc-text-muted)] mx-auto mb-2" />
                  <p className="text-sm font-semibold text-[var(--dc-text-primary)]">
                    Tu lista de deseos está vacía
                  </p>
                  <button
                    onClick={() => onNavigate('tienda')}
                    className="mt-3 px-5 py-2.5 rounded-full dc-btn-primary text-xs font-bold cursor-pointer whitespace-nowrap"
                  >
                    Ir a la Tienda
                  </button>
                </div>
              ) : (
                wishlistedBundles.map((b) => (
                  <button
                    key={b.id}
                    onClick={() => onOpenBundle(b)}
                    className="w-full rounded-2xl bg-[var(--dc-bg-card)] hover:bg-[var(--dc-bg-elevated)] border border-[var(--dc-border)] p-3.5 flex items-center justify-between transition-colors cursor-pointer"
                  >
                    <div className="text-left">
                      <p className="font-semibold text-[var(--dc-text-primary)]">{b.title}</p>
                      <p className="text-xs text-[var(--dc-text-muted)]">
                        {b.items.length} artículos · {b.priceOrbs} Orbs / {b.priceUsd}
                      </p>
                    </div>
                    <Heart className="w-5 h-5 text-red-500 fill-red-500" />
                  </button>
                ))
              )}
            </div>
          )}
        </div>
      </div>

      {/* Floating Bottom Pill Dock */}
      <div className="absolute bottom-4 inset-x-0 flex justify-center px-4 pointer-events-none z-20">
        <nav
          aria-label="Accesos de perfil"
          className="pointer-events-auto bg-[var(--dc-bg-sheet)]/95 backdrop-blur-md border border-[var(--dc-border)] rounded-3xl px-3 py-2 shadow-2xl grid grid-cols-4 gap-1 w-full max-w-[340px]"
        >
          <button
            onClick={() => onNavigate('misiones')}
            className="flex flex-col items-center justify-center py-1 rounded-2xl hover:bg-black/5 dark:hover:bg-white/5 text-[var(--dc-text-secondary)] hover:text-[var(--dc-text-primary)] transition-colors cursor-pointer relative active:scale-95"
          >
            <div className="relative">
              <LaurelQuestIcon className="w-5 h-5" />
              {hasUnclaimedQuests && (
                <span className="absolute -top-0.5 -right-1 w-2.5 h-2.5 rounded-full bg-[#da373c] border-2 border-[var(--dc-bg-sheet)]" />
              )}
            </div>
            <span className="text-[11px] font-medium mt-1">Misiones</span>
          </button>

          <button
            onClick={() => onNavigate('tienda')}
            className="flex flex-col items-center justify-center py-1 rounded-2xl hover:bg-black/5 dark:hover:bg-white/5 text-[var(--dc-text-secondary)] hover:text-[var(--dc-text-primary)] transition-colors cursor-pointer active:scale-95"
          >
            <Store className="w-5 h-5" />
            <span className="text-[11px] font-medium mt-1">Tienda</span>
          </button>

          <button
            onClick={() => onNavigate('nitro')}
            className="flex flex-col items-center justify-center py-1 rounded-2xl hover:bg-black/5 dark:hover:bg-white/5 text-[var(--dc-text-secondary)] hover:text-[var(--dc-text-primary)] transition-colors cursor-pointer active:scale-95"
          >
            <NitroWheelIcon className="w-5 h-5" />
            <span className="text-[11px] font-medium mt-1">Nitro</span>
          </button>

          <button
            onClick={() => onNavigate('ajustes')}
            className="flex flex-col items-center justify-center py-1 rounded-2xl hover:bg-black/5 dark:hover:bg-white/5 text-[var(--dc-text-secondary)] hover:text-[var(--dc-text-primary)] transition-colors cursor-pointer active:scale-95"
          >
            <Settings className="w-5 h-5" />
            <span className="text-[11px] font-medium mt-1">Ajustes</span>
          </button>
        </nav>
      </div>

      {/* =================================================================== */}
      {/* FULL-SCREEN DISCORD PERFIL EDITOR (Screenshots 140532/140541/140544) */}
      {/* =================================================================== */}
      {showEditProfile && (
        <div className="fixed inset-0 z-50 bg-[#111214] text-[#f2f3f5] flex flex-col">
          {/* Hidden file inputs */}
          <input
            ref={bannerFileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) readFileAsDataUrl(f, (url) => setDraftBannerImage(url));
              e.target.value = '';
            }}
          />
          <input
            ref={avatarFileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) readFileAsDataUrl(f, (url) => setDraftCustomAvatarUrl(url));
              e.target.value = '';
            }}
          />
          <input
            ref={serverBannerFileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) readFileAsDataUrl(f, (url) => updateCurrentServerDraft({ bannerImage: url }));
              e.target.value = '';
            }}
          />

          {/* Top Bar: X(99) | Perfil | Guardar */}
          <header className="h-14 px-3 bg-[#09090c] border-b border-white/[0.08] flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  setShowEditProfile(false);
                  setActivePickerSheet(null);
                }}
                aria-label="Cerrar editor de perfil"
                className="relative w-9 h-9 rounded-full hover:bg-white/10 flex items-center justify-center text-white cursor-pointer"
              >
                <X className="w-6 h-6" />
                <span className="absolute -bottom-0.5 -right-0.5 px-1.5 py-[1px] rounded-full bg-[#da373c] text-white text-[10px] font-bold tabular-nums leading-tight">
                  {unreadTotal}
                </span>
              </button>
              <h2 className="font-display font-bold text-[19px] text-white">Perfil</h2>
            </div>

            <button
              onClick={saveProfile}
              className="px-3 py-1.5 rounded-full text-[15px] font-semibold text-[#7b85ff] hover:text-white hover:bg-[#5865F2]/20 transition-colors cursor-pointer"
            >
              Guardar
            </button>
          </header>

          {/* Sub-Tabs: Perfil principal | Perfiles por servidor */}
          <div className="grid grid-cols-2 bg-[#09090c] border-b border-white/[0.08] shrink-0">
            <button
              onClick={() => setEditorTab('principal')}
              className={`py-3 text-[14px] font-semibold relative transition-colors cursor-pointer ${
                editorTab === 'principal' ? 'text-[#7b85ff]' : 'text-[#80848e] hover:text-zinc-200'
              }`}
            >
              Perfil principal
              {editorTab === 'principal' && (
                <span className="absolute bottom-0 inset-x-0 h-[2.5px] bg-[#7b85ff] rounded-t-full" />
              )}
            </button>
            <button
              onClick={() => setEditorTab('servidor')}
              className={`py-3 text-[14px] font-semibold relative transition-colors cursor-pointer ${
                editorTab === 'servidor' ? 'text-[#7b85ff]' : 'text-[#80848e] hover:text-zinc-200'
              }`}
            >
              Perfiles por servidor
              {editorTab === 'servidor' && (
                <span className="absolute bottom-0 inset-x-0 h-[2.5px] bg-[#7b85ff] rounded-t-full" />
              )}
            </button>
          </div>

          {/* Editor Scroll Content */}
          <div className="flex-1 overflow-y-auto pb-32">
            {editorTab === 'principal' ? (
              <div className="max-w-xl mx-auto">
                <div
                  className={`relative transition-all ${
                    PROFILE_FRAME_OPTIONS.find(
                      (f) => f.id === (nitroPreviewActive ? 'neon-blue' : draftFrame)
                    )?.ornate
                      ? 'mx-2.5 mt-5 rounded-2xl overflow-visible'
                      : ''
                  } ${draftFrameClass}`}
                >
                  <ProfileFrameArtwork
                    frame={nitroPreviewActive ? 'neon-blue' : draftFrame}
                  />
                  <ProfileEffectAnimationOverlay
                    effect={nitroPreviewActive ? 'sparks' : draftEffect}
                    playKey={editorEffectPlayKey}
                    className="z-30"
                  />
                  {/* Editable Banner */}
                  <div
                    className="h-32 sm:h-36 w-full relative overflow-hidden"
                    style={{ backgroundColor: draftBanner }}
                  >
                    {draftBannerImage && (
                      <img
                        src={draftBannerImage}
                        alt="Banner"
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    )}
                    <ProfileEffectOverlay
                      effect={nitroPreviewActive ? 'sparks' : draftEffect}
                    />
                    <button
                      onClick={() => setActivePickerSheet('banner')}
                      aria-label="Editar banner"
                      className="absolute top-3 right-3 w-9 h-9 rounded-full bg-black/65 hover:bg-black/85 border border-white/15 flex items-center justify-center text-white cursor-pointer shadow-lg z-30"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Overlapping Avatar + Pencil + Thought Bubble "+ Añadir estado" */}
                  <div className="px-4">
                    <div className="relative flex items-end gap-2 -mt-10 mb-2">
                      <button
                        type="button"
                        onClick={() => setActivePickerSheet('avatar')}
                        className="relative rounded-full p-1 bg-[#111214] cursor-pointer group"
                      >
                        <UserAvatar
                          avatar={draftAvatar}
                          customAvatarUrl={draftCustomAvatarUrl}
                          status={user.status}
                          decoration={draftDeco}
                          size="xl"
                          borderColor="#111214"
                          showStatus={false}
                        />
                        <span className="absolute top-0 right-0 w-7 h-7 rounded-full bg-[#26272f] border-2 border-[#111214] flex items-center justify-center text-zinc-200 group-hover:bg-[#5865F2] group-hover:text-white transition-colors">
                          <Pencil className="w-3.5 h-3.5" />
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setDraftCustomStatus(user.customStatus);
                          setShowCustomStatusModal(true);
                        }}
                        className="relative mb-1 ml-1 bg-[#14151a] hover:bg-[#1c1d24] border border-white/10 rounded-full px-3.5 py-2 flex items-center gap-2 cursor-pointer"
                      >
                        <span className="w-2.5 h-2.5 rounded-full bg-[#14151a] border border-white/10 absolute -left-1.5 bottom-2" />
                        <span className="w-1.5 h-1.5 rounded-full bg-[#14151a] border border-white/10 absolute -left-3.5 bottom-0.5" />
                        <span className="w-5 h-5 rounded-full bg-white text-black flex items-center justify-center shrink-0">
                          <Plus className="w-3.5 h-3.5 stroke-[2.6]" />
                        </span>
                        <span className="text-[13.5px] font-semibold text-zinc-200 truncate max-w-[190px]">
                          {user.customStatus || 'Añadir estado'}
                        </span>
                      </button>
                    </div>

                    {/* Live Preview Name + Username + Badges + Server Tag */}
                    <div className="mt-1 mb-4">
                      <h3
                        className={`text-[24px] text-white leading-tight ${getDisplayNameStyleClass(
                          draftNameStyle
                        )}`}
                      >
                        {draftName || user.displayName}
                      </h3>
                      <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                        <span className="text-[14px] text-zinc-300">{user.username}</span>
                        {draftPronouns && (
                          <span className="text-[13px] text-zinc-400">· {draftPronouns}</span>
                        )}
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-[#14151a] border border-white/10">
                          {(user.equippedBadgeIds || ['hypesquad', 'misiones'])
                            .filter((id) => isBadgeUnlocked(id as BadgeId, user))
                            .map((badgeId) => (
                              <BadgeArtwork
                                key={badgeId}
                                badgeId={badgeId as BadgeId}
                                unlocked
                                size="sm"
                              />
                            ))}
                        </span>
                        {draftServerTag && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-[#181920] border border-white/10 text-[11.5px] font-bold text-white">
                            {draftServerTag}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Form Section Card */}
                <div className="mx-3 rounded-2xl bg-[#111216] border border-white/[0.08] p-4 space-y-5">
                  {/* Nombre de visualización */}
                  <div>
                    <label className="text-[13.5px] font-semibold text-zinc-300 block mb-2">
                      Nombre de visualización
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={draftName}
                        onChange={(e) => setDraftName(e.target.value)}
                        placeholder={user.username}
                        className="w-full h-12 rounded-xl bg-[#07080a] border border-white/10 pl-3.5 pr-11 text-[15px] text-white focus:outline-none focus:border-[#5865F2]"
                      />
                      {draftName && (
                        <button
                          type="button"
                          onClick={() => setDraftName('')}
                          aria-label="Borrar nombre"
                          className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-zinc-500/80 hover:bg-zinc-400 text-[#07080a] flex items-center justify-center cursor-pointer"
                        >
                          <X className="w-3 h-3 stroke-[2.8]" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Estilos de nombre de visualización */}
                  <div>
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <span className="text-[13.5px] font-semibold text-zinc-300">
                        Estilos de nombre de visualización
                      </span>
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#1e2028] border border-white/10 text-[10.5px] font-bold text-zinc-200 tabular-nums">
                        <Clock className="w-3 h-3 text-white" />
                        <span>QUEDA(N) 22 D</span>
                      </span>
                    </div>

                    <div className="rounded-2xl bg-[#090a0d] border border-white/10 overflow-hidden">
                      <div className="px-4 py-4 flex items-center justify-between gap-3">
                        <span
                          className={`text-[28px] text-white leading-none truncate ${getDisplayNameStyleClass(
                            draftNameStyle === 'default' ? 'gta' : draftNameStyle
                          )}`}
                        >
                          {(draftName || user.displayName).toLowerCase()}
                        </span>

                        <button
                          type="button"
                          role="switch"
                          aria-checked={draftNameStyle !== 'default'}
                          onClick={() =>
                            setDraftNameStyle((prev) => (prev === 'default' ? 'gta' : 'default'))
                          }
                          className={`w-12 h-7 rounded-full p-0.5 transition-colors flex items-center cursor-pointer shrink-0 ${
                            draftNameStyle !== 'default' ? 'bg-[#5865F2]' : 'bg-zinc-700'
                          }`}
                        >
                          <span
                            className={`w-6 h-6 rounded-full bg-white shadow-md transition-transform ${
                              draftNameStyle !== 'default' ? 'translate-x-5' : 'translate-x-0'
                            }`}
                          />
                        </button>
                      </div>

                      <div className="px-4 py-2.5 bg-gradient-to-r from-[#23192d]/60 via-[#1a1c29]/80 to-[#2b211a]/60 border-t border-white/[0.06] text-[12px] text-zinc-200 flex items-center justify-between gap-2">
                        <span>
                          Prueba la fuente de Grand Theft Auto.{' '}
                          <button
                            type="button"
                            onClick={() => setActivePickerSheet('name-style-info')}
                            className="underline text-white font-semibold cursor-pointer"
                          >
                            Más información
                          </button>
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Pronombres */}
                  <div>
                    <label className="text-[13.5px] font-semibold text-zinc-300 block mb-2">
                      Pronombres
                    </label>
                    <input
                      type="text"
                      value={draftPronouns}
                      onChange={(e) => setDraftPronouns(e.target.value)}
                      placeholder="Añade tus pronombres"
                      className="w-full h-12 rounded-xl bg-[#07080a] border border-white/10 px-3.5 text-[15px] text-white placeholder:text-zinc-600 focus:outline-none focus:border-[#5865F2]"
                    />
                  </div>

                  {/* Insignias */}
                  <div>
                    <label className="text-[13.5px] font-semibold text-zinc-300 block mb-2">
                      Insignias
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        saveProfile();
                        onNavigate('insignias');
                      }}
                      className="w-full h-13 rounded-xl bg-[#07080a] hover:bg-[#13151b] border border-white/10 px-3.5 flex items-center justify-between cursor-pointer transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        {(user.equippedBadgeIds || ['hypesquad', 'misiones'])
                          .filter((id) => isBadgeUnlocked(id as BadgeId, user))
                          .map((badgeId) => (
                            <BadgeArtwork
                              key={badgeId}
                              badgeId={badgeId as BadgeId}
                              unlocked
                              size="sm"
                            />
                          ))}
                      </div>
                      <ChevronRight className="w-5 h-5 text-zinc-400" />
                    </button>
                  </div>

                  {/* Biografía */}
                  <div>
                    <label className="text-[13.5px] font-semibold text-zinc-300 block mb-2">
                      Biografía
                    </label>
                    <div className="relative">
                      <textarea
                        rows={4}
                        maxLength={300}
                        value={draftBio}
                        onChange={(e) => setDraftBio(e.target.value)}
                        placeholder="Cuéntale a la gente sobre ti..."
                        className="w-full rounded-xl bg-[#07080a] border border-white/10 px-3.5 py-3 pb-7 text-[14.5px] text-white placeholder:text-zinc-600 focus:outline-none focus:border-[#5865F2] resize-none"
                      />
                      <span className="absolute bottom-2.5 right-3 text-[12px] font-semibold text-zinc-500 tabular-nums">
                        {300 - draftBio.length}
                      </span>
                    </div>
                  </div>

                  {/* Decoración de avatar */}
                  <div>
                    <label className="text-[13.5px] font-semibold text-zinc-300 block mb-2">
                      Decoración de avatar
                    </label>
                    <button
                      type="button"
                      onClick={() => setActivePickerSheet('decoration')}
                      className="w-full h-13 rounded-xl bg-[#07080a] hover:bg-[#13151b] border border-white/10 px-3.5 flex items-center justify-between cursor-pointer transition-colors"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        {draftDeco === 'none' ? (
                          <Ban className="w-5 h-5 text-zinc-400 shrink-0" />
                        ) : (
                          <Sparkles className="w-5 h-5 text-[#5865F2] shrink-0" />
                        )}
                        <span className="text-[15px] text-white truncate">
                          {DECORATION_OPTIONS.find((d) => d.id === draftDeco)?.label || 'Ninguno'}
                        </span>
                      </div>
                      <ChevronRight className="w-5 h-5 text-zinc-400 shrink-0" />
                    </button>
                  </div>

                  {/* Efecto de perfil */}
                  <div>
                    <label className="text-[13.5px] font-semibold text-zinc-300 block mb-2">
                      Efecto de perfil
                    </label>
                    <button
                      type="button"
                      onClick={() => setActivePickerSheet('effect')}
                      className="w-full h-13 rounded-xl bg-[#07080a] hover:bg-[#13151b] border border-white/10 px-3.5 flex items-center justify-between cursor-pointer transition-colors"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        {draftEffect === 'none' ? (
                          <Ban className="w-5 h-5 text-zinc-400 shrink-0" />
                        ) : (
                          <Sparkles className="w-5 h-5 text-sky-400 shrink-0" />
                        )}
                        <span className="text-[15px] text-white truncate">
                          {PROFILE_EFFECT_OPTIONS.find((e) => e.id === draftEffect)?.label ||
                            'Ninguno'}
                        </span>
                      </div>
                      <ChevronRight className="w-5 h-5 text-zinc-400 shrink-0" />
                    </button>
                  </div>

                  {/* Marco de perfil NUEVO */}
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-[13.5px] font-semibold text-zinc-300">
                        Marco de perfil
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-[#da373c] text-white text-[10px] font-extrabold tracking-wide uppercase">
                        NUEVO
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setActivePickerSheet('frame')}
                      className="w-full h-13 rounded-xl bg-[#07080a] hover:bg-[#13151b] border border-white/10 px-3.5 flex items-center justify-between cursor-pointer transition-colors"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        {draftFrame === 'none' ? (
                          <Ban className="w-5 h-5 text-zinc-400 shrink-0" />
                        ) : (
                          <span className="w-5 h-5 rounded-md border-2 border-[#5865F2] shrink-0" />
                        )}
                        <span className="text-[15px] text-white truncate">
                          {PROFILE_FRAME_OPTIONS.find((f) => f.id === draftFrame)?.label ||
                            'Ninguno'}
                        </span>
                      </div>
                      <ChevronRight className="w-5 h-5 text-zinc-400 shrink-0" />
                    </button>
                  </div>

                  {/* Placa de identificación */}
                  <div>
                    <label className="text-[13.5px] font-semibold text-zinc-300 block mb-2">
                      Placa de identificación
                    </label>
                    <button
                      type="button"
                      onClick={() => setActivePickerSheet('nameplate')}
                      className="w-full h-13 rounded-xl bg-[#07080a] hover:bg-[#13151b] border border-white/10 px-3.5 flex items-center justify-between cursor-pointer transition-colors"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        {draftNameplate === 'none' ? (
                          <Ban className="w-5 h-5 text-zinc-400 shrink-0" />
                        ) : (
                          <span className="w-5 h-5 rounded-md bg-gradient-to-r from-[#5865F2] to-sky-400 shrink-0" />
                        )}
                        <span className="text-[15px] text-white truncate">
                          {NAMEPLATE_OPTIONS.find((n) => n.id === draftNameplate)?.label ||
                            'Ninguno'}
                        </span>
                      </div>
                      <ChevronRight className="w-5 h-5 text-zinc-400 shrink-0" />
                    </button>
                  </div>

                  {/* Etiqueta del servidor */}
                  <div>
                    <label className="text-[13.5px] font-semibold text-zinc-300 block mb-2">
                      Etiqueta del servidor
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        setServerTagSearch('');
                        setActivePickerSheet('server-tag');
                      }}
                      className="w-full h-13 rounded-xl bg-[#07080a] hover:bg-[#13151b] border border-white/10 px-3.5 flex items-center justify-between cursor-pointer transition-colors"
                    >
                      <span className="text-[15px] text-white truncate">
                        {draftServerTag
                          ? `Equipada: ${draftServerTag}`
                          : 'Selecciona una etiqueta de servidor'}
                      </span>
                      <ChevronRight className="w-5 h-5 text-zinc-400 shrink-0" />
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              /* TAB 2: Perfiles por servidor */
              <div className="max-w-xl mx-auto p-3 space-y-4">
                <div className="rounded-2xl bg-[#111216] border border-white/[0.08] p-4 space-y-3">
                  <p className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                    Tus servidores agregados ({servers.length})
                  </p>
                  <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
                    {servers.map((srv) => {
                      const active = srv.id === currentServerProfileTarget?.id;
                      return (
                        <button
                          key={srv.id}
                          type="button"
                          onClick={() => setSelectedEditorServerId(srv.id)}
                          className={`flex items-center gap-2 px-3 py-2 rounded-xl border shrink-0 cursor-pointer transition-all ${
                            active
                              ? 'bg-[#5865F2]/20 border-[#5865F2] text-white'
                              : 'bg-[#07080a] border-white/10 text-zinc-400 hover:text-white'
                          }`}
                        >
                          <div className="w-6 h-6 rounded-lg overflow-hidden shrink-0">
                            <ServerIconArt server={srv} />
                          </div>
                          <span className="text-xs font-semibold">{srv.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {currentServerProfileTarget ? (
                  <div className="rounded-2xl bg-[#111216] border border-white/[0.08] overflow-hidden">
                    <div
                      className="h-24 w-full relative"
                      style={{
                        backgroundColor:
                          currentServerDraft.bannerColor ||
                          currentServerProfileTarget.bannerColor ||
                          '#18181b',
                      }}
                    >
                      {currentServerDraft.bannerImage && (
                        <img
                          src={currentServerDraft.bannerImage}
                          alt="Banner de perfil de servidor"
                          className="w-full h-full object-cover"
                        />
                      )}
                      <button
                        type="button"
                        onClick={() => serverBannerFileRef.current?.click()}
                        className="absolute top-2.5 right-2.5 px-2.5 py-1 rounded-full bg-black/65 border border-white/15 text-xs font-semibold text-white flex items-center gap-1 cursor-pointer"
                      >
                        <Upload className="w-3 h-3" />
                        <span>Subir banner</span>
                      </button>
                    </div>

                    <div className="p-4 space-y-4">
                      <div>
                        <label className="text-[13px] font-semibold text-zinc-300 block mb-1.5">
                          Apodo en {currentServerProfileTarget.name}
                        </label>
                        <input
                          type="text"
                          value={currentServerDraft.nickname || ''}
                          onChange={(e) =>
                            updateCurrentServerDraft({ nickname: e.target.value })
                          }
                          placeholder={draftName || user.displayName}
                          className="w-full h-11 rounded-xl bg-[#07080a] border border-white/10 px-3.5 text-sm text-white focus:outline-none focus:border-[#5865F2]"
                        />
                      </div>

                      <div>
                        <label className="text-[13px] font-semibold text-zinc-300 block mb-1.5">
                          Pronombres del servidor
                        </label>
                        <input
                          type="text"
                          value={currentServerDraft.pronouns || ''}
                          onChange={(e) =>
                            updateCurrentServerDraft({ pronouns: e.target.value })
                          }
                          placeholder={draftPronouns || 'Pronombres personalizados'}
                          className="w-full h-11 rounded-xl bg-[#07080a] border border-white/10 px-3.5 text-sm text-white focus:outline-none focus:border-[#5865F2]"
                        />
                      </div>

                      <div>
                        <label className="text-[13px] font-semibold text-zinc-300 block mb-1.5">
                          Biografía en este servidor
                        </label>
                        <textarea
                          rows={3}
                          maxLength={300}
                          value={currentServerDraft.bio || ''}
                          onChange={(e) => updateCurrentServerDraft({ bio: e.target.value })}
                          placeholder={draftBio || 'Biografía para este servidor...'}
                          className="w-full rounded-xl bg-[#07080a] border border-white/10 px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#5865F2] resize-none"
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="rounded-2xl bg-[#111216] border border-white/10 p-6 text-center text-sm text-zinc-400">
                    Únete o crea un servidor para configurar perfiles por servidor.
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Floating Nitro Preview Footer (Exact Screenshot 140532/140541/140544) */}
          {editorTab === 'principal' && (
            <div className="fixed bottom-3 inset-x-3 z-50 flex justify-center pointer-events-none">
              <div className="pointer-events-auto w-full max-w-md rounded-2xl bg-[#0b0c10]/95 backdrop-blur-md border border-white/15 p-3 shadow-2xl space-y-2">
                <p className="text-center text-[13px] font-medium text-zinc-200">
                  ¡Mira el aspecto que podría tener tu perfil con Nitro!
                </p>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setNitroPreviewActive((p) => !p)}
                    className={`flex-1 h-11 rounded-full font-bold text-[14px] flex items-center justify-center gap-2 cursor-pointer transition-all ${
                      nitroPreviewActive
                        ? 'bg-[#23a55a] text-white'
                        : 'dc-btn-primary'
                    }`}
                  >
                    <NitroWheelIcon className="w-4 h-4" />
                    <span>
                      {nitroPreviewActive ? 'Vista Nitro activada' : 'Previsualizar Nitro'}
                    </span>
                  </button>
                  {nitroPreviewActive && (
                    <button
                      type="button"
                      onClick={() => {
                        setShowEditProfile(false);
                        onNavigate('nitro');
                      }}
                      className="px-4 h-11 rounded-full dc-btn-white text-xs font-bold cursor-pointer whitespace-nowrap"
                    >
                      Ir a Nitro
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* PICKER SHEETS INSIDE PERFIL EDITOR */}
          {activePickerSheet === 'server-tag' && (
            <div
              onClick={() => setActivePickerSheet(null)}
              className="fixed inset-0 z-[60] bg-black/75 backdrop-blur-xs flex items-end md:items-center justify-center"
            >
              <div
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-md bg-[#0e0f14] rounded-t-3xl md:rounded-3xl border border-white/10 p-4 pb-6 space-y-3.5 max-h-[85vh] flex flex-col shadow-2xl"
              >
                <div className="w-10 h-1 bg-white/25 rounded-full mx-auto shrink-0" />
                <h3 className="font-display font-bold text-[19px] text-center text-white">
                  Cambiar etiqueta de servidor
                </h3>

                {/* Search tus servidores */}
                <div className="relative shrink-0">
                  <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={serverTagSearch}
                    onChange={(e) => setServerTagSearch(e.target.value)}
                    placeholder="Buscar tus servidores"
                    className="w-full h-11 rounded-xl bg-[#07080a] border border-white/10 pl-10 pr-4 text-[14.5px] text-white placeholder:text-zinc-500 focus:outline-none focus:border-[#5865F2]"
                  />
                </div>

                {/* Card List: Ninguno + ONLY added/joined servers */}
                <div className="flex-1 overflow-y-auto rounded-2xl bg-[#14151b] border border-white/[0.08] divide-y divide-white/[0.06]">
                  {/* Ninguno option */}
                  <button
                    type="button"
                    onClick={() => {
                      setDraftServerTag('');
                      setActivePickerSheet(null);
                    }}
                    className="w-full px-4 py-3.5 flex items-center justify-between hover:bg-white/[0.04] transition-colors cursor-pointer"
                  >
                    <span className="text-[15.5px] font-semibold text-white">Ninguno</span>
                    <span
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                        !draftServerTag ? 'border-[#5865F2] bg-[#5865F2]' : 'border-zinc-500'
                      }`}
                    >
                      {!draftServerTag && <span className="w-2.5 h-2.5 rounded-full bg-white" />}
                    </span>
                  </button>

                  {filteredServersForTag.map((srv) => {
                    const tagVal = getServerTagLabel(srv);
                    const selected = draftServerTag === tagVal;
                    return (
                      <button
                        key={srv.id}
                        type="button"
                        onClick={() => {
                          setDraftServerTag(tagVal);
                          setActivePickerSheet(null);
                        }}
                        className="w-full px-4 py-3 flex items-center justify-between gap-3 hover:bg-white/[0.04] transition-colors cursor-pointer"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-10 h-10 rounded-xl overflow-hidden border border-white/10 shrink-0">
                            <ServerIconArt server={srv} />
                          </div>
                          <span className="text-[15px] font-semibold text-white truncate text-left">
                            {srv.name}
                          </span>
                        </div>

                        <div className="flex items-center gap-3 shrink-0">
                          <span className="px-2 py-0.5 rounded-md bg-[#20222b] border border-white/10 text-[12px] font-bold text-white">
                            {tagVal}
                          </span>
                          <span
                            className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                              selected ? 'border-[#5865F2] bg-[#5865F2]' : 'border-zinc-500'
                            }`}
                          >
                            {selected && <span className="w-2.5 h-2.5 rounded-full bg-white" />}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {activePickerSheet === 'banner' && (
            <div
              onClick={() => setActivePickerSheet(null)}
              className="fixed inset-0 z-[60] bg-black/75 backdrop-blur-xs flex items-end md:items-center justify-center"
            >
              <div
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-md bg-[#0e0f14] rounded-t-3xl md:rounded-3xl border border-white/10 p-5 space-y-4 max-h-[85vh] overflow-y-auto"
              >
                <div className="w-10 h-1 bg-white/25 rounded-full mx-auto" />
                <h3 className="font-display font-bold text-lg text-white text-center">
                  Cambiar banner
                </h3>

                <button
                  type="button"
                  onClick={() => bannerFileRef.current?.click()}
                  className="w-full h-11 rounded-full dc-btn-primary text-sm font-bold flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Upload className="w-4 h-4" />
                  <span>Subir imagen desde tu dispositivo</span>
                </button>

                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">
                    Color sólido
                  </p>
                  <div className="flex items-center gap-2.5 flex-wrap">
                    {BANNER_PRESETS.map((c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => {
                          setDraftBanner(c);
                          setDraftBannerImage(undefined);
                        }}
                        style={{ backgroundColor: c }}
                        className={`w-9 h-9 rounded-full cursor-pointer transition-transform ${
                          !draftBannerImage && draftBanner === c
                            ? 'ring-2 ring-white scale-110'
                            : 'border border-white/20'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                      Banners de Tienda ({ownedBanners.length})
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setActivePickerSheet(null);
                        setShowEditProfile(false);
                        onNavigate('tienda');
                      }}
                      className="text-xs font-semibold text-[#7b85ff] cursor-pointer"
                    >
                      Ir a la Tienda
                    </button>
                  </div>
                  {ownedBanners.length === 0 ? (
                    <p className="text-xs text-zinc-500">
                      Compra banners en la Tienda para equiparlos aquí también.
                    </p>
                  ) : (
                    <div className="grid grid-cols-2 gap-2">
                      {ownedBanners.map((b) => (
                        <button
                          key={b.id}
                          type="button"
                          onClick={() => {
                            setDraftBannerImage(b.bannerUrl);
                            setActivePickerSheet(null);
                          }}
                          className={`relative h-16 rounded-xl overflow-hidden border cursor-pointer ${
                            draftBannerImage === b.bannerUrl
                              ? 'ring-2 ring-[#5865F2] border-transparent'
                              : 'border-white/10'
                          }`}
                        >
                          <img
                            src={b.bannerUrl}
                            alt={b.name}
                            className="w-full h-full object-cover"
                          />
                          <span className="absolute bottom-1 left-2 text-[11px] font-bold text-white drop-shadow">
                            {b.name}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activePickerSheet === 'avatar' && (
            <div
              onClick={() => setActivePickerSheet(null)}
              className="fixed inset-0 z-[60] bg-black/75 backdrop-blur-xs flex items-end md:items-center justify-center"
            >
              <div
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-md bg-[#0e0f14] rounded-t-3xl md:rounded-3xl border border-white/10 p-5 space-y-4"
              >
                <div className="w-10 h-1 bg-white/25 rounded-full mx-auto" />
                <h3 className="font-display font-bold text-lg text-white text-center">
                  Cambiar avatar
                </h3>

                <button
                  type="button"
                  onClick={() => avatarFileRef.current?.click()}
                  className="w-full h-11 rounded-full dc-btn-primary text-sm font-bold flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Upload className="w-4 h-4" />
                  <span>Subir foto desde tu galería</span>
                </button>

                <div className="grid grid-cols-3 gap-2">
                  {AVATAR_PRESETS.map((av) => {
                    const selected = !draftCustomAvatarUrl && draftAvatar === av.id;
                    return (
                      <button
                        key={av.id}
                        type="button"
                        onClick={() => {
                          setDraftAvatar(av.id);
                          setDraftCustomAvatarUrl(undefined);
                          setActivePickerSheet(null);
                        }}
                        className={`flex flex-col items-center gap-1 p-2 rounded-xl border cursor-pointer ${
                          selected
                            ? 'border-[#5865F2] bg-[#5865F2]/15'
                            : 'border-white/10 bg-[#14151b]'
                        }`}
                      >
                        <UserAvatar avatar={av.id} size="md" showStatus={false} />
                        <span className="text-[11px] text-zinc-300">{av.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {activePickerSheet === 'name-style-info' && (
            <div
              onClick={() => setActivePickerSheet(null)}
              className="fixed inset-0 z-[60] bg-black/75 backdrop-blur-xs flex items-end md:items-center justify-center"
            >
              <div
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-md bg-[#0e0f14] rounded-t-3xl md:rounded-3xl border border-white/10 p-5 space-y-3"
              >
                <div className="w-10 h-1 bg-white/25 rounded-full mx-auto" />
                <h3 className="font-display font-bold text-lg text-white text-center">
                  Estilos de nombre de visualización
                </h3>
                <div className="space-y-2">
                  {(
                    [
                      { id: 'gta', label: 'Grand Theft Auto', sample: 'zinepth' },
                      { id: 'default', label: 'Predeterminado Discord', sample: 'zinepth' },
                      { id: 'neon', label: 'Neón Cibernético', sample: 'zinepth' },
                      { id: 'retro', label: 'Retro Arcade', sample: 'zinepth' },
                    ] as { id: DisplayNameStyle; label: string; sample: string }[]
                  ).map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => {
                        setDraftNameStyle(opt.id);
                        setActivePickerSheet(null);
                      }}
                      className={`w-full px-4 py-3 rounded-2xl border flex items-center justify-between cursor-pointer ${
                        draftNameStyle === opt.id
                          ? 'bg-[#5865F2]/15 border-[#5865F2]'
                          : 'bg-[#14151b] border-white/10'
                      }`}
                    >
                      <span className="text-sm font-semibold text-white">{opt.label}</span>
                      <span className={`text-xl text-white ${getDisplayNameStyleClass(opt.id)}`}>
                        {opt.sample}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activePickerSheet === 'decoration' && (
            <div
              onClick={() => setActivePickerSheet(null)}
              className="fixed inset-0 z-[60] bg-black/75 backdrop-blur-xs flex items-end md:items-center justify-center"
            >
              <div
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-md bg-[#0e0f14] rounded-t-3xl md:rounded-3xl border border-white/10 p-5 space-y-3 max-h-[80vh] overflow-y-auto"
              >
                <div className="w-10 h-1 bg-white/25 rounded-full mx-auto" />
                <h3 className="font-display font-bold text-lg text-white text-center">
                  Decoración de avatar
                </h3>
                <p className="text-xs text-zinc-400 text-center">
                  Solo puedes equipar decoraciones compradas en la Tienda.
                </p>
                <div className="grid grid-cols-3 gap-2">
                  {DECORATION_OPTIONS.map((dec) => {
                    const unlocked = isDecoOwned(dec.id);
                    const shopMatch = findBundleForCosmetic({ decorationId: dec.id }, shopBundles);
                    return (
                      <button
                        key={dec.id}
                        type="button"
                        onClick={() => {
                          if (unlocked) {
                            setDraftDeco(dec.id);
                            setActivePickerSheet(null);
                          } else if (shopMatch) {
                            setActivePickerSheet(null);
                            setShowEditProfile(false);
                            onOpenBundle(shopMatch);
                          } else {
                            setActivePickerSheet(null);
                            setShowEditProfile(false);
                            onNavigate('tienda');
                          }
                        }}
                        className={`relative p-2.5 rounded-2xl border flex flex-col items-center gap-2 cursor-pointer ${
                          draftDeco === dec.id
                            ? 'bg-[#5865F2]/20 border-[#5865F2] text-white'
                            : unlocked
                            ? 'bg-[#14151b] border-white/10 text-zinc-200'
                            : 'bg-[#0b0c10] border-white/5 text-zinc-500 opacity-75 hover:opacity-100'
                        }`}
                      >
                        {!unlocked && (
                          <span className="absolute top-1.5 right-1.5 px-1.5 py-0.5 rounded-full bg-black/75 border border-white/15 text-[9px] font-bold text-amber-300 flex items-center gap-0.5 tabular-nums">
                            <Lock className="w-2.5 h-2.5" />
                            {shopMatch ? `${shopMatch.priceOrbs}` : 'Tienda'}
                          </span>
                        )}
                        <UserAvatar
                          avatar={draftAvatar}
                          customAvatarUrl={draftCustomAvatarUrl}
                          decoration={dec.id}
                          size="md"
                          showStatus={false}
                        />
                        <span className="text-[11.5px] font-semibold text-center leading-tight">
                          {dec.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {activePickerSheet === 'effect' && (
            <div
              onClick={() => setActivePickerSheet(null)}
              className="fixed inset-0 z-[60] bg-black/75 backdrop-blur-xs flex items-end md:items-center justify-center"
            >
              <div
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-md bg-[#0e0f14] rounded-t-3xl md:rounded-3xl border border-white/10 p-5 space-y-3 max-h-[80vh] overflow-y-auto"
              >
                <div className="w-10 h-1 bg-white/25 rounded-full mx-auto" />
                <h3 className="font-display font-bold text-lg text-white text-center">
                  Efecto de perfil
                </h3>
                <p className="text-xs text-zinc-400 text-center">
                  Compra efectos en la Tienda para dejarlos equipados en tu perfil.
                </p>
                <div className="space-y-2">
                  {PROFILE_EFFECT_OPTIONS.map((eff) => {
                    const unlocked = isEffectOwned(eff.id);
                    const shopMatch = findBundleForCosmetic({ profileEffectId: eff.id }, shopBundles);
                    return (
                      <button
                        key={eff.id}
                        type="button"
                        onClick={() => {
                          if (unlocked) {
                            setDraftEffect(eff.id);
                            setEditorEffectPlayKey((k) => k + 1);
                            setActivePickerSheet(null);
                          } else if (shopMatch) {
                            setActivePickerSheet(null);
                            setShowEditProfile(false);
                            onOpenBundle(shopMatch);
                          } else {
                            setActivePickerSheet(null);
                            setShowEditProfile(false);
                            onNavigate('nitro');
                          }
                        }}
                        className={`w-full px-4 py-3 rounded-2xl border flex items-center justify-between gap-2 cursor-pointer ${
                          draftEffect === eff.id
                            ? 'bg-[#5865F2]/20 border-[#5865F2]'
                            : unlocked
                            ? 'bg-[#14151b] border-white/10'
                            : 'bg-[#0b0c10] border-white/5 opacity-80 hover:opacity-100'
                        }`}
                      >
                        <div className="text-left min-w-0">
                          <p className="text-sm font-semibold text-white truncate">{eff.label}</p>
                          <p className="text-xs text-zinc-400 truncate">{eff.desc}</p>
                        </div>
                        {draftEffect === eff.id ? (
                          <Check className="w-5 h-5 text-[#7b85ff] shrink-0" />
                        ) : !unlocked ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-[11px] font-bold text-amber-300 shrink-0 tabular-nums">
                            <Lock className="w-3 h-3" />
                            <span>{shopMatch ? `◈ ${shopMatch.priceOrbs}` : 'Nitro'}</span>
                          </span>
                        ) : null}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {activePickerSheet === 'frame' && (
            <div
              onClick={() => setActivePickerSheet(null)}
              className="fixed inset-0 z-[60] bg-black/75 backdrop-blur-xs flex items-end md:items-center justify-center"
            >
              <div
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-md bg-[#0e0f14] rounded-t-3xl md:rounded-3xl border border-white/10 p-5 space-y-3 max-h-[82vh] overflow-y-auto"
              >
                <div className="w-10 h-1 bg-white/25 rounded-full mx-auto" />
                <h3 className="font-display font-bold text-lg text-white text-center">
                  Marco de perfil
                </h3>
                <p className="text-xs text-zinc-400 text-center">
                  Los marcos coleccionables se desbloquean comprándolos en la Tienda.
                </p>
                <div className="grid grid-cols-2 gap-3 pt-1">
                  {PROFILE_FRAME_OPTIONS.map((fr) => {
                    const unlocked = isFrameOwned(fr.id);
                    const shopMatch = findBundleForCosmetic({ profileFrameId: fr.id }, shopBundles);
                    return (
                      <button
                        key={fr.id}
                        type="button"
                        onClick={() => {
                          if (unlocked) {
                            setDraftFrame(fr.id);
                            setActivePickerSheet(null);
                          } else if (shopMatch) {
                            setActivePickerSheet(null);
                            setShowEditProfile(false);
                            onOpenBundle(shopMatch);
                          } else {
                            setActivePickerSheet(null);
                            setShowEditProfile(false);
                            onNavigate('tienda');
                          }
                        }}
                        className={`relative p-3.5 rounded-2xl border text-left cursor-pointer flex flex-col gap-2.5 transition-all ${
                          draftFrame === fr.id
                            ? 'bg-[#5865F2]/20 border-[#5865F2]'
                            : unlocked
                            ? 'bg-[#14151b] border-white/10'
                            : 'bg-[#0b0c10] border-white/5 opacity-80 hover:opacity-100'
                        } ${fr.borderClass}`}
                      >
                        {!unlocked && (
                          <span className="absolute top-2 right-2 z-30 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-black/80 border border-white/15 text-[10px] font-bold text-amber-300 tabular-nums">
                            <Lock className="w-2.5 h-2.5" />
                            <span>{shopMatch ? `◈ ${shopMatch.priceOrbs}` : 'Tienda'}</span>
                          </span>
                        )}
                        {fr.ornate && (
                          <div className="relative h-14 w-full rounded-xl bg-[#181920] border border-white/10 mt-2 overflow-visible flex items-center justify-center">
                            <ProfileFrameArtwork frame={fr.id} />
                            <div className="w-7 h-7 rounded-full bg-white/10 border border-white/10" />
                          </div>
                        )}
                        <div className="flex items-center justify-between gap-1.5">
                          <p className="text-sm font-bold text-white truncate">{fr.label}</p>
                          {draftFrame === fr.id && (
                            <Check className="w-4 h-4 text-[#7b85ff] shrink-0" />
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {activePickerSheet === 'nameplate' && (
            <div
              onClick={() => setActivePickerSheet(null)}
              className="fixed inset-0 z-[60] bg-black/75 backdrop-blur-xs flex items-end md:items-center justify-center"
            >
              <div
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-md bg-[#0e0f14] rounded-t-3xl md:rounded-3xl border border-white/10 p-5 space-y-3 max-h-[80vh] overflow-y-auto"
              >
                <div className="w-10 h-1 bg-white/25 rounded-full mx-auto" />
                <h3 className="font-display font-bold text-lg text-white text-center">
                  Placa de identificación
                </h3>
                <p className="text-xs text-zinc-400 text-center">
                  Compra placas en la Tienda para desbloquearlas aquí.
                </p>
                <div className="space-y-2">
                  {NAMEPLATE_OPTIONS.map((np) => {
                    const unlocked = isNameplateOwned(np.id);
                    const shopMatch = findBundleForCosmetic({ nameplateId: np.id }, shopBundles);
                    return (
                      <button
                        key={np.id}
                        type="button"
                        onClick={() => {
                          if (unlocked) {
                            setDraftNameplate(np.id);
                            setActivePickerSheet(null);
                          } else if (shopMatch) {
                            setActivePickerSheet(null);
                            setShowEditProfile(false);
                            onOpenBundle(shopMatch);
                          } else {
                            setActivePickerSheet(null);
                            setShowEditProfile(false);
                            onNavigate('tienda');
                          }
                        }}
                        className={`relative overflow-hidden w-full px-4 py-3 rounded-2xl border flex items-center justify-between cursor-pointer ${
                          np.gradient ? `bg-gradient-to-r ${np.gradient}` : 'bg-[#14151b]'
                        } ${
                          draftNameplate === np.id
                            ? 'border-[#5865F2] ring-1 ring-[#5865F2]'
                            : unlocked
                            ? 'border-white/10'
                            : 'border-white/5 opacity-75 hover:opacity-100'
                        }`}
                      >
                        {np.id !== 'none' && <NameplateStripBackground nameplate={np.id} />}
                        <span className="relative z-10 text-sm font-bold text-white drop-shadow">
                          {np.label}
                        </span>
                        {draftNameplate === np.id ? (
                          <Check className="relative z-10 w-5 h-5 text-white drop-shadow" />
                        ) : !unlocked ? (
                          <span className="relative z-10 inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-black/70 border border-white/15 text-[11px] font-bold text-amber-300 tabular-nums">
                            <Lock className="w-3 h-3" />
                            <span>{shopMatch ? `◈ ${shopMatch.priceOrbs}` : 'Tienda'}</span>
                          </span>
                        ) : null}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Cambiar estado en línea Bottom Sheet */}
      {showStatusSheet && (
        <div
          onClick={() => setShowStatusSheet(false)}
          className="fixed inset-0 z-50 bg-black/55 backdrop-blur-xs flex items-end md:items-center justify-center"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md bg-[var(--dc-bg-sheet)] rounded-t-3xl md:rounded-3xl border border-[var(--dc-border)] p-4 pb-6 shadow-2xl space-y-3"
          >
            <div className="w-10 h-1 bg-[var(--dc-text-muted)]/35 rounded-full mx-auto" />
            <h3 className="font-display font-bold text-[18px] text-center text-[var(--dc-text-primary)] pt-1">
              Cambiar estado en línea
            </h3>

            <div>
              <p className="text-xs font-semibold text-[var(--dc-text-secondary)] px-1 mb-1.5">
                Estado en línea
              </p>
              <div className="rounded-2xl bg-[var(--dc-bg-card)] border border-[var(--dc-border)] divide-y divide-[var(--dc-border)] overflow-hidden">
                {(
                  [
                    { id: 'online', label: 'En línea' },
                    { id: 'idle', label: 'Ausente' },
                    { id: 'dnd', label: 'No molestar' },
                    { id: 'offline', label: 'Invisible' },
                  ] as { id: PresenceStatus; label: string }[]
                ).map((st) => {
                  const selected = user.status === st.id;
                  return (
                    <button
                      key={st.id}
                      onClick={() => {
                        onUpdateUser({ status: st.id });
                        setShowStatusSheet(false);
                      }}
                      className="w-full px-4 py-3.5 flex items-center justify-between hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <StatusIndicator status={st.id} size="md" borderColor="var(--dc-bg-card)" />
                        <span className="text-[15px] font-medium text-[var(--dc-text-primary)]">
                          {st.label}
                        </span>
                      </div>
                      <span
                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                          selected
                            ? 'border-[#5865F2] bg-[#5865F2]'
                            : 'border-[var(--dc-text-muted)]/50'
                        }`}
                      >
                        {selected && <span className="w-2.5 h-2.5 rounded-full bg-white" />}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <button
              onClick={() => {
                setShowStatusSheet(false);
                setDraftCustomStatus(user.customStatus);
                setShowCustomStatusModal(true);
              }}
              className="w-full rounded-2xl dc-btn-secondary px-4 py-3.5 flex items-center gap-3 text-[15px] font-medium cursor-pointer"
            >
              <Smile className="w-5 h-5 text-[var(--dc-text-secondary)]" />
              <span>Establecer un estado personalizado</span>
            </button>
          </div>
        </div>
      )}

      {/* Custom Status Modal */}
      {showCustomStatusModal && (
        <div className="fixed inset-0 z-[70] bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-[var(--dc-bg-sheet)] rounded-3xl border border-[var(--dc-border)] p-5 space-y-4">
            <h3 className="font-display font-bold text-lg text-[var(--dc-text-primary)]">
              Estado personalizado
            </h3>
            <input
              type="text"
              autoFocus
              value={draftCustomStatus}
              onChange={(e) => setDraftCustomStatus(e.target.value)}
              placeholder="Ej. Jugando a Aldea Roleplay..."
              className="w-full bg-[var(--dc-bg-input)] border border-[var(--dc-border)] rounded-xl px-3.5 py-2.5 text-sm text-[var(--dc-text-primary)] focus:outline-none focus:border-[#5865F2]"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  onUpdateUser({ customStatus: '' });
                  setShowCustomStatusModal(false);
                }}
                className="px-4 py-2 rounded-full dc-btn-secondary text-xs font-semibold cursor-pointer"
              >
                Borrar
              </button>
              <button
                onClick={saveCustomStatus}
                className="px-5 py-2 rounded-full dc-btn-primary text-sm font-bold cursor-pointer"
              >
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
