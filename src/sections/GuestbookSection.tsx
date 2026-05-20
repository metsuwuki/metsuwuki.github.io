import { useState, type FormEvent, useEffect } from "react";
import { motion } from "framer-motion";
import { SectionHeading } from "../components/SectionHeading";
import { UiIcon } from "../components/UiIcon";
import { useMotionSettings } from "../hooks/useMotionSettings";
import { getRevealProps } from "../utils/motion";
import { useGuestbook } from "../hooks/useGuestbook";
import { usePageLocale } from "../i18n/pageLocale";

const MAX_NAME = 50;
const MAX_MSG = 500;

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
  const [validationError, setValidationError] = useState<string | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<number>(0);

  const isSubmitting = submitState === "loading";
  const isInCooldown =
    cooldownEnd != null &&
    Number(cooldownEnd) > Date.now();

  // Таймер для обновления времени оставшегося cooldown
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
    await postEntry(trimmedName, trimmedMessage);

    setName("");
    setMessage("");
    setValidationError(null);
  } catch (err: any) {
    console.error(err);
    setValidationError(err?.message || "Ошибка при отправке");
  }
}

  return (
    <section className="section-block section-block--airy section-block--guestbook" id="guestbook">
      <div className="page-container">
        <motion.div {...getRevealProps(prefersReducedMotion)}>
          <SectionHeading
            title={siteMeta.guestbookTitle}
            description={siteMeta.guestbookDescription}
            align="left"
          />
        </motion.div>

        <div className="guestbook-layout">
          {/* Форма */}
          <motion.article className="guestbook-card" {...getRevealProps(prefersReducedMotion, 0.06)}>
            <div className="window-chrome" aria-hidden="true">
              <span /><span /><span />
            </div>

            <form className="guestbook-form" onSubmit={handleSubmit} noValidate>
              <div className="guestbook-form__fields">
                <div className="guestbook-field">
                  <label className="guestbook-field__label" htmlFor="gb-name">{siteMeta.guestbookNameLabel}</label>
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
                  <label className="guestbook-field__label" htmlFor="gb-message">{siteMeta.guestbookMessageLabel}</label>
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
                  <span className="guestbook-field__counter">{message.length}/{MAX_MSG}</span>
                </div>
              </div>

              {(validationError || submitError) && (
                <p className="guestbook-status guestbook-status--error">
                  {validationError ?? submitError ?? siteMeta.guestbookSubmitError}
                  {isInCooldown && timeRemaining !== null && (
                    <> ({formatTimeRemaining(timeRemaining)})</>
                  )}
                </p>
              )}

              {submitState === "success" && (
                <p className="guestbook-status guestbook-status--success">{siteMeta.guestbookSubmitSuccess}</p>
              )}

              <button 
                type="submit" 
                className={`guestbook-submit ${isInCooldown ? "guestbook-submit--cooldown" : ""}`}
                disabled={isSubmitting || isInCooldown}
              >
                <UiIcon name="write" className="guestbook-submit__icon" />
                {isSubmitting
                  ? siteMeta.guestbookSubmitLoading
                  : isInCooldown
                    ? formatTimeRemaining(Math.max(0, timeRemaining))
                    : siteMeta.guestbookSubmitIdle}
              </button>
            </form>
          </motion.article>

          {/* Сообщения */}
          <motion.div className="guestbook-messages" {...getRevealProps(prefersReducedMotion, 0.12)}>
            <div className="guestbook-messages__chrome" aria-hidden="true">
              <span /><span /><span />
            </div>

            <div className="guestbook-messages__scroll">
              {loading && <p className="guestbook-empty">{siteMeta.guestbookLoading}</p>}

              {!loading && fetchError && (
                <p className="guestbook-empty guestbook-status--error">{fetchError}</p>
              )}

              {!loading && !fetchError && entries.length === 0 && (
                <p className="guestbook-empty">{siteMeta.guestbookEmpty}</p>
              )}

              {!loading && !fetchError && entries.map((entry) => (
                <article className="guestbook-msg" key={entry.id}>
                  <header className="guestbook-msg__header">
                    <span
                      className={
                        entry.name === "MetsUwUki" &&
                        new Date(entry.created_at).toDateString() ===
                          new Date("2026-04-23T19:20:57.000Z").toDateString()
                          ? "guestbook-owner-msg__name"
                          : "guestbook-msg__name"
                        }
                      >
                        {entry.name}
                    </span>
                    <time
                      className="guestbook-msg__date"
                      dateTime={entry.created_at}
                    >
                      {formatDate(entry.created_at, siteMeta.guestbookDateLocale)}
                    </time>
                  </header>
                  <p className="guestbook-msg__text">{entry.message}</p>
                </article>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}