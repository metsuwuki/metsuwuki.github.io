import { Routes, Route } from "react-router-dom";
import { SiteShell } from "./layouts/SiteShell";
import { PageLocaleProvider } from "./i18n/pageLocale";
import AboutSection from "./sections/AboutSection";
import GuestbookSection from "./sections/GuestbookSection";
import HeroSection from "./sections/HeroSection";
import KagamiPage from "./pages/KagamiPage";

function MainSite() {
  return (
    <PageLocaleProvider>
      <SiteShell>
        <HeroSection />
        <AboutSection />
        <GuestbookSection />
      </SiteShell>
    </PageLocaleProvider>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<MainSite />} />
      <Route path="/gta5rp" element={<KagamiPage />} />
    </Routes>
  );
}
