import React, { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion, MotionConfig } from 'motion/react';
import {
  Award,
  Bell,
  Compass,
  Home,
  Moon,
  Plus,
  Search,
  Settings,
  Store,
  Sun,
  Upload,
  UserPlus,
  X,
} from 'lucide-react';
import {
  INITIAL_ACTIVITIES,
  INITIAL_DMS,
  INITIAL_NOTIFICATIONS,
  INITIAL_QUESTS,
  INITIAL_SERVERS,
  INITIAL_SHOP_BUNDLES,
  INITIAL_USER,
  resolvePublicUserProfile,
} from './data/discordData';
import {
  AvatarKey,
  BadgeId,
  Channel,
  ChatMessage,
  CreateServerPayload,
  DirectMessageThread,
  FriendActivity,
  MainScreen,
  NotificationItem,
  PresenceStatus,
  PublicUserProfile,
  Quest,
  Server,
  ServerRole,
  ServerSettingsSection,
  ServerTemplateId,
  ShopBundle,
  StoredAccount,
  ThemeMode,
  UserProfile,
  VoiceSession,
} from './types/discord';
import {
  GENERATED_ASSETS,
  LaurelQuestIcon,
  NitroWheelIcon,
  OrbsCrystalIcon,
  PrimordialAppIcon,
  UserAvatar,
} from './components/DiscordArt';
import { AuthView } from './components/AuthView';
import { ServerRail } from './components/ServerRail';
import { MessagesPanel } from './components/MessagesPanel';
import { ChatView, RichMessagePayload } from './components/ChatView';
import { ProfileView } from './components/ProfileView';
import { QuestsView } from './components/QuestsView';
import { ShopView } from './components/ShopView';
import { NitroView } from './components/NitroView';
import { BadgesView } from './components/BadgesView';
import { BoostGemIcon, ServerBoostView } from './components/ServerBoostView';
import { ServerSettingsView } from './components/ServerSettingsView';
import { UserProfileModal } from './components/UserProfileModal';
import { sanitizeUserShopCosmetics } from './utils/shopOwnership';
import {
  CreateServerModal,
  DiscoverModal,
  FriendsView,
  NotificationsView,
  SettingsView,
  VoiceOverlay,
} from './components/SettingsAndModals';
import { OfflineIndicator, PWAInstallButton } from './components/PWAPrompts';

const STORAGE_KEY = 'discord_full_app_state_v2';
const ACCOUNTS_KEY = 'discord_accounts_v1';
const SESSION_KEY = 'discord_auth_session_v1';
const ORBS_BUGFIX_KEY = 'discord_orbs_bugfix_v2';
const SHOP_OWNERSHIP_MIGRATION_KEY = 'discord_shop_ownership_v1';

const USER_ORBS_GRANT_KEY = 'discord_user_1q_orbs_grant_v1';
const SQUAD_DEV_MIGRATION_KEY = 'discord_squad_dev_v1';
const SQUAD_DEV_ACTIVE_KEY = 'discord_squad_dev_active_v2';
const CLEAN_EMPTY_START_KEY = 'primordial_clean_empty_v1';
const USER_ONLY_ORBS_AMOUNT = 1000000000000000;
const SQUAD_DEV_MEMBER_COUNT = 20909470267;
const SQUAD_DEV_MEMBER_DISPLAY = '209.0947.0267';

interface CommunityHuman {
  id: string;
  name: string;
  avatar: AvatarKey;
  tag?: string;
}

const COMMUNITY_HUMANS: CommunityHuman[] = [
  { id: 'snuf', name: 'snuf', avatar: 'snuf' },
  { id: 'jorge', name: 'Jorge', avatar: 'jorge' },
  { id: 'alex', name: '-/alex_rawr\\-', avatar: 'alex', tag: '⚡ 培根' },
  { id: 'dev', name: 'Dev', avatar: 'dev' },
  { id: 'joawasa', name: 'Joawasa', avatar: 'joawasa' },
  { id: 'carioca', name: 'Carioca', avatar: 'carioca' },
  { id: 'phibi', name: 'Phibi', avatar: 'phibi' },
  { id: 'alirito', name: 'Alirito', avatar: 'alirito' },
  { id: 'locke', name: 'LockE', avatar: 'locke' },
  { id: 'dragon', name: '𒅒龙的传人𒅒', avatar: 'dragon' },
];

const HUMAN_GENERAL_CHAT_POOL = [
  'alguien ya probó el último build? a mí me cargó al toque 🔥',
  'uff qué limpio se ve el dark mode nuevo ngl',
  'quién se mete a Sala Dev un rato? estamos poniendo temazos 🎧',
  'jajaja literal no dormimos nunca en este server 💀',
  'acabo de arreglar un bug que llevaba 2 horas buscando y era una coma 😭',
  'wenaaa gente cómo anda todo por acá?',
  'alguien para unas partidas más tarde o siguen full código?',
  'me encanta lo activo que está el general hoy jaja',
  'pasen captura de cómo les quedó el setup 👀',
  'yo recién me hice otro café, toca trasnochar hoy ☕',
  'broo ese diseño quedó 10/10 sin exagerar',
  'quién anda en llamada? entro en 2 minutos que reinicio el mic',
  'siento que somos millones conectados ahorita y el chat volando 🚀',
  'jajajaj totalmente de acuerdo con eso',
  'alguien sabe si van a hacer evento hoy en la noche?',
  'ey acabo de llegar, de qué me perdí? 👀',
  'nahhh eso quedó demasiado clean 💯',
  'estoy probando unas animaciones nuevas y casi explota el navegador 😂',
  'buenas noches genteee, activos por aquí!',
  'literal este servidor es mi casa ya jajaja ❤️',
  'vengan a #desarrollo que ahí tiramos ideas para la v3',
  'si alguien necesita ayuda con TypeScript que avise por acá 👍',
];

const buildServerHumanReply = (
  content: string,
  senderName: string,
  responder: CommunityHuman
): string => {
  const lower = content.toLowerCase();
  if (lower.includes('hola') || lower.includes('buenas') || lower.includes('hey') || lower.includes('wena')) {
    const greetings = [
      `eyyy buenas @${senderName}! cómo anda todo? 🔥`,
      `qué pasa @${senderName}!! bienvenido al chat 👋`,
      `holaaa @${senderName}, justo estábamos hablando por acá jaja`,
    ];
    return greetings[Math.floor(Math.random() * greetings.length)];
  }
  if (lower.includes('?') || lower.includes('alguien') || lower.includes('quien') || lower.includes('como')) {
    const answers = [
      `yo estoy acá activo @${senderName}! dime qué necesitas 👀`,
      `sí bro, justo estábamos viendo eso en el grupo jaja`,
      `dale @${senderName}, si quieres pásate a Sala Dev y lo vemos rápido 🚀`,
    ];
    return answers[Math.floor(Math.random() * answers.length)];
  }
  if (lower.includes('dev') || lower.includes('codigo') || lower.includes('código') || lower.includes('bug') || lower.includes('app')) {
    return `ufff @${senderName} quedó durísimo eso 💻🔥 me apunto a probarlo`;
  }
  if (lower.includes('voz') || lower.includes('llamada') || lower.includes('call') || lower.includes('jugar')) {
    return `yooo me sumo @${senderName}! métanse a Sala Dev en un toque 🎧`;
  }
  const casual = [
    `jajaja facts @${senderName} 💯`,
    `literal @${senderName} 🔥🔥`,
    `totalmente bro, está re activo el general hoy 🙌`,
    `uff sí @${senderName}, ${responder.name === 'snuf' ? 'de una' : 'apoyo eso al 100%'} 😂`,
    `qué grande @${senderName} 🚀`,
  ];
  return casual[Math.floor(Math.random() * casual.length)];
};

const DEFAULT_ACCOUNT: StoredAccount = {
  id: 'acc-zinepth',
  contact: 'zinepth@discord.gg',
  password: 'demo1234',
  user: {
    ...INITIAL_USER,
    email: 'zinepth@discord.gg',
    orbs: USER_ONLY_ORBS_AMOUNT,
  },
  ownedBundleIds: [],
  wishlistIds: ['bundle-miyabi'],
};

const normalizeOrbs = (value?: number) => {
  if (typeof value !== 'number' || Number.isNaN(value) || value < 0) {
    return 1200;
  }
  return value;
};

