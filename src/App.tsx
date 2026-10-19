import { Navigate, Route, Routes } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, LazyMotion, domAnimation } from "framer-motion";
import { hasPassedOnboarding, OnboardingGate } from "./components/OnboardingGate";
import { SiteShell } from "./layouts/SiteShell";
import { PageLocaleProvider } from "./i18n/pageLocale";
import AboutSection from "./sections/AboutSection";
import GuestbookSection from "./sections/GuestbookSection";
import HeroSection from "./sections/HeroSection";
import KagamiPage from "./pages/KagamiPage";
import IdentitySelector from "./pages/IdentitySelector";
import type { ProfileId } from "./data/profileContent";

function PortfolioPage({ profileId }: { profileId: ProfileId }) {
  useEffect(() => {
    document.title = profileId === "mika" ? "Mika Kagami · K✦GAMI Nexus" : "MetsUwUki · K✦GAMI Nexus";
  }, [profileId]);

  return (
    <PageLocaleProvider profileId={profileId}>
      <SiteShell>
        <HeroSection />
        <AboutSection />
        <GuestbookSection />
      </SiteShell>
    </PageLocaleProvider>
  );
}

export default function App() {
  const [verified, setVerified] = useState(hasPassedOnboarding);
  const siteRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (siteRef.current) siteRef.current.inert = !verified;
    document.documentElement.classList.toggle("is-onboarding", !verified);
    return () => document.documentElement.classList.remove("is-onboarding");
  }, [verified]);

  return (
    <LazyMotion features={domAnimation} strict>
      <div ref={siteRef} className={`site-access-layer ${verified ? "is-verified" : "is-locked"}`} aria-hidden={!verified}>
        <Routes>
          <Route path="/" element={<IdentitySelector />} />
          <Route path="/metsuki" element={<PortfolioPage profileId="metsuki" />} />
          <Route path="/mika" element={<PortfolioPage profileId="mika" />} />
          <Route path="/gta5rp" element={<KagamiPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
      <AnimatePresence>{!verified && <OnboardingGate onVerified={() => setVerified(true)} />}</AnimatePresence>
    </LazyMotion>
  );
}
