import { useMemo, useState } from "react";
import type { ProfileRecord, ProfileStatus, RegistrationStatus } from "../types";

type Filter = ProfileStatus | "all";

type AdminAccessPanelProps = {
  currentProfile: ProfileRecord;
  profiles: ProfileRecord[];
  registrationStatus: RegistrationStatus;
  onApprove: (profileId: string) => Promise<void>;
  onReject: (profileId: string) => Promise<void>;
  onRevoke: (profileId: string) => Promise<void>;
  onDelete: (profileId: string) => Promise<void>;
  onSetRegistrationOpen: (enabled: boolean) => Promise<void>;
};

const filters: Filter[] = ["pending", "approved", "rejected", "revoked", "all"];

export default function AdminAccessPanel({
  currentProfile,
  profiles,
  registrationStatus,
  onApprove,
  onReject,
  onRevoke,
  onDelete,
  onSetRegistrationOpen
}: AdminAccessPanelProps) {
  const [filter, setFilter] = useState<Filter>("pending");

  const visibleProfiles = useMemo(() => {
    return filter === "all" ? profiles : profiles.filter((profile) => profile.status === filter);
  }, [filter, profiles]);

  return (
    <section className="access-panel">
      <div className="section-title">
        <span className="eyebrow">Owner access control</span>
        <h2>AdminAccessPanel</h2>
      </div>

      <div className="access-panel__toolbar">
        <div className="segmented-control" role="group" aria-label="Access filters">
          {filters.map((item) => (
            <button className={filter === item ? "is-active" : ""} key={item} type="button" onClick={() => setFilter(item)}>
              {item}
            </button>
          ))}
        </div>
        <button className="cc-button cc-button--secondary" type="button" onClick={() => onSetRegistrationOpen(!registrationStatus.enabled)}>
          {registrationStatus.enabled ? "Close registration" : "Open registration"}
        </button>
      </div>

      <div className="access-list">
        {visibleProfiles.length === 0 ? (
          <div className="empty-state empty-state--wide">
            <strong>No users in this filter</strong>
            <p>Requests will appear here after registration.</p>
          </div>
        ) : (
          visibleProfiles.map((profile) => {
            const targetIsOwner = profile.role === "owner";
            const isSelf = profile.id === currentProfile.id;
            const canManage = !targetIsOwner && !isSelf;

            return (
              <article className="access-card" key={profile.id}>
                <div className="access-card__main">
                  <div>
                    <strong>{profile.email ?? "No email"}</strong>
                    <span>{profile.username ?? "No username"} · {profile.role} · {profile.status}</span>
                  </div>
                  <div className="access-card__meta">
                    <span>Player: {profile.nickname ?? profile.clash_name ?? "Unknown"} ({profile.clash_tag ?? "No tag"})</span>
                    <span>Town Hall: {profile.townhall_level ?? "?"}</span>
                  </div>
                </div>
                <div className="access-card__dates">
                  <span>Created: {new Date(profile.created_at).toLocaleString("ru-RU")}</span>
                  <span>Approved: {profile.approved_at ? new Date(profile.approved_at).toLocaleString("ru-RU") : "none"}</span>
                  <span>Last login: {profile.last_login_at ? new Date(profile.last_login_at).toLocaleString("ru-RU") : "none"}</span>
                </div>
                <div className="access-card__actions">
                  <button className="mini-button" type="button" onClick={() => onApprove(profile.id)} disabled={!canManage}>
                    Approve as admin
                  </button>
                  <button className="mini-button mini-button--blacklist" type="button" onClick={() => onReject(profile.id)} disabled={!canManage}>
                    Reject
                  </button>
                  <button className="mini-button mini-button--blacklist" type="button" onClick={() => onRevoke(profile.id)} disabled={!canManage}>
                    Revoke access
                  </button>
                  <button className="mini-button mini-button--danger" type="button" onClick={() => onDelete(profile.id)} disabled={!canManage}>
                    Delete user
                  </button>
                </div>
              </article>
            );
          })
        )}
      </div>
    </section>
  );
}
