import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import type { ProfileRecord, RegistrationStatus } from "../types";
import { clashSupabase, clashSupabaseMissingEnvVars, isClashSupabaseConfigured } from "../lib/clashSupabaseClient";
import { sendPasswordReset, signIn, signOut, signUp, updatePassword } from "../services/authService";
import { getSupabaseErrorMessage } from "../utils/errors";
import { displayApiError, normalizeClashTag } from "../utils/tags";

type AuthPanelProps = {
  user: User | null;
  profile: ProfileRecord | null;
  registrationStatus: RegistrationStatus;
  onAuthChanged: () => Promise<void>;
  onMessage: (message: string, type?: "success" | "error" | "info") => void;
};

type AuthMode = "login" | "register" | "forgot";

function LoginIcon() {
  return (
    <svg aria-hidden="true" fill="none" viewBox="0 0 24 24">
      <path d="M10.2 7.2L14.95 12L10.2 16.8" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
      <path d="M14.55 12H3.8" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" />
      <path d="M12.5 4.25H17.2C18.86 4.25 20.2 5.59 20.2 7.25V16.75C20.2 18.41 18.86 19.75 17.2 19.75H12.5" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" />
    </svg>
  );
}

function EyeIcon({ hidden }: { hidden: boolean }) {
  return (
    <svg aria-hidden="true" fill="none" viewBox="0 0 24 24">
      <path d="M3.4 12C5.25 8.55 8.05 6.75 12 6.75C15.95 6.75 18.75 8.55 20.6 12C18.75 15.45 15.95 17.25 12 17.25C8.05 17.25 5.25 15.45 3.4 12Z" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.7" />
      <circle cx="12" cy="12" r="2.45" stroke="currentColor" strokeWidth="1.7" />
      {hidden ? <path d="M4.8 19.2L19.2 4.8" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" /> : null}
    </svg>
  );
}

type PasswordInputProps = {
  ariaDescribedBy?: string;
  invalid?: boolean;
  onChange: (value: string) => void;
  placeholder: string;
  value: string;
};

function PasswordInput({ ariaDescribedBy, invalid = false, onChange, placeholder, value }: PasswordInputProps) {
  const [visible, setVisible] = useState(false);

  return (
    <label className={`password-field ${invalid ? "password-field--invalid" : ""}`}>
      <input
        aria-describedby={ariaDescribedBy}
        aria-invalid={invalid}
        type={visible ? "text" : "password"}
        placeholder={placeholder}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        minLength={8}
      />
      <button
        className="password-field__toggle"
        type="button"
        aria-label={visible ? "Hide password" : "Show password"}
        aria-pressed={visible}
        onClick={() => setVisible((current) => !current)}
      >
        <EyeIcon hidden={!visible} />
      </button>
    </label>
  );
}

function getAuthErrorMessage(error: unknown, fallback: string): string {
  if (error && typeof error === "object") {
    const reason = "reason" in error ? String((error as { reason?: unknown }).reason ?? "") : "";
    const message = "message" in error ? String((error as { message?: unknown }).message ?? "") : "";

    if (reason) {
      return displayApiError(reason, message || fallback);
    }

    if (message.includes("Database error saving new user")) {
      return "Supabase trigger failed while creating profile. Re-run clash_clan/supabase/schema.sql.";
    }
  }

  return getSupabaseErrorMessage(error, fallback);
}

export default function AuthPanel({ user, profile, registrationStatus, onAuthChanged, onMessage }: AuthPanelProps) {
  const [mode, setMode] = useState<AuthMode>("login");
  const [open, setOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [recoveryMode, setRecoveryMode] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [playerTag, setPlayerTag] = useState("");
  const [busy, setBusy] = useState(false);
  const passwordTooShort = mode === "register" && password.length > 0 && password.length < 8;
  const passwordsMismatch = mode === "register" && confirmPassword.length > 0 && password !== confirmPassword;
  const registerDisabled =
    busy ||
    !registrationStatus.enabled ||
    !email ||
    !password ||
    !confirmPassword ||
    !playerTag ||
    password.length < 8 ||
    password !== confirmPassword;

  useEffect(() => {
    if (!registrationStatus.enabled && mode === "register") {
      setMode("login");
    }
  }, [registrationStatus.enabled, mode]);

  useEffect(() => {
    if (!clashSupabase) return undefined;

    if (window.location.hash.includes("type=recovery") || window.location.search.includes("type=recovery")) {
      setRecoveryMode(true);
      setAccountOpen(true);
      setOpen(false);
    }

    const {
      data: { subscription }
    } = clashSupabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") {
        setRecoveryMode(true);
        setAccountOpen(true);
        setOpen(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  async function handleSignIn() {
    if (!email || !password) return;
    setBusy(true);
    try {
      await signIn(email, password);
      setOpen(false);
      await onAuthChanged();
      onMessage("Logged in.", "success");
    } catch (error) {
      onMessage(getAuthErrorMessage(error, "Login failed."), "error");
    } finally {
      setBusy(false);
    }
  }

  async function handleSignUp() {
    if (!email || !password || !confirmPassword || !playerTag) {
      onMessage("Email, password, confirm password and player tag are required.", "error");
      return;
    }

    if (password.length < 8) {
      onMessage("Password must be at least 8 characters.", "error");
      return;
    }

    if (password !== confirmPassword) {
      onMessage("Password and confirm password must match.", "error");
      return;
    }

    setBusy(true);
    try {
      await signUp({ email, password, playerTag });
      setMode("login");
      setPassword("");
      setConfirmPassword("");
      setOpen(false);
      onMessage("Access request sent. Wait for owner approval.", "success");
      await onAuthChanged();
    } catch (error) {
      onMessage(getAuthErrorMessage(error, "Registration failed."), "error");
    } finally {
      setBusy(false);
    }
  }

  async function handleSignOut() {
    setBusy(true);
    try {
      await signOut();
      await onAuthChanged();
      onMessage("Viewer mode enabled.", "info");
    } catch (error) {
      onMessage(getAuthErrorMessage(error, "Logout failed."), "error");
    } finally {
      setBusy(false);
    }
  }

  async function handlePasswordReset() {
    if (!email) {
      onMessage("Email is required.", "error");
      return;
    }

    setBusy(true);
    try {
      await sendPasswordReset(email);
      onMessage("Password reset link sent.", "success");
      setMode("login");
    } catch (error) {
      onMessage(getAuthErrorMessage(error, "Password reset failed."), "error");
    } finally {
      setBusy(false);
    }
  }

  if (!isClashSupabaseConfigured) {
    return (
      <div className="auth-panel auth-panel--warning">
        <strong>Viewer mode</strong>
        <span>Clash Supabase env variables are missing: {clashSupabaseMissingEnvVars.join(", ")}</span>
      </div>
    );
  }

  if (user) {
    const accessLabel = profile ? `${profile.role} / ${profile.status}` : "profile loading";

    return (
      <div className="auth-panel auth-panel--session">
        <div className="auth-panel__identity">
          <strong>{profile?.status === "approved" ? "Access active" : "Viewer mode"}</strong>
          <span title={`${user.email ?? ""} / ${accessLabel}`}>{user.email} / {accessLabel}</span>
          {recoveryMode ? <span>Password recovery mode</span> : null}
        </div>
        <div className="auth-panel__actions">
          <button className="cc-button cc-button--ghost" type="button" onClick={() => setAccountOpen((current) => !current)} disabled={busy}>
            Account
          </button>
          <button className="cc-button cc-button--ghost" type="button" onClick={handleSignOut} disabled={busy}>
            Logout
          </button>
        </div>
        {accountOpen || recoveryMode ? (
          <AccountSettings
            recoveryMode={recoveryMode}
            onDone={async () => {
              setRecoveryMode(false);
              setAccountOpen(false);
              await onAuthChanged();
            }}
            onMessage={onMessage}
          />
        ) : null}
      </div>
    );
  }

  return (
    <div className={`auth-panel auth-panel--collapsed ${open ? "is-open" : ""}`}>
      <button className="auth-toggle" type="button" aria-expanded={open} aria-label="Login" onClick={() => setOpen((current) => !current)}>
        <LoginIcon />
      </button>

      {open ? (
        <form className="auth-popover auth-popover--login" onSubmit={(event) => event.preventDefault()}>
          <div className="auth-popover__header">
            <strong>{getModeTitle(mode)}</strong>
            <span>{!registrationStatus.enabled ? "Registration requests are currently closed." : getModeDescription(mode)}</span>
          </div>
          <input type="email" placeholder="email" value={email} onChange={(event) => setEmail(event.target.value)} />
          {mode !== "forgot" ? (
            <>
              <PasswordInput ariaDescribedBy={passwordTooShort ? "password-error" : undefined} invalid={passwordTooShort} placeholder="password" value={password} onChange={setPassword} />
              {passwordTooShort ? (
                <small className="field-error" id="password-error">
                  Password must be at least 8 characters
                </small>
              ) : null}
            </>
          ) : null}
          {mode === "register" ? (
            <>
              <PasswordInput
                ariaDescribedBy={passwordsMismatch ? "confirm-password-error" : undefined}
                invalid={passwordsMismatch}
                placeholder="confirm password"
                value={confirmPassword}
                onChange={setConfirmPassword}
              />
              {passwordsMismatch ? (
                <small className="field-error" id="confirm-password-error">
                  Passwords do not match
                </small>
              ) : null}
              <input
                placeholder="player tag, e.g. #ABC123"
                value={playerTag}
                onBlur={() => setPlayerTag((current) => normalizeClashTag(current))}
                onChange={(event) => setPlayerTag(event.target.value)}
              />
              <small>После регистрации ожидайте потдтверждения для управления игроками.</small>
            </>
          ) : null}
          <div className="auth-popover__actions">
            <button
              className="cc-button cc-button--secondary"
              type="button"
              onClick={mode === "forgot" ? handlePasswordReset : mode === "login" ? handleSignIn : handleSignUp}
              disabled={mode === "register" ? registerDisabled : busy}
            >
              {mode === "forgot" ? "Send reset link" : mode === "login" ? "Login" : "Send request"}
            </button>
            <button className="cc-button cc-button--ghost" type="button" onClick={() => setMode(mode === "login" ? "register" : "login")} disabled={busy || (!registrationStatus.enabled && mode === "login")}>
              {mode === "login" ? "Register" : "Back to login"}
            </button>
            {mode === "login" ? (
              <button className="cc-button cc-button--ghost" type="button" onClick={() => setMode("forgot")} disabled={busy}>
                Forgot password
              </button>
            ) : null}
          </div>
        </form>
      ) : null}
    </div>
  );
}

type AccountSettingsProps = {
  recoveryMode: boolean;
  onDone: () => Promise<void>;
  onMessage: (message: string, type?: "success" | "error" | "info") => void;
};

function AccountSettings({ recoveryMode, onDone, onMessage }: AccountSettingsProps) {
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [busy, setBusy] = useState(false);

  async function handleUpdatePassword() {
    if (newPassword.length < 8) {
      onMessage("New password must be at least 8 characters.", "error");
      return;
    }

    if (newPassword !== confirmNewPassword) {
      onMessage("New password and confirmation must match.", "error");
      return;
    }

    setBusy(true);
    try {
      await updatePassword(newPassword);
      setNewPassword("");
      setConfirmNewPassword("");
      onMessage("Password updated successfully.", "success");
      await onDone();
    } catch (error) {
      onMessage(getAuthErrorMessage(error, "Password update failed."), "error");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form className="auth-popover auth-popover--account" onSubmit={(event) => event.preventDefault()}>
      <div className="auth-popover__header">
        <strong>{recoveryMode ? "Set new password" : "Account settings"}</strong>
        <span>{recoveryMode ? "Choose a new password for this account." : "Update your own Supabase Auth password."}</span>
      </div>
      <PasswordInput placeholder="new password" value={newPassword} onChange={setNewPassword} />
      <PasswordInput placeholder="confirm new password" value={confirmNewPassword} onChange={setConfirmNewPassword} />
      <div className="auth-popover__actions">
        <button className="cc-button cc-button--secondary" type="button" onClick={handleUpdatePassword} disabled={busy}>
          Update password
        </button>
      </div>
    </form>
  );
}

function getModeTitle(mode: AuthMode): string {
  if (mode === "forgot") return "Reset password";
  if (mode === "register") return "Access request";
  return "Viewer mode";
}

function getModeDescription(mode: AuthMode): string {
  if (mode === "forgot") return "Enter your email to receive a password reset link.";
  if (mode === "register") return "Request access with your Clash player tag.";
  return "Login or request access.";
}
