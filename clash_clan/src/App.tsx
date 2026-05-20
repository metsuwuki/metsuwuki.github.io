import { useEffect, useMemo, useState } from "react";
import type { User } from "@supabase/supabase-js";
import clanIcon from "../assets/clash_icon.png";
import AdminAccessPanel from "./components/AdminAccessPanel";
import AuthPanel from "./components/AuthPanel";
import BlacklistPanel from "./components/BlacklistPanel";
import ClanCard from "./components/ClanCard";
import Modal from "./components/Modal";
import NavIcon from "./components/NavIcon";
import { fixedClans } from "./data/fixedClans";
import {
  checkClashSupabaseConnection,
  clashSupabase,
  clashSupabaseHost,
  clashSupabaseMissingEnvVars,
  clearClashSupabaseSession,
  isClashSupabaseConfigured
} from "./lib/clashSupabaseClient";
import { runClashNetworkDiagnostics, type NetworkDiagnostic } from "./lib/clashSupabaseRest";
import { approveUser, deleteProfile, listProfiles, rejectUser, revokeUser } from "./services/accessService";
import { getCurrentUser, getMyProfile, updateLastLogin } from "./services/authService";
import { addPlayerToBlacklist, createPlayer, deletePlayer, getBlacklist, getPlayersWithRelations, movePlayerToClan, updatePlayer, setWarReady, type PlayerInput } from "./services/playerService";
import { getClanRulesSettings, getRegistrationStatus, saveClanRules, setRegistrationOpen } from "./services/settingsService";
import type { AccountType, BlacklistRecord, ClanKey, ClanRulesSettings, PlayerRecord, PlayerRole, PlayerWithRelations, ProfileRecord, RegistrationStatus, Toast } from "./types";
import { getErrorDebugDetails, getSupabaseErrorMessage, isSupabaseFetchError } from "./utils/errors";
import { animesitePath, mainSitePath } from "./utils/siteRoutes";
import { normalizeClashTag } from "./utils/tags";

type ActiveModal =
  | { type: "player"; clanKey: ClanKey; player?: PlayerRecord }
  | null;

