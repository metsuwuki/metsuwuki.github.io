import appIcon from "../../assets/App-Icon.png";
import communityIcon from "../../assets/Community-Icon.png";
import discordIcon from "../../assets/Discord-Icon.png";
import githubIcon from "../../assets/Github-Icon.png";
import guestbookIcon from "../../assets/Guestbook-Icon.png";
import bypassCleanerIcon from "../assets/apps/bypass-cleaner-icon.ico";
import bypassCleanerPreview from "../assets/apps/bypass-cleaner-preview.png";
import exeAnalyserIcon from "../assets/apps/exe-analyser-icon.ico";
import exeAnalyserPreview from "../assets/apps/exe-analyser-preview.png";
import type { IconName } from "../components/UiIcon";

export type NavigationItem = {
  label: string;
  href: string;
  icon: IconName;
};

export type DiscordPresenceFallback = {
  displayName: string;
  username: string;
  avatarHash: string;
  accentColor: string;
  status: "online" | "idle" | "dnd" | "offline";
  activityName: string;
  activePlatform: string;
};

export type FeatureCard = {
  title: string;
  label: string;
  text: string;
  buttonLabel?: string;
  href?: string;
  image: string;
  tone: "violet" | "cyan" | "peach";
};

export type AppCard = {
  title: string;
  version?: string;
  subtitle: string;
  text: string;
  preview: string;
  icon: string;
  downloadHref?: string;
  githubHref?: string;
  websiteHref?: string;
  accent: "violet" | "cyan";
  tags: string[];
  highlights: string[];
};

export type Locale = "en" | "ru";

export type SiteMeta = {
  brandName: string;
  brandLine: string;
  brandHomeAria: string;
  navigationAria: string;
  mobileNavigationAria: string;
  heroEyebrow: string;
  heroTitle: string;
  heroRole: string;
  heroDescription: string;
  heroContactLabel: string;
  discordPresenceId: string;
  uniqueVisitorsLabel: string;
  uniqueVisitorsDescription: string;
  featureTitle: string;
  featureDescription: string;
  appsTitle: string;
  appsDescription: string;
  appPreviewAltPrefix: string;
  appCardEyebrow: string;
  appDownloadLabel: string;
  appGithubLabel: string;
  appWebsiteLabel: string;
  guestbookTitle: string;
  guestbookDescription: string;
  guestbookDateLocale: string;
  guestbookNameLabel: string;
  guestbookNamePlaceholder: string;
  guestbookMessageLabel: string;
  guestbookMessagePlaceholder: string;
  guestbookAvatarLabel: string;
  guestbookNameRequired: string;
  guestbookMessageRequired: string;
  guestbookSubmitIdle: string;
  guestbookSubmitLoading: string;
  guestbookSubmitSuccess: string;
  guestbookSubmitError: string;
  guestbookLoading: string;
  guestbookEmpty: string;
  openMenuAria: string;
  closeMenuAria: string;
  localeSwitcherAria: string;
  footerCopy: string;
};

export type LocalizedSiteContent = {
  siteMeta: SiteMeta;
  navigation: NavigationItem[];
  featureCards: FeatureCard[];
  appCards: AppCard[];
};

const projectCards: AppCard[] = [
  {
    title: "Bypass Cleaner",
    version: "v0.4.0-alpha",
    subtitle: "cleanup utility",
    text: "System cleanup utility focused on control: preview mode, filters, quarantine, logging, and suspicious process handling.",
    preview: bypassCleanerPreview,
    icon: bypassCleanerIcon,
    downloadHref:
      "https://github.com/metsuwuki/ByPass_Cleaner/releases/download/v.0.4.0-alpha/ByPass.Cleaner.Setup.exe",
    githubHref: "https://github.com/metsuwuki/ByPass_Cleaner",
    accent: "violet",
    tags: ["Quarantine", "Preview", "Logs"],
    highlights: ["folder scanning", "forced delete", "process terminate"],
  },
  {
    title: "EXE Analyzer",
    version: "v1.0.0",
    subtitle: "exe analyser",
    text: "Utility for `.exe` analysis with PE checks, runtime scenarios, risk scoring, custom tests, and practical exports.",
    preview: exeAnalyserPreview,
    icon: exeAnalyserIcon,
    downloadHref:
      "https://github.com/metsuwuki/EXE-Programs-Analyser/releases/download/v1.0.0/EXE_Analyzer_Setup_1.0.0.exe",
    githubHref: "https://github.com/metsuwuki/EXE-Programs-Analyser",
    accent: "cyan",
    tags: ["PE", "Runtime", "Export"],
    highlights: ["entropy and imports", "stress scenarios", "html/json/markdown"],
  },
];