export default function App() {
  const [accounts, setAccounts] = useState<StoredAccount[]>(() => {
    try {
      const bugfixed = localStorage.getItem(ORBS_BUGFIX_KEY);
      const userGrantApplied = localStorage.getItem(USER_ORBS_GRANT_KEY);
      const activeSessionId = localStorage.getItem(SESSION_KEY);
      const rawAccs = localStorage.getItem(ACCOUNTS_KEY);
      if (rawAccs) {
        const parsed: StoredAccount[] = JSON.parse(rawAccs);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const sanitized = parsed.map((acc) => {
            const owned = acc.ownedBundleIds || [];
            const isMainUserAccount =
              acc.id === 'acc-zinepth' ||
              (activeSessionId ? acc.id === activeSessionId : parsed.length === 1);
            const baseOrbs = bugfixed ? acc.user.orbs : normalizeOrbs(acc.user.orbs);
            const mergedAccUser: UserProfile = {
              ...INITIAL_USER,
              ...acc.user,
              orbs: !userGrantApplied && isMainUserAccount ? USER_ONLY_ORBS_AMOUNT : baseOrbs,
            };
            return {
              ...acc,
              ownedBundleIds: owned,
              user: sanitizeUserShopCosmetics(mergedAccUser, owned, INITIAL_SHOP_BUNDLES),
            };
          });
          localStorage.setItem(ORBS_BUGFIX_KEY, '1');
          return sanitized;
        }
      }
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed?.user) {
          const owned = parsed.ownedBundleIds || [];
          const mergedSeedUser: UserProfile = {
            ...INITIAL_USER,
            ...parsed.user,
            orbs: !userGrantApplied ? USER_ONLY_ORBS_AMOUNT : normalizeOrbs(parsed.user.orbs),
          };
          const seeded: StoredAccount = {
            id: 'acc-zinepth',
            contact: parsed.user.email || parsed.user.phone || 'zinepth@discord.gg',
            password: 'demo1234',
            user: sanitizeUserShopCosmetics(mergedSeedUser, owned, INITIAL_SHOP_BUNDLES),
            ownedBundleIds: owned,
            wishlistIds: parsed.wishlistIds || ['bundle-miyabi'],
          };
          localStorage.setItem(ORBS_BUGFIX_KEY, '1');
          return [seeded];
        }
      }
      localStorage.setItem(ORBS_BUGFIX_KEY, '1');
    } catch {
      /* ignore */
    }
    return [DEFAULT_ACCOUNT];
  });

  const [activeAccountId, setActiveAccountId] = useState<string | null>(() => {
    try {
      return localStorage.getItem(SESSION_KEY) || null;
    } catch {
      return null;
    }
  });

  const [user, setUser] = useState<UserProfile>(() => {
    try {
      localStorage.removeItem('discord_orbs_100m_granted_v1');
      const userGrantApplied = localStorage.getItem(USER_ORBS_GRANT_KEY);
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        const parsedUser = parsed.user;
        const owned: string[] = parsed.ownedBundleIds || [];
        if (parsedUser) {
          const merged: UserProfile = {
            ...INITIAL_USER,
            ...parsedUser,
            orbs: !userGrantApplied ? USER_ONLY_ORBS_AMOUNT : normalizeOrbs(parsedUser.orbs),
            unlockedBadgeIds: parsedUser.unlockedBadgeIds || INITIAL_USER.unlockedBadgeIds,
            equippedBadgeIds: parsedUser.equippedBadgeIds || INITIAL_USER.equippedBadgeIds,
            boostsGiven: parsedUser.boostsGiven ?? 0,
            boostStreakMonths: parsedUser.boostStreakMonths ?? 0,
            giftsSent: parsedUser.giftsSent ?? 0,
            streamHours: parsedUser.streamHours ?? 0,
            gamesPlayedCount: parsedUser.gamesPlayedCount ?? 0,
            accountYears: parsedUser.accountYears ?? 0,
          };
          localStorage.setItem(ORBS_BUGFIX_KEY, '1');
          return sanitizeUserShopCosmetics(merged, owned, INITIAL_SHOP_BUNDLES);
        }
      }
      localStorage.setItem(ORBS_BUGFIX_KEY, '1');
    } catch {
      /* ignore */
    }
    return INITIAL_USER;
  });

  const [dms, setDms] = useState<DirectMessageThread[]>(() => {
    try {
      if (!localStorage.getItem(CLEAN_EMPTY_START_KEY)) {
        return INITIAL_DMS;
      }
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const savedDms: DirectMessageThread[] | undefined = JSON.parse(raw).dms;
        if (Array.isArray(savedDms)) {
          return savedDms;
        }
      }
    } catch {
      /* ignore */
    }
    return INITIAL_DMS;
  });

  const [servers, setServers] = useState<Server[]>(() => {
    try {
      if (!localStorage.getItem(CLEAN_EMPTY_START_KEY)) {
        return INITIAL_SERVERS;
      }
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const saved: Server[] | undefined = JSON.parse(raw).servers;
        if (Array.isArray(saved)) {
          return saved;
        }
      }
    } catch {
      /* ignore */
    }
    return INITIAL_SERVERS;
  });

  const [quests, setQuests] = useState<Quest[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const savedQuests: Quest[] = JSON.parse(raw).quests;
        if (Array.isArray(savedQuests) && savedQuests.length > 0) {
          const claimedMap = new Map(savedQuests.map((q) => [q.id, q.claimed]));
          return INITIAL_QUESTS.map((q) => ({
            ...q,
            claimed: claimedMap.get(q.id) ?? q.claimed,
          }));
        }
      }
    } catch {
      /* ignore */
    }
    return INITIAL_QUESTS;
  });

  const [wishlistIds, setWishlistIds] = useState<string[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return JSON.parse(raw).wishlistIds || ['bundle-miyabi'];
    } catch {
      /* ignore */
    }
    return ['bundle-miyabi'];
  });

  const [ownedBundleIds, setOwnedBundleIds] = useState<string[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return JSON.parse(raw).ownedBundleIds || [];
    } catch {
      /* ignore */
    }
    return [];
  });

  const [theme, setTheme] = useState<ThemeMode>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return JSON.parse(raw).theme || 'onyx';
    } catch {
      /* ignore */
    }
    return 'onyx';
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [screen, setScreen] = useState<MainScreen>('inicio');
  const [activeContext, setActiveContext] = useState<
    | { type: 'dm' }
    | { type: 'favorites' }
    | { type: 'servidores' }
    | { type: 'server'; serverId: string }
  >({ type: 'dm' });
  const [selectedDmId, setSelectedDmId] = useState<string | null>(null);
  const [selectedChannelId, setSelectedChannelId] = useState<string | null>(null);
  const [mobileChatOpen, setMobileChatOpen] = useState(false);

  const [selectedShopBundle, setSelectedShopBundle] = useState<ShopBundle | null>(null);
  const [boostTargetServerId, setBoostTargetServerId] = useState<string | null>(null);
  const [serverSettingsTarget, setServerSettingsTarget] = useState<{
    serverId: string;
    section: ServerSettingsSection;
  } | null>(null);
  const [showCreateServer, setShowCreateServer] = useState(false);
  const [createServerTemplate, setCreateServerTemplate] = useState<ServerTemplateId>('friends');
  const [showDiscover, setShowDiscover] = useState(false);
  const [showNewGroupDm, setShowNewGroupDm] = useState(false);
  const [groupMemberIds, setGroupMemberIds] = useState<string[]>([]);
  const [groupTitle, setGroupTitle] = useState('');
  const [groupEmoji, setGroupEmoji] = useState('💬');
  const [groupColor, setGroupColor] = useState('#5865F2');
  const [groupCustomIconUrl, setGroupCustomIconUrl] = useState<string | undefined>(undefined);
  const groupIconFileRef = useRef<HTMLInputElement>(null);
  const [selectedActivity, setSelectedActivity] = useState<FriendActivity | null>(null);
  const [inspectedUser, setInspectedUser] = useState<{
    profile: PublicUserProfile;
    roles?: ServerRole[];
  } | null>(null);
  const [typingMap, setTypingMap] = useState<Record<string, string | null>>({});
  const [profileEditorRequest, setProfileEditorRequest] = useState<{
    tab: 'principal' | 'servidor';
    serverId?: string;
  } | null>(null);
  const [profileViewTrigger, setProfileViewTrigger] = useState(0);
  const [toast, setToast] = useState<string | null>(null);

  const [voiceSession, setVoiceSession] = useState<VoiceSession>({
    active: false,
    channelName: '',
    contextName: '',
    muted: false,
    deafened: false,
    videoOn: false,
    screenSharing: false,
    connectedSeconds: 0,
    participants: [],
  });

  useEffect(() => {
    try {
      localStorage.setItem(USER_ORBS_GRANT_KEY, '1');
      localStorage.setItem(SQUAD_DEV_MIGRATION_KEY, '1');
      localStorage.setItem(SQUAD_DEV_ACTIVE_KEY, '1');
      localStorage.setItem(CLEAN_EMPTY_START_KEY, '1');
      localStorage.setItem(SHOP_OWNERSHIP_MIGRATION_KEY, '1');
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          user,
          dms,
          servers,
          quests,
          wishlistIds,
          ownedBundleIds,
          theme,
        })
      );
    } catch {
      /* ignore */
    }
  }, [user, dms, servers, quests, wishlistIds, ownedBundleIds, theme]);

  useEffect(() => {
    if (!activeAccountId) return;
    setAccounts((prev) => {
      const idx = prev.findIndex((a) => a.id === activeAccountId);
      if (idx === -1) return prev;
      const updated = [...prev];
      updated[idx] = {
        ...updated[idx],
        user,
        ownedBundleIds,
        wishlistIds,
      };
      try {
        localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(updated));
      } catch {
        /* ignore */
      }
      return updated;
    });
  }, [activeAccountId, user, ownedBundleIds, wishlistIds]);

  useEffect(() => {
    try {
      localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
    } catch {
      /* ignore */
    }
  }, [accounts]);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme !== 'light');
  }, [theme]);

  useEffect(() => {
    if (!voiceSession.active) return;
    const t = setInterval(() => {
      setVoiceSession((prev) => ({ ...prev, connectedSeconds: prev.connectedSeconds + 1 }));
    }, 1000);
    return () => clearInterval(t);
  }, [voiceSession.active]);

  const showToastMsg = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2800);
  };

  const unreadTotal = useMemo(() => {
    const serverSum = servers.reduce((acc, s) => acc + (s.badgeCount || 0), 0);
    return serverSum + notifications.filter((n) => n.unread).length;
  }, [servers, notifications]);

  const unreadNotificationsCount = notifications.filter((n) => n.unread).length;
  const hasUnclaimedQuests = quests.some((q) => !q.claimed);

  const themeClass =
    theme === 'vice-city'
      ? 'theme-vice-city'
      : theme === 'dark'
      ? 'theme-dark'
      : theme === 'light'
      ? 'theme-light'
      : '';

  const activeDm = dms.find((d) => d.id === selectedDmId) || dms[0];
  const activeServer =
    activeContext.type === 'server'
      ? servers.find((s) => s.id === activeContext.serverId)
      : undefined;

  const activeChannelObj = activeServer?.channels.find((c) => c.id === selectedChannelId);
  const isLiveHumanChannel = Boolean(
    activeAccountId &&
      screen === 'inicio' &&
      activeServer &&
      activeChannelObj &&
      activeChannelObj.type === 'text' &&
      !activeChannelObj.isPrivate &&
      (activeChannelObj.name.toLowerCase().includes('general') ||
        activeChannelObj.name.toLowerCase().includes('desarrollo') ||
        activeChannelObj.name.toLowerCase().includes('off-topic'))
  );
  const liveServerId = activeServer?.id;
  const liveChannelId = activeChannelObj?.id;

  useEffect(() => {
    if (!isLiveHumanChannel || !liveServerId || !liveChannelId) return;

    let cancelled = false;
    let postTimer: number | undefined;

    const triggerChatter = () => {
      if (cancelled) return;
      const speaker = COMMUNITY_HUMANS[Math.floor(Math.random() * COMMUNITY_HUMANS.length)];
      const coTyper =
        Math.random() < 0.35
          ? COMMUNITY_HUMANS.find((m) => m.id !== speaker.id)
          : undefined;
      const typingText = coTyper
        ? `${speaker.name} y ${coTyper.name} están escribiendo...`
        : `${speaker.name} está escribiendo...`;

      setTypingMap((prev) => ({ ...prev, [liveChannelId]: typingText }));

      postTimer = window.setTimeout(() => {
        if (cancelled) return;
        setTypingMap((prev) => ({ ...prev, [liveChannelId]: null }));

        setServers((prev) =>
          prev.map((s) => {
            if (s.id !== liveServerId) return s;
            return {
              ...s,
              channels: s.channels.map((c) => {
                if (c.id !== liveChannelId) return c;
                const recentContents = new Set(c.messages.slice(-8).map((m) => m.content));
                const candidates = HUMAN_GENERAL_CHAT_POOL.filter(
                  (line) => !recentContents.has(line)
                );
                const pool = candidates.length > 0 ? candidates : HUMAN_GENERAL_CHAT_POOL;
                const text = pool[Math.floor(Math.random() * pool.length)];

                const lastHumanMsg = [...c.messages]
                  .reverse()
                  .find((m) => m.authorId !== speaker.id && !m.authorIsBot);
                const shouldReply = Boolean(lastHumanMsg && Math.random() < 0.35);

                const newMsg: ChatMessage = {
                  id: `live-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
                  authorId: speaker.id,
                  authorName: speaker.name,
                  authorAvatar: speaker.avatar,
                  authorTag: speaker.tag,
                  timestamp: 'Ahora',
                  ...(shouldReply && lastHumanMsg
                    ? {
                        replyTo: {
                          authorName: lastHumanMsg.authorName,
                          content: lastHumanMsg.content.slice(0, 80),
                        },
                      }
                    : {}),
                  content: text,
                  reactions:
                    Math.random() < 0.3
                      ? [
                          {
                            emoji: ['🔥', '😂', '👀', '💯'][Math.floor(Math.random() * 4)],
                            count: 1,
                            reacted: false,
                          },
                        ]
                      : [],
                };

                return { ...c, messages: [...c.messages.slice(-79), newMsg] };
              }),
            };
          })
        );
      }, 1450);
    };

    const initialTimer = window.setTimeout(triggerChatter, 2800);
    const interval = window.setInterval(triggerChatter, 6200);

    return () => {
      cancelled = true;
      window.clearTimeout(initialTimer);
      window.clearInterval(interval);
      if (postTimer) window.clearTimeout(postTimer);
    };
  }, [isLiveHumanChannel, liveServerId, liveChannelId]);

  const handleInspectUser = (
    userId: string,
    fallback?: Partial<PublicUserProfile>,
    roles?: ServerRole[]
  ) => {
    if (userId === 'me') {
      setInspectedUser({
        profile: {
          id: 'me',
          displayName: user.displayName,
          username: user.username,
          pronouns: user.pronouns,
          avatar: user.avatar,
          status: user.status,
          customStatus: user.customStatus,
          bio: user.bio,
          bannerColor: user.bannerColor,
          bannerImage: user.bannerImage,
          decoration: user.decoration,
          profileEffect: user.profileEffect,
          profileFrame: user.profileFrame,
          nameplate: user.nameplate,
          serverTag: user.serverTag,
          nitroTier: user.nitroTier,
          badgeIds: user.equippedBadgeIds,
          memberSince: user.memberSince,
          mutualServers: servers.map((s) => s.name),
        },
        roles,
      });
      return;
    }

    const baseProfile = resolvePublicUserProfile(userId, fallback);
    const matchingDm = dms.find(
      (d) => d.id === userId || d.id === `dm-${userId}` || d.id.replace(/^dm-/, '') === userId
    );
    const giftedCosmetics: Partial<PublicUserProfile> = {};
    if (matchingDm?.giftedBundleIds?.length) {
      for (const bid of matchingDm.giftedBundleIds) {
        const b = INITIAL_SHOP_BUNDLES.find((item) => item.id === bid);
        if (!b) continue;
        const deco = b.items.find((i) => i.decorationId)?.decorationId;
        const plate = b.items.find((i) => i.nameplateId)?.nameplateId;
        const banner = b.items.find((i) => i.bannerUrl)?.bannerUrl;
        const fx = b.items.find((i) => i.profileEffectId)?.profileEffectId;
        if (deco) giftedCosmetics.decoration = deco;
        if (plate) giftedCosmetics.nameplate = plate;
        if (banner) giftedCosmetics.bannerImage = banner;
        if (fx) giftedCosmetics.profileEffect = fx;
      }
    }

    setInspectedUser({
      profile: {
        ...baseProfile,
        ...giftedCosmetics,
        decoration: matchingDm?.decoration || giftedCosmetics.decoration || baseProfile.decoration,
        nameplate: matchingDm?.nameplate || giftedCosmetics.nameplate || baseProfile.nameplate,
      },
      roles,
    });
  };

  const handleSelectDm = (dmId: string) => {
    setSelectedDmId(dmId);
    setSelectedChannelId(null);
    setActiveContext({ type: 'dm' });
    setScreen('inicio');
    setMobileChatOpen(true);
    setDms((prev) =>
      prev.map((d) => (d.id === dmId ? { ...d, unread: false, unreadCount: 0 } : d))
    );
  };

  const handleSelectServer = (serverId: string) => {
    const srv = servers.find((s) => s.id === serverId);
    const firstText =
      srv?.channels.find((c) => !c.isPrivate && c.type !== 'voice' && c.name.toLowerCase().includes('general')) ||
      srv?.channels.find((c) => !c.isPrivate && c.type !== 'voice') ||
      srv?.channels.find((c) => c.type !== 'voice') ||
      srv?.channels[0];
    setActiveContext({ type: 'server', serverId });
    setSelectedChannelId(firstText?.id || null);
    setScreen('inicio');
    setMobileChatOpen(false);
    setServers((prev) =>
      prev.map((s) => (s.id === serverId ? { ...s, badgeCount: 0, hasUnread: false } : s))
    );
  };

  const handleSelectChannel = (serverId: string, channelId: string) => {
    setActiveContext({ type: 'server', serverId });
    setSelectedChannelId(channelId);
    setScreen('inicio');
    setMobileChatOpen(true);
    setServers((prev) =>
      prev.map((s) =>
        s.id === serverId
          ? {
              ...s,
              channels: s.channels.map((c) =>
                c.id === channelId ? { ...c, unreadCount: 0 } : c
              ),
            }
          : s
      )
    );
  };

  const formatMessagePreview = (payload: {
    content?: string;
    imageUrl?: string;
    sticker?: ChatMessage['sticker'];
    audioNote?: ChatMessage['audioNote'];
    poll?: ChatMessage['poll'];
  }) => {
    if (payload.poll) return `📊 Encuesta: ${payload.poll.question}`;
    if (payload.audioNote) return `🎤 Nota de voz (${payload.audioNote.durationSec}s)`;
    if (payload.sticker) return `🏷️ Sticker: ${payload.sticker.name}`;
    if (payload.imageUrl && !payload.content) return '📷 Foto enviada';
    return payload.content || '';
  };

  const buildSmartReply = (dmThread: DirectMessageThread, payload: RichMessagePayload): string => {
    const lower = (payload.content || '').toLowerCase();
    if (payload.poll) {
      return `Buena encuesta! Yo ya voy votando 👀`;
    }
    if (payload.audioNote) {
      return `Recibido ese audio de ${payload.audioNote.durationSec}s 🎧 te escucho claro!`;
    }
    if (payload.sticker) {
      return `${payload.sticker.emoji} jajaja top ese sticker!`;
    }
    if (dmThread.isBot) {
      if (lower.includes('bump')) {
        return '🤖 ¡Servidor bumpeado correctamente! Sube posiciones en el listado público.';
      }
      if (lower.includes('help') || lower.includes('ayuda')) {
        return '🤖 Comandos disponibles: `/bump`, `/stats`, `/ping` y `/server`.';
      }
      if (lower.includes('stats')) {
        return '📊 Estadísticas actuales: 102 miembros · 48 en línea · Latencia 24ms.';
      }
      return `🤖 Comando procesado: "${payload.content || 'multimedia'}". Todo operando al 100%.`;
    }
    if (lower.includes('hola') || lower.includes('buenas') || lower.includes('hey')) {
      return `¡Qué pasa ${user.displayName}! ¿Cómo va todo por el server?`;
    }
    if (lower.includes('?')) {
      return 'Sí, de una! Avísame cuando quieras darle 🔥';
    }
    if (dmThread.id === 'dm-snuf') {
      return 'Brutal bro 🔥 seguimos subiendo la comunidad!';
    }
    if (dmThread.id === 'dm-alex') {
      return 'Dale perfecto, avísame cuando entres a probarlo ⚡';
    }
    if (dmThread.isGroup) {
      return 'Todos atentos por acá 👀 ¡buen punto!';
    }
    return '¡Recibido! 👍 Te respondo enseguida.';
  };

  const handleSendRichMessage = (payload: RichMessagePayload) => {
    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      authorId: 'me',
      authorName: user.displayName,
      authorAvatar: user.avatar,
      timestamp: 'Ahora',
      content: payload.content,
      replyTo: payload.replyTo,
      imageUrl: payload.imageUrl,
      sticker: payload.sticker,
      audioNote: payload.audioNote,
      poll: payload.poll,
      reactions: [],
    };

    if (activeContext.type === 'server' && activeServer && selectedChannelId) {
      const targetServerId = activeServer.id;
      const targetChannelId = selectedChannelId;
      setServers((prev) =>
        prev.map((s) =>
          s.id === targetServerId
            ? {
                ...s,
                channels: s.channels.map((c) =>
                  c.id === targetChannelId ? { ...c, messages: [...c.messages, newMsg] } : c
                ),
              }
            : s
        )
      );

      const lower = payload.content.toLowerCase();
      if (lower.includes('@bumper') || lower.includes('/bump')) {
        setTypingMap((prev) => ({ ...prev, [targetChannelId]: 'Bumper está escribiendo...' }));
        setTimeout(() => {
          setTypingMap((prev) => ({ ...prev, [targetChannelId]: null }));
          const replyMsg: ChatMessage = {
            id: `ch-reply-${Date.now()}`,
            authorId: 'bumper',
            authorName: 'Bumper',
            authorAvatar: 'bumper',
            authorIsBot: true,
            timestamp: 'Ahora',
            content: '🤖 ¡Servidor bumpeado! +1 visibilidad en el directorio.',
            reactions: [],
          };
          setServers((prev) =>
            prev.map((s) =>
              s.id === targetServerId
                ? {
                    ...s,
                    channels: s.channels.map((c) =>
                      c.id === targetChannelId ? { ...c, messages: [...c.messages, replyMsg] } : c
                    ),
                  }
                : s
            )
          );
        }, 950);
      } else {
        const responder = COMMUNITY_HUMANS[Math.floor(Math.random() * COMMUNITY_HUMANS.length)];
        const secondResponder = COMMUNITY_HUMANS.find((m) => m.id !== responder.id);
        setTypingMap((prev) => ({
          ...prev,
          [targetChannelId]: `${responder.name} está escribiendo...`,
        }));
        setTimeout(() => {
          setTypingMap((prev) => ({ ...prev, [targetChannelId]: null }));
          const replyText = buildServerHumanReply(payload.content, user.displayName, responder);
          const replyMsg: ChatMessage = {
            id: `ch-reply-${Date.now()}`,
            authorId: responder.id,
            authorName: responder.name,
            authorAvatar: responder.avatar,
            authorTag: responder.tag,
            timestamp: 'Ahora',
            replyTo: {
              authorName: user.displayName,
              content: payload.content.slice(0, 90) || 'Mensaje',
            },
            content: replyText,
            reactions: [],
          };
          setServers((prev) =>
            prev.map((s) =>
              s.id === targetServerId
                ? {
                    ...s,
                    channels: s.channels.map((c) => {
                      if (c.id !== targetChannelId) return c;
                      const updatedMsgs = c.messages.map((m) =>
                        m.id === newMsg.id && Math.random() < 0.7
                          ? {
                              ...m,
                              reactions: [
                                ...(m.reactions || []),
                                {
                                  emoji: ['🔥', '👍', '❤️', '😂'][Math.floor(Math.random() * 4)],
                                  count: 1,
                                  reacted: false,
                                },
                              ],
                            }
                          : m
                      );
                      return { ...c, messages: [...updatedMsgs, replyMsg] };
                    }),
                  }
                : s
            )
          );

          if (secondResponder && Math.random() < 0.45) {
            setTimeout(() => {
              setTypingMap((prev) => ({
                ...prev,
                [targetChannelId]: `${secondResponder.name} está escribiendo...`,
              }));
              setTimeout(() => {
                setTypingMap((prev) => ({ ...prev, [targetChannelId]: null }));
                const followUps = [
                  'literal jajajaj 💯',
                  'confirmo eso 👀',
                  'yo también me apunto 🔥',
                  `eso mismo iba a decir @${user.displayName} 😂`,
                ];
                const followMsg: ChatMessage = {
                  id: `ch-reply2-${Date.now()}`,
                  authorId: secondResponder.id,
                  authorName: secondResponder.name,
                  authorAvatar: secondResponder.avatar,
                  authorTag: secondResponder.tag,
                  timestamp: 'Ahora',
                  content: followUps[Math.floor(Math.random() * followUps.length)],
                  reactions: [],
                };
                setServers((prev) =>
                  prev.map((s) =>
                    s.id === targetServerId
                      ? {
                          ...s,
                          channels: s.channels.map((c) =>
                            c.id === targetChannelId
                              ? { ...c, messages: [...c.messages, followMsg] }
                              : c
                          ),
                        }
                      : s
                  )
                );
              }, 1100);
            }, 900);
          }
        }, 1250);
      }
      return;
    }

    if (activeDm) {
      const targetDm = activeDm;
      const targetId = targetDm.id;
      const preview = formatMessagePreview(payload);
      setDms((prev) =>
        prev.map((d) =>
          d.id === targetId
            ? {
                ...d,
                lastMessagePreview: `Tú: ${preview}`,
                lastTimestamp: 'Ahora',
                unread: false,
                unreadCount: 0,
                messages: [...d.messages, newMsg],
              }
            : d
        )
      );

      setTypingMap((prev) => ({ ...prev, [targetId]: `${targetDm.name} está escribiendo...` }));
      setTimeout(() => {
        setTypingMap((prev) => ({ ...prev, [targetId]: null }));
        const replyText = buildSmartReply(targetDm, payload);
        const botReply: ChatMessage = {
          id: `reply-${Date.now()}`,
          authorId: targetDm.id,
          authorName: targetDm.name,
          authorAvatar: targetDm.avatar,
          authorIsBot: targetDm.isBot,
          authorTag: targetDm.serverTag,
          timestamp: 'Ahora',
          content: replyText,
          reactions: [],
        };

        setDms((prev) =>
          prev.map((d) => {
            if (d.id !== targetId) return d;
            const isCurrentlyOpen = selectedDmId === targetId && activeContext.type === 'dm';
            return {
              ...d,
              lastMessagePreview: `${targetDm.name}: ${replyText}`,
              lastTimestamp: 'Ahora',
              unread: !isCurrentlyOpen,
              unreadCount: isCurrentlyOpen ? 0 : (d.unreadCount ?? 0) + 1,
              messages: [...d.messages, botReply],
            };
          })
        );
      }, 950);
    }
  };

  const handleSendMessage = (
    text: string,
    replyTo?: { authorName: string; content: string },
    imageUrl?: string
  ) => {
    handleSendRichMessage({ content: text, replyTo, imageUrl });
  };

  const mapActiveMessages = (
    updater: (msgs: ChatMessage[]) => ChatMessage[],
    dmPreviewUpdater?: (msgs: ChatMessage[]) => Partial<DirectMessageThread>
  ) => {
    if (activeContext.type === 'server' && activeServer && selectedChannelId) {
      setServers((prev) =>
        prev.map((s) =>
          s.id === activeServer.id
            ? {
                ...s,
                channels: s.channels.map((c) =>
                  c.id === selectedChannelId ? { ...c, messages: updater(c.messages) } : c
                ),
              }
            : s
        )
      );
    } else if (activeDm) {
      setDms((prev) =>
        prev.map((d) => {
          if (d.id !== activeDm.id) return d;
          const nextMsgs = updater(d.messages);
          const extra = dmPreviewUpdater ? dmPreviewUpdater(nextMsgs) : {};
          return { ...d, messages: nextMsgs, ...extra };
        })
      );
    }
  };

  const handleEditMessage = (messageId: string, newContent: string) => {
    mapActiveMessages(
      (msgs) =>
        msgs.map((m) =>
          m.id === messageId ? { ...m, content: newContent, edited: true, editedAt: 'Ahora' } : m
        ),
      (nextMsgs) => {
        const last = nextMsgs[nextMsgs.length - 1];
        if (!last) return {};
        return {
          lastMessagePreview:
            last.authorId === 'me'
              ? `Tú: ${formatMessagePreview(last)}`
              : `${last.authorName}: ${formatMessagePreview(last)}`,
        };
      }
    );
    showToastMsg('Mensaje editado');
  };

  const handleDeleteMessage = (messageId: string) => {
    mapActiveMessages(
      (msgs) => msgs.filter((m) => m.id !== messageId),
      (nextMsgs) => {
        const last = nextMsgs[nextMsgs.length - 1];
        if (!last) {
          return { lastMessagePreview: 'Sin mensajes recientes', lastTimestamp: '' };
        }
        return {
          lastMessagePreview:
            last.authorId === 'me'
              ? `Tú: ${formatMessagePreview(last)}`
              : `${last.authorName}: ${formatMessagePreview(last)}`,
          lastTimestamp: last.timestamp,
        };
      }
    );
    showToastMsg('Mensaje eliminado');
  };

  const handleTogglePinMessage = (messageId: string) => {
    let wasPinned = false;
    mapActiveMessages((msgs) =>
      msgs.map((m) => {
        if (m.id !== messageId) return m;
        wasPinned = Boolean(m.pinned);
        return { ...m, pinned: !m.pinned };
      })
    );
    showToastMsg(wasPinned ? 'Mensaje desfijado' : 'Mensaje fijado en el chat');
  };

  const handleVotePoll = (messageId: string, optionId: string) => {
    mapActiveMessages((msgs) =>
      msgs.map((m) => {
        if (m.id !== messageId || !m.poll) return m;
        const alreadyVotedThis = m.poll.options
          .find((o) => o.id === optionId)
          ?.votes.includes('me');
        return {
          ...m,
          poll: {
            ...m.poll,
            options: m.poll.options.map((o) => {
              const withoutMe = o.votes.filter((v) => v !== 'me');
              if (o.id === optionId && !alreadyVotedThis) {
                return { ...o, votes: [...withoutMe, 'me'] };
              }
              return { ...o, votes: withoutMe };
            }),
          },
        };
      })
    );
  };

  const handleForwardMessage = (
    msg: ChatMessage,
    target: { type: 'dm' | 'channel'; id: string; serverId?: string; label: string }
  ) => {
    const originLabel =
      activeContext.type === 'server' && activeServer
        ? `${activeServer.name}`
        : activeDm?.name || 'Chat';
    const forwardedMsg: ChatMessage = {
      id: `fwd-${Date.now()}`,
      authorId: 'me',
      authorName: user.displayName,
      authorAvatar: user.avatar,
      timestamp: 'Ahora',
      content: msg.content,
      imageUrl: msg.imageUrl,
      sticker: msg.sticker,
      forwardedFrom: {
        authorName: msg.authorName,
        originLabel,
        content: msg.content,
      },
      reactions: [],
    };
    const preview = formatMessagePreview(forwardedMsg) || 'Mensaje reenviado';

    if (target.type === 'dm') {
      setDms((prev) =>
        prev.map((d) =>
          d.id === target.id
            ? {
                ...d,
                lastMessagePreview: `Tú: ↪ ${preview}`,
                lastTimestamp: 'Ahora',
                messages: [...d.messages, forwardedMsg],
              }
            : d
        )
      );
    } else if (target.type === 'channel' && target.serverId) {
      setServers((prev) =>
        prev.map((s) =>
          s.id === target.serverId
            ? {
                ...s,
                channels: s.channels.map((c) =>
                  c.id === target.id ? { ...c, messages: [...c.messages, forwardedMsg] } : c
                ),
              }
            : s
        )
      );
    }
    showToastMsg(`Mensaje reenviado a ${target.label}`);
  };

  const handleToggleDmPin = (dmId: string) => {
    setDms((prev) => prev.map((d) => (d.id === dmId ? { ...d, pinned: !d.pinned } : d)));
  };

  const handleToggleDmMute = (dmId: string) => {
    setDms((prev) => prev.map((d) => (d.id === dmId ? { ...d, muted: !d.muted } : d)));
  };

  const handleToggleDmUnread = (dmId: string) => {
    setDms((prev) =>
      prev.map((d) =>
        d.id === dmId
          ? { ...d, unread: !d.unread, unreadCount: !d.unread ? Math.max(1, d.unreadCount || 1) : 0 }
          : d
      )
    );
  };

  const handleToggleDmFavorite = (dmId: string) => {
    setDms((prev) => prev.map((d) => (d.id === dmId ? { ...d, favorite: !d.favorite } : d)));
  };

  const handleCloseDm = (dmId: string) => {
    setDms((prev) => {
      const next = prev.filter((d) => d.id !== dmId);
      if (selectedDmId === dmId) {
        setSelectedDmId(next[0]?.id || null);
      }
      return next;
    });
    showToastMsg('Conversación cerrada');
  };

  const handleToggleReaction = (messageId: string, emoji: string) => {
    const toggleInList = (msgs: DirectMessageThread['messages']) =>
      msgs.map((m) => {
        if (m.id !== messageId) return m;
        const existing = m.reactions.find((r) => r.emoji === emoji);
        if (existing) {
          const nextCount = existing.reacted ? existing.count - 1 : existing.count + 1;
          return {
            ...m,
            reactions:
              nextCount <= 0
                ? m.reactions.filter((r) => r.emoji !== emoji)
                : m.reactions.map((r) =>
                    r.emoji === emoji ? { ...r, count: nextCount, reacted: !r.reacted } : r
                  ),
          };
        }
        return { ...m, reactions: [...m.reactions, { emoji, count: 1, reacted: true }] };
      });

    if (activeContext.type === 'server' && activeServer && selectedChannelId) {
      setServers((prev) =>
        prev.map((s) =>
          s.id === activeServer.id
            ? {
                ...s,
                channels: s.channels.map((c) =>
                  c.id === selectedChannelId ? { ...c, messages: toggleInList(c.messages) } : c
                ),
              }
            : s
        )
      );
    } else if (activeDm) {
      setDms((prev) =>
        prev.map((d) => (d.id === activeDm.id ? { ...d, messages: toggleInList(d.messages) } : d))
      );
    }
  };

  const unlockBadgeHelper = (
    prev: UserProfile,
    badgeId: BadgeId
  ): Pick<UserProfile, 'unlockedBadgeIds' | 'equippedBadgeIds'> => {
    const unlocked = prev.unlockedBadgeIds.includes(badgeId)
      ? prev.unlockedBadgeIds
      : [...prev.unlockedBadgeIds, badgeId];
    const equipped = prev.equippedBadgeIds.includes(badgeId)
      ? prev.equippedBadgeIds
      : [...prev.equippedBadgeIds, badgeId];
    return { unlockedBadgeIds: unlocked, equippedBadgeIds: equipped };
  };

  const handleClaimQuest = (questId: string) => {
    const q = quests.find((item) => item.id === questId);
    if (!q || q.claimed) return;
    const rawBonus = user.nitroTier === 'nitro' ? Math.round(q.rewardOrbs * 1.2) : q.rewardOrbs;
    const bonus = q.isLimitedTime ? Math.min(300, rawBonus) : rawBonus;
    setQuests((prev) => prev.map((item) => (item.id === questId ? { ...item, claimed: true } : item)));
    setUser((prev) => ({
      ...prev,
      orbs: prev.orbs + bonus,
      ...unlockBadgeHelper(prev, 'orbs'),
    }));
    showToastMsg(`¡Conseguiste +${bonus} Orbs y la insignia Aprendiz de Orbs!`);
  };

  const handleBoostServer = (serverId: string, amount: number, orbCost: number) => {
    if (user.orbs < orbCost) {
      showToastMsg('No tienes suficientes Orbs para esta mejora');
      return;
    }
    const target = servers.find((s) => s.id === serverId);
    if (!target) return;
    const nextBoosts = (target.boostCount ?? 0) + amount;
    const nextLevel = nextBoosts >= 14 ? 3 : nextBoosts >= 5 ? 2 : nextBoosts >= 1 ? 1 : 0;

    setServers((prev) =>
      prev.map((s) =>
        s.id === serverId ? { ...s, boostCount: nextBoosts, boostLevel: nextLevel } : s
      )
    );
    setUser((prev) => ({
      ...prev,
      orbs: prev.orbs - orbCost,
      boostsGiven: prev.boostsGiven + amount,
      boostStreakMonths: Math.max(1, prev.boostStreakMonths + amount),
      ...unlockBadgeHelper(prev, 'mejora'),
    }));
    showToastMsg(
      `¡Mejoraste ${target.name} (+${amount})! Banner desbloqueado · Nivel ${nextLevel}`
    );
  };

  const handleUpdateServer = (serverId: string, patch: Partial<Server>) => {
    setServers((prev) => prev.map((s) => (s.id === serverId ? { ...s, ...patch } : s)));
  };

  const handleOpenServerSettings = (
    serverId: string,
    section: ServerSettingsSection = 'menu'
  ) => {
    setServerSettingsTarget({ serverId, section });
    setScreen('servidor-ajustes');
  };

  const handleMarkServerRead = (serverId: string) => {
    setServers((prev) =>
      prev.map((s) =>
        s.id === serverId
          ? {
              ...s,
              badgeCount: 0,
              hasUnread: false,
              channels: s.channels.map((c) => ({ ...c, unreadCount: 0 })),
            }
          : s
      )
    );
    showToastMsg('Todo marcado como leído');
  };

  const handleAddChannel = (
    serverId: string,
    data: { name: string; type: Channel['type']; category: string; isPrivate?: boolean }
  ) => {
    const newCh: Channel = {
      id: `ch-${Date.now()}`,
      name: data.name,
      type: data.type,
      category: data.category,
      isPrivate: data.isPrivate,
      topic: `Canal ${data.name}`,
      voiceParticipants: data.type === 'voice' ? [] : undefined,
      messages: [],
    };
    setServers((prev) =>
      prev.map((s) => {
        if (s.id !== serverId) return s;
        const cats = s.categoriesOrder || Array.from(new Set(['', ...s.channels.map((c) => c.category)]));
        const nextCats = cats.includes(data.category) ? cats : [...cats, data.category];
        return { ...s, categoriesOrder: nextCats, channels: [...s.channels, newCh] };
      })
    );
    showToastMsg(`Canal #${data.name} creado`);
  };

  const handleUpdateChannel = (serverId: string, channelId: string, patch: Partial<Channel>) => {
    setServers((prev) =>
      prev.map((s) =>
        s.id === serverId
          ? {
              ...s,
              channels: s.channels.map((c) => (c.id === channelId ? { ...c, ...patch } : c)),
            }
          : s
      )
    );
    showToastMsg('Canal actualizado');
  };

  const handleDeleteChannel = (serverId: string, channelId: string) => {
    setServers((prev) =>
      prev.map((s) =>
        s.id === serverId
          ? { ...s, channels: s.channels.filter((c) => c.id !== channelId) }
          : s
      )
    );
    if (selectedChannelId === channelId) {
      const srv = servers.find((s) => s.id === serverId);
      const next = srv?.channels.find((c) => c.id !== channelId && c.type !== 'voice');
      setSelectedChannelId(next?.id || null);
    }
    showToastMsg('Canal eliminado');
  };

  const handleMoveChannel = (serverId: string, channelId: string, direction: -1 | 1) => {
    setServers((prev) =>
      prev.map((s) => {
        if (s.id !== serverId) return s;
        const target = s.channels.find((c) => c.id === channelId);
        if (!target) return s;
        const sameCatIndices = s.channels
          .map((c, idx) => (c.category === target.category ? idx : -1))
          .filter((idx) => idx !== -1);
        const pos = sameCatIndices.indexOf(s.channels.findIndex((c) => c.id === channelId));
        const swapPos = pos + direction;
        if (swapPos < 0 || swapPos >= sameCatIndices.length) return s;
        const a = sameCatIndices[pos];
        const b = sameCatIndices[swapPos];
        const nextChannels = [...s.channels];
        [nextChannels[a], nextChannels[b]] = [nextChannels[b], nextChannels[a]];
        return { ...s, channels: nextChannels };
      })
    );
  };

  const handleAddCategory = (serverId: string, categoryName: string) => {
    setServers((prev) =>
      prev.map((s) => {
        if (s.id !== serverId) return s;
        const cats = s.categoriesOrder || Array.from(new Set(['', ...s.channels.map((c) => c.category)]));
        if (cats.includes(categoryName)) return s;
        return { ...s, categoriesOrder: [...cats, categoryName] };
      })
    );
    showToastMsg(`Categoría "${categoryName}" creada`);
  };

  const handleRenameCategory = (serverId: string, oldName: string, newName: string) => {
    setServers((prev) =>
      prev.map((s) => {
        if (s.id !== serverId) return s;
        const cats = (s.categoriesOrder || []).map((c) => (c === oldName ? newName : c));
        return {
          ...s,
          categoriesOrder: cats,
          channels: s.channels.map((ch) =>
            ch.category === oldName ? { ...ch, category: newName } : ch
          ),
        };
      })
    );
    showToastMsg(`Categoría renombrada a "${newName}"`);
  };

  const handleDeleteCategory = (serverId: string, categoryName: string) => {
    setServers((prev) =>
      prev.map((s) => {
        if (s.id !== serverId) return s;
        return {
          ...s,
          categoriesOrder: (s.categoriesOrder || []).filter((c) => c !== categoryName),
          channels: s.channels.map((ch) =>
            ch.category === categoryName ? { ...ch, category: '' } : ch
          ),
        };
      })
    );
    showToastMsg(`Categoría "${categoryName}" eliminada`);
  };

  const handleMoveCategory = (serverId: string, categoryName: string, direction: -1 | 1) => {
    setServers((prev) =>
      prev.map((s) => {
        if (s.id !== serverId) return s;
        const cats = Array.from(
          new Set([...(s.categoriesOrder || ['']), ...s.channels.map((c) => c.category)])
        );
        const named = cats.filter((c) => c !== '');
        const idx = named.indexOf(categoryName);
        const swap = idx + direction;
        if (idx === -1 || swap < 0 || swap >= named.length) return s;
        [named[idx], named[swap]] = [named[swap], named[idx]];
        return { ...s, categoriesOrder: cats.includes('') ? ['', ...named] : named };
      })
    );
  };

  const handleUnlockServerPerk = (serverId: string, perkId: string, tagLabel?: string) => {
    setServers((prev) =>
      prev.map((s) => {
        if (s.id !== serverId) return s;
        const current = s.unlockedPerkIds || [];
        if (current.includes(perkId)) return s;
        return {
          ...s,
          unlockedPerkIds: [...current, perkId],
          ...(tagLabel ? { activeServerTag: tagLabel } : {}),
        };
      })
    );
    if (tagLabel) {
      setUser((prev) => ({ ...prev, serverTag: tagLabel }));
    }
    showToastMsg('¡Ventaja de servidor activada!');
  };

  const handleGiftBundle = (bundle: ShopBundle, recipientId: string, recipientName: string) => {
    if (user.orbs < bundle.priceOrbs) {
      showToastMsg('No tienes suficientes Orbs para enviar este regalo');
      return;
    }
    const giftedDeco = bundle.items.find((i) => i.decorationId)?.decorationId;
    const giftedPlate = bundle.items.find((i) => i.nameplateId)?.nameplateId;
    const giftMsg: ChatMessage = {
      id: `gift-${Date.now()}`,
      authorId: 'me',
      authorName: user.displayName,
      authorAvatar: user.avatar,
      timestamp: 'Ahora',
      content: `🎁 ¡Te envié un regalo de la Tienda: **${bundle.title}**!`,
      reactions: [{ emoji: '🎁', count: 1, reacted: true }],
    };
    setDms((prev) =>
      prev.map((d) => {
        if (d.id !== recipientId) return d;
        const currentGifts = d.giftedBundleIds || [];
        return {
          ...d,
          lastMessagePreview: `Tú: 🎁 ¡Te envié ${bundle.title}!`,
          lastTimestamp: 'Ahora',
          giftedBundleIds: currentGifts.includes(bundle.id)
            ? currentGifts
            : [...currentGifts, bundle.id],
          ...(giftedDeco ? { decoration: giftedDeco } : {}),
          ...(giftedPlate ? { nameplate: giftedPlate } : {}),
          messages: [...d.messages, giftMsg],
        };
      })
    );
    setUser((prev) => ({
      ...prev,
      orbs: prev.orbs - bundle.priceOrbs,
      giftsSent: prev.giftsSent + 1,
      ...unlockBadgeHelper(prev, 'regalos'),
    }));
    showToastMsg(`¡Regalo enviado a ${recipientName}! Ya lo luce en su perfil`);
  };

  const handleLogStreamHour = () => {
    setUser((prev) => {
      const nextHours = prev.streamHours + 1;
      return {
        ...prev,
        streamHours: nextHours,
        ...(nextHours >= 1 ? unlockBadgeHelper(prev, 'transmision') : {}),
      };
    });
    showToastMsg('¡+1 hora transmitida! Progreso de Transmisión actualizado');
  };

  const handleLogGamePlayed = (gameName: string) => {
    setUser((prev) => {
      const nextGames = prev.gamesPlayedCount + 1;
      return {
        ...prev,
        gamesPlayedCount: nextGames,
        ...(nextGames >= 2 ? unlockBadgeHelper(prev, 'juegos') : {}),
      };
    });
    showToastMsg(`¡Partida registrada en ${gameName}!`);
  };

  const handleAdvanceAccountYear = () => {
    setUser((prev) => {
      const nextYears = prev.accountYears + 1;
      return {
        ...prev,
        accountYears: nextYears,
        ...(nextYears >= 1 ? unlockBadgeHelper(prev, 'antiguedad') : {}),
      };
    });
    showToastMsg('¡Aniversario de cuenta avanzado (+1 año)!');
  };

  const handleBuyBundle = (bundle: ShopBundle, useOrbs: boolean) => {
    if (ownedBundleIds.includes(bundle.id)) return;
    if (useOrbs) {
      if (user.orbs < bundle.priceOrbs) {
        showToastMsg('No tienes suficientes Orbs');
        return;
      }
      setUser((prev) => ({ ...prev, orbs: prev.orbs - bundle.priceOrbs }));
    }
    setOwnedBundleIds((prev) => [...prev, bundle.id]);
    const deco = bundle.items.find((i) => i.decorationId)?.decorationId;
    const plate = bundle.items.find((i) => i.nameplateId)?.nameplateId;
    const banner = bundle.items.find((i) => i.bannerUrl)?.bannerUrl;
    const effect = bundle.items.find((i) => i.profileEffectId)?.profileEffectId;
    if (deco || plate || banner || effect) {
      setUser((prev) => ({
        ...prev,
        ...(deco ? { decoration: deco } : {}),
        ...(plate ? { nameplate: plate } : {}),
        ...(banner ? { bannerImage: banner } : {}),
        ...(effect ? { profileEffect: effect } : {}),
      }));
    }
    showToastMsg(`¡${bundle.title} adquirido y equipado!`);
  };

  const handleEquipBundle = (bundle: ShopBundle) => {
    if (!ownedBundleIds.includes(bundle.id)) {
      showToastMsg('Compra este lote en la Tienda para equiparlo en tu perfil');
      return;
    }
    const deco = bundle.items.find((i) => i.decorationId)?.decorationId;
    const plate = bundle.items.find((i) => i.nameplateId)?.nameplateId;
    const banner = bundle.items.find((i) => i.bannerUrl)?.bannerUrl;
    const effect = bundle.items.find((i) => i.profileEffectId)?.profileEffectId;
    if (deco || plate || banner || effect) {
      setUser((prev) => ({
        ...prev,
        ...(deco ? { decoration: deco } : {}),
        ...(plate ? { nameplate: plate } : {}),
        ...(banner ? { bannerImage: banner } : {}),
        ...(effect ? { profileEffect: effect } : {}),
      }));
      showToastMsg(`Estilo, efecto y banner de ${bundle.title} aplicados en tu perfil`);
    }
  };

  const handleLoginAccount = (account: StoredAccount) => {
    const owned = account.ownedBundleIds || [];
    const safeUser = sanitizeUserShopCosmetics(
      {
        ...INITIAL_USER,
        ...account.user,
        orbs: normalizeOrbs(account.user.orbs),
      },
      owned,
      INITIAL_SHOP_BUNDLES
    );
    setActiveAccountId(account.id);
    setUser(safeUser);
    setOwnedBundleIds(owned);
    setWishlistIds(account.wishlistIds || []);
    setScreen('inicio');
    setMobileChatOpen(false);
    try {
      localStorage.setItem(SESSION_KEY, account.id);
    } catch {
      /* ignore */
    }
    showToastMsg(`¡Sesión iniciada como ${safeUser.displayName}!`);
  };

  const handleRegisterAccount = (payload: {
    contact: string;
    contactType: 'phone' | 'email';
    displayName: string;
    username: string;
    password: string;
    avatar: AvatarKey;
    twoFactorEnabled?: boolean;
    backupCodes?: string[];
  }) => {
    const newId = `acc-${Date.now()}`;
    const newUser: UserProfile = {
      id: `me-${Date.now()}`,
      displayName: payload.displayName,
      username: payload.username,
      ...(payload.contactType === 'email'
        ? { email: payload.contact }
        : { phone: payload.contact }),
      pronouns: '',
      status: 'online',
      customStatus: '',
      bio: '¡Nuevo en Primordial!',
      bannerColor: '#5865F2',
      avatar: payload.avatar,
      decoration: 'none',
      profileEffect: 'none',
      profileFrame: 'none',
      nameplate: 'none',
      orbs: 1200,
      memberSince: 'Nov 2026',
      note: '',
      nitroTier: 'none',
      unlockedBadgeIds: ['hypesquad'],
      equippedBadgeIds: ['hypesquad'],
      boostsGiven: 0,
      boostStreakMonths: 0,
      giftsSent: 0,
      streamHours: 0,
      gamesPlayedCount: 0,
      accountYears: 0,
    };
    const newAccount: StoredAccount = {
      id: newId,
      contact: payload.contact,
      password: payload.password,
      twoFactorEnabled: payload.twoFactorEnabled,
      backupCodes: payload.backupCodes,
      user: newUser,
      ownedBundleIds: [],
      wishlistIds: [],
    };
    setAccounts((prev) => [...prev, newAccount]);
    setActiveAccountId(newId);
    setUser(newUser);
    setOwnedBundleIds([]);
    setWishlistIds([]);
    setScreen('inicio');
    setMobileChatOpen(false);
    try {
      localStorage.setItem(SESSION_KEY, newId);
    } catch {
      /* ignore */
    }
    showToastMsg(`¡Bienvenido a Primordial, ${payload.displayName}! (+1.200 Orbs)`);
  };

  const handleResetAccountPassword = (accountId: string, newPassword: string) => {
    setAccounts((prev) =>
      prev.map((acc) => (acc.id === accountId ? { ...acc, password: newPassword } : acc))
    );
    showToastMsg('Contraseña actualizada de forma segura');
  };

  const handleLogout = () => {
    try {
      localStorage.removeItem(SESSION_KEY);
    } catch {
      /* ignore */
    }
    setActiveAccountId(null);
    setScreen('inicio');
    setMobileChatOpen(false);
  };

  const handleAddServer = (nameOrConfig: string | CreateServerPayload) => {
    const config: CreateServerPayload =
      typeof nameOrConfig === 'string'
        ? {
            name: nameOrConfig,
            templateId: 'custom',
            audience: 'community',
            accentColor: '#5865F2',
            chatTheme: 'black',
            chatMessageStyle: 'classic',
            includeBots: true,
            includeStarterRoles: true,
            includeVoiceChannels: true,
          }
        : nameOrConfig;

    const name = config.name;
    const lower = name.toLowerCase();
    const communityVisual = lower.includes('monopoly')
      ? {
          customIconUrl: GENERATED_ASSETS.monopolyBanner,
          bannerImage: GENERATED_ASSETS.monopolyBanner,
          accentColor: '#0284c7',
        }
      : lower.includes('zenith')
      ? {
          customIconUrl: GENERATED_ASSETS.zenithIcon,
          bannerImage: GENERATED_ASSETS.zenithBanner,
          accentColor: '#e52521',
        }
      : lower.includes('squad dev') || lower.includes('squad.dev')
      ? {
          customIconUrl: '/icon-512.png',
          bannerImage: GENERATED_ASSETS.zenithBanner,
          accentColor: '#5865F2',
        }
      : lower.includes('aldea')
      ? {
          customIconUrl: GENERATED_ASSETS.aldeaRoleplayIcon,
          bannerImage: GENERATED_ASSETS.viceCityBanner,
          accentColor: '#ec4899',
        }
      : lower.includes('dune')
      ? {
          customIconUrl: GENERATED_ASSETS.duneBanner,
          bannerImage: GENERATED_ASSETS.duneBanner,
          accentColor: '#b45309',
        }
      : lower.includes('zenless') || lower.includes('zzz')
      ? {
          customIconUrl: GENERATED_ASSETS.zzzEllenBanner,
          bannerImage: GENERATED_ASSETS.zzzEllenBanner,
          accentColor: '#06b6d4',
        }
      : {
          customIconUrl: config.customIconUrl,
          bannerImage: GENERATED_ASSETS.zenithBanner,
          accentColor: config.accentColor || '#5865F2',
        };

    const shortCode = name
      .split(' ')
      .map((w) => w[0])
      .join('')
      .slice(0, 3)
      .toUpperCase();

    const now = Date.now();
    const welcomeMessages: ChatMessage[] = config.includeBots
      ? [
          {
            id: `welcome-${now}`,
            authorId: 'welcomer',
            authorName: 'Welcomer',
            authorAvatar: 'welcomer',
            authorIsBot: true,
            timestamp: 'Ahora',
            content: `¡Bienvenido a tu nuevo servidor **${name}**! Usa \`/bump\` o crea encuestas para empezar.`,
            reactions: [{ emoji: '🎉', count: 1, reacted: true }],
          },
        ]
      : [
          {
            id: `welcome-${now}`,
            authorId: 'me',
            authorName: user.displayName,
            authorAvatar: user.avatar,
            timestamp: 'Ahora',
            content: `¡Servidor **${name}** creado!`,
            reactions: [],
          },
        ];

    const makeTextChannel = (chName: string, topic: string, type: Channel['type'] = 'text'): Channel => ({
      id: `ch-${now}-${chName}`,
      name: chName,
      type,
      category: 'CANALES DE TEXTO',
      topic,
      messages: chName === 'general' ? welcomeMessages : [],
    });

    const templateTextChannels: Channel[] = (() => {
      switch (config.templateId) {
        case 'friends':
          return [
            makeTextChannel('general', `Charla diaria en ${name}`),
            makeTextChannel('memes-y-fotos', 'Comparte clips, capturas y memes'),
            makeTextChannel('off-topic', 'Cualquier tema libre'),
          ];
        case 'gaming':
          return [
            makeTextChannel('general', `Centro de operaciones de ${name}`),
            makeTextChannel('buscar-equipo', 'Arma tu squad y coordina horarios'),
            makeTextChannel('clips', 'Mejores jugadas y momentos'),
            makeTextChannel('estrategia', 'Guías, builds y tácticas'),
          ];
        case 'community':
          return [
            makeTextChannel('anuncios', 'Novedades oficiales del servidor', 'announcement'),
            makeTextChannel('reglas', 'Normas de convivencia de la comunidad'),
            makeTextChannel('general', `Chat principal de ${name}`),
            makeTextChannel('sugerencias', 'Ideas para mejorar el servidor'),
          ];
        case 'study':
          return [
            makeTextChannel('general', `Organización de ${name}`),
            makeTextChannel('apuntes', 'Comparte resúmenes y material'),
            makeTextChannel('dudas', 'Resuelve ejercicios con el grupo'),
          ];
        case 'art':
          return [
            makeTextChannel('general', `Bienvenidos a ${name}`),
            makeTextChannel('galeria-arte', 'Muestra tus ilustraciones y diseños'),
            makeTextChannel('feedback', 'Crítica constructiva y consejos'),
            makeTextChannel('recursos', 'Pinceles, paletas y referencias'),
          ];
        default:
          return [makeTextChannel('general', `Bienvenido a ${name}`)];
      }
    })();

    const voiceNames =
      config.templateId === 'gaming'
        ? ['Lobby 1', 'Competitivo']
        : config.templateId === 'friends'
        ? ['Sala Chill']
        : config.templateId === 'community'
        ? ['Escenario', 'Charla General']
        : config.templateId === 'study'
        ? ['Sala Pomodoro', 'Biblioteca']
        : config.templateId === 'art'
        ? ['Mesa de Dibujo']
        : ['General'];

    const voiceChannels: Channel[] = config.includeVoiceChannels
      ? voiceNames.map((vName, idx) => ({
          id: `ch-${now}-voz-${idx}`,
          name: vName,
          type: 'voice',
          category: 'CANALES DE VOZ',
          voiceParticipants: [],
          messages: [],
        }))
      : [];

    const roles: ServerRole[] = config.includeStarterRoles
      ? [
          {
            id: 'role-owner',
            name: '👑 Owner',
            color: '#f59e0b',
            hoist: true,
            permissions: ['Administrador'],
          },
          {
            id: 'role-mod',
            name: '🛡️ Moderador',
            color: '#38bdf8',
            hoist: true,
            permissions: ['Gestionar mensajes', 'Fijar mensajes'],
          },
          {
            id: 'role-member',
            name: '🎮 Miembro',
            color: '#4ade80',
            hoist: false,
            permissions: ['Leer canales', 'Enviar mensajes'],
          },
          {
            id: 'role-everyone',
            name: '@everyone',
            color: '#b5bac1',
            hoist: false,
            permissions: ['Leer canales', 'Enviar mensajes'],
          },
        ]
      : [
          {
            id: 'role-owner',
            name: '👑 Owner',
            color: '#f59e0b',
            hoist: true,
            permissions: ['Administrador'],
          },
          {
            id: 'role-everyone',
            name: '@everyone',
            color: '#b5bac1',
            hoist: false,
            permissions: ['Leer canales', 'Enviar mensajes'],
          },
        ];

    const isSquadDevName =
      name.trim().toLowerCase() === 'squad dev' ||
      name.trim().toLowerCase() === 'squad.dev';

    const newSrv: Server = {
      id: `srv-${now}`,
      name,
      shortCode: shortCode || 'SR',
      hasUnread: false,
      iconStyle: 'custom',
      customIconUrl: communityVisual.customIconUrl,
      customEmoji: config.customEmoji,
      accentColor: communityVisual.accentColor,
      bannerColor: '#09090b',
      bannerImage: communityVisual.bannerImage,
      memberCount: isSquadDevName ? SQUAD_DEV_MEMBER_COUNT : config.includeBots ? 3 : 1,
      ...(isSquadDevName ? { memberCountDisplay: SQUAD_DEV_MEMBER_DISPLAY } : {}),
      onlineCount: config.includeBots ? 3 : 1,
      boostLevel: 0,
      boostCount: 0,
      unlockedPerkIds: [],
      communityEnabled: config.audience === 'community',
      showAllChannels: true,
      chatTheme: config.chatTheme,
      chatMessageStyle: config.chatMessageStyle,
      chatAccentColor: communityVisual.accentColor,
      categoriesOrder: config.includeVoiceChannels
        ? ['', 'CANALES DE TEXTO', 'CANALES DE VOZ']
        : ['', 'CANALES DE TEXTO'],
      roles,
      memberRoleIds: { me: ['role-owner'] },
      customEmojis: [],
      stickers: [],
      channels: [...templateTextChannels, ...voiceChannels],
    };
    setServers((prev) => [...prev, newSrv]);
    const initialCh =
      newSrv.channels.find((c) => !c.isPrivate && c.type !== 'voice' && c.name.includes('general')) ||
      newSrv.channels.find((c) => c.type !== 'voice') ||
      newSrv.channels[0];
    setActiveContext({ type: 'server', serverId: newSrv.id });
    setSelectedChannelId(initialCh?.id || null);
    setScreen('inicio');
    setMobileChatOpen(false);
    showToastMsg(`Servidor "${name}" creado con ${newSrv.channels.length} canales`);
  };

  const handleAddFriend = (
    username: string,
    opts?: { avatar?: AvatarKey; status?: PresenceStatus; initialGreeting?: string }
  ) => {
    const existing = dms.find((d) => d.name.toLowerCase() === username.toLowerCase());
    if (existing) {
      handleSelectDm(existing.id);
      return;
    }
    const lower = username.toLowerCase();
    const inferredAvatar: AvatarKey =
      opts?.avatar ||
      (lower.includes('carioca')
        ? 'carioca'
        : lower.includes('alex')
        ? 'alex'
        : lower.includes('snuf')
        ? 'snuf'
        : lower.includes('dev')
        ? 'dev'
        : lower.includes('joaw')
        ? 'joawasa'
        : 'jorge');

    const newThread: DirectMessageThread = {
      id: `dm-${Date.now()}`,
      name: username,
      username: username.toLowerCase().replace(/\s+/g, ''),
      avatar: inferredAvatar,
      status: opts?.status || 'online',
      lastMessagePreview: opts?.initialGreeting || `Conversación con ${username}`,
      lastTimestamp: 'Ahora',
      messages: [
        {
          id: `f-${Date.now()}`,
          authorId: `friend-${username.toLowerCase().replace(/\s+/g, '')}`,
          authorName: username,
          authorAvatar: inferredAvatar,
          timestamp: 'Ahora',
          content:
            opts?.initialGreeting ||
            `¡Hey ${user.displayName}! ¿Qué tal todo? Escríbeme por aquí cuando quieras 👋`,
          reactions: [],
        },
      ],
    };
    setDms((prev) => [newThread, ...prev]);
    handleSelectDm(newThread.id);
  };

  const renderDesktopWorkspace = () => {
    if (screen === 'tu') {
      return (
        <ProfileView
          user={user}
          servers={servers}
          unreadTotal={unreadTotal}
          wishlistIds={wishlistIds}
          ownedBundleIds={ownedBundleIds}
          shopBundles={INITIAL_SHOP_BUNDLES}
          hasUnclaimedQuests={hasUnclaimedQuests}
          profileViewTrigger={profileViewTrigger}
          initialEditorRequest={profileEditorRequest}
          onConsumeEditorRequest={() => setProfileEditorRequest(null)}
          onClose={() => setScreen('inicio')}
          onNavigate={(s) => setScreen(s)}
          onUpdateUser={(patch) =>
            setUser((prev) =>
              sanitizeUserShopCosmetics({ ...prev, ...patch }, ownedBundleIds, INITIAL_SHOP_BUNDLES)
            )
          }
          onOpenBundle={(b) => {
            setSelectedShopBundle(b);
            setScreen('tienda');
          }}
        />
      );
    }
    if (screen === 'misiones') {
      return (
        <QuestsView
          user={user}
          quests={quests}
          theme={theme}
          onBack={() => setScreen('inicio')}
          onClaimQuest={handleClaimQuest}
          onApplyViceCityTheme={() => {
            setTheme((t) => (t === 'vice-city' ? 'onyx' : 'vice-city'));
            showToastMsg(
              theme === 'vice-city' ? 'Tema Onyx restaurado' : 'Tema Vice City aplicado'
            );
          }}
          onOpenNitro={() => setScreen('nitro')}
          onJoinDuneServer={() => handleAddServer('Dune: Arrakis Hub')}
        />
      );
    }
    if (screen === 'tienda') {
      return (
        <ShopView
          user={user}
          bundles={INITIAL_SHOP_BUNDLES}
          dms={dms}
          wishlistIds={wishlistIds}
          ownedBundleIds={ownedBundleIds}
          selectedBundle={selectedShopBundle}
          onSelectBundle={setSelectedShopBundle}
          onToggleWishlist={(id) =>
            setWishlistIds((prev) =>
              prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
            )
          }
          onBuyBundle={handleBuyBundle}
          onEquipBundle={handleEquipBundle}
          onGiftBundle={handleGiftBundle}
          onBack={() => setScreen('inicio')}
        />
      );
    }
    if (screen === 'nitro') {
      return (
        <NitroView
          user={user}
          onBack={() => setScreen('inicio')}
          onSubscribe={(tier) => {
            setUser((prev) => ({
              ...prev,
              nitroTier: tier,
              ...unlockBadgeHelper(prev, 'nitro'),
            }));
            showToastMsg(
              tier === 'nitro'
                ? '¡Discord Nitro activado e insignia Nitro desbloqueada!'
                : '¡Discord Nitro Basic activado e insignia Nitro desbloqueada!'
            );
            setScreen('tu');
          }}
        />
      );
    }
    if (screen === 'insignias') {
      return (
        <BadgesView
          user={user}
          onBack={() => setScreen('tu')}
          onUpdateUser={(patch) => setUser((prev) => ({ ...prev, ...patch }))}
          onOpenServerBoost={() => {
            setBoostTargetServerId(null);
            setScreen('mejoras');
          }}
          onOpenShop={() => setScreen('tienda')}
          onOpenNitro={() => setScreen('nitro')}
          onOpenQuests={() => setScreen('misiones')}
          onLogStreamHour={handleLogStreamHour}
          onLogGamePlayed={handleLogGamePlayed}
          onAdvanceAccountYear={handleAdvanceAccountYear}
        />
      );
    }
    if (screen === 'mejoras') {
      return (
        <ServerBoostView
          servers={servers}
          user={user}
          initialServerId={boostTargetServerId}
          onBack={() => {
            setBoostTargetServerId(null);
            setScreen('tu');
          }}
          onBoostServer={handleBoostServer}
          onUnlockServerPerk={handleUnlockServerPerk}
          onOpenNitro={() => setScreen('nitro')}
        />
      );
    }
    if (screen === 'ajustes') {
      return (
        <SettingsView
          user={user}
          theme={theme}
          onChangeTheme={setTheme}
          onBack={() => setScreen('tu')}
          onOpenNitro={() => setScreen('nitro')}
          onOpenShop={() => setScreen('tienda')}
          onOpenQuests={() => setScreen('misiones')}
          onOpenServerBoost={() => {
            setBoostTargetServerId(null);
            setScreen('mejoras');
          }}
          onOpenBadges={() => setScreen('insignias')}
          onLogout={handleLogout}
        />
      );
    }
    if (screen === 'amigos') {
      return (
        <FriendsView
          dms={dms}
          onBack={() => setScreen('inicio')}
          onOpenDm={handleSelectDm}
          onAddFriend={handleAddFriend}
          onInspectUser={handleInspectUser}
        />
      );
    }
    if (screen === 'notificaciones') {
      return (
        <NotificationsView
          notifications={notifications}
          onMarkAllRead={() =>
            setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })))
          }
          onClickNotification={(n) => {
            setNotifications((prev) =>
              prev.map((item) => (item.id === n.id ? { ...item, unread: false } : item))
            );
            if (n.type === 'quest') {
              setScreen('misiones');
            } else if (n.type === 'system') {
              setScreen('nitro');
            } else if (n.targetServerId && n.targetChannelId) {
              handleSelectChannel(n.targetServerId, n.targetChannelId);
            } else if (n.targetDmId) {
              const targetExists = dms.some((d) => d.id === n.targetDmId);
              if (targetExists) {
                handleSelectDm(n.targetDmId);
              } else {
                handleAddFriend(n.title.split(' ')[0] || 'Jorge', { avatar: n.avatar });
              }
            } else {
              setScreen('amigos');
            }
          }}
        />
      );
    }

    if (screen === 'servidor-ajustes' && serverSettingsTarget) {
      const srv = servers.find((s) => s.id === serverSettingsTarget.serverId) || servers[0];
      if (srv) {
        return (
          <ServerSettingsView
            key={`${srv.id}-${serverSettingsTarget.section}`}
            server={srv}
            user={user}
            initialSection={serverSettingsTarget.section}
            onBack={() => setScreen('inicio')}
            onUpdateServer={handleUpdateServer}
            onAddChannel={handleAddChannel}
            onUpdateChannel={handleUpdateChannel}
            onDeleteChannel={handleDeleteChannel}
            onMoveChannel={handleMoveChannel}
            onAddCategory={handleAddCategory}
            onRenameCategory={handleRenameCategory}
            onDeleteCategory={handleDeleteCategory}
            onMoveCategory={handleMoveCategory}
            onOpenServerBoost={(serverId) => {
              setBoostTargetServerId(serverId);
              setScreen('mejoras');
            }}
            onLeaveServer={(serverId) => {
              const targetName = servers.find((s) => s.id === serverId)?.name || 'el servidor';
              setServers((prev) => prev.filter((s) => s.id !== serverId));
              setActiveContext({ type: 'dm' });
              setSelectedChannelId(null);
              setScreen('inicio');
              showToastMsg(`Has salido de ${targetName}`);
            }}
            onNotify={showToastMsg}
          />
        );
      }
    }

    if (
      ((activeContext.type === 'dm' ||
        activeContext.type === 'favorites' ||
        activeContext.type === 'servidores') &&
        !activeDm) ||
      (activeContext.type === 'server' && !activeServer)
    ) {
      return (
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center bg-[var(--dc-bg-chat)] text-[var(--dc-text-primary)]">
          <div className="max-w-md w-full space-y-5">
            <div className="flex justify-center">
              <PrimordialAppIcon className="w-20 h-20 rounded-3xl shadow-2xl border border-white/15" />
            </div>
            <div className="space-y-1.5">
              <h2 className="font-display font-extrabold text-2xl tracking-tight">
                Bienvenido a Primordial
              </h2>
              <p className="text-sm text-[var(--dc-text-secondary)]">
                Tu espacio empieza limpio: busca a tus amigos para chatear o crea y explora servidores a tu manera.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
              <button
                type="button"
                onClick={() => setScreen('amigos')}
                className="px-4 py-3 rounded-2xl dc-btn-primary text-xs font-bold flex items-center justify-center gap-2 cursor-pointer"
              >
                <Search className="w-4 h-4 shrink-0" />
                <span>Buscar amigos</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setCreateServerTemplate('friends');
                  setShowCreateServer(true);
                }}
                className="px-4 py-3 rounded-2xl dc-btn-secondary text-xs font-bold flex items-center justify-center gap-2 cursor-pointer"
              >
                <Plus className="w-4 h-4 shrink-0" />
                <span>Crear servidor</span>
              </button>
              <button
                type="button"
                onClick={() => setShowDiscover(true)}
                className="px-4 py-3 rounded-2xl dc-btn-success text-xs font-bold flex items-center justify-center gap-2 cursor-pointer"
              >
                <Compass className="w-4 h-4 shrink-0" />
                <span>Buscar servidores</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    const activeTypingKey =
      activeContext.type === 'server'
        ? selectedChannelId || ''
        : activeDm?.id || '';

    return (
      <ChatView
        mode={activeContext.type === 'server' ? 'channel' : 'dm'}
        dm={activeDm}
        server={activeServer}
        channelId={selectedChannelId || undefined}
        currentUser={user}
        dms={dms}
        allServers={servers}
        typingLabel={activeTypingKey ? typingMap[activeTypingKey] || null : null}
        onBackMobile={() => setMobileChatOpen(false)}
        onSendMessage={handleSendMessage}
        onSendRichMessage={handleSendRichMessage}
        onEditMessage={handleEditMessage}
        onDeleteMessage={handleDeleteMessage}
        onTogglePinMessage={handleTogglePinMessage}
        onVotePoll={handleVotePoll}
        onForwardMessage={handleForwardMessage}
        onToggleDmFavorite={() => activeDm && handleToggleDmFavorite(activeDm.id)}
        onToggleDmMute={() => activeDm && handleToggleDmMute(activeDm.id)}
        onToggleReaction={handleToggleReaction}
        onStartCall={(video) =>
          setVoiceSession({
            active: true,
            callNonce: Date.now(),
            channelName:
              activeContext.type === 'server' ? 'Canal de voz' : activeDm?.name || 'Llamada',
            contextName:
              activeContext.type === 'server' ? activeServer?.name || '' : 'Mensaje directo',
            muted: false,
            deafened: false,
            videoOn: video,
            screenSharing: false,
            connectedSeconds: 0,
            participants: activeDm
              ? [{ id: activeDm.id, name: activeDm.name, avatar: activeDm.avatar, speaking: true }]
              : [
                  { id: 'snuf', name: 'snuf', avatar: 'snuf', speaking: true },
                  { id: 'jorge', name: 'Jorge', avatar: 'jorge', muted: false },
                ],
          })
        }
        onJoinInviteServer={(url) =>
          handleAddServer(url.includes('ut29') ? 'TNU Invited' : 'Zenith Invited')
        }
        onOpenNitro={() => setScreen('nitro')}
        onOpenServerSettings={handleOpenServerSettings}
        onInspectUser={handleInspectUser}
      />
    );
  };

  const isMobileOverlayScreen = [
    'tu',
    'misiones',
    'tienda',
    'nitro',
    'ajustes',
    'amigos',
    'insignias',
    'mejoras',
    'servidor-ajustes',
  ].includes(screen);

  if (!activeAccountId) {
    return (
      <AuthView
        accounts={accounts}
        onLoginAccount={handleLoginAccount}
        onRegisterAccount={handleRegisterAccount}
        onResetPassword={handleResetAccountPassword}
      />
    );
  }

  return (
    <MotionConfig reducedMotion="user">
    <div
      className={`w-screen h-screen flex flex-col bg-[var(--dc-bg-rail)] text-[var(--dc-text-primary)] overflow-hidden ${themeClass}`}
    >
      {toast && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[70] px-4 py-2 rounded-full bg-[#23a55a] text-white text-xs font-bold shadow-2xl pointer-events-none">
          {toast}
        </div>
      )}

      <div className="flex-1 flex min-h-0 overflow-hidden">
        {/* Left Server Rail + Sidebar */}
        <div
          className={`flex h-full min-h-0 shrink-0 ${
            isMobileOverlayScreen || mobileChatOpen
              ? 'hidden md:flex'
              : 'flex w-full md:w-[360px] lg:w-[376px]'
          }`}
        >
          <ServerRail
            servers={servers}
            activeContext={activeContext}
            onSelectDm={() => {
              setActiveContext({ type: 'dm' });
              setScreen('inicio');
              setMobileChatOpen(false);
            }}
            onSelectFavorites={() => {
              setActiveContext({ type: 'favorites' });
              setScreen('inicio');
              setMobileChatOpen(false);
            }}
            onSelectServer={handleSelectServer}
            onOpenBotDm={() => handleSelectDm('dm-bumper')}
            onOpenAddServer={() => {
              setCreateServerTemplate('friends');
              setShowCreateServer(true);
            }}
            onOpenDiscover={() => setShowDiscover(true)}
          />

          <div className="flex-1 flex flex-col min-w-0 min-h-0">
            <AnimatePresence mode="wait" initial={false}>
              {screen === 'notificaciones' ? (
                <motion.div
                  key="mobile-notifs"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.16, ease: 'easeOut' }}
                  className="flex-1 md:hidden flex flex-col min-h-0"
                >
                  <NotificationsView
                    notifications={notifications}
                    onMarkAllRead={() =>
                      setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })))
                    }
                    onClickNotification={(n) => {
                      setNotifications((prev) =>
                        prev.map((item) => (item.id === n.id ? { ...item, unread: false } : item))
                      );
                      if (n.type === 'quest') {
                        setScreen('misiones');
                      } else if (n.type === 'system') {
                        setScreen('nitro');
                      } else if (n.targetServerId && n.targetChannelId) {
                        handleSelectChannel(n.targetServerId, n.targetChannelId);
                      } else if (n.targetDmId) {
                        const targetExists = dms.some((d) => d.id === n.targetDmId);
                        if (targetExists) {
                          handleSelectDm(n.targetDmId);
                        } else {
                          handleAddFriend(n.title.split(' ')[0] || 'Jorge', { avatar: n.avatar });
                        }
                      } else {
                        setScreen('amigos');
                      }
                    }}
                  />
                </motion.div>
              ) : null}
            </AnimatePresence>

            <div
              className={`flex-1 flex flex-col min-h-0 ${
                screen === 'notificaciones' ? 'hidden md:flex' : 'flex'
              }`}
            >
              <MessagesPanel
                dms={dms}
                activities={INITIAL_ACTIVITIES}
                servers={servers}
                activeContext={activeContext}
                selectedDmId={selectedDmId}
                selectedChannelId={selectedChannelId}
                voiceSession={voiceSession}
                currentUser={user}
                typingDmIds={typingMap}
                onSelectDm={handleSelectDm}
                onSelectChannel={handleSelectChannel}
                onJoinVoice={(_srvId, _chId, chName, srvName) => {
                  setVoiceSession({
                    active: true,
                    callNonce: Date.now(),
                    channelName: chName,
                    contextName: srvName,
                    muted: false,
                    deafened: false,
                    videoOn: false,
                    screenSharing: false,
                    connectedSeconds: 0,
                    participants: [
                      { id: 'jorge', name: 'Jorge', avatar: 'jorge', speaking: true },
                      { id: 'alex', name: '-/alex_rawr\\-', avatar: 'alex', muted: true },
                    ],
                  });
                }}
                onOpenFriends={() => setScreen('amigos')}
                onOpenNewGroupDm={() => {
                  setGroupMemberIds([]);
                  setGroupTitle('');
                  setGroupEmoji('💬');
                  setGroupColor('#5865F2');
                  setGroupCustomIconUrl(undefined);
                  setShowNewGroupDm(true);
                }}
                onSelectActivity={(act) =>
                  handleAddFriend(act.displayName, {
                    avatar: act.avatar,
                    status: act.status,
                    initialGreeting: act.gameTitle
                      ? `¡Hola ${user.displayName}! Estoy jugando ${act.gameTitle} 🎮 ¿te unes?`
                      : `¡Buenas ${user.displayName}! Aquí ando conectado, dime qué pasa.`,
                  })
                }
                onOpenCreateServerModal={(tpl) => {
                  setCreateServerTemplate(tpl || 'friends');
                  setShowCreateServer(true);
                }}
                onJoinCommunity={(name) => handleAddServer(name)}
                onOpenServerBoost={(serverId) => {
                  setBoostTargetServerId(serverId);
                  setScreen('mejoras');
                }}
                onOpenServerSettings={handleOpenServerSettings}
                onMarkServerRead={handleMarkServerRead}
                onUpdateServer={handleUpdateServer}
                onOpenProfile={(serverId) => {
                  if (serverId) {
                    setProfileEditorRequest({ tab: 'servidor', serverId });
                  }
                  setProfileViewTrigger((k) => k + 1);
                  setScreen('tu');
                }}
                onInspectUser={handleInspectUser}
                onToggleDmPin={handleToggleDmPin}
                onToggleDmMute={handleToggleDmMute}
                onToggleDmUnread={handleToggleDmUnread}
                onToggleDmFavorite={handleToggleDmFavorite}
                onCloseDm={handleCloseDm}
                onNotify={showToastMsg}
              />
            </div>

            <VoiceOverlay
              voice={voiceSession}
              currentUser={user}
              onToggleMute={() => setVoiceSession((v) => ({ ...v, muted: !v.muted }))}
              onToggleDeafen={() => setVoiceSession((v) => ({ ...v, deafened: !v.deafened }))}
              onToggleVideo={() => setVoiceSession((v) => ({ ...v, videoOn: !v.videoOn }))}
              onToggleScreen={() => {
                if (!voiceSession.screenSharing) {
                  handleLogStreamHour();
                }
                setVoiceSession((v) => ({ ...v, screenSharing: !v.screenSharing }));
              }}
              onDisconnect={() => setVoiceSession((v) => ({ ...v, active: false }))}
            />

            {/* Mobile Bottom Primary Tabs — 3 Clean Centered Tabs */}
            <nav
              aria-label="Navegación principal móvil"
              className="md:hidden bg-[var(--dc-bg-rail)] border-t border-[var(--dc-border)] h-[60px] shrink-0 flex items-center justify-center px-3"
            >
              <div className="grid grid-cols-3 w-full max-w-md mx-auto h-full">
                <button
                  onClick={() => {
                    setScreen('inicio');
                    setMobileChatOpen(false);
                  }}
                  className={`flex flex-col items-center justify-center gap-0.5 text-[11px] font-semibold transition-colors cursor-pointer ${
                    screen === 'inicio'
                      ? 'text-[var(--dc-text-primary)]'
                      : 'text-[var(--dc-text-muted)] hover:text-[var(--dc-text-secondary)]'
                  }`}
                >
                  <Home className={`w-5 h-5 ${screen === 'inicio' ? 'text-[#5865F2]' : ''}`} />
                  <span>Inicio</span>
                </button>

                <button
                  onClick={() => {
                    setScreen('notificaciones');
                    setMobileChatOpen(false);
                  }}
                  className={`flex flex-col items-center justify-center gap-0.5 text-[11px] font-semibold transition-colors cursor-pointer relative ${
                    screen === 'notificaciones'
                      ? 'text-[var(--dc-text-primary)]'
                      : 'text-[var(--dc-text-muted)] hover:text-[var(--dc-text-secondary)]'
                  }`}
                >
                  <div className="relative">
                    <Bell className={`w-5 h-5 ${screen === 'notificaciones' ? 'text-[#5865F2]' : ''}`} />
                    {unreadNotificationsCount > 0 && (
                      <span className="absolute -top-1 -right-1.5 min-w-[16px] h-[16px] px-1 rounded-full bg-[#da373c] text-white text-[9.5px] font-bold tabular-nums flex items-center justify-center border-2 border-[var(--dc-bg-rail)] leading-none">
                        {unreadNotificationsCount}
                      </span>
                    )}
                  </div>
                  <span>Notificaciones</span>
                </button>

                <button
                  onClick={() => {
                    setProfileViewTrigger((k) => k + 1);
                    setScreen('tu');
                  }}
                  className={`flex flex-col items-center justify-center gap-0.5 text-[11px] font-semibold transition-colors cursor-pointer ${
                    screen === 'tu'
                      ? 'text-[var(--dc-text-primary)]'
                      : 'text-[var(--dc-text-muted)] hover:text-[var(--dc-text-secondary)]'
                  }`}
                >
                  <div
                    className={`rounded-full p-[1.5px] transition-all ${
                      screen === 'tu' ? 'ring-2 ring-[#5865F2]' : ''
                    }`}
                  >
                    <UserAvatar
                      avatar={user.avatar}
                      customAvatarUrl={user.customAvatarUrl}
                      status={user.status}
                      size="xs"
                      borderColor="var(--dc-bg-rail)"
                      showStatus={true}
                    />
                  </div>
                  <span>Tú</span>
                </button>
              </div>
            </nav>
          </div>
        </div>

        {/* Right Desktop Workspace + Mobile Fullscreen Subviews */}
        <main
          className={`flex-1 flex flex-col min-w-0 min-h-0 ${
            isMobileOverlayScreen || mobileChatOpen ? 'flex' : 'hidden md:flex'
          }`}
        >
          {/* Desktop Top Quick Switcher Bar */}
          <div className="hidden md:flex h-11 px-4 bg-[var(--dc-bg-rail)] border-b border-[var(--dc-border)] items-center justify-between gap-4 shrink-0">
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
              {[
                { id: 'inicio' as const, label: 'Chat', icon: Home },
                { id: 'notificaciones' as const, label: 'Notificaciones', icon: Bell },
                { id: 'amigos' as const, label: 'Amigos', icon: UserPlus },
                { id: 'misiones' as const, label: 'Misiones', icon: LaurelQuestIcon },
                { id: 'tienda' as const, label: 'Tienda', icon: Store },
                { id: 'insignias' as const, label: 'Insignias', icon: Award },
                { id: 'mejoras' as const, label: 'Mejoras', icon: BoostGemIcon },
                { id: 'nitro' as const, label: 'Nitro', icon: NitroWheelIcon },
                { id: 'ajustes' as const, label: 'Ajustes', icon: Settings },
                { id: 'tu' as const, label: 'Mi Perfil (Tú)', icon: null },
              ].map((item) => {
                const Icon = item.icon;
                const active = screen === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      if (item.id === 'mejoras') setBoostTargetServerId(null);
                      if (item.id === 'tu') setProfileViewTrigger((k) => k + 1);
                      setScreen(item.id);
                    }}
                    className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap cursor-pointer ${
                      active
                        ? 'dc-btn-primary'
                        : 'text-[var(--dc-text-secondary)] hover:bg-black/5 dark:hover:bg-white/10 hover:text-[var(--dc-text-primary)] transition-colors'
                    }`}
                  >
                    {Icon && <Icon className="w-3.5 h-3.5" />}
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <PWAInstallButton variant="compact" />
              <button
                onClick={() => setTheme((t) => (t === 'light' ? 'onyx' : 'light'))}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full dc-btn-secondary text-xs font-semibold cursor-pointer"
              >
                {theme === 'light' ? <Moon className="w-3.5 h-3.5" /> : <Sun className="w-3.5 h-3.5" />}
                <span>{theme === 'light' ? 'Onyx' : 'Claro'}</span>
              </button>
              <button
                onClick={() => setScreen('misiones')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full dc-btn-secondary text-xs font-bold tabular-nums cursor-pointer"
              >
                <OrbsCrystalIcon className="w-3.5 h-3.5 text-indigo-400" />
                <span>{user.orbs.toLocaleString('es-ES')} Orbs</span>
              </button>
            </div>
          </div>

          <div className="flex-1 flex min-h-0 overflow-hidden">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={`${screen}-${activeContext.type}-${activeContext.type === 'server' ? activeContext.serverId : ''}-${selectedDmId || ''}-${selectedChannelId || ''}`}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.16, ease: 'easeOut' }}
                className="flex-1 flex min-h-0 overflow-hidden"
              >
                {renderDesktopWorkspace()}
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>

      <CreateServerModal
        open={showCreateServer}
        initialTemplate={createServerTemplate}
        onClose={() => setShowCreateServer(false)}
        onCreate={handleAddServer}
      />

      <DiscoverModal
        open={showDiscover}
        onClose={() => setShowDiscover(false)}
        onJoinCommunity={(name) => handleAddServer(name)}
      />

      {showNewGroupDm && (
        <div
          onClick={() => setShowNewGroupDm(false)}
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <input
            ref={groupIconFileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) {
                const reader = new FileReader();
                reader.onload = () => {
                  if (typeof reader.result === 'string') {
                    setGroupCustomIconUrl(reader.result);
                  }
                };
                reader.readAsDataURL(f);
              }
              e.target.value = '';
            }}
          />
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md rounded-3xl bg-[var(--dc-bg-sheet)] border border-[var(--dc-border)] p-5 space-y-3.5 max-h-[90vh] overflow-y-auto shadow-2xl"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-display font-bold text-lg text-[var(--dc-text-primary)]">
                  Nuevo mensaje o grupo
                </h3>
                <p className="text-[11px] text-[var(--dc-text-muted)]">
                  Toca 1 amigo para chatear o selecciona varios para crear un grupo con nombre e icono
                </p>
              </div>
              <button
                onClick={() => setShowNewGroupDm(false)}
                className="p-1 text-[var(--dc-text-muted)] hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Custom Group Name & Icon Editor */}
            <div className="rounded-2xl bg-[var(--dc-bg-card)] border border-[var(--dc-border)] p-3 space-y-2.5">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => groupIconFileRef.current?.click()}
                  title="Subir icono del grupo"
                  className="w-12 h-12 rounded-full overflow-hidden flex items-center justify-center text-xl border border-white/15 shrink-0 cursor-pointer relative group"
                  style={
                    groupCustomIconUrl
                      ? undefined
                      : { background: `linear-gradient(135deg, ${groupColor} 0%, #11121a 100%)` }
                  }
                >
                  {groupCustomIconUrl ? (
                    <img src={groupCustomIconUrl} alt="Icono grupo" className="w-full h-full object-cover" />
                  ) : (
                    <span>{groupEmoji}</span>
                  )}
                </button>
                <div className="flex-1 min-w-0 space-y-1.5">
                  <input
                    type="text"
                    value={groupTitle}
                    onChange={(e) => setGroupTitle(e.target.value)}
                    placeholder="Nombre del grupo (ej. Squad Dev)"
                    className="w-full bg-[var(--dc-bg-input)] border border-[var(--dc-border)] rounded-xl px-3 py-2 text-xs text-[var(--dc-text-primary)] focus:outline-none focus:border-[#5865F2]"
                  />
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => groupIconFileRef.current?.click()}
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-[#7b85ff] hover:text-white cursor-pointer"
                    >
                      <Upload className="w-3 h-3" />
                      <span>{groupCustomIconUrl ? 'Cambiar foto' : 'Subir icono'}</span>
                    </button>
                    {groupCustomIconUrl && (
                      <button
                        type="button"
                        onClick={() => setGroupCustomIconUrl(undefined)}
                        className="text-[11px] text-zinc-400 hover:text-white cursor-pointer"
                      >
                        Usar emoji
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {!groupCustomIconUrl && (
                <div className="flex items-center justify-between gap-2 flex-wrap pt-1">
                  <div className="flex items-center gap-1.5">
                    {['#5865F2', '#23a55a', '#ec4899', '#f59e0b', '#06b6d4', '#9333ea'].map((c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => setGroupColor(c)}
                        className={`w-5 h-5 rounded-full cursor-pointer ${
                          groupColor === c ? 'ring-2 ring-white scale-110' : 'opacity-80'
                        }`}
                        style={{ backgroundColor: c }}
                      />
                    ))}
                  </div>
                  <div className="flex items-center gap-1">
                    {['💬', '🎮', '🔥', '⚡', '🚀', '👑', '🎧'].map((em) => (
                      <button
                        key={em}
                        type="button"
                        onClick={() => setGroupEmoji(em)}
                        className={`w-6 h-6 rounded-md text-xs flex items-center justify-center cursor-pointer ${
                          groupEmoji === em ? 'bg-[#5865F2] text-white' : 'hover:bg-white/10'
                        }`}
                      >
                        {em}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-1.5 max-h-56 overflow-y-auto">
              {dms.filter((d) => !d.isGroup).length === 0 ? (
                <div className="rounded-2xl bg-[var(--dc-bg-card)] border border-[var(--dc-border)] p-5 text-center space-y-2.5">
                  <p className="text-xs text-[var(--dc-text-secondary)]">
                    Primero busca y añade amigos para poder crear chats grupales.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setShowNewGroupDm(false);
                      setScreen('amigos');
                    }}
                    className="px-4 py-2 rounded-full dc-btn-primary text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer"
                  >
                    <UserPlus className="w-3.5 h-3.5" />
                    <span>Buscar amigos</span>
                  </button>
                </div>
              ) : (
                dms
                  .filter((d) => !d.isGroup)
                  .map((d) => {
                    const checked = groupMemberIds.includes(d.id);
                    return (
                      <div
                        key={d.id}
                        className={`w-full flex items-center justify-between gap-2 p-2 rounded-xl transition-colors ${
                          checked
                            ? 'bg-[#5865F2]/20 border border-[#5865F2]/50'
                            : 'hover:bg-black/5 dark:hover:bg-white/10'
                        }`}
                      >
                        <button
                          type="button"
                          onClick={() => {
                            if (groupMemberIds.length === 0 && !groupTitle.trim() && !groupCustomIconUrl) {
                              handleSelectDm(d.id);
                              setShowNewGroupDm(false);
                            } else {
                              setGroupMemberIds((prev) =>
                                prev.includes(d.id)
                                  ? prev.filter((id) => id !== d.id)
                                  : [...prev, d.id]
                              );
                            }
                          }}
                          className="flex-1 flex items-center gap-3 text-left min-w-0 cursor-pointer"
                        >
                          <UserAvatar
                            avatar={d.avatar}
                            status={d.status}
                            size="sm"
                            borderColor="var(--dc-bg-sheet)"
                          />
                          <span className="text-sm font-semibold text-[var(--dc-text-primary)] truncate">
                            {d.name}
                          </span>
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            setGroupMemberIds((prev) =>
                              prev.includes(d.id)
                                ? prev.filter((id) => id !== d.id)
                                : [...prev, d.id]
                            )
                          }
                          className={`px-2.5 py-1 rounded-full text-[11px] font-bold cursor-pointer ${
                            checked
                              ? 'bg-[#5865F2] text-white'
                              : 'bg-white/10 text-zinc-300 hover:bg-white/20'
                          }`}
                        >
                          {checked ? 'Añadido' : '+ Grupo'}
                        </button>
                      </div>
                    );
                  })
              )}
            </div>

            {groupMemberIds.length >= 1 && (
              <button
                type="button"
                onClick={() => {
                  const members = dms.filter((d) => groupMemberIds.includes(d.id));
                  if (members.length < 1) return;
                  const finalName =
                    groupTitle.trim() || members.map((m) => m.name).join(', ').slice(0, 32);
                  const newGroup: DirectMessageThread = {
                    id: `dm-grp-${Date.now()}`,
                    name: finalName,
                    avatar: members[0].avatar,
                    secondaryAvatar: members[1]?.avatar,
                    customIconUrl: groupCustomIconUrl,
                    groupEmoji: groupCustomIconUrl ? undefined : groupEmoji,
                    groupColor,
                    isGroup: true,
                    status: 'online',
                    lastMessagePreview: `Grupo creado con ${members.length} ${members.length === 1 ? 'persona' : 'personas'}`,
                    lastTimestamp: 'Ahora',
                    messages: [
                      {
                        id: `grp-init-${Date.now()}`,
                        authorId: 'me',
                        authorName: user.displayName,
                        authorAvatar: user.avatar,
                        timestamp: 'Ahora',
                        content: `Creaste el grupo **${finalName}** con ${members.map((m) => `@${m.name}`).join(', ')}.`,
                        reactions: [{ emoji: '🎉', count: 1, reacted: true }],
                      },
                    ],
                  };
                  setDms((prev) => [newGroup, ...prev]);
                  setShowNewGroupDm(false);
                  handleSelectDm(newGroup.id);
                  showToastMsg(`Grupo "${finalName}" creado`);
                }}
                className="w-full h-10 rounded-full dc-btn-primary text-xs font-bold cursor-pointer"
              >
                Crear grupo ({groupMemberIds.length}{' '}
                {groupMemberIds.length === 1 ? 'persona' : 'personas'})
              </button>
            )}
          </div>
        </div>
      )}

      {selectedActivity && (
        <div
          onClick={() => setSelectedActivity(null)}
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm rounded-3xl bg-[var(--dc-bg-sheet)] border border-[var(--dc-border)] p-5 space-y-4"
          >
            <div className="flex items-center gap-3">
              <UserAvatar
                avatar={selectedActivity.avatar}
                status={selectedActivity.status}
                size="lg"
                borderColor="var(--dc-bg-sheet)"
              />
              <div>
                <h3 className="font-display font-bold text-lg text-[var(--dc-text-primary)]">
                  {selectedActivity.displayName}
                </h3>
                <p className="text-xs text-[#23a55a] font-semibold">
                  {selectedActivity.gameTitle
                    ? `Jugando a ${selectedActivity.gameTitle}`
                    : 'No molestar'}
                </p>
                {selectedActivity.elapsed && (
                  <p className="text-[11px] text-[var(--dc-text-muted)]">
                    Hace {selectedActivity.elapsed}
                  </p>
                )}
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  const name = selectedActivity.displayName;
                  setSelectedActivity(null);
                  handleAddFriend(name);
                }}
                className="flex-1 h-11 rounded-full dc-btn-primary text-sm font-bold cursor-pointer"
              >
                Enviar mensaje
              </button>
              <button
                onClick={() => setSelectedActivity(null)}
                className="px-5 h-11 rounded-full dc-btn-secondary text-sm font-semibold cursor-pointer"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      <UserProfileModal
        profile={inspectedUser?.profile || null}
        isSelf={inspectedUser?.profile.id === 'me'}
        isFriend={
          inspectedUser
            ? dms.some(
                (d) =>
                  d.id === inspectedUser.profile.id ||
                  d.id === `dm-${inspectedUser.profile.id}` ||
                  d.name.toLowerCase() === inspectedUser.profile.displayName.toLowerCase()
              )
            : false
        }
        serverRoles={inspectedUser?.roles || []}
        onClose={() => setInspectedUser(null)}
        onOpenSelfFullProfile={() => {
          setProfileViewTrigger((k) => k + 1);
          setScreen('tu');
        }}
        onSendMessage={(prof) => {
          const existing = dms.find(
            (d) =>
              d.id === prof.id ||
              d.id === `dm-${prof.id}` ||
              d.name.toLowerCase() === prof.displayName.toLowerCase()
          );
          if (existing) {
            handleSelectDm(existing.id);
          } else {
            handleAddFriend(prof.displayName);
          }
        }}
        onStartCall={(prof, video) =>
          setVoiceSession({
            active: true,
            callNonce: Date.now(),
            channelName: prof.displayName,
            contextName: 'Mensaje directo',
            muted: false,
            deafened: false,
            videoOn: video,
            screenSharing: false,
            connectedSeconds: 0,
            participants: [
              { id: prof.id, name: prof.displayName, avatar: prof.avatar, speaking: true },
            ],
          })
        }
        onToggleFriend={(prof) => {
          const existing = dms.find(
            (d) =>
              d.id === prof.id ||
              d.id === `dm-${prof.id}` ||
              d.name.toLowerCase() === prof.displayName.toLowerCase()
          );
          if (existing) {
            showToastMsg(`${prof.displayName} ya está en tu lista de chats/amigos`);
          } else {
            handleAddFriend(prof.displayName, { avatar: prof.avatar, status: prof.status });
            showToastMsg(`¡${prof.displayName} añadido como amigo!`);
          }
        }}
      />
      <OfflineIndicator />
    </div>
    </MotionConfig>
  );
}
