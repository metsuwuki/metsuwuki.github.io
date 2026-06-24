import { useEffect, useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import profileAvatar from "../../assets/profile.png";
import profileAvatar1 from "../../assets/profile1.png";
import profileAvatar2 from "../../assets/profile2.png";
import profileAvatar3 from "../../assets/profile3.png";
import profileAvatar4 from "../../assets/profile4.png";
import profileAvatar5 from "../../assets/profile5.png";
import profileAvatar6 from "../../assets/profile6.png";
import profileAvatar7 from "../../assets/profile7.png";
import mikaAvatar from "../../mika.jpg";
import ownerAvatar from "../../metsuki.jpg";
import { SectionHeading } from "../components/SectionHeading";
import { UiIcon } from "../components/UiIcon";
import { useGuestbook } from "../hooks/useGuestbook";
import { useMotionSettings } from "../hooks/useMotionSettings";
import { usePageLocale } from "../i18n/pageLocale";
import { getRevealProps } from "../utils/motion";

const MAX_NAME = 50;
const MAX_MSG = 500;
const avatarOptions = [
  { id: "profile", src: profileAvatar, label: "Profile avatar" },
  { id: "profile1", src: profileAvatar1, label: "Profile avatar 1" },
  { id: "profile2", src: profileAvatar2, label: "Profile avatar 2" },
  { id: "profile3", src: profileAvatar3, label: "Profile avatar 3" },
  { id: "profile4", src: profileAvatar4, label: "Profile avatar 4" },
  { id: "profile5", src: profileAvatar5, label: "Profile avatar 5" },
  { id: "profile6", src: profileAvatar6, label: "Profile avatar 6" },
  { id: "profile7", src: profileAvatar7, label: "Profile avatar 7" },
];

function isMikaKagamiEntry(name: string, createdAt: string): boolean {
  const date = new Date(createdAt);
  const parts = new Intl.DateTimeFormat("en", {
    day: "2-digit",
    month: "2-digit",
    timeZone: "Europe/Berlin",
    year: "numeric",
  }).formatToParts(date);
  const getPart = (type: string) => parts.find((part) => part.type === type)?.value ?? "";
  const berlinDate = `${getPart("year")}-${getPart("month")}-${getPart("day")}`;

  return name.trim().toLowerCase() === "mika kagami" && berlinDate === "2026-04-24";
}

function getAvatarSrc(name: string, avatar: string | null, createdAt: string): string {
  if (name.trim().toLowerCase() === "metsuwuki") {
    return ownerAvatar;
  }

  if (isMikaKagamiEntry(name, createdAt)) {
    return mikaAvatar;
  }

  return avatarOptions.find((option) => option.id === avatar)?.src ?? avatarOptions[0].src;
}

function formatDate(iso: string, locale: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString(locale, { day: "numeric", month: "long", year: "numeric" });
}

function formatTimeRemaining(milliseconds: number): string {
  const totalSeconds = Math.ceil(milliseconds / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

export default function GuestbookSection() {
  const { content } = usePageLocale();
  const { siteMeta } = content;
  const { prefersReducedMotion } = useMotionSettings();
  const { entries, loading, submitState, fetchError, postEntry, cooldownEnd, submitError } = useGuestbook();
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [selectedAvatar, setSelectedAvatar] = useState(avatarOptions[0].id);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [timeRemaining, setTimeRemaining] = useState(0);

  const isSubmitting = submitState === "loading";
  const isInCooldown = cooldownEnd != null && Number(cooldownEnd) > Date.now();

  useEffect(() => {
    if (cooldownEnd == null) return;

    const update = () => {
      const remaining = Number(cooldownEnd) - Date.now();
      setTimeRemaining(Math.max(0, remaining));
    };

    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [cooldownEnd]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    const trimmedName = name.trim();
    const trimmedMessage = message.trim();

    if (!trimmedName) {
      setValidationError(siteMeta.guestbookNameRequired);
      return;
    }

    if (!trimmedMessage) {
      setValidationError(siteMeta.guestbookMessageRequired);
      return;
    }

    setValidationError(null);

    try {
      await postEntry(trimmedName, trimmedMessage, selectedAvatar);
      setName("");
      setMessage("");
      setValidationError(null);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : siteMeta.guestbookSubmitError;
      setValidationError(message);
    }
  }

  return (
    <section className="section-block section-block--airy section-block--guestbook" id="guestbook">
      <div className="page-container">
        <motion.div {...getRevealProps(prefersReducedMotion)}>
          <SectionHeading title={siteMeta.guestbookTitle} description={siteMeta.guestbookDescription} align="left" />
        </motion.div>

        <div className="guestbook-layout">
          <motion.article className="guestbook-card" {...getRevealProps(prefersReducedMotion, 0.06)}>
            <form className="guestbook-form" onSubmit={handleSubmit} noValidate>
              <div className="guestbook-form__fields">
                <div className="guestbook-avatar-picker" role="radiogroup" aria-label={siteMeta.guestbookAvatarLabel}>
                  <p className="guestbook-field__label">{siteMeta.guestbookAvatarLabel}</p>
                  <div className="guestbook-avatar-picker__grid">
                    {avatarOptions.map((avatar) => (
                      <button
                        key={avatar.id}
                        type="button"
                        className={`guestbook-avatar-option ${selectedAvatar === avatar.id ? "is-selected" : ""}`}
                        aria-label={avatar.label}
                        aria-pressed={selectedAvatar === avatar.id}
                        onClick={() => setSelectedAvatar(avatar.id)}
                      >
                        <img src={avatar.src} alt="" loading="lazy" />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="guestbook-field">
                  <label className="guestbook-field__label" htmlFor="gb-name">
                    {siteMeta.guestbookNameLabel}
                  </label>
                  <input
                    id="gb-name"
                    className="guestbook-input"
                    type="text"
                    placeholder={siteMeta.guestbookNamePlaceholder}
                    maxLength={MAX_NAME}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled={isSubmitting || isInCooldown}
                    autoComplete="off"
                  />
                </div>

                <div className="guestbook-field">
                  <label className="guestbook-field__label" htmlFor="gb-message">
                    {siteMeta.guestbookMessageLabel}
                  </label>
                  <textarea
                    id="gb-message"
                    className="guestbook-input guestbook-input--textarea"
                    placeholder={siteMeta.guestbookMessagePlaceholder}
                    maxLength={MAX_MSG}
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    disabled={isSubmitting || isInCooldown}
                  />
                  <span className="guestbook-field__counter">
                    {message.length}/{MAX_MSG}
                  </span>
                </div>
              </div>

              {(validationError || submitError) && (
                <p className="guestbook-status guestbook-status--error">
                  {validationError ?? submitError ?? siteMeta.guestbookSubmitError}
                  {isInCooldown ? <> ({formatTimeRemaining(timeRemaining)})</> : null}
                </p>
              )}

              {submitState === "success" && (
                <p className="guestbook-status guestbook-status--success">{siteMeta.guestbookSubmitSuccess}</p>
              )}

              <button type="submit" className="guestbook-submit" disabled={isSubmitting || isInCooldown}>
                <UiIcon name="write" className="guestbook-submit__icon" />
                {isSubmitting
                  ? siteMeta.guestbookSubmitLoading
                  : isInCooldown
                    ? formatTimeRemaining(timeRemaining)
                    : siteMeta.guestbookSubmitIdle}
                <UiIcon name="arrow-right" className="guestbook-submit__arrow" />
              </button>
            </form>

            <p className="guestbook-note">Be kind and respectful to other visitors.</p>
          </motion.article>

          <motion.div className="guestbook-messages" {...getRevealProps(prefersReducedMotion, 0.12)}>
            <div className="guestbook-messages__head">
              <h3>Latest messages</h3>
              <span>{entries.length}</span>
            </div>

            <div className="guestbook-messages__scroll">
              {loading ? (
                <>
                  <div className="guestbook-skeleton" />
                  <div className="guestbook-skeleton" />
                  <div className="guestbook-skeleton" />
                </>
              ) : null}

              {!loading && fetchError ? (
                <p className="guestbook-empty guestbook-status--error">{fetchError}</p>
              ) : null}

              {!loading && !fetchError && entries.length === 0 ? (
                <p className="guestbook-empty">{siteMeta.guestbookEmpty}</p>
              ) : null}

              {!loading && !fetchError
                ? entries.map((entry) => (
                    <article className="guestbook-msg" key={entry.id}>
                      <img src={getAvatarSrc(entry.name, entry.avatar, entry.created_at)} alt="" className="guestbook-msg__avatar" loading="lazy" />
                      <div className="guestbook-msg__content">
                        <header className="guestbook-msg__header">
                          <span
                            className={
                              entry.name === "MetsUwUki" ? "guestbook-owner-msg__name" : "guestbook-msg__name"
                            }
                          >
                            {entry.name}
                          </span>
                          <time className="guestbook-msg__date" dateTime={entry.created_at}>
                            {formatDate(entry.created_at, siteMeta.guestbookDateLocale)}
                          </time>
                        </header>
                        <p className="guestbook-msg__text">{entry.message}</p>
                      </div>
                    </article>
                  ))
                : null}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
