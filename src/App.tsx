import { SiteShell } from "./layouts/SiteShell";
import { PageLocaleProvider } from "./i18n/pageLocale";
import AboutSection from "./sections/AboutSection";
import GamesSection from "./sections/GamesSection";
import GuestbookSection from "./sections/GuestbookSection";
import HeroSection from "./sections/HeroSection";

export default function App() {
  return (
    <PageLocaleProvider>
      <SiteShell>
        <HeroSection />
        <GamesSection />
        <AboutSection />
        <GuestbookSection />
      </SiteShell>
    </PageLocaleProvider>
  );
}
