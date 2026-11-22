import React, { useEffect, useRef, useState } from 'react';
import { AtSign, Award, ArrowLeft, Bell, Check, CheckCheck, ChevronRight, Clapperboard, Clock, Gamepad2, Globe, Headphones, HeadphoneOff, HelpCircle, Info, Link2, LogOut, MessageSquare, MessageSquareMore, Mic, MicOff, Monitor, Palette, PhoneCall, PhoneOff, QrCode, Search, Settings, Shield, Smartphone, Sparkles, Store, Upload, User, UserCheck, UserPlus, Users, Video, VideoOff, X } from 'lucide-react';
import {
  CreateServerPayload,
  DirectMessageThread,
  NotificationItem,
  PublicUserProfile,
  ServerTemplateId,
  ThemeMode,
  UserProfile,
  VoiceSession,
} from '../types/discord';
import {
  LaurelQuestIcon,
  NitroWheelIcon,
  OrbsCrystalIcon,
  PrimordialAppIcon,
  SafeImage,
  UserAvatar,
} from './DiscordArt';
import { DISCOVERABLE_COMMUNITIES, FRIEND_DIRECTORY } from '../data/discordData';
import { BoostGemIcon } from './ServerBoostView';
import { PWAInstallButton } from './PWAPrompts';

const PrimordialRowIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <PrimordialAppIcon className={`${className} rounded-md border border-white/10`} />
);