const defaultPlayerRole: PlayerRole = "member";
const defaultClanRules: ClanRulesSettings = {
  version: "default-rules",
  content: `# Правила клану !!!Ukraine!!!

## 1. Загальні правила

* Поважайте всіх учасників клану.
* Заборонені:
  * образи
  * токсична поведінка
  * провокації
  * расизм та дискримінація
* Будьте активними:
  * спілкуйтесь
  * допомагайте союзникам
  * беріть участь у подіях клану
* Неактивність без попередження може призвести до виключення.

---

## 2. Донати

* Донати є обов’язковими для всіх учасників.
* Намагайтесь підтримувати хороший баланс отриманих та відправлених військ.
* Мінімальна активність по донатах — 1000 за сезон.

---

## 3. Війни кланів (КВ)

* Якщо у вас зелений щит — атаки ОБОВ’ЯЗКОВІ.
* Перша атака:
  * дзеркало
* Друга атака:
  * добивання
  * або атака для 3★
* Пропуск атак без причини:
  * попередження
  * повторно → виключення

---

## 4. Ліга воєн кланів (ЛВК)

* Для участі:
  * зелений щит
  * усі герої повинні бути доступні
* Атакуємо дзеркало або ціль, узгоджену з лідером.
* У клані діє ротація учасників ЛВК.

---

## 5. Вимоги до атак

* Нижчий ТХ → 3★
* Свій ТХ → мінімум 2★
* Вищий ТХ → мінімум 1★

---

## 6. Поведінка в чаті

* Спілкування має бути адекватним та дружнім.
* Конфлікти вирішуються спокійно.
* Конструктивна критика дозволена.
* Спам та флуд заборонені.

---

## 7. Дисципліна

Керівництво клану має право:

* видати попередження
* виключити гравця
* обмежити участь у війнах

Рішення приймаються для підтримки порядку та активності клану.

---

## 8. Додатково

Якщо у вас є:

* ідеї
* пропозиції
* зміни до правил

звертайтесь до керівництва клану.

Дотримання правил є обов’язковим для всіх учасників.`
};

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<ProfileRecord | null>(null);
  const [profiles, setProfiles] = useState<ProfileRecord[]>([]);
  const [registrationStatus, setRegistrationStatusState] = useState<RegistrationStatus>({ enabled: true });
  const [players, setPlayers] = useState<PlayerWithRelations[]>([]);
  const [blacklist, setBlacklist] = useState<BlacklistRecord[]>([]);
  const [rulesSettings, setRulesSettings] = useState<ClanRulesSettings>(defaultClanRules);
  const [rulesOpen, setRulesOpen] = useState(false);
  const [rulesAcknowledgedVersion, setRulesAcknowledgedVersion] = useState("");
  const [modal, setModal] = useState<ActiveModal>(null);
  const [toast, setToast] = useState<Toast | null>(null);
  const [loadError, setLoadError] = useState("");
  const [loadErrorDetails, setLoadErrorDetails] = useState("");
  const [networkDiagnostics, setNetworkDiagnostics] = useState<NetworkDiagnostic[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [draggedPlayerId, setDraggedPlayerId] = useState<string | null>(null);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const isOwner = Boolean(profile?.status === "approved" && profile.role === "owner");
  const canManage = Boolean(profile?.status === "approved" && (profile.role === "owner" || profile.role === "admin"));
  const modeLabel = profile?.status === "approved" ? `${profile.role} mode` : "Viewer mode";
  const accessNotice = getAccessNotice(user, profile);
  const rulesStorageKey = `clash-clan-rules-ack:${user?.id ?? "guest"}`;
  const hasUnreadRules = rulesAcknowledgedVersion !== rulesSettings.version;

  function showMessage(message: string, type: Toast["type"] = "info") {
    setToast({ message, type });
    window.setTimeout(() => setToast(null), 6200);
  }

  async function loadData() {
    if (!isClashSupabaseConfigured) {
      setLoadError("Clash Supabase env variables are missing");
      setLoadErrorDetails(`Required: ${clashSupabaseMissingEnvVars.join(", ")}`);
      setLoading(false);
      return;
    }

    setLoading(true);
    const [playersResult, blacklistResult, rulesResult] = await Promise.allSettled([
      getPlayersWithRelations(),
      getBlacklist(),
      getClanRulesSettings(defaultClanRules)
    ]);

    if (playersResult.status === "fulfilled") {
      setPlayers(playersResult.value);
    }

    if (blacklistResult.status === "fulfilled") {
      setBlacklist(blacklistResult.value);
    }

    if (rulesResult.status === "fulfilled") {
      setRulesSettings(rulesResult.value);
    } else {
      console.warn("Clan rules settings request failed:", rulesResult.reason);
    }

    const failed = [
      { name: "players", result: playersResult },
      { name: "blacklist", result: blacklistResult }
    ].filter((entry) => entry.result.status === "rejected");

    if (failed.length === 0) {
      setLoadError("");
      setLoadErrorDetails("");
    } else {
      failed.forEach((entry) => {
        if (entry.result.status === "rejected") {
          console.error(`Clash Supabase ${entry.name} request failed:`, entry.result.reason);
        }
      });

      const primary = failed[0];
      const error = primary.result.status === "rejected" ? primary.result.reason : null;
      setLoadError(getSupabaseErrorMessage(error, `Failed to load ${primary.name}`));
      setLoadErrorDetails(error ? `${primary.name}: ${getErrorDebugDetails(error)}` : "");

      if (failed.some((entry) => entry.result.status === "rejected" && isSupabaseFetchError(entry.result.reason))) {
        setNetworkDiagnostics(await runClashNetworkDiagnostics());
      }
    }

    setLoading(false);
  }

  async function handleRunDiagnostics() {
    const results = await runClashNetworkDiagnostics();
    setNetworkDiagnostics(results);
    const failed = results.filter((result) => !result.ok);
    showMessage(failed.length ? "Network diagnostics found blocked Supabase requests." : "Network diagnostics passed.", failed.length ? "error" : "success");
  }

  async function refreshAuthState() {
    if (!isClashSupabaseConfigured) {
      setUser(null);
      setProfile(null);
      return;
    }

    const [currentUser, registration] = await Promise.all([
      getCurrentUser().catch(() => null),
      getRegistrationStatus().catch(() => ({ enabled: true }))
    ]);
    setUser(currentUser);
    setRegistrationStatusState(registration);

    if (!currentUser) {
      setProfile(null);
      setProfiles([]);
      return;
    }

    const currentProfile = await getMyProfile();
    setProfile(currentProfile);
    if (currentProfile?.status === "approved" && currentProfile.role === "owner") {
      setProfiles(await listProfiles());
    } else {
      setProfiles([]);
    }
  }

  async function refreshProfiles() {
    if (isOwner) {
      setProfiles(await listProfiles());
    }
    setProfile(await getMyProfile());
  }

  useEffect(() => {
    if (!clashSupabase) {
      setLoading(false);
      return;
    }

    void checkClashSupabaseConnection();
    void refreshAuthState();
    const {
      data: { subscription }
    } = clashSupabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        void updateLastLogin().catch(() => undefined);
      }
      void refreshAuthState();
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    void loadData();
  }, []);

  useEffect(() => {
    setRulesAcknowledgedVersion(window.localStorage.getItem(rulesStorageKey) ?? "");
  }, [rulesStorageKey]);

  const playersByClan = useMemo(() => {
    return fixedClans.reduce<Record<ClanKey, PlayerWithRelations[]>>((accumulator, clan) => {
      accumulator[clan.key] = players.filter((player) => player.current_clan_key === clan.key);
      return accumulator;
    }, { ukraine: [], raybojniki: [] });
  }, [players]);

  async function handleSavePlayer(input: PlayerInput, player?: PlayerRecord) {
    if (!canManage || saving) return;
    setSaving(true);

    try {
      if (player) {
        const updated = await updatePlayer(player.id, input);
        showMessage(`${updated.nickname} updated.`, "success");
      } else {
        const created = await createPlayer(input);
        showMessage(`${created.nickname} added.`, "success");
      }
      await loadData();
      setModal(null);
    } catch (error) {
      showMessage(getSupabaseErrorMessage(error, "Failed to save player"), "error");
    } finally {
      setSaving(false);
    }
  }

  async function handleMovePlayer(player: PlayerRecord, clanKey: ClanKey) {
    if (!canManage || player.current_clan_key === clanKey) return;
    const previousPlayers = players;
    const isAwayFromHome = player.home_clan_key !== clanKey;
    setPlayers((current) =>
      current.map((item) =>
        item.id === player.id
          ? {
              ...item,
              current_clan_key: clanKey,
              home_clan_timer_paused: isAwayFromHome,
              home_clan_timer_paused_at: isAwayFromHome ? item.home_clan_timer_paused_at ?? new Date().toISOString() : null
            }
          : item
      )
    );

    try {
      await movePlayerToClan(player.id, clanKey);
      await loadData();
      showMessage(`${player.nickname} moved.`, "success");
    } catch (error) {
      setPlayers(previousPlayers);
      showMessage(getSupabaseErrorMessage(error, "Failed to move player"), "error");
    }
  }

  async function handleDropPlayer(clanKey: ClanKey) {
    const player = players.find((item) => item.id === draggedPlayerId);
    setDraggedPlayerId(null);
    if (player) {
      await handleMovePlayer(player, clanKey);
    }
  }

  async function handleToggleWarReady(player: PlayerRecord) {
    if (!canManage) return;
    const nextWarReady = !(player.war_ready !== false);
    const previousPlayers = players;
    setPlayers((current) => current.map((item) => (item.id === player.id ? { ...item, war_ready: nextWarReady } : item)));

    try {
      await setWarReady(player.id, nextWarReady);
      await loadData();
    } catch (error) {
      setPlayers(previousPlayers);
      showMessage(getSupabaseErrorMessage(error, "Failed to update shield"), "error");
    }
  }

  async function handleDeletePlayer(player: PlayerRecord) {
    if (!canManage || !window.confirm(`Удалить ${player.nickname} из списка?`)) return;
    const previousPlayers = players;
    setPlayers((current) => current.filter((item) => item.id !== player.id));

    try {
      await deletePlayer(player.id);
      showMessage(`${player.nickname} deleted.`, "success");
    } catch (error) {
      setPlayers(previousPlayers);
      showMessage(getSupabaseErrorMessage(error, "Failed to delete player"), "error");
    }
  }

  async function handleBlacklistPlayer(player: PlayerRecord) {
    if (!canManage) return;
    if (blacklist.some((item) => item.player_tag === player.player_tag)) {
      showMessage("Player is already in blacklist.", "info");
      return;
    }

    const previousPlayers = players;
    setSaving(true);
    try {
      const entry = await addPlayerToBlacklist({
        nickname: player.nickname,
        playerTag: player.player_tag,
        townHallLevel: player.town_hall_level
      });
      await deletePlayer(player.id);
      setBlacklist((current) => [entry, ...current]);
      setPlayers((current) => current.filter((item) => item.id !== player.id));
      showMessage(`${player.nickname} moved to blacklist.`, "success");
    } catch (error) {
      setPlayers(previousPlayers);
      showMessage(getSupabaseErrorMessage(error, "Failed to blacklist player"), "error");
    } finally {
      setSaving(false);
    }
  }

  function handleAcknowledgeRules() {
    window.localStorage.setItem(rulesStorageKey, rulesSettings.version);
    setRulesAcknowledgedVersion(rulesSettings.version);
    showMessage("Правила отмечены как прочитанные.", "success");
  }

  async function handleSaveRules(content: string) {
    if (!isOwner) return;
    setSaving(true);
    try {
      const nextRules = await saveClanRules(content);
      setRulesSettings(nextRules);
      window.localStorage.setItem(rulesStorageKey, nextRules.version);
      setRulesAcknowledgedVersion(nextRules.version);
      showMessage("Правила обновлены.", "success");
    } catch (error) {
      showMessage(getSupabaseErrorMessage(error, "Failed to save rules"), "error");
      throw error;
    } finally {
      setSaving(false);
    }
  }

  const navLinks = [
    { href: mainSitePath(), icon: <NavIcon name="home" className="cc-nav__icon" />, label: "Главная" },
    { href: animesitePath(), icon: <NavIcon name="kagami" className="cc-nav__icon" />, label: "KAGAMI" },
    { href: "#dashboard", icon: <img src={clanIcon} alt="" className="cc-nav__icon cc-nav__icon--image" />, label: "Кланы" },
    { href: "#blacklist", icon: <NavIcon name="ban" className="cc-nav__icon" />, label: "Blacklist" }
  ];

  return (
    <main className="cc-shell">
      <div className="cc-backdrop" aria-hidden="true">
        <div className="cc-backdrop__scene" />
        <div className="cc-backdrop__scene-glow" />
        <div className="cc-backdrop__fireflies cc-backdrop__fireflies--one" />
        <div className="cc-backdrop__fireflies cc-backdrop__fireflies--two" />
        <div className="cc-backdrop__vignette" />
        <div className="cc-backdrop__glow cc-backdrop__glow--one" />
        <div className="cc-backdrop__glow cc-backdrop__glow--two" />
      </div>

      <header className="cc-header">
        <div className="cc-brand">
          <span className="cc-brand__mark">
            <img src={clanIcon} alt="" />
          </span>
          <div>
            <strong>Clash Clan Management</strong>
          </div>
        </div>

        <nav className="cc-nav cc-nav--desktop" aria-label="Основная навигация">
          {navLinks.map((item) => (
            <a href={item.href} key={item.href} onClick={() => setMobileNavOpen(false)}>
              {item.icon}
              {item.label}
            </a>
          ))}
        </nav>

        <div className="cc-header__actions">
          <AuthPanel user={user} profile={profile} registrationStatus={registrationStatus} onAuthChanged={refreshAuthState} onMessage={showMessage} />
          <button
            className="cc-menu-toggle"
            type="button"
            aria-expanded={mobileNavOpen}
            aria-controls="cc-mobile-navigation"
            aria-label={mobileNavOpen ? "Закрыть меню" : "Открыть меню"}
            onClick={() => setMobileNavOpen((current) => !current)}
          >
            <span className={mobileNavOpen ? "is-open" : ""} />
            <span className={mobileNavOpen ? "is-open" : ""} />
            <span className={mobileNavOpen ? "is-open" : ""} />
          </button>
        </div>

        {mobileNavOpen ? (
          <div className="cc-header__mobile" id="cc-mobile-navigation">
            <nav className="cc-header__mobile-nav" aria-label="Мобильная навигация">
              {navLinks.map((item) => (
                <a href={item.href} key={item.href} onClick={() => setMobileNavOpen(false)}>
                  {item.icon}
                  {item.label}
                </a>
              ))}
            </nav>
          </div>
        ) : null}
      </header>

      <section className="cc-hero">
        <div className="cc-hero__copy">
          <span className="eyebrow">!!!Ukraine!!! x РАЗБОЙНИКИ</span>
          <h1>Менеджмент участников клана</h1>
        </div>
        <div className="cc-hero__actions">
          <button className="cc-button cc-button--secondary rules-button" type="button" onClick={() => setRulesOpen(true)}>
            Правила
            {hasUnreadRules ? <span className="rules-button__badge">1</span> : null}
          </button>
          <span className={`mode-pill ${canManage ? "mode-pill--admin" : ""}`}>{modeLabel}</span>
        </div>
      </section>

      {toast ? <div className={`toast toast--${toast.type}`}>{toast.message}</div> : null}
      {accessNotice ? <div className="toast toast--info">{accessNotice}</div> : null}

      {(loadError || networkDiagnostics.length > 0) ? (
        <section className="diagnostic-card" aria-live="polite">
          <div>
            <strong>Supabase status</strong>
            {loadError ? <span>{loadError}</span> : <span>Network diagnostics are available below.</span>}
            {clashSupabaseHost ? <small>Host: {clashSupabaseHost}</small> : null}
            {loadErrorDetails ? <small>{loadErrorDetails}</small> : null}
            {networkDiagnostics.length > 0 ? (
              <div className="diagnostic-list">
                {networkDiagnostics.map((item) => (
                  <small className={item.ok ? "diagnostic-list__ok" : "diagnostic-list__fail"} key={item.name}>
                    {item.name}: {item.message} · {item.url}
                  </small>
                ))}
              </div>
            ) : null}
          </div>
          <div className="diagnostic-card__actions">
            <button className="cc-button cc-button--secondary" type="button" onClick={() => void loadData()}>
              Retry
            </button>
            <button className="cc-button cc-button--secondary" type="button" onClick={() => void handleRunDiagnostics()}>
              Test network
            </button>
            <button
              className="cc-button cc-button--danger"
              type="button"
              onClick={async () => {
                await clearClashSupabaseSession();
                window.location.reload();
              }}
            >
              Reset Clash session
            </button>
          </div>
        </section>
      ) : null}

      <section className="dashboard" id="dashboard">
        {loading ? (
          <div className="loading-card">Загрузка игроков...</div>
        ) : (
          fixedClans.map((clan) => (
            <ClanCard
              allClans={fixedClans}
              clan={clan}
              isAdmin={canManage}
              isDropTarget={draggedPlayerId !== null}
              key={clan.key}
              onAddPlayer={(clanKey) => setModal({ type: "player", clanKey })}
              onBlacklistPlayer={handleBlacklistPlayer}
              onDeletePlayer={handleDeletePlayer}
              onDragStart={setDraggedPlayerId}
              onDropPlayer={handleDropPlayer}
              onEditPlayer={(player) => setModal({ type: "player", clanKey: player.current_clan_key, player })}
              onMovePlayer={handleMovePlayer}
              onToggleWarReady={handleToggleWarReady}
              players={playersByClan[clan.key] ?? []}
            />
          ))
        )}
      </section>

      <div id="blacklist">
        <BlacklistPanel items={blacklist} />
      </div>

      {isOwner && profile ? (
        <AdminAccessPanel
          currentProfile={profile}
          profiles={profiles}
          registrationStatus={registrationStatus}
          onApprove={async (profileId) => {
            try {
              await approveUser(profileId);
              await refreshProfiles();
              showMessage("User approved as admin.", "success");
            } catch (error) {
              showMessage(getSupabaseErrorMessage(error, "Failed to approve user"), "error");
            }
          }}
          onReject={async (profileId) => {
            try {
              await rejectUser(profileId);
              await refreshProfiles();
              showMessage("User rejected.", "success");
            } catch (error) {
              showMessage(getSupabaseErrorMessage(error, "Failed to reject user"), "error");
            }
          }}
          onRevoke={async (profileId) => {
            try {
              await revokeUser(profileId);
              await refreshProfiles();
              showMessage("Access revoked.", "success");
            } catch (error) {
              showMessage(getSupabaseErrorMessage(error, "Failed to revoke access"), "error");
            }
          }}
          onDelete={async (profileId) => {
            if (!window.confirm("Delete profile from database? Auth user deletion is not done from frontend.")) return;
            try {
              await deleteProfile(profileId);
              await refreshProfiles();
              showMessage("Profile deleted.", "success");
            } catch (error) {
              showMessage(getSupabaseErrorMessage(error, "Failed to delete profile"), "error");
            }
          }}
          onSetRegistrationOpen={async (enabled) => {
            const next = await setRegistrationOpen(enabled);
            setRegistrationStatusState(next);
            showMessage(enabled ? "Registration opened." : "Registration closed.", "success");
          }}
        />
      ) : null}

      {modal?.type === "player" ? (
        <PlayerModal
          clanKey={modal.clanKey}
          player={modal.player}
          saving={saving}
          allPlayers={players}
          onClose={() => setModal(null)}
          onSave={handleSavePlayer}
        />
      ) : null}

      {rulesOpen ? (
        <RulesModal
          canEdit={isOwner}
          rules={rulesSettings}
          saving={saving}
          unread={hasUnreadRules}
          onAcknowledge={handleAcknowledgeRules}
          onClose={() => setRulesOpen(false)}
          onSave={handleSaveRules}
        />
      ) : null}
    </main>
  );
}

