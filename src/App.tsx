import { SiteShell } from "./layouts/SiteShell";
import { PageLocaleProvider } from "./i18n/pageLocale";
import AboutSection from "./sections/AboutSection";
import GuestbookSection from "./sections/GuestbookSection";
import HeroSection from "./sections/HeroSection";

export default function App() {
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