/* ---------------- EXACT SETTINGS VIEW (Screenshots 5 & 6) ---------------- */
export const SettingsView: React.FC<{
  user: UserProfile;
  theme: ThemeMode;
  onChangeTheme: (t: ThemeMode) => void;
  onBack: () => void;
  onOpenNitro: () => void;
  onOpenShop: () => void;
  onOpenQuests: () => void;
  onOpenServerBoost: () => void;
  onOpenBadges: () => void;
  onLogout: () => void;
}> = ({
  user,
  theme,
  onChangeTheme,
  onBack,
  onOpenNitro,
  onOpenShop,
  onOpenQuests,
  onOpenServerBoost,
  onOpenBadges,
  onLogout,
}) => {
  const [search, setSearch] = useState('');
  const [activeSubPanel, setActiveSubPanel] = useState<string | null>(null);
  const [typingIndicator, setTypingIndicator] = useState(true);
  const [pushNotifs, setPushNotifs] = useState(true);

  const q = search.trim().toLowerCase();

  const matches = (label: string) => !q || label.toLowerCase().includes(q);

  const accountRows = [
    { id: 'nitro', label: 'Obtener Nitro', icon: NitroWheelIcon, badge: 'DESCUENTO', action: onOpenNitro },
    { id: 'cuenta', label: 'Cuenta', icon: User, action: () => setActiveSubPanel('Cuenta') },
    { id: 'contenido', label: 'Contenido y social', icon: Users, action: () => setActiveSubPanel('Contenido y social') },
    { id: 'privacidad', label: 'Datos y privacidad', icon: Shield, action: () => setActiveSubPanel('Datos y privacidad') },
    { id: 'familia', label: 'Centro familiar', icon: Users, action: () => setActiveSubPanel('Centro familiar') },
    { id: 'dispositivos', label: 'Dispositivos', icon: Smartphone, action: () => setActiveSubPanel('Dispositivos') },
    { id: 'apps', label: 'Aplicaciones conectadas', icon: Link2, action: () => setActiveSubPanel('Aplicaciones conectadas') },
    { id: 'clips', label: 'Clips', icon: Clapperboard, action: () => setActiveSubPanel('Clips') },
    { id: 'qr', label: 'Escanear código QR', icon: QrCode, action: () => setActiveSubPanel('Escanear código QR') },
  ].filter((r) => matches(r.label));

  const billingRows = [
    { id: 'tienda', label: 'Tienda', icon: Store, action: onOpenShop },
    { id: 'misiones', label: 'Misiones', icon: LaurelQuestIcon, action: onOpenQuests },
    { id: 'insignias', label: 'Tus insignias', icon: Award, action: onOpenBadges },
    { id: 'mejora', label: 'Mejora del servidor', icon: BoostGemIcon, action: onOpenServerBoost },
  ].filter((r) => matches(r.label));

  const appRows = [
    { id: 'apariencia', label: 'Apariencia', icon: Palette, action: () => setActiveSubPanel('Apariencia') },
    { id: 'chat', label: 'Chat', icon: MessageSquare, action: () => setActiveSubPanel('Chat') },
    { id: 'escribiendo', label: 'Indicador de escritura', icon: MessageSquareMore, action: () => setActiveSubPanel('Indicador de escritura') },
    { id: 'navegador', label: 'Navegador web', icon: Globe, action: () => setActiveSubPanel('Navegador web') },
    { id: 'notificaciones', label: 'Notificaciones', icon: Bell, action: () => setActiveSubPanel('Notificaciones') },
    { id: 'icono', label: 'Icono de la aplicación', icon: PrimordialRowIcon, action: () => setActiveSubPanel('Icono de la aplicación') },
    { id: 'avanzado', label: 'Avanzado', icon: Settings, action: () => setActiveSubPanel('Avanzado') },
  ].filter((r) => matches(r.label));

  const supportRows = [
    { id: 'soporte', label: 'Soporte técnico', icon: HelpCircle, action: () => setActiveSubPanel('Soporte técnico') },
    {
      id: 'registros',
      label: 'Subir registros de depuración al soporte técnico de Discord',
      icon: Info,
      action: () => setActiveSubPanel('Registros de depuración'),
    },
    { id: 'agradecimientos', label: 'Agradecimientos', icon: Info, action: () => setActiveSubPanel('Agradecimientos') },
  ].filter((r) => matches(r.label));

  return (
    <div className="flex-1 flex flex-col h-full bg-[var(--dc-bg-sidebar)] text-[var(--dc-text-primary)] overflow-hidden">
      {/* Top Header (Exact Screenshot 6: ✕ 99  Ajustes) */}
      <header className="h-14 px-4 flex items-center gap-3 bg-[var(--dc-bg-sidebar)] shrink-0">
        <button
          onClick={activeSubPanel ? () => setActiveSubPanel(null) : onBack}
          className="relative p-1.5 rounded-full hover:bg-black/5 dark:hover:bg-white/10 text-[var(--dc-text-primary)] cursor-pointer"
        >
          {activeSubPanel ? <ArrowLeft className="w-6 h-6" /> : <X className="w-6 h-6" />}
          {!activeSubPanel && (
            <span className="absolute -bottom-1 -right-1 px-1.5 py-[1px] rounded-full bg-[#da373c] text-white text-[10px] font-bold tabular-nums leading-tight border-2 border-[var(--dc-bg-sidebar)]">
              99
            </span>
          )}
        </button>
        <h1 className="font-display font-bold text-[19px]">
          {activeSubPanel || 'Ajustes'}
        </h1>
      </header>

      {activeSubPanel === 'Apariencia' ? (
        <div className="flex-1 overflow-y-auto px-4 py-3 max-w-xl mx-auto w-full space-y-4">
          <p className="text-xs font-bold uppercase tracking-wider text-[var(--dc-text-muted)]">
            Tema de Discord
          </p>
          <div className="rounded-2xl bg-[var(--dc-bg-chat)] border border-[var(--dc-border)] p-3 grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {(
              [
                { id: 'light', label: 'Claro', swatch: '#ffffff' },
                { id: 'onyx', label: 'Onyx', swatch: '#0e0e11' },
                { id: 'dark', label: 'Oscuro', swatch: '#313338' },
                { id: 'vice-city', label: 'Vice City', swatch: '#361c4d' },
              ] as { id: ThemeMode; label: string; swatch: string }[]
            ).map((t) => (
              <button
                key={t.id}
                onClick={() => onChangeTheme(t.id)}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  theme === t.id
                    ? 'border-[#5865F2] bg-[#5865F2]/15'
                    : 'border-[var(--dc-border)] bg-[var(--dc-bg-card)]'
                }`}
              >
                <div
                  className="w-8 h-8 rounded-full border border-black/15 dark:border-white/20 mb-2 flex items-center justify-center"
                  style={{ backgroundColor: t.swatch }}
                >
                  {theme === t.id && (
                    <Check className={`w-4 h-4 ${t.id === 'light' ? 'text-black' : 'text-white'}`} />
                  )}
                </div>
                <span className="text-xs font-bold">{t.label}</span>
              </button>
            ))}
          </div>
        </div>
      ) : activeSubPanel === 'Cuenta' ? (
        <div className="flex-1 overflow-y-auto px-4 py-4 max-w-xl mx-auto w-full space-y-4">
          <div className="rounded-2xl bg-[var(--dc-bg-chat)] border border-[var(--dc-border)] p-4 space-y-4">
            <div className="flex items-center gap-3">
              <UserAvatar
                avatar={user.avatar}
                customAvatarUrl={user.customAvatarUrl}
                status={user.status}
                decoration={user.decoration}
                size="lg"
                borderColor="var(--dc-bg-chat)"
              />
              <div className="min-w-0">
                <p className="font-display font-bold text-lg text-[var(--dc-text-primary)] truncate">
                  {user.displayName}
                </p>
                <p className="text-xs text-[var(--dc-text-muted)]">@{user.username}</p>
              </div>
            </div>

            <div className="rounded-xl bg-[var(--dc-bg-card)] border border-[var(--dc-border)] divide-y divide-[var(--dc-border)] text-sm">
              <div className="px-3.5 py-2.5 flex items-center justify-between gap-2">
                <span className="text-[var(--dc-text-muted)]">Contacto</span>
                <span className="font-semibold text-[var(--dc-text-primary)] truncate">
                  {user.email || user.phone || `${user.username}@discord.gg`}
                </span>
              </div>
              <div className="px-3.5 py-2.5 flex items-center justify-between gap-2">
                <span className="text-[var(--dc-text-muted)]">Saldo de Orbs</span>
                <span className="inline-flex items-center gap-1 font-bold text-indigo-400 tabular-nums">
                  <OrbsCrystalIcon className="w-3.5 h-3.5" />
                  {user.orbs.toLocaleString('es-ES')}
                </span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                onClick={onLogout}
                className="flex-1 h-10 rounded-full dc-btn-danger text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Cerrar sesión / Cambiar cuenta</span>
              </button>
              <button
                onClick={() => setActiveSubPanel(null)}
                className="px-5 h-10 rounded-full dc-btn-secondary text-xs font-bold cursor-pointer"
              >
                Volver
              </button>
            </div>
          </div>
        </div>
      ) : activeSubPanel ? (
        <div className="flex-1 overflow-y-auto px-4 py-4 max-w-xl mx-auto w-full space-y-4">
          <div className="rounded-2xl bg-[var(--dc-bg-chat)] border border-[var(--dc-border)] p-4 space-y-3">
            <p className="font-bold text-base">{activeSubPanel}</p>
            {activeSubPanel === 'Icono de la aplicación' ? (
              <div className="flex items-center gap-4 p-3 rounded-xl bg-[var(--dc-bg-card)] border border-[var(--dc-border)]">
                <PrimordialAppIcon className="w-16 h-16 rounded-2xl shadow-lg border border-white/15 shrink-0" />
                <div>
                  <p className="font-display font-bold text-sm text-[var(--dc-text-primary)]">
                    Primordial · Emblema Oficial
                  </p>
                  <p className="text-xs text-[var(--dc-text-secondary)] mt-0.5">
                    Activo en la aplicación web, PWA y acceso directo de Android.
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-sm text-[var(--dc-text-secondary)]">
                Configuración de {activeSubPanel.toLowerCase()} para la cuenta{' '}
                <strong>{user.username}</strong>.
              </p>
            )}
            {activeSubPanel === 'Indicador de escritura' && (
              <label className="flex items-center justify-between pt-2 cursor-pointer">
                <span className="text-sm">Mostrar cuando otros están escribiendo</span>
                <input
                  type="checkbox"
                  checked={typingIndicator}
                  onChange={(e) => setTypingIndicator(e.target.checked)}
                  className="w-5 h-5 accent-[#5865F2]"
                />
              </label>
            )}
            {activeSubPanel === 'Notificaciones' && (
              <label className="flex items-center justify-between pt-2 cursor-pointer">
                <span className="text-sm">Notificaciones push activadas</span>
                <input
                  type="checkbox"
                  checked={pushNotifs}
                  onChange={(e) => setPushNotifs(e.target.checked)}
                  className="w-5 h-5 accent-[#5865F2]"
                />
              </label>
            )}
            <button
              onClick={() => setActiveSubPanel(null)}
              className="px-5 py-2 rounded-full dc-btn-primary text-xs font-bold cursor-pointer"
            >
              Listo
            </button>
          </div>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto px-4 pb-12 max-w-xl mx-auto w-full space-y-5">
          {/* Search Bar */}
          <div className="flex items-center gap-2.5 bg-[var(--dc-bg-chat)] border border-[var(--dc-border)] rounded-2xl px-3.5 h-11">
            <Search className="w-4 h-4 text-[var(--dc-text-muted)] shrink-0" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar"
              className="flex-1 bg-transparent text-[15px] text-[var(--dc-text-primary)] placeholder:text-[var(--dc-text-muted)] focus:outline-none"
            />
          </div>

          <PWAInstallButton variant="card" />

          {/* Ajustes de la cuenta */}
          {accountRows.length > 0 && (
            <section className="space-y-1.5">
              <h2 className="text-[13px] font-semibold text-[var(--dc-text-muted)] px-1">
                Ajustes de la cuenta
              </h2>
              <div className="rounded-2xl bg-[var(--dc-bg-chat)] border border-[var(--dc-border)] divide-y divide-[var(--dc-border)] overflow-hidden">
                {accountRows.map((row) => {
                  const Icon = row.icon;
                  return (
                    <button
                      key={row.id}
                      onClick={row.action}
                      className="w-full px-4 py-3.5 flex items-center justify-between hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-3.5">
                        <Icon className="w-5 h-5 text-[var(--dc-text-primary)] shrink-0" />
                        <span className="text-[15px] font-medium text-[var(--dc-text-primary)]">
                          {row.label}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        {row.badge && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[var(--dc-bg-elevated)] text-[11px] font-bold text-[var(--dc-text-primary)]">
                            <Clock className="w-3 h-3" />
                            <span>{row.badge}</span>
                          </span>
                        )}
                        <ChevronRight className="w-4 h-4 text-[var(--dc-text-muted)]" />
                      </div>
                    </button>
                  );
                })}
              </div>
            </section>
          )}

          {/* Ajustes de facturación */}
          {billingRows.length > 0 && (
            <section className="space-y-1.5">
              <h2 className="text-[13px] font-semibold text-[var(--dc-text-muted)] px-1">
                Ajustes de facturación
              </h2>
              <div className="rounded-2xl bg-[var(--dc-bg-chat)] border border-[var(--dc-border)] divide-y divide-[var(--dc-border)] overflow-hidden">
                {billingRows.map((row) => {
                  const Icon = row.icon;
                  return (
                    <button
                      key={row.id}
                      onClick={row.action}
                      className="w-full px-4 py-3.5 flex items-center justify-between hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-3.5">
                        <Icon className="w-5 h-5 text-[var(--dc-text-primary)] shrink-0" />
                        <span className="text-[15px] font-medium text-[var(--dc-text-primary)]">
                          {row.label}
                        </span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-[var(--dc-text-muted)]" />
                    </button>
                  );
                })}
              </div>
            </section>
          )}

          {/* Ajustes de la aplicación */}
          {appRows.length > 0 && (
            <section className="space-y-1.5">
              <h2 className="text-[13px] font-semibold text-[var(--dc-text-muted)] px-1">
                Ajustes de la aplicación
              </h2>
              <div className="rounded-2xl bg-[var(--dc-bg-chat)] border border-[var(--dc-border)] divide-y divide-[var(--dc-border)] overflow-hidden">
                {appRows.map((row) => {
                  const Icon = row.icon;
                  return (
                    <button
                      key={row.id}
                      onClick={row.action}
                      className="w-full px-4 py-3.5 flex items-center justify-between hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-3.5">
                        <Icon className="w-5 h-5 text-[var(--dc-text-primary)] shrink-0" />
                        <span className="text-[15px] font-medium text-[var(--dc-text-primary)]">
                          {row.label}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        {row.id === 'apariencia' && (
                          <span className="text-xs text-[var(--dc-text-muted)] capitalize">
                            {theme === 'light' ? 'Claro' : theme === 'vice-city' ? 'Vice City' : theme}
                          </span>
                        )}
                        <ChevronRight className="w-4 h-4 text-[var(--dc-text-muted)]" />
                      </div>
                    </button>
                  );
                })}
              </div>
            </section>
          )}

          {/* Soporte técnico */}
          {supportRows.length > 0 && (
            <section className="space-y-1.5">
              <h2 className="text-[13px] font-semibold text-[var(--dc-text-muted)] px-1">
                Soporte técnico
              </h2>
              <div className="rounded-2xl bg-[var(--dc-bg-chat)] border border-[var(--dc-border)] divide-y divide-[var(--dc-border)] overflow-hidden">
                {supportRows.map((row) => {
                  const Icon = row.icon;
                  return (
                    <button
                      key={row.id}
                      onClick={row.action}
                      className="w-full px-4 py-3.5 flex items-center justify-between text-left gap-3 hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-3.5 min-w-0">
                        <Icon className="w-5 h-5 text-[var(--dc-text-primary)] shrink-0" />
                        <span className="text-[15px] font-medium text-[var(--dc-text-primary)]">
                          {row.label}
                        </span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-[var(--dc-text-muted)] shrink-0" />
                    </button>
                  );
                })}
              </div>
            </section>
          )}

          {/* Novedades */}
          {matches('Novedades') && (
            <section className="space-y-1.5">
              <h2 className="text-[13px] font-semibold text-[var(--dc-text-muted)] px-1">
                Novedades
              </h2>
              <div className="rounded-2xl bg-[var(--dc-bg-chat)] border border-[var(--dc-border)] overflow-hidden">
                <button
                  onClick={() => setActiveSubPanel('Novedades')}
                  className="w-full px-4 py-3.5 flex items-center justify-between hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3.5">
                    <Info className="w-5 h-5 text-[var(--dc-text-primary)] shrink-0" />
                    <span className="text-[15px] font-medium text-[var(--dc-text-primary)]">
                      Novedades
                    </span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-[var(--dc-text-muted)]" />
                </button>
              </div>
            </section>
          )}

          {/* Cerrar sesión */}
          <button
            onClick={onLogout}
            className="w-full rounded-2xl bg-[var(--dc-bg-chat)] border border-[var(--dc-border)] px-4 py-3.5 flex items-center gap-3 text-[#da373c] font-semibold text-[15px] hover:bg-red-500/5 transition-colors cursor-pointer"
          >
            <LogOut className="w-5 h-5" />
            <span>Cerrar sesión</span>
          </button>
        </div>
      )}
    </div>
  );
};

/* ---------------- FRIENDS VIEW ---------------- */
export const FriendsView: React.FC<{
  dms: DirectMessageThread[];
  onBack: () => void;
  onOpenDm: (dmId: string) => void;
  onAddFriend: (
    username: string,
    opts?: { avatar?: UserProfile['avatar']; status?: UserProfile['status']; initialGreeting?: string }
  ) => void;
  onInspectUser?: (userId: string, fallback?: Partial<PublicUserProfile>) => void;
}> = ({ dms, onBack, onOpenDm, onAddFriend, onInspectUser }) => {
  const friendThreads = dms.filter((d) => !d.isBot && !d.isGroup);
  const [tab, setTab] = useState<'online' | 'all' | 'add'>(friendThreads.length === 0 ? 'add' : 'all');
  const [friendHandle, setFriendHandle] = useState('');
  const [addedMsg, setAddedMsg] = useState<string | null>(null);

  const filtered =
    tab === 'online' ? friendThreads.filter((f) => f.status === 'online') : friendThreads;

  const q = friendHandle.trim().toLowerCase();
  const directoryMatches = FRIEND_DIRECTORY.filter(
    (entry) =>
      !q ||
      entry.displayName.toLowerCase().includes(q) ||
      entry.username.toLowerCase().includes(q) ||
      entry.bio.toLowerCase().includes(q)
  );

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = friendHandle.trim();
    if (!clean) return;
    const matched = FRIEND_DIRECTORY.find(
      (entry) =>
        entry.username.toLowerCase() === clean.toLowerCase() ||
        entry.displayName.toLowerCase() === clean.toLowerCase()
    );
    onAddFriend(matched ? matched.displayName : clean, matched ? { avatar: matched.avatar, status: matched.status } : undefined);
    setAddedMsg(`Chat abierto con ${matched ? matched.displayName : clean}`);
    setFriendHandle('');
    setTimeout(() => setAddedMsg(null), 2600);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[var(--dc-bg-chat)] text-[var(--dc-text-primary)] overflow-hidden">
      <header className="h-14 px-4 flex items-center justify-between border-b border-[var(--dc-border)] shrink-0">
        <div className="flex items-center gap-2.5">
          <button
            onClick={onBack}
            className="p-1.5 rounded-full hover:bg-black/5 dark:hover:bg-white/10 text-[var(--dc-text-primary)] cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <Users className="w-5 h-5 text-[var(--dc-text-muted)]" />
          <h1 className="font-display font-bold text-[17px]">Amigos</h1>
        </div>
        <button
          onClick={() => setTab('add')}
          className="px-3.5 py-1.5 rounded-full dc-btn-success text-xs font-bold cursor-pointer whitespace-nowrap"
        >
          Buscar amigos
        </button>
      </header>

      <div className="px-4 py-2.5 flex items-center gap-2 border-b border-[var(--dc-border)] overflow-x-auto no-scrollbar">
        {[
          { id: 'all', label: `Todos (${friendThreads.length})` },
          { id: 'online', label: 'En línea' },
          { id: 'add', label: 'Buscar y añadir' },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id as 'all' | 'online' | 'add')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold cursor-pointer whitespace-nowrap ${
              tab === t.id ? 'dc-btn-primary' : 'dc-btn-secondary'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto p-4 max-w-2xl w-full mx-auto space-y-4">
        {tab === 'add' ? (
          <>
            <form
              onSubmit={handleAdd}
              className="space-y-3 bg-[var(--dc-bg-card)] p-5 rounded-2xl border border-[var(--dc-border)]"
            >
              <h2 className="font-display font-bold text-base">Buscar o añadir amigos</h2>
              <p className="text-xs text-[var(--dc-text-secondary)]">
                Busca personas en Primordial por nombre o escribe su usuario exacto para empezar a chatear.
              </p>
              <div className="flex gap-2">
                <div className="flex-1 flex items-center gap-2 bg-[var(--dc-bg-input)] border border-[var(--dc-border)] rounded-xl px-3.5 focus-within:border-[#5865F2]">
                  <Search className="w-4 h-4 text-[var(--dc-text-muted)] shrink-0" />
                  <input
                    type="text"
                    value={friendHandle}
                    onChange={(e) => setFriendHandle(e.target.value)}
                    placeholder="Buscar por nombre o @usuario..."
                    className="flex-1 bg-transparent py-2.5 text-sm text-[var(--dc-text-primary)] focus:outline-none"
                  />
                  {friendHandle && (
                    <button
                      type="button"
                      onClick={() => setFriendHandle('')}
                      className="text-[var(--dc-text-muted)] hover:text-white cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
                <button
                  type="submit"
                  className="px-4 py-2.5 rounded-xl dc-btn-primary text-xs font-bold flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Añadir</span>
                </button>
              </div>
              {addedMsg && (
                <p className="text-xs text-[#23a55a] font-semibold flex items-center gap-1">
                  <UserCheck className="w-4 h-4" />
                  <span>{addedMsg}</span>
                </p>
              )}
            </form>

            <div className="space-y-2">
              <p className="text-xs font-bold uppercase tracking-wider text-[var(--dc-text-muted)] px-1">
                {q ? `Resultados (${directoryMatches.length})` : 'Personas en Primordial'}
              </p>

              {directoryMatches.map((person) => {
                const existingDm = dms.find(
                  (d) =>
                    d.id === person.id ||
                    d.id === `dm-${person.id}` ||
                    d.name.toLowerCase() === person.displayName.toLowerCase()
                );

                return (
                  <div
                    key={person.id}
                    onClick={() =>
                      onInspectUser?.(person.id, {
                        displayName: person.displayName,
                        username: person.username,
                        avatar: person.avatar,
                        status: person.status,
                        bio: person.bio,
                        customStatus: person.customStatus,
                      })
                    }
                    className="w-full flex items-center justify-between gap-3 p-3 rounded-2xl bg-[var(--dc-bg-card)] hover:bg-[var(--dc-bg-elevated)] border border-[var(--dc-border)] transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <UserAvatar
                        avatar={person.avatar}
                        status={person.status}
                        size="md"
                        borderColor="var(--dc-bg-card)"
                      />
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-bold text-sm truncate">{person.displayName}</p>
                          <span className="text-[11px] text-[var(--dc-text-muted)] truncate">
                            @{person.username}
                          </span>
                        </div>
                        <p className="text-xs text-[var(--dc-text-secondary)] truncate mt-0.5">
                          {person.customStatus || person.bio}
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (existingDm) {
                          onOpenDm(existingDm.id);
                        } else {
                          onAddFriend(person.displayName, {
                            avatar: person.avatar,
                            status: person.status,
                          });
                        }
                      }}
                      className={`px-3.5 py-1.5 rounded-full text-xs font-bold shrink-0 cursor-pointer whitespace-nowrap ${
                        existingDm ? 'dc-btn-secondary' : 'dc-btn-primary'
                      }`}
                    >
                      {existingDm ? 'Abrir chat' : 'Añadir y chatear'}
                    </button>
                  </div>
                );
              })}

              {q && directoryMatches.length === 0 && (
                <div className="rounded-2xl bg-[var(--dc-bg-card)] border border-[var(--dc-border)] p-5 text-center space-y-3">
                  <p className="text-sm text-[var(--dc-text-secondary)]">
                    No aparece «{friendHandle.trim()}» en sugerencias, pero puedes agregarlo directamente por usuario.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      const clean = friendHandle.trim();
                      onAddFriend(clean);
                      setFriendHandle('');
                    }}
                    className="px-4 py-2 rounded-full dc-btn-primary text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer"
                  >
                    <UserPlus className="w-4 h-4" />
                    <span>Añadir a «{friendHandle.trim()}»</span>
                  </button>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="space-y-2">
            {filtered.map((f) => (
              <div
                key={f.id}
                onClick={() =>
                  onInspectUser?.(f.id, {
                    displayName: f.name,
                    username: f.username || f.name.toLowerCase().replace(/\s+/g, ''),
                    avatar: f.avatar,
                    status: f.status,
                    decoration: f.decoration,
                    nameplate: f.nameplate,
                    serverTag: f.serverTag,
                  })
                }
                className="w-full flex items-center justify-between p-3 rounded-2xl bg-[var(--dc-bg-card)] hover:bg-[var(--dc-bg-elevated)] transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <UserAvatar
                    avatar={f.avatar}
                    status={f.status}
                    decoration={f.decoration || 'none'}
                    size="md"
                    borderColor="var(--dc-bg-card)"
                  />
                  <div className="text-left min-w-0">
                    <p className="font-bold text-sm truncate">{f.name}</p>
                    <p className="text-xs text-[var(--dc-text-muted)] truncate">
                      {f.username || f.lastMessagePreview}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpenDm(f.id);
                  }}
                  className="px-3 py-1.5 rounded-full bg-black/10 dark:bg-white/10 hover:bg-white/20 text-xs font-semibold cursor-pointer"
                >
                  Mensaje
                </button>
              </div>
            ))}

            {filtered.length === 0 && (
              <div className="rounded-2xl bg-[var(--dc-bg-card)] border border-[var(--dc-border)] p-8 text-center space-y-3">
                <p className="text-sm font-medium text-[var(--dc-text-secondary)]">
                  {tab === 'online'
                    ? 'Ninguno de tus amigos añadidos está en línea ahora.'
                    : 'Aún no has añadido amigos.'}
                </p>
                <button
                  type="button"
                  onClick={() => setTab('add')}
                  className="px-5 py-2.5 rounded-full dc-btn-primary text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <Search className="w-4 h-4" />
                  <span>Buscar amigos</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

/* ---------------- NOTIFICATIONS VIEW ---------------- */
export const NotificationsView: React.FC<{
  notifications: NotificationItem[];
  onMarkAllRead: () => void;
  onClickNotification: (n: NotificationItem) => void;
}> = ({ notifications, onMarkAllRead, onClickNotification }) => {
  const [tab, setTab] = useState<'all' | 'mentions'>('all');
  const mentionItems = notifications.filter((n) => n.type === 'mention' || n.type === 'reply');
  const visible = tab === 'mentions' ? mentionItems : notifications;

  const badgeLabel = (type: NotificationItem['type']) => {
    switch (type) {
      case 'mention':
        return { text: 'Mención', cls: 'bg-[#5865F2]/25 text-[#9aa4ff]' };
      case 'reply':
        return { text: 'Respuesta', cls: 'bg-emerald-500/20 text-emerald-300' };
      case 'friend':
        return { text: 'Amigo', cls: 'bg-amber-500/20 text-amber-300' };
      case 'quest':
        return { text: 'Misión', cls: 'bg-purple-500/20 text-purple-300' };
      default:
        return { text: 'Sistema', cls: 'bg-white/10 text-zinc-300' };
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[var(--dc-bg-sidebar)] text-[var(--dc-text-primary)] overflow-hidden">
      <header className="px-4 pt-3.5 pb-2.5 border-b border-[var(--dc-border)] shrink-0 space-y-2.5">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-[var(--dc-text-primary)]" />
            <h1 className="font-display font-extrabold text-[22px] tracking-tight">Notificaciones</h1>
          </div>
          <button
            onClick={onMarkAllRead}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full dc-btn-secondary text-xs font-semibold cursor-pointer whitespace-nowrap"
          >
            <CheckCheck className="w-4 h-4" />
            <span>Marcar leídas</span>
          </button>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setTab('all')}
            className={`px-3 py-1 rounded-full text-xs font-semibold cursor-pointer transition-colors ${
              tab === 'all'
                ? 'bg-[#5865F2] text-white'
                : 'bg-[var(--dc-bg-card)] text-[var(--dc-text-secondary)] hover:text-white'
            }`}
          >
            Todas ({notifications.length})
          </button>
          <button
            type="button"
            onClick={() => setTab('mentions')}
            className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold cursor-pointer transition-colors ${
              tab === 'mentions'
                ? 'bg-[#5865F2] text-white'
                : 'bg-[var(--dc-bg-card)] text-[var(--dc-text-secondary)] hover:text-white'
            }`}
          >
            <AtSign className="w-3.5 h-3.5" />
            <span>Menciones ({mentionItems.length})</span>
          </button>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-3 space-y-2 max-w-2xl w-full mx-auto pb-24">
        {visible.map((n) => {
          const badge = badgeLabel(n.type);
          return (
            <button
              key={n.id}
              onClick={() => onClickNotification(n)}
              className={`w-full text-left p-3.5 rounded-2xl flex items-start gap-3 transition-colors cursor-pointer ${
                n.unread
                  ? 'bg-[#5865F2]/15 border border-[#5865F2]/35 hover:bg-[#5865F2]/20'
                  : 'bg-[var(--dc-bg-card)] hover:bg-[var(--dc-bg-elevated)] border border-transparent'
              }`}
            >
              <UserAvatar avatar={n.avatar} size="md" showStatus={false} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold shrink-0 ${badge.cls}`}>
                      {badge.text}
                    </span>
                    <p className="font-bold text-sm text-[var(--dc-text-primary)] truncate">{n.title}</p>
                  </div>
                  <span className="text-[11px] text-[var(--dc-text-muted)] shrink-0 tabular-nums">
                    {n.timestamp}
                  </span>
                </div>
                <p className="text-xs text-[var(--dc-text-secondary)] mt-1 line-clamp-2">{n.body}</p>
              </div>
            </button>
          );
        })}

        {visible.length === 0 && (
          <div className="rounded-2xl bg-[var(--dc-bg-card)] border border-[var(--dc-border)] p-8 text-center space-y-2 mt-4">
            <Bell className="w-8 h-8 text-[var(--dc-text-muted)] mx-auto opacity-75" />
            <p className="font-bold text-sm text-[var(--dc-text-primary)]">
              Sin notificaciones por ahora
            </p>
            <p className="text-xs text-[var(--dc-text-muted)]">
              Aquí aparecerán tus menciones, respuestas y avisos de tus amigos o servidores.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

/* ---------------- VOICE BAR & CALL OVERLAY ---------------- */
export const VoiceOverlay: React.FC<{
  voice: VoiceSession;
  currentUser: UserProfile;
  onToggleMute: () => void;
  onToggleDeafen: () => void;
  onToggleVideo: () => void;
  onToggleScreen: () => void;
  onDisconnect: () => void;
}> = ({
  voice,
  currentUser,
  onToggleMute,
  onToggleDeafen,
  onToggleVideo,
  onToggleScreen,
  onDisconnect,
}) => {
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    if (voice.active && voice.callNonce) {
      setExpanded(true);
    }
    if (!voice.active) {
      setExpanded(false);
    }
  }, [voice.active, voice.callNonce]);

  if (!voice.active) return null;

  const mins = String(Math.floor(voice.connectedSeconds / 60)).padStart(2, '0');
  const secs = String(voice.connectedSeconds % 60).padStart(2, '0');
  const isRinging = voice.connectedSeconds < 2;

  return (
    <>
      <div className="bg-[#161b18] border-t border-[#23a55a]/30 px-3 py-2 flex items-center justify-between gap-2 shrink-0 text-white">
        <button onClick={() => setExpanded(true)} className="text-left min-w-0 flex-1 cursor-pointer">
          <p className="text-xs font-bold text-[#23a55a] flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#23a55a]" />
            <span>
              {voice.videoOn ? 'Videollamada' : 'Voz conectada'} · {mins}:{secs}
            </span>
          </p>
          <p className="text-[11.5px] text-zinc-300 truncate">
            {voice.channelName} / {voice.contextName}
          </p>
        </button>

        <div className="flex items-center gap-1">
          <button
            onClick={onToggleVideo}
            aria-label="Alternar cámara"
            className={`w-9 h-9 rounded-full flex items-center justify-center cursor-pointer ${
              voice.videoOn ? 'bg-[#23a55a]/25 text-[#3dd67d]' : 'hover:bg-white/10 text-white'
            }`}
          >
            {voice.videoOn ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
          </button>
          <button
            onClick={onToggleMute}
            aria-label="Silenciar micrófono"
            className={`w-9 h-9 rounded-full flex items-center justify-center cursor-pointer ${
              voice.muted ? 'bg-red-500/20 text-red-400' : 'hover:bg-white/10 text-white'
            }`}
          >
            {voice.muted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </button>
          <button
            onClick={onToggleDeafen}
            aria-label="Ensordecer audio"
            className={`w-9 h-9 rounded-full flex items-center justify-center cursor-pointer ${
              voice.deafened ? 'bg-red-500/20 text-red-400' : 'hover:bg-white/10 text-white'
            }`}
          >
            {voice.deafened ? (
              <HeadphoneOff className="w-4 h-4" />
            ) : (
              <Headphones className="w-4 h-4" />
            )}
          </button>
          <button
            onClick={onDisconnect}
            aria-label="Desconectar llamada"
            className="w-9 h-9 rounded-full dc-btn-danger flex items-center justify-center cursor-pointer"
          >
            <PhoneOff className="w-4 h-4" />
          </button>
        </div>
      </div>

      {expanded && (
        <div className="fixed inset-0 z-50 bg-[#111214] flex flex-col justify-between p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-[#23a55a]/20 text-[#23a55a] flex items-center justify-center">
                {voice.videoOn ? <Video className="w-4.5 h-4.5" /> : <PhoneCall className="w-4.5 h-4.5" />}
              </div>
              <div>
                <h3 className="font-display font-bold text-lg text-white leading-tight">
                  {voice.channelName}
                </h3>
                <p className="text-xs text-[#23a55a] font-semibold tabular-nums">
                  {isRinging ? 'Conectando llamada...' : `${voice.contextName} · ${mins}:${secs}`}
                </p>
              </div>
            </div>
            <button
              onClick={() => setExpanded(false)}
              className="px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-white/15 text-xs font-semibold text-white cursor-pointer"
            >
              Minimizar
            </button>
          </div>

          <div
            className={`grid gap-4 max-w-3xl mx-auto w-full my-auto ${
              voice.participants.length <= 1 ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-2 sm:grid-cols-3'
            }`}
          >
            <div
              className={`aspect-video sm:aspect-square rounded-3xl border flex flex-col items-center justify-center gap-2.5 relative overflow-hidden ${
                voice.videoOn
                  ? 'bg-gradient-to-br from-[#1d2238] via-[#171924] to-[#111214] border-[#5865F2]/50'
                  : 'bg-[#1c1d22] border-white/10'
              }`}
            >
              {voice.videoOn && (
                <div className="absolute top-3 left-3 px-2 py-0.5 rounded-full bg-black/55 border border-white/15 text-[10.5px] font-bold text-emerald-300 flex items-center gap-1">
                  <Video className="w-3 h-3" />
                  <span>Cámara activa</span>
                </div>
              )}
              {voice.screenSharing && (
                <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-[#5865F2] text-[10.5px] font-bold text-white flex items-center gap-1">
                  <Monitor className="w-3 h-3" />
                  <span>Pantalla</span>
                </div>
              )}
              <div className={!voice.muted ? 'rounded-full speaking-ring' : ''}>
                <UserAvatar
                  avatar={currentUser.avatar}
                  customAvatarUrl={currentUser.customAvatarUrl}
                  size="xl"
                  showStatus={false}
                />
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-bold text-white">{currentUser.displayName}</span>
                {voice.muted && <MicOff className="w-3.5 h-3.5 text-red-400" />}
              </div>
            </div>

            {voice.participants.map((p, idx) => (
              <div
                key={p.id}
                className={`aspect-video sm:aspect-square rounded-3xl border flex flex-col items-center justify-center gap-2.5 relative overflow-hidden ${
                  voice.videoOn && idx === 0
                    ? 'bg-gradient-to-br from-[#1a2c26] via-[#171c22] to-[#111214] border-[#23a55a]/45'
                    : 'bg-[#1c1d22] border-white/10'
                }`}
              >
                {voice.videoOn && idx === 0 && (
                  <div className="absolute top-3 left-3 px-2 py-0.5 rounded-full bg-black/55 border border-white/15 text-[10.5px] font-bold text-sky-300 flex items-center gap-1">
                    <Video className="w-3 h-3" />
                    <span>Video simulado</span>
                  </div>
                )}
                <div className={p.speaking && !p.muted ? 'rounded-full speaking-ring' : ''}>
                  <UserAvatar avatar={p.avatar} size="xl" showStatus={false} />
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-bold text-white">{p.name}</span>
                  {p.muted && <MicOff className="w-3.5 h-3.5 text-zinc-400" />}
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-center gap-3 pb-4">
            <button
              onClick={onToggleVideo}
              title={voice.videoOn ? 'Apagar cámara' : 'Encender cámara'}
              className={`w-12 h-12 rounded-full flex items-center justify-center cursor-pointer transition-colors ${
                voice.videoOn ? 'bg-white text-black' : 'bg-[#26272f] hover:bg-[#31333d] text-white'
              }`}
            >
              {voice.videoOn ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
            </button>
            <button
              onClick={onToggleScreen}
              title="Compartir pantalla"
              className={`w-12 h-12 rounded-full flex items-center justify-center cursor-pointer transition-colors ${
                voice.screenSharing ? 'bg-[#5865F2] text-white' : 'bg-[#26272f] hover:bg-[#31333d] text-white'
              }`}
            >
              <Monitor className="w-5 h-5" />
            </button>
            <button
              onClick={onToggleMute}
              title={voice.muted ? 'Activar micrófono' : 'Silenciar micrófono'}
              className={`w-12 h-12 rounded-full flex items-center justify-center cursor-pointer transition-colors ${
                voice.muted ? 'bg-white text-black' : 'bg-[#26272f] hover:bg-[#31333d] text-white'
              }`}
            >
              {voice.muted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </button>
            <button
              onClick={onToggleDeafen}
              title={voice.deafened ? 'Activar audio' : 'Ensordecer'}
              className={`w-12 h-12 rounded-full flex items-center justify-center cursor-pointer transition-colors ${
                voice.deafened ? 'bg-white text-black' : 'bg-[#26272f] hover:bg-[#31333d] text-white'
              }`}
            >
              {voice.deafened ? (
                <HeadphoneOff className="w-5 h-5" />
              ) : (
                <Headphones className="w-5 h-5" />
              )}
            </button>
            <button
              onClick={() => {
                setExpanded(false);
                onDisconnect();
              }}
              title="Colgar llamada"
              className="w-14 h-12 rounded-full dc-btn-danger flex items-center justify-center cursor-pointer"
            >
              <PhoneOff className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

const SERVER_ICON_COLORS = [
  '#5865F2',
  '#23a55a',
  '#ec4899',
  '#f59e0b',
  '#06b6d4',
  '#9333ea',
  '#ef4444',
];

const SERVER_ICON_EMOJIS = ['', '🚀', '🎮', '⚡', '💻', '🔥', '👑', '🎧'];

/* ---------------- CREATE SERVER MODAL ---------------- */
export const CreateServerModal: React.FC<{
  open: boolean;
  initialTemplate?: ServerTemplateId;
  onClose: () => void;
  onCreate: (payload: CreateServerPayload) => void;
}> = ({ open, initialTemplate = 'friends', onClose, onCreate }) => {
  const [name, setName] = useState('');
  const [templateId, setTemplateId] = useState<'friends' | 'gaming'>(
    initialTemplate === 'gaming' ? 'gaming' : 'friends'
  );
  const [accentColor, setAccentColor] = useState('#5865F2');
  const [customEmoji, setCustomEmoji] = useState('🚀');
  const [customIconUrl, setCustomIconUrl] = useState<string | undefined>(undefined);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    setTemplateId(initialTemplate === 'gaming' ? 'gaming' : 'friends');
    setName('');
    setAccentColor(initialTemplate === 'gaming' ? '#23a55a' : '#5865F2');
    setCustomEmoji(initialTemplate === 'gaming' ? '🎮' : '🚀');
    setCustomIconUrl(undefined);
  }, [open, initialTemplate]);

  if (!open) return null;

  const placeholder = templateId === 'gaming' ? 'Squad Gaming' : 'Mi nuevo servidor';
  const previewShortCode = (name.trim() || placeholder)
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 3)
    .toUpperCase();

  const handleIconFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setCustomIconUrl(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalName = name.trim() || placeholder;
    onCreate({
      name: finalName,
      templateId,
      audience: templateId === 'gaming' ? 'community' : 'friends',
      accentColor,
      customIconUrl,
      customEmoji: customIconUrl ? undefined : customEmoji || undefined,
      chatTheme: 'black',
      chatMessageStyle: 'classic',
      includeBots: true,
      includeStarterRoles: true,
      includeVoiceChannels: true,
    });
    setName('');
    onClose();
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4"
    >
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) handleIconFile(f);
          e.target.value = '';
        }}
      />
      <form
        onClick={(e) => e.stopPropagation()}
        onSubmit={submit}
        className="w-full max-w-md rounded-3xl bg-[var(--dc-bg-sheet)] border border-[var(--dc-border)] p-5 space-y-4 shadow-2xl max-h-[92vh] overflow-y-auto"
      >
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="font-display font-bold text-lg text-[var(--dc-text-primary)]">
              Crea tu servidor
            </h3>
            <p className="text-xs text-[var(--dc-text-secondary)] mt-0.5 leading-snug">
              Elige plantilla, nombre y un icono personalizado para tu servidor.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full dc-btn-icon flex items-center justify-center shrink-0 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Custom Server Icon Preview & Picker */}
        <div className="rounded-2xl bg-[var(--dc-bg-card)] border border-[var(--dc-border)] p-3.5 space-y-3">
          <div className="flex items-center gap-3.5">
            <div
              className="w-16 h-16 rounded-2xl overflow-hidden flex items-center justify-center font-display font-extrabold text-white text-xl shrink-0 border border-white/15 shadow-lg relative"
              style={
                customIconUrl
                  ? undefined
                  : { background: `linear-gradient(135deg, ${accentColor} 0%, #11121a 100%)` }
              }
            >
              {customIconUrl ? (
                <img src={customIconUrl} alt="Icono" className="w-full h-full object-cover" />
              ) : (
                <span className={customEmoji ? 'text-2xl' : 'text-lg'}>
                  {customEmoji || previewShortCode}
                </span>
              )}
            </div>

            <div className="flex-1 min-w-0 space-y-1.5">
              <p className="text-xs font-bold text-[var(--dc-text-primary)]">
                Icono del servidor
              </p>
              <div className="flex flex-wrap items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full dc-btn-primary text-[11px] font-bold cursor-pointer"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>{customIconUrl ? 'Cambiar foto' : 'Subir icono'}</span>
                </button>
                {customIconUrl && (
                  <button
                    type="button"
                    onClick={() => setCustomIconUrl(undefined)}
                    className="px-2.5 py-1.5 rounded-full dc-btn-secondary text-[11px] font-semibold cursor-pointer"
                  >
                    Usar icono
                  </button>
                )}
              </div>
            </div>
          </div>

          {!customIconUrl && (
            <div className="space-y-2 pt-1">
              <div className="flex items-center gap-1.5 flex-wrap">
                {SERVER_ICON_COLORS.map((col) => (
                  <button
                    key={col}
                    type="button"
                    onClick={() => setAccentColor(col)}
                    aria-label={`Color ${col}`}
                    className={`w-6 h-6 rounded-full cursor-pointer transition-transform ${
                      accentColor === col ? 'ring-2 ring-white scale-110' : 'opacity-80 hover:opacity-100'
                    }`}
                    style={{ backgroundColor: col }}
                  />
                ))}
              </div>
              <div className="flex items-center gap-1.5 flex-wrap">
                {SERVER_ICON_EMOJIS.map((em) => (
                  <button
                    key={em || 'initials'}
                    type="button"
                    onClick={() => setCustomEmoji(em)}
                    className={`px-2 h-7 rounded-lg text-xs font-bold flex items-center justify-center cursor-pointer transition-colors ${
                      customEmoji === em
                        ? 'bg-[#5865F2] text-white'
                        : 'bg-[var(--dc-bg-input)] text-[var(--dc-text-secondary)] hover:text-white'
                    }`}
                  >
                    {em || previewShortCode}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="space-y-2">
          <button
            type="button"
            onClick={() => setTemplateId('friends')}
            className={`w-full p-3 rounded-2xl border flex items-center gap-3 text-left transition-colors cursor-pointer ${
              templateId === 'friends'
                ? 'border-[#5865F2] bg-[#5865F2]/15'
                : 'border-[var(--dc-border)] bg-[var(--dc-bg-card)] hover:bg-[var(--dc-bg-elevated)]'
            }`}
          >
            <span className="w-9 h-9 rounded-xl bg-[#5865F2] text-white flex items-center justify-center shrink-0">
              <Users className="w-4 h-4" />
            </span>
            <div className="flex-1 min-w-0">
              <p className="font-display font-bold text-sm text-[var(--dc-text-primary)]">
                Solo para pasar el rato
              </p>
              <p className="text-[11.5px] text-[var(--dc-text-muted)]">
                Para mis amigos y para mí
              </p>
            </div>
            <ChevronRight className="w-4 h-4 text-[var(--dc-text-muted)] shrink-0" />
          </button>

          <button
            type="button"
            onClick={() => setTemplateId('gaming')}
            className={`w-full p-3 rounded-2xl border flex items-center gap-3 text-left transition-colors cursor-pointer ${
              templateId === 'gaming'
                ? 'border-[#5865F2] bg-[#5865F2]/15'
                : 'border-[var(--dc-border)] bg-[var(--dc-bg-card)] hover:bg-[var(--dc-bg-elevated)]'
            }`}
          >
            <span className="w-9 h-9 rounded-xl bg-[#23a55a] text-white flex items-center justify-center shrink-0">
              <Gamepad2 className="w-4 h-4" />
            </span>
            <div className="flex-1 min-w-0">
              <p className="font-display font-bold text-sm text-[var(--dc-text-primary)]">
                Para juegos
              </p>
              <p className="text-[11.5px] text-[var(--dc-text-muted)]">
                Para un club o comunidad
              </p>
            </div>
            <ChevronRight className="w-4 h-4 text-[var(--dc-text-muted)] shrink-0" />
          </button>
        </div>

        <div className="space-y-1.5">
          <label className="text-[11px] font-bold uppercase tracking-wider text-[var(--dc-text-muted)] block">
            Nombre del servidor
          </label>
          <input
            type="text"
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={placeholder}
            className="w-full bg-[var(--dc-bg-input)] border border-[var(--dc-border)] rounded-xl px-3 py-2.5 text-sm text-[var(--dc-text-primary)] focus:outline-none focus:border-[#5865F2]"
          />
        </div>

        <div className="flex justify-end gap-2 pt-1">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-full dc-btn-secondary text-xs font-semibold cursor-pointer"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-5 py-2.5 rounded-full dc-btn-primary text-xs font-bold cursor-pointer"
          >
            Crear servidor
          </button>
        </div>
      </form>
    </div>
  );
};

/* ---------------- DISCOVER SERVERS MODAL ---------------- */
export const DiscoverModal: React.FC<{
  open: boolean;
  onClose: () => void;
  onJoinCommunity: (name: string) => void;
}> = ({ open, onClose, onJoinCommunity }) => {
  const [q, setQ] = useState('');
  if (!open) return null;

  const trimmed = q.trim();
  const lowerQ = trimmed.toLowerCase();
  const communities = DISCOVERABLE_COMMUNITIES.filter(
    (c) =>
      !lowerQ ||
      c.name.toLowerCase().includes(lowerQ) ||
      c.category.toLowerCase().includes(lowerQ) ||
      c.desc.toLowerCase().includes(lowerQ)
  );
  const hasExactMatch = communities.some((c) => c.name.toLowerCase() === lowerQ);

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md rounded-3xl bg-[var(--dc-bg-sheet)] border border-[var(--dc-border)] p-5 space-y-4 max-h-[85vh] flex flex-col"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#23a55a]" />
            <h3 className="font-display font-bold text-lg text-[var(--dc-text-primary)]">
              Buscar y descubrir servidores
            </h3>
          </div>
          <button onClick={onClose} className="p-1 text-[var(--dc-text-muted)] cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex items-center gap-2 bg-[var(--dc-bg-input)] rounded-xl px-3 py-2 border border-[var(--dc-border)] focus-within:border-[#5865F2]">
          <Search className="w-4 h-4 text-[var(--dc-text-muted)] shrink-0" />
          <input
            type="text"
            autoFocus
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Buscar servidores por nombre o tema..."
            className="flex-1 bg-transparent text-sm text-[var(--dc-text-primary)] focus:outline-none"
          />
          {q && (
            <button
              type="button"
              onClick={() => setQ('')}
              className="text-[var(--dc-text-muted)] hover:text-white cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="flex-1 overflow-y-auto space-y-2.5">
          {communities.map((c) => (
            <div
              key={c.name}
              className="p-3 rounded-2xl bg-[var(--dc-bg-card)] border border-[var(--dc-border)] flex items-center justify-between gap-3"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-12 h-12 rounded-2xl overflow-hidden border border-white/15 shrink-0">
                  <SafeImage src={c.thumb} alt={c.name} className="w-full h-full object-cover" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <p className="font-bold text-sm text-[var(--dc-text-primary)] truncate">{c.name}</p>
                    <span className="px-1.5 py-0.5 rounded bg-white/10 text-[10px] text-[var(--dc-text-muted)] shrink-0">
                      {c.category}
                    </span>
                  </div>
                  <p className="text-xs text-[var(--dc-text-muted)] mt-0.5 line-clamp-1">{c.desc}</p>
                  <p className="text-[11px] text-[#23a55a] font-semibold mt-1 tabular-nums">
                    {c.online} · {c.members}
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  onJoinCommunity(c.name);
                  setQ('');
                  onClose();
                }}
                className="px-4 py-2 rounded-full dc-btn-success text-xs font-bold shrink-0 cursor-pointer whitespace-nowrap"
              >
                Unirse
              </button>
            </div>
          ))}

          {trimmed && !hasExactMatch && (
            <div className="p-3.5 rounded-2xl bg-[#5865F2]/10 border border-[#5865F2]/30 flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="font-bold text-sm text-[var(--dc-text-primary)] truncate">
                  Crear o unirse a «{trimmed}»
                </p>
                <p className="text-xs text-[var(--dc-text-muted)] mt-0.5">
                  Abre este servidor directamente en tu barra lateral
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  onJoinCommunity(trimmed);
                  setQ('');
                  onClose();
                }}
                className="px-4 py-2 rounded-full dc-btn-primary text-xs font-bold shrink-0 cursor-pointer whitespace-nowrap"
              >
                Crear / Unirse
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