type PlayerModalProps = {
  allPlayers: PlayerWithRelations[];
  clanKey: ClanKey;
  player?: PlayerRecord;
  saving: boolean;
  onClose: () => void;
  onSave: (input: PlayerInput, player?: PlayerRecord) => Promise<void>;
};

type RulesModalProps = {
  canEdit: boolean;
  rules: ClanRulesSettings;
  saving: boolean;
  unread: boolean;
  onAcknowledge: () => void;
  onClose: () => void;
  onSave: (content: string) => Promise<void>;
};

function RulesModal({ canEdit, rules, saving, unread, onAcknowledge, onClose, onSave }: RulesModalProps) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(rules.content);

  useEffect(() => {
    setDraft(rules.content);
  }, [rules.content]);

  return (
    <Modal title="Правила клану !!!Ukraine!!!" onClose={onClose}>
      <div className="rules-page">
        <div className="rules-page__hero">
          <span className="eyebrow">Clan codex</span>
          <h2>Правила та дисципліна</h2>
          <p>Ознайомтесь з правилами клану. Нові зміни позначаються червоним індикатором біля кнопки правил.</p>
          {rules.updated_at ? <small>Оновлено: {new Date(rules.updated_at).toLocaleString()}</small> : null}
        </div>

        {editing ? (
          <textarea className="rules-editor" value={draft} onChange={(event) => setDraft(event.target.value)} rows={24} />
        ) : (
          <div className="rules-content">{renderRulesMarkdown(rules.content)}</div>
        )}

        <div className="rules-page__actions">
          {canEdit ? (
            editing ? (
              <>
                <button
                  className="cc-button cc-button--secondary"
                  type="button"
                  onClick={async () => {
                    try {
                      await onSave(draft);
                      setEditing(false);
                    } catch {
                      // Error toast is shown by the save handler.
                    }
                  }}
                  disabled={saving || !draft.trim()}
                >
                  Сохранить правила
                </button>
                <button className="cc-button cc-button--ghost" type="button" onClick={() => setEditing(false)} disabled={saving}>
                  Отмена
                </button>
              </>
            ) : (
              <button className="cc-button cc-button--ghost" type="button" onClick={() => setEditing(true)}>
                Редактировать
              </button>
            )
          ) : null}
          <button className="cc-button cc-button--primary" type="button" onClick={onAcknowledge} disabled={!unread}>
            {unread ? "Ознакомлен" : "Ознакомлен"}
          </button>
        </div>
      </div>
    </Modal>
  );
}