const sharedFeatureCards: FeatureCard[] = [
  {
    title: "Guestbook",
    label: "Social",
    text: "Leave messages and see what others think.",
    buttonLabel: "Open Guestbook",
    href: "#guestbook",
    image: guestbookIcon,
    tone: "violet",
  },
  {
    title: "Applications",
    label: "Builds",
    text: "Useful applications and tools.",
    buttonLabel: "Explore Apps",
    href: "#applications-catalog",
    image: appIcon,
    tone: "cyan",
  },
  {
    title: "Community",
    label: "Network",
    text: "Community space is being prepared.",
    href: "https://discord.gg/yEkHmbhexW",
    image: communityIcon,
    tone: "peach",
  },
  {
    title: "Discord",
    label: "Direct",
    text: "Contact me directly.",
    buttonLabel: "Write in Discord",
    href: "https://discord.com/users/836229144701829140",
    image: discordIcon,
    tone: "violet",
  },
  {
    title: "GitHub",
    label: "Code",
    text: "See my code and projects.",
    buttonLabel: "Visit GitHub",
    href: "https://github.com/metsuwuki",
    image: githubIcon,
    tone: "cyan",
  },
];

const contentByLocale: Record<Locale, LocalizedSiteContent> = {
  en: {
    siteMeta: {
      brandName: "MetsUwUki",
      brandLine: "Software Developer",
      brandHomeAria: "home",
      navigationAria: "Main navigation",
      mobileNavigationAria: "Mobile navigation",
      heroEyebrow: "Hi, I'm",
      heroTitle: "MetsUwUki",
      heroRole: "Full-Stack Developer",
      heroDescription:
        "Building modern applications with beautiful interfaces and scalable architectures.",
      heroContactLabel: "Contact Me",
      discordPresenceId: "836229144701829140",
      uniqueVisitorsLabel: "Unique visitors",
      uniqueVisitorsDescription: "Total unique guests",
      featureTitle: "Portal",
      featureDescription: " ",
      appsTitle: "Applications",
      appsDescription: "Collection of my real projects.",
      appPreviewAltPrefix: "Preview",
      appCardEyebrow: "Application",
      appDownloadLabel: "Download",
      appGithubLabel: "GitHub",
      appWebsiteLabel: "Website",
      guestbookTitle: "Guestbook",
      guestbookDescription:
        "Leave a message, idea, or quick feedback. Entries are saved as posts.",
      guestbookDateLocale: "en-US",
      guestbookNameLabel: "Name",
      guestbookNamePlaceholder: "What is your name?",
      guestbookMessageLabel: "Message",
      guestbookMessagePlaceholder: "Leave something...",
      guestbookAvatarLabel: "Avatar",
      guestbookNameRequired: "Enter your name.",
      guestbookMessageRequired: "Write a message.",
      guestbookSubmitIdle: "Leave entry",
      guestbookSubmitLoading: "Sending...",
      guestbookSubmitSuccess: "Message saved. Thank you!",
      guestbookSubmitError: "Failed to send. Please try again.",
      guestbookLoading: "Loading...",
      guestbookEmpty: "No messages yet. Be the first!",
      openMenuAria: "Open menu",
      closeMenuAria: "Close menu",
      localeSwitcherAria: "Page language",
      footerCopy: "(c) 2026 MetsUwUki. Software development, applications, and projects.",
    },
    navigation: [
      { label: "Home", href: "#overview", icon: "home" },
      { label: "Projects", href: "#apps", icon: "apps" },
      { label: "Guestbook", href: "#guestbook", icon: "write" },
      { label: "Contacts", href: "#contact", icon: "message" },
    ],
    featureCards: sharedFeatureCards,
    appCards: projectCards,
  },
  ru: {
    siteMeta: {
      brandName: "MetsUwUki",
      brandLine: "Разработчик ПО",
      brandHomeAria: "главная",
      navigationAria: "Главная навигация",
      mobileNavigationAria: "Мобильная навигация",
      heroEyebrow: "Привет, я",
      heroTitle: "MetsUwUki",
      heroRole: "Full-Stack Разработчик",
      heroDescription:
        "Создаю современные приложения с красивыми интерфейсами и масштабируемой архитектурой.",
      heroContactLabel: "Написать",
      discordPresenceId: "836229144701829140",
      uniqueVisitorsLabel: "Уникальных посетителей",
      uniqueVisitorsDescription: "Всего уникальных гостей",
      featureTitle: "Портал",
      featureDescription: "Персональный хаб для проектов, приложений, гостевой и связи.",
      appsTitle: "Приложения",
      appsDescription: "Коллекция моих реальных проектов.",
      appPreviewAltPrefix: "Превью",
      appCardEyebrow: "Приложение",
      appDownloadLabel: "Скачать",
      appGithubLabel: "GitHub",
      appWebsiteLabel: "Сайт",
      guestbookTitle: "Книга гостей",
      guestbookDescription:
        "Оставь сообщение, идею или отзыв. Записи сохраняются как посты.",
      guestbookDateLocale: "ru-RU",
      guestbookNameLabel: "Имя",
      guestbookNamePlaceholder: "Как тебя зовут?",
      guestbookMessageLabel: "Сообщение",
      guestbookMessagePlaceholder: "Напиши что-нибудь...",
      guestbookAvatarLabel: "Аватар",
      guestbookNameRequired: "Введи имя.",
      guestbookMessageRequired: "Напиши сообщение.",
      guestbookSubmitIdle: "Оставить запись",
      guestbookSubmitLoading: "Отправка...",
      guestbookSubmitSuccess: "Сообщение сохранено, спасибо!",
      guestbookSubmitError: "Ошибка отправки. Попробуй ещё раз.",
      guestbookLoading: "Загрузка...",
      guestbookEmpty: "Пока пусто, будь первым!",
      openMenuAria: "Открыть меню",
      closeMenuAria: "Закрыть меню",
      localeSwitcherAria: "Язык страницы",
      footerCopy: "(c) 2026 MetsUwUki. Разработка ПО, приложения и проекты.",
    },
    navigation: [
      { label: "Главная", href: "#overview", icon: "home" },
      { label: "Проекты", href: "#apps", icon: "apps" },
      { label: "Книга гостей", href: "#guestbook", icon: "write" },
      { label: "Контакты", href: "#contact", icon: "message" },
    ],
    featureCards: sharedFeatureCards.map((card) => {
      const ruText: Record<string, Pick<FeatureCard, "label" | "text" | "buttonLabel">> = {
        Guestbook: {
          label: "Социальное",
          text: "Оставляй сообщения и читай, что думают другие.",
          buttonLabel: "Открыть гостевую",
        },
        Applications: {
          label: "Сборки",
          text: "Полезные приложения и инструменты.",
          buttonLabel: "Смотреть приложения",
        },
        Community: {
          label: "Сообщество",
          text: "Социальное пространство готовится.",
        },
        Discord: {
          label: "Прямой",
          text: "Написать напрямую.",
          buttonLabel: "Написать в Discord",
        },
        GitHub: {
          label: "Код",
          text: "Смотри код и проекты.",
          buttonLabel: "Открыть GitHub",
        },
      };

      return { ...card, ...ruText[card.title] };
    }),
    appCards: projectCards,
  },
};

export const defaultLocale: Locale = "en";

export function getSiteContent(locale: Locale): LocalizedSiteContent {
  return contentByLocale[locale];
}

export const siteMeta = contentByLocale[defaultLocale].siteMeta;
export const navigation = contentByLocale[defaultLocale].navigation;
export const featureCards = contentByLocale[defaultLocale].featureCards;
export const appCards = contentByLocale[defaultLocale].appCards;

export const discordPresenceFallback: DiscordPresenceFallback = {
  displayName: "Metsuki",
  username: "me_tsu_ki",
  avatarHash: "8ca19c40a7d844bd29f6ab23daa80975",
  accentColor: "#8f4fff",
  status: "dnd",
  activityName: "Visual Studio Code",
  activePlatform: "Desktop",
};

export const socialLinks = {
  discordProfile: "https://discord.com/users/836229144701829140",
  github: "https://github.com/metsuwuki",
  apps: "#apps",
  guestbook: "#guestbook",
};
