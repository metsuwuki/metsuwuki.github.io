import { SiteShell } from "./layouts/SiteShell";
import AboutSection from "./sections/AboutSection";
import CtaSection from "./sections/CtaSection";
import FeaturesSection from "./sections/FeaturesSection";
import GuideSection from "./sections/GuideSection";
import HeroSection from "./sections/HeroSection";
import SecuritySection from "./sections/SecuritySection";

export default function App() {
  return (
    <SiteShell>
      <HeroSection />
      <AboutSection />
      <FeaturesSection />
      <GuideSection />
      <SecuritySection />
      <CtaSection />
    </SiteShell>
  );
}