function PlayerModal({ allPlayers, clanKey, player, saving, onClose, onSave }: PlayerModalProps) {
  const [nickname, setNickname] = useState(player?.nickname ?? "");
  const [playerTag, setPlayerTag] = useState(player?.player_tag ?? "");
  const [townHallLevel, setTownHallLevel] = useState(String(player?.town_hall_level ?? 16));
  const [role, setRole] = useState<PlayerRole>(player?.role ?? defaultPlayerRole);
  const [accountType, setAccountType] = useState<AccountType>(player?.account_type ?? "main");
  const [mainPlayerId, setMainPlayerId] = useState(player?.main_player_id ?? "");
  const [homeClanKey, setHomeClanKey] = useState<ClanKey>(player?.home_clan_key ?? player?.clan_key ?? clanKey);
  const [currentClanKey, setCurrentClanKey] = useState<ClanKey>(player?.current_clan_key ?? player?.clan_key ?? clanKey);
  const [joinedHomeClanAt, setJoinedHomeClanAt] = useState(player?.joined_home_clan_at ?? "");
  const mainAccountOptions = allPlayers.filter((item) => item.account_type === "main" && item.id !== player?.id);
  const title = player ? `Редактировать ${player.nickname}` : "Добавить игрока";
  const saveDisabled = saving || !nickname.trim() || !playerTag.trim() || (accountType === "twink" && !mainPlayerId);

  return (
    <Modal title={title} onClose={onClose}>
      <form className="modal-form" onSubmit={(event) => event.preventDefault()}>
        <label>
          Ник
          <input value={nickname} onChange={(event) => setNickname(event.target.value)} autoFocus />
        </label>
        <label>
          # тег игрока
          <input value={playerTag} onBlur={() => setPlayerTag((current) => normalizeClashTag(current))} onChange={(event) => setPlayerTag(event.target.value)} placeholder="#ABC123" />
        </label>
        <label>
          Уровень ратуши
          <input min={1} max={18} type="number" value={townHallLevel} onChange={(event) => setTownHallLevel(event.target.value)} />
        </label>
        <label>
          Account type
          <select
            value={accountType}
            onChange={(event) => {
              const next = event.target.value as AccountType;
              setAccountType(next);
              if (next === "main") setMainPlayerId("");
            }}
          >
            <option value="main">Main account</option>
            <option value="twink">Alt/Twink account</option>
          </select>
        </label>
        {accountType === "twink" ? (
          <label>
            Основной аккаунт
            <select value={mainPlayerId} onChange={(event) => setMainPlayerId(event.target.value)}>
              <option value="">Выберите основу</option>
              {mainAccountOptions.map((mainPlayer) => (
                <option key={mainPlayer.id} value={mainPlayer.id}>
                  {mainPlayer.nickname} · {mainPlayer.player_tag}
                </option>
              ))}
            </select>
          </label>
        ) : null}
        <label>
          Должность
          <select value={role} onChange={(event) => setRole(event.target.value as PlayerRole)}>
            <option value="leader">Глава</option>
            <option value="coLeader">Соруководитель</option>
            <option value="member">Участник</option>
          </select>
        </label>
        <label>
          Основной клан
          <select value={homeClanKey} onChange={(event) => setHomeClanKey(event.target.value as ClanKey)}>
            {fixedClans.map((clan) => (
              <option key={clan.key} value={clan.key}>
                {clan.name}
              </option>
            ))}
          </select>
        </label>
        <label>
          Текущий клан
          <select value={currentClanKey} onChange={(event) => setCurrentClanKey(event.target.value as ClanKey)}>
            {fixedClans.map((clan) => (
              <option key={clan.key} value={clan.key}>
                {clan.name}
              </option>
            ))}
          </select>
        </label>
        <label>
          В основном клане с
          <input type="date" value={joinedHomeClanAt} onChange={(event) => setJoinedHomeClanAt(event.target.value)} />
        </label>
        <button
          className="cc-button cc-button--primary"
          type="button"
          disabled={saveDisabled}
          onClick={() =>
            onSave(
              {
                homeClanKey,
                currentClanKey,
                nickname,
                playerTag,
                role,
                townHallLevel: Number(townHallLevel) || 1,
                accountType,
                mainPlayerId: accountType === "twink" ? mainPlayerId : null,
                joinedHomeClanAt: joinedHomeClanAt || null
              },
              player
            )
          }
        >
          {saving ? "Сохранение..." : "Сохранить"}
        </button>
      </form>
    </Modal>
  );
}

function renderRulesMarkdown(content: string) {
  return content.split(/\n+/).map((line, index) => {
    const trimmed = line.trim();
    const key = `${index}-${trimmed}`;

    if (!trimmed) return null;
    if (trimmed === "---") return <hr key={key} />;
    if (trimmed.startsWith("# ")) return <h1 key={key}>{trimmed.slice(2)}</h1>;
    if (trimmed.startsWith("## ")) return <h2 key={key}>{trimmed.slice(3)}</h2>;
    if (trimmed.startsWith("* ")) return <p className="rules-content__item" key={key}>{trimmed.slice(2)}</p>;

    return <p key={key}>{trimmed}</p>;
  });
}

function getAccessNotice(user: User | null, profile: ProfileRecord | null): string {
  if (!user) return "";

  if (!profile) {
    return "Профиль загружается. Пока доступен только режим просмотра.";
  }

  if (profile.status === "pending") {
    return "Заявка ожидает одобрения. Пока доступен только режим просмотра.";
  }

  if (profile.status === "rejected") {
    return "Заявка отклонена. Доступен только режим просмотра.";
  }

  if (profile.status === "revoked") {
    return "Доступ отозван. Доступен только режим просмотра.";
  }

  return "";
}
