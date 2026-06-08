import brickBreakerIcon from "../../break_brick/assets/icon.png";
import clashClanIcon from "../../clash_clan/assets/clash_icon.png";
import lightFlowIcon from "../../light_flow/assets/icon.png";
import bypassCleanerIcon from "../assets/apps/bypass-cleaner-icon.ico";
import bypassCleanerPreview from "../assets/apps/bypass-cleaner-preview.png";
import exeAnalyserIcon from "../assets/apps/exe-analyser-icon.ico";
import exeAnalyserPreview from "../assets/apps/exe-analyser-preview.png";
import brickBreakerPreview from "../assets/BrickBreaker.jpg";
import gameNavIcon from "../assets/game.svg";
import cIcon from "../assets/icons/c.svg";
import cppIcon from "../assets/icons/cpp.svg";
import csharpIcon from "../assets/icons/cs.svg";
import cssIcon from "../assets/icons/css.svg";
import goIcon from "../assets/icons/go.svg";
import htmlIcon from "../assets/icons/html.svg";
import javaIcon from "../assets/icons/java.svg";
import jsIcon from "../assets/icons/js.svg";
import kotlinIcon from "../assets/icons/kotlin.svg";
import luaIcon from "../assets/icons/lua.svg";
import mineSweeperIcon from "../assets/icons/mine.png";
import pythonIcon from "../assets/icons/py.svg";
import reactIcon from "../assets/icons/react.svg";
import rustIcon from "../assets/icons/rust.svg";
import scssIcon from "../assets/icons/scss.svg";
import tsIcon from "../assets/icons/ts.svg";
import mineSweeperPreview from "../assets/Minesweepers.jpg";
import lightFlowPreview from "../assets/NeonFlow.jpg";
import type { IconName } from "../components/UiIcon";
import { appPath } from "../utils/siteRoutes";

const animesitePath = appPath("animesite");
const clashClanPath = appPath("clashClan");
const mineSweeperPath = appPath("mineSweeper");
const breakBrickPath = appPath("breakBrick");
const lightFlowPath = appPath("lightFlow");
const mineSweeperLaunchPath = `${mineSweeperPath}${mineSweeperPath.includes("?") ? "&" : "?"}open=1`;
const breakBrickLaunchPath = `${breakBrickPath}${breakBrickPath.includes("?") ? "&" : "?"}open=1`;
const lightFlowLaunchPath = `${lightFlowPath}${lightFlowPath.includes("?") ? "&" : "?"}open=1`;

export type NavigationItem = {
  label: string;
  href: string;
  icon: IconName;
  image?: string;
};

