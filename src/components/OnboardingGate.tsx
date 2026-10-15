import { useEffect, useMemo, useRef, useState } from "react";
import { m } from "framer-motion";

const VERIFIED_KEY = "metsuwuki_onboarding_verified_v1";

function DirectionGlyph({ check = false }: { check?: boolean }) {
  return check ? (
    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m5 12.5 4.2 4.2L19 7" /></svg>
  ) : (
    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h13M13 7l5 5-5 5" /></svg>
  );
}

type OnboardingGateProps = { onVerified: () => void };

export function OnboardingGate({ onVerified }: OnboardingGateProps) {
  const target = useMemo(() => Math.floor(38 + Math.random() * 45), []);
  const [value, setValue] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const aligned = Math.abs(value - target) <= 1;

  useEffect(() => { panelRef.current?.focus(); }, []);

  const submit = () => {
    if (!aligned || submitting) return;
    setSubmitting(true);
    sessionStorage.setItem(VERIFIED_KEY, "true");
    onVerified();
  };

  return <m.div
    className={`onboarding-gate onboarding-gate--radar${aligned ? " is-verified" : ""}`}
    role="dialog"
    aria-modal="true"
    aria-labelledby="onboarding-title"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: .25 }}
  >
    <div className="onboarding-radar-background" aria-hidden="true">
      <span className="onboarding-radar-background__ring onboarding-radar-background__ring--one" />
      <span className="onboarding-radar-background__ring onboarding-radar-background__ring--two" />
      <span className="onboarding-radar-background__ring onboarding-radar-background__ring--three" />
      <span className="onboarding-radar-background__axis onboarding-radar-background__axis--horizontal" />
      <span className="onboarding-radar-background__axis onboarding-radar-background__axis--vertical" />
      <i className="onboarding-radar-background__sweep" />
      <b className="onboarding-radar-background__contact onboarding-radar-background__contact--one" />
      <b className="onboarding-radar-background__contact onboarding-radar-background__contact--two" />
      <b className="onboarding-radar-background__contact onboarding-radar-background__contact--three" />
    </div>

    <div ref={panelRef} tabIndex={-1} className={`onboarding-panel${aligned ? " is-aligned" : ""}`}>
      <div className="onboarding-panel__status"><span /><b>IDENTITY GATE</b><small>01 / VERIFY</small></div>
      <p className="onboarding-panel__eyebrow">WELCOME TO THE SYSTEM</p>
      <h1 id="onboarding-title">Подтверди,<br /><em>что ты человек.</em></h1>
      <p className="onboarding-panel__copy">Совмести сигнал с контрольной отметкой, затем подтверди вход.</p>

      <div className="slide-commit" style={{ "--slide-value": `${value}%`, "--slide-target": `${target}%` } as React.CSSProperties}>
        <div className="slide-commit__labels"><span>ТЕКУЩИЙ СИГНАЛ <b>{value}%</b></span><span>ЦЕЛЬ <b>{target}%</b></span></div>
        <div className="slide-commit__track">
          <span className="slide-commit__progress" />
          <span className="slide-commit__target" aria-hidden="true"><i /></span>
          <input
            type="range"
            min="0"
            max="100"
            step="1"
            value={value}
            data-target={target}
            aria-label={`Передвиньте ползунок к значению ${target} процентов`}
            aria-valuetext={`${value} процентов, цель ${target}`}
            onChange={(event) => setValue(Number(event.target.value))}
          />
          <span className="slide-commit__thumb" aria-hidden="true"><i><DirectionGlyph check={aligned} /></i></span>
        </div>
        <p className="slide-commit__feedback" aria-live="polite">
          {aligned ? "Сигнал совмещён. Можно подтвердить вход." : `Отклонение: ${Math.abs(target - value)}%`}
        </p>
      </div>

      <button className="specular-submit" type="button" disabled={!aligned || submitting} onClick={submit}>
        <span>{submitting ? "Открываю интерфейс…" : "Submit"}</span><i aria-hidden="true"><DirectionGlyph /></i>
      </button>
      <p className="onboarding-panel__note">Проверка действует до закрытия вкладки.</p>
    </div>
  </m.div>;
}

export function hasPassedOnboarding() {
  try { return sessionStorage.getItem(VERIFIED_KEY) === "true"; } catch { return false; }
}
