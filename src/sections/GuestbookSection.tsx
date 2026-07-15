import { useEffect, useState, type CSSProperties, type FormEvent } from "react";
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
import { Reveal } from "../components/Reveal";
import { SectionHeading } from "../components/SectionHeading";
import { useGuestbook } from "../hooks/useGuestbook";
import { useMotionSettings } from "../hooks/useMotionSettings";
import { usePageLocale } from "../i18n/pageLocale";

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

function renderLetters(text: string) {
  return Array.from(text).map((char, i) => (
    <span key={i} style={{ "--i": i } as CSSProperties}>
      {char === " " ? " " : char}
    </span>
  ));
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
        <Reveal prefersReducedMotion={prefersReducedMotion}>
          <SectionHeading title={siteMeta.guestbookTitle} description={siteMeta.guestbookDescription} align="left" />
        </Reveal>

        <div className="guestbook-layout">
          <Reveal as="article" className="guestbook-card" delay={0.06} prefersReducedMotion={prefersReducedMotion}>
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

              <button
                type="submit"
                className={`guestbook-submit${isSubmitting ? " is-sending" : ""}${
                  submitState === "success" ? " is-sent" : ""
                }`}
                disabled={isSubmitting || isInCooldown}
              >
                <span className="guestbook-submit__outline" aria-hidden="true" />
                <span className="guestbook-submit__state guestbook-submit__state--default">
                  <span className="guestbook-submit__icon" aria-hidden="true">
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M14.2199 21.63C13.0399 21.63 11.3699 20.8 10.0499 16.83L9.32988 14.67L7.16988 13.95C3.20988 12.63 2.37988 10.96 2.37988 9.78001C2.37988 8.61001 3.20988 6.93001 7.16988 5.60001L15.6599 2.77001C17.7799 2.06001 19.5499 2.27001 20.6399 3.35001C21.7299 4.43001 21.9399 6.21001 21.2299 8.33001L18.3999 16.82C17.0699 20.8 15.3999 21.63 14.2199 21.63ZM7.63988 7.03001C4.85988 7.96001 3.86988 9.06001 3.86988 9.78001C3.86988 10.5 4.85988 11.6 7.63988 12.52L10.1599 13.36C10.3799 13.43 10.5599 13.61 10.6299 13.83L11.4699 16.35C12.3899 19.13 13.4999 20.12 14.2199 20.12C14.9399 20.12 16.0399 19.13 16.9699 16.35L19.7999 7.86001C20.3099 6.32001 20.2199 5.06001 19.5699 4.41001C18.9199 3.76001 17.6599 3.68001 16.1299 4.19001L7.63988 7.03001Z"
                        fill="currentColor"
                      />
                      <path
                        d="M10.11 14.4C9.92005 14.4 9.73005 14.33 9.58005 14.18C9.29005 13.89 9.29005 13.41 9.58005 13.12L13.16 9.53C13.45 9.24 13.93 9.24 14.22 9.53C14.51 9.82 14.51 10.3 14.22 10.59L10.64 14.18C10.5 14.33 10.3 14.4 10.11 14.4Z"
                        fill="currentColor"
                      />
                    </svg>
                  </span>
                  <span className="guestbook-submit__label">
                    {renderLetters(
                      isSubmitting
                        ? siteMeta.guestbookSubmitLoading
                        : isInCooldown
                          ? formatTimeRemaining(timeRemaining)
                          : siteMeta.guestbookSubmitIdle,
                    )}
                  </span>
                </span>
                <span className="guestbook-submit__state guestbook-submit__state--sent">
                  <span className="guestbook-submit__icon" aria-hidden="true">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <path
                        fill="currentColor"
                        d="M12 22.75C6.07 22.75 1.25 17.93 1.25 12C1.25 6.07 6.07 1.25 12 1.25C17.93 1.25 22.75 6.07 22.75 12C22.75 17.93 17.93 22.75 12 22.75ZM12 2.75C6.9 2.75 2.75 6.9 2.75 12C2.75 17.1 6.9 21.25 12 21.25C17.1 21.25 21.25 17.1 21.25 12C21.25 6.9 17.1 2.75 12 2.75Z"
                      />
                      <path
                        fill="currentColor"
                        d="M10.5795 15.5801C10.3795 15.5801 10.1895 15.5001 10.0495 15.3601L7.21945 12.5301C6.92945 12.2401 6.92945 11.7601 7.21945 11.4701C7.50945 11.1801 7.98945 11.1801 8.27945 11.4701L10.5795 13.7701L15.7195 8.6301C16.0095 8.3401 16.4895 8.3401 16.7795 8.6301C17.0695 8.9201 17.0695 9.4001 16.7795 9.6901L11.1095 15.3601C10.9695 15.5001 10.7795 15.5801 10.5795 15.5801Z"
                      />
                    </svg>
                  </span>
                  <span className="guestbook-submit__label">{renderLetters(siteMeta.guestbookSubmitSent)}</span>
                </span>
              </button>
            </form>

            <p className="guestbook-note">Be kind and respectful to other visitors.</p>
          </Reveal>

          <Reveal className="guestbook-messages" delay={0.12} prefersReducedMotion={prefersReducedMotion}>
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
          </Reveal>
        </div>
      </div>
    </section>
  );
}