export type TechItem = {
  label: string;
  tone: string;
  icon: string;
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

export type TechGroup = {
  title: string;
  items: TechItem[];
};

export type DestinationCard = {
  title: string;
  text: string;
  href: string;
  accent: "violet" | "cyan" | "peach";
};

export type AppCard = {
  title: string;
  version: string;
  subtitle: string;
  text: string;
  preview: string;
  icon: string;
  downloadHref: string;
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
  portraitAlt: string;
  discordPresenceId: string;
  uniqueVisitorsLabel: string;
  writeLabel: string;
  gamesTitle: string;
  gamesDescription: string;
  gamesCardEyebrow: string;
  gamesMinesweeperTitle: string;
  gamesMinesweeperText: string;
  gamesBrickBreakerTitle: string;
  gamesBrickBreakerText: string;
  gamesNeonFlowTitle: string;
  gamesNeonFlowText: string;
  gamesNeonFlowLeaderboardTitle: string;
  gamesNeonFlowLeaderboardDescription: string;
  gamesBrickLeaderboardTitle: string;
  gamesBrickLeaderboardDescription: string;
  gamesScoreLabel: string;
  gamesComboLabel: string;
  gamesPlayLabel: string;
  gamesLeaderboardTitle: string;
  gamesLeaderboardDescription: string;
  gamesLeaderboardLoading: string;
  gamesLeaderboardEmpty: string;
  gamesLeaderboardError: string;
  gamesPlayedLabel: string;
  gamesFilterAll: string;
  gamesFilterEasy: string;
  gamesFilterMedium: string;
  gamesFilterHard: string;
  gamesRankLabel: string;
  gamesNicknameLabel: string;
  gamesTimeLabel: string;
  gamesDifficultyLabel: string;
  appsTitle: string;
  appsDescription: string;
  appPreviewAltPrefix: string;
  appCardEyebrow: string;
  appDownloadLabel: string;
  ctaTitle: string;
  ctaText: string;
  guestbookTitle: string;
  guestbookDescription: string;
  guestbookRepo: string;
  guestbookLabel: string;
  guestbookDateLocale: string;
  guestbookNameLabel: string;
  guestbookNamePlaceholder: string;
  guestbookMessageLabel: string;
  guestbookMessagePlaceholder: string;
  guestbookNameRequired: string;
  guestbookNameMax: string;
  guestbookMessageRequired: string;
  guestbookMessageMax: string;
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
  techGroups: TechGroup[];
  appCards: AppCard[];
  destinationCards: DestinationCard[];
};

const techItems: TechItem[] = [
  { label: "HTML", tone: "html", icon: htmlIcon },
  { label: "CSS", tone: "css", icon: cssIcon },
  { label: "SCSS", tone: "scss", icon: scssIcon },
  { label: "JavaScript", tone: "js", icon: jsIcon },
  { label: "TypeScript", tone: "ts", icon: tsIcon },
  { label: "React", tone: "react", icon: reactIcon },
  { label: "C", tone: "c", icon: cIcon },
  { label: "C++", tone: "cpp", icon: cppIcon },
  { label: "Rust", tone: "rust", icon: rustIcon },
  { label: "Go", tone: "go", icon: goIcon },
  { label: "C#", tone: "csharp", icon: csharpIcon },
  { label: "Java", tone: "java", icon: javaIcon },
  { label: "Python", tone: "python", icon: pythonIcon },
  { label: "Lua", tone: "lua", icon: luaIcon },
  { label: "Kotlin", tone: "kotlin", icon: kotlinIcon },
];

const contentByLocale: Record<Locale, LocalizedSiteContent> = {
  en: {
    siteMeta: {
      brandName: "METSUWUKI",
      brandLine: "software developer",
      brandHomeAria: "home",
      navigationAria: "Main navigation",
      mobileNavigationAria: "Mobile navigation",
      heroEyebrow: "home page",
      heroTitle: "MetsUwUki",
      heroRole: "Software Developer",
      heroDescription:
        "I'm a software Full-Stack developer. Here are my languages. Move mouse on them to see info about my experience: Green = good, Yellow = quite well, Red = some experience.",
      portraitAlt: "Metsuwuki portrait",
      discordPresenceId: "836229144701829140",
      uniqueVisitorsLabel: "Unique visitors",
      writeLabel: "Message",
      gamesTitle: "Games",
      gamesDescription: "Small browser games.",
      gamesCardEyebrow: "Browser game",
      gamesMinesweeperTitle: "Minesweeper",
      gamesMinesweeperText:
        "A game Minesweeper 25x25 with difficulty modes and a live leaderboard.",
      gamesBrickBreakerTitle: "Brick Breaker",
      gamesBrickBreakerText:
        "Endless Ballz-style arcade with ricochets, combos, +1 balls, and score records.",
      gamesNeonFlowTitle: "Neon Flow",
      gamesNeonFlowText:
        "A calm circuit puzzle: rotate soft neon channels until every lamp receives power.",
      gamesNeonFlowLeaderboardTitle: "Neon Flow records",
      gamesNeonFlowLeaderboardDescription: "Best powered circuits",
      gamesBrickLeaderboardTitle: "Brick Breaker records",
      gamesBrickLeaderboardDescription: "Best endless scores",
      gamesScoreLabel: "Score",
      gamesComboLabel: "Combo",
      gamesPlayLabel: "Play now",
      gamesLeaderboardTitle: "Leaderboard",
      gamesLeaderboardDescription: "Best Minesweeper runs",
      gamesLeaderboardLoading: "Loading scores...",
      gamesLeaderboardEmpty: "No scores yet.",
      gamesLeaderboardError: "Could not load leaderboard.",
      gamesPlayedLabel: "Games played",
      gamesFilterAll: "All",
      gamesFilterEasy: "Easy",
      gamesFilterMedium: "Medium",
      gamesFilterHard: "Hard",
      gamesRankLabel: "Place",
      gamesNicknameLabel: "Nickname",
      gamesTimeLabel: "Time",
      gamesDifficultyLabel: "Difficulty",
      appsTitle: "Applications",
      appsDescription:
        "A compact collection of key apps with real previews, clean presentation, and direct downloads.",
      appPreviewAltPrefix: "Preview",
      appCardEyebrow: "Application",
      appDownloadLabel: "Download",
      ctaTitle: "KAGAMI-Server",
      ctaText:
        "The main entry point of the project: server atmosphere, navigation, and key directions in one place.",
      guestbookTitle: "Guestbook",
      guestbookDescription:
        "Leave a message, idea, or quick feedback. Entries are saved as posts.",
      guestbookRepo: "metsuwuki/metsuwuki.github.io",
      guestbookLabel: "guestbook",
      guestbookDateLocale: "en-US",
      guestbookNameLabel: "Name",
      guestbookNamePlaceholder: "What is your name?",
      guestbookMessageLabel: "Message",
      guestbookMessagePlaceholder: "Leave something...",
      guestbookNameRequired: "Enter your name.",
      guestbookNameMax: "Name must be no longer than {max} characters.",
      guestbookMessageRequired: "Write a message.",
      guestbookMessageMax: "Message must be no longer than {max} characters.",
      guestbookSubmitIdle: "Leave entry",
      guestbookSubmitLoading: "Sending...",
      guestbookSubmitSuccess: "Message saved. Thank you!",
      guestbookSubmitError: "Failed to send. Please try again.",
      guestbookLoading: "Loading...",
      guestbookEmpty: "No messages yet. Be the first!",
      openMenuAria: "Open menu",
      closeMenuAria: "Close menu",
      localeSwitcherAria: "Page language",
      footerCopy:
        "© 2026 METSUWUKI. Software development, applications, and projects.",
    },
    navigation: [
      { label: "Home", href: "#overview", icon: "home" },
      { label: "Games", href: "#games", icon: "apps", image: gameNavIcon },
      { label: "Guestbook", href: "#guestbook", icon: "write" },
      { label: "KAGAMI-Server", href: animesitePath, icon: "discord" },
      {
        label: "Clash Clan",
        href: clashClanPath,
        icon: "shield",
        image: clashClanIcon,
      },
    ],
    techGroups: [
      { title: "Web stack", items: techItems.slice(0, 6) },
      { title: "Low-level", items: techItems.slice(6, 10) },
      { title: "Other", items: techItems.slice(10) },
    ],
    appCards: [
      {
        title: "Bypass Cleaner",
        version: "28.04.2026 - v.0.4.0-alpha",
        subtitle: "cleanup utility",
        text: "System cleanup utility focused on control: preview mode, filters, quarantine, logging, and suspicious process handling.",
        preview: bypassCleanerPreview,
        icon: bypassCleanerIcon,
        downloadHref:
          "https://github.com/metsuwuki/ByPass_Cleaner/releases/download/v.0.4.0-alpha/ByPass.Cleaner.Setup.exe",
        accent: "violet",
        tags: ["Quarantine", "Preview", "Logs"],
        highlights: ["folder scanning", "forced delete", "process terminate"],
      },
      {
        title: "EXE-Analyser",
        version: "08.06.2026 - v0.6.0",
        subtitle: "exe analyser",
        text: "Utility for `.exe` analysis with PE checks, runtime scenarios, risk scoring, uploading your own Unit tests and export to practical formats.",
        preview: exeAnalyserPreview,
        icon: exeAnalyserIcon,
        downloadHref:
          "https://github.com/metsuwuki/EXE-Programs-Analyser/releases/download/v0.6.0/EXE_Analyzer_Setup_0.6.0.exe",
        accent: "cyan",
        tags: ["PE", "Runtime", "Export"],
        highlights: [
          "entropy and imports",
          "stress scenarios",
          "html/json/markdown",
        ],
      },
    ],
    destinationCards: [
      {
        title: "KAGAMI-Server",
        text: "Main server page with atmosphere, navigation, and core project directions.",
        href: animesitePath,
        accent: "violet",
      },
      {
        title: "Clash Clan",
        text: "Clan management dashboard for rosters, war participation, transfers, and blacklist control.",
        href: clashClanPath,
        accent: "peach",
      },
      {
        title: "GitHub",
        text: "Code, releases, and technical details without showcase noise.",
        href: "https://github.com/metsuwuki",
        accent: "cyan",
      },
    ],
  },
  ru: {
    siteMeta: {
      brandName: "METSUWUKI",
      brandLine: "разработчик ПО",
      brandHomeAria: "главная",
      navigationAria: "Основная навигация",
      mobileNavigationAria: "Мобильная навигация",
      heroEyebrow: "главная страница",
      heroTitle: "MetsUwUki",
      heroRole: "Разработчик программного обеспечения",
      heroDescription:
        "Я разработчик ПО Full-Stack верстки. Здесь мои языки. Наведи мышь на них, чтобы увидеть информацию о моём опыте: зелёный = хорошо, жёлтый = вполне умею, красный = есть небольшой опыт.",
      portraitAlt: "Портрет Metsuwuki",
      discordPresenceId: "836229144701829140",
      uniqueVisitorsLabel: "Уникальных посетителей",
      writeLabel: "Написать",
      gamesTitle: "Игры",
      gamesDescription:
        "Небольшие браузерные игры с аккуратным превью, быстрым входом и таблицей результатов.",
      gamesCardEyebrow: "Браузерная игра",
      gamesMinesweeperTitle: "Сапёр",
      gamesMinesweeperText:
        "Игра Сапер 25x25 со сложностями и живой таблицей лидеров.",
      gamesBrickBreakerTitle: "Brick Breaker",
      gamesBrickBreakerText:
        "Endless arcade в стиле Ballz: рикошеты, combo, +1 шарики и рейтинг по счету.",
      gamesNeonFlowTitle: "Neon Flow",
      gamesNeonFlowText:
        "Спокойная puzzle-игра: поворачивай неоновые каналы, чтобы зажечь все лампы.",
      gamesNeonFlowLeaderboardTitle: "Рекорды Neon Flow",
      gamesNeonFlowLeaderboardDescription: "Лучшие собранные цепи",
      gamesBrickLeaderboardTitle: "Рекорды Brick Breaker",
      gamesBrickLeaderboardDescription: "Лучшие endless scores",
      gamesScoreLabel: "Счет",
      gamesComboLabel: "Комбо",
      gamesPlayLabel: "Играть сейчас",
      gamesLeaderboardTitle: "Лидеры",
      gamesLeaderboardDescription: "Лучшие прохождения Сапера",
      gamesLeaderboardLoading: "Загрузка результатов...",
      gamesLeaderboardEmpty: "Результатов пока нет.",
      gamesLeaderboardError: "Не удалось загрузить таблицу лидеров.",
      gamesPlayedLabel: "Игр сыграно",
      gamesFilterAll: "Общее",
      gamesFilterEasy: "Лёгкий",
      gamesFilterMedium: "Средний",
      gamesFilterHard: "Сложный",
      gamesRankLabel: "Место",
      gamesNicknameLabel: "Ник",
      gamesTimeLabel: "Время",
      gamesDifficultyLabel: "Сложность",
      appsTitle: "Приложения",
      appsDescription:
        "Немного, но по делу: ключевые приложения с реальными превью, аккуратной подачей и прямым скачиванием.",
      appPreviewAltPrefix: "Превью",
      appCardEyebrow: "Приложение",
      appDownloadLabel: "Скачать",
      ctaTitle: "KAGAMI-Server",
      ctaText:
        "Главная входная точка проекта: атмосфера сервера, навигация и всё основное в одном месте. GitHub остается рядом как техническая часть.",
      guestbookTitle: "Книга гостей",
      guestbookDescription:
        "Оставь сообщение, идею или короткий фидбек. Записи сохраняются и остаются как посты.",
      guestbookRepo: "metsuwuki/metsuwuki.github.io",
      guestbookLabel: "guestbook",
      guestbookDateLocale: "ru-RU",
      guestbookNameLabel: "Имя",
      guestbookNamePlaceholder: "Как тебя зовут?",
      guestbookMessageLabel: "Сообщение",
      guestbookMessagePlaceholder: "Оставь что-нибудь...",
      guestbookNameRequired: "Введи имя.",
      guestbookNameMax: "Имя не длиннее {max} символов.",
      guestbookMessageRequired: "Напиши сообщение.",
      guestbookMessageMax: "Сообщение не длиннее {max} символов.",
      guestbookSubmitIdle: "Оставить запись",
      guestbookSubmitLoading: "Отправка...",
      guestbookSubmitSuccess: "Сообщение сохранено — спасибо!",
      guestbookSubmitError: "Ошибка отправки. Попробуй ещё раз.",
      guestbookLoading: "Загрузка...",
      guestbookEmpty: "Пока пусто — будь первым!",
      openMenuAria: "Открыть меню",
      closeMenuAria: "Закрыть меню",
      localeSwitcherAria: "Язык страницы",
      footerCopy: "© 2026 METSUWUKI. Разработка ПО, приложения и проекты.",
    },
    navigation: [
      { label: "Главная", href: "#overview", icon: "home" },
      { label: "Игры", href: "#games", icon: "apps", image: gameNavIcon },
      { label: "Книга гостей", href: "#guestbook", icon: "write" },
      { label: "KAGAMI-Server", href: animesitePath, icon: "discord" },
      {
        label: "Clash Clan",
        href: clashClanPath,
        icon: "shield",
        image: clashClanIcon,
      },
    ],
    techGroups: [
      { title: "Веб-стек", items: techItems.slice(0, 6) },
      { title: "Низкий уровень", items: techItems.slice(6, 10) },
      { title: "Остальное", items: techItems.slice(10) },
    ],
    appCards: [
      {
        title: "Bypass Cleaner",
        version: "28.04.2026 - v.0.4.0-alpha",
        subtitle: "утилита очистки",
        text: "Утилита для чистки системы с упором на контроль: предпросмотр, фильтры, карантин, логирование и работа с подозрительными процессами.",
        preview: bypassCleanerPreview,
        icon: bypassCleanerIcon,
        downloadHref:
          "https://github.com/metsuwuki/ByPass_Cleaner/releases/download/v.0.4.0-alpha/ByPass.Cleaner.Setup.exe",
        accent: "violet",
        tags: ["Карантин", "Предпросмотр", "Логи"],
        highlights: [
          "сканирование папок",
          "принудительное удаление",
          "завершение процессов",
        ],
      },
      {
        title: "EXE-Analyser",
        version: "08.06.2026 - v0.6.0",
        subtitle: "анализатор exe",
        text: "Инструмент для разбора `.exe` с PE-проверками, runtime-сценариями, оценкой риска, загрузкой своих Unit тестов и экспортом результатов в удобные форматы.",
        preview: exeAnalyserPreview,
        icon: exeAnalyserIcon,
        downloadHref:
          "https://github.com/metsuwuki/EXE-Programs-Analyser/releases/download/v0.6.0/EXE_Analyzer_Setup_0.6.0.exe",
        accent: "cyan",
        tags: ["PE", "Runtime", "Экспорт"],
        highlights: [
          "энтропия и импорты",
          "стресс-сценарии",
          "html/json/markdown",
        ],
      },
    ],
    destinationCards: [
      {
        title: "KAGAMI-Server",
        text: "Главная страница сервера: вход в атмосферу, навигация и основное направление проекта.",
        href: animesitePath,
        accent: "violet",
      },
      {
        title: "Clash Clan",
        text: "Clan management dashboard для составов, войн, переносов игроков и blacklist.",
        href: clashClanPath,
        accent: "peach",
      },
      {
        title: "GitHub",
        text: "Код, релизы и открытая техническая часть без лишнего витринного текста.",
        href: "https://github.com/metsuwuki",
        accent: "cyan",
      },
    ],
  },
};

export const defaultLocale: Locale = "en";

export function getSiteContent(locale: Locale): LocalizedSiteContent {
  return contentByLocale[locale];
}

export const siteMeta = contentByLocale[defaultLocale].siteMeta;
export const navigation = contentByLocale[defaultLocale].navigation;
export const techGroups = contentByLocale[defaultLocale].techGroups;
export const appCards = contentByLocale[defaultLocale].appCards;
export const destinationCards = contentByLocale[defaultLocale].destinationCards;

export const discordPresenceFallback: DiscordPresenceFallback = {
  displayName: "Metsuki",
  username: "me_tsu_ki",
  avatarHash: "8ca19c40a7d844bd29f6ab23daa80975",
  accentColor: "#7d2bf9",
  status: "dnd",
  activityName: "Visual Studio Code",
  activePlatform: "Desktop",
};

export const socialLinks = {
  discord: animesitePath,
  clashClan: clashClanPath,
  mineSweeper: mineSweeperPath,
  breakBrick: breakBrickPath,
  lightFlow: lightFlowPath,
  discordProfile: "https://discord.com/users/836229144701829140",
  github: "https://github.com/metsuwuki",
  apps: "#apps",
};

export const gameCards = {
  mineSweeper: {
    href: mineSweeperLaunchPath,
    icon: mineSweeperIcon,
    preview: mineSweeperPreview,
  },
  brickBreaker: {
    href: breakBrickLaunchPath,
    icon: brickBreakerIcon,
    preview: brickBreakerPreview,
  },
  lightFlow: {
    href: lightFlowLaunchPath,
    icon: lightFlowIcon,
    preview: lightFlowPreview,
  },
};
