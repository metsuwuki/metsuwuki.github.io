import appIcon from "../../assets/App-Icon.png";
import communityIcon from "../../assets/Community-Icon.png";
import guestbookIcon from "../../assets/Guestbook-Icon.png";
import mikaCosmicBackground from "../../assets/mika-cosmic-bg.png";
import telegramIcon from "../../assets/Telegram-Icon.png";
import mikaPortrait from "../../mika.jpg";
import metsukiPortrait from "../../metsuki.jpg";
import type { IconName } from "../components/UiIcon";
import type { AppCard, FeatureCard, Locale, LocalizedSiteContent } from "./siteContent";
import { getSiteContent } from "./siteContent";

export type ProfileId = "metsuki" | "mika";

export type ProfileLink = {
  label: string;
  href: string;
  icon?: IconName;
  image?: string;
};

export type ProfileContent = LocalizedSiteContent & {
  profile: {
    id: ProfileId;
    portrait: string;
    background?: string;
    presenceLabel: string;
    links: ProfileLink[];
  };
  heroTypewriter: {
    prefix: string;
    phrases: string[];
  };
};

const mikaAppsByLocale: Record<Locale, AppCard[]> = {
  en: [
    {
      title: "Creative Projects",
      version: "COMING SOON",
      subtitle: "future portfolio",
      text: "A reserved space for Mika's future published creative projects. No unreleased work is presented as complete.",
      preview: mikaCosmicBackground,
      icon: appIcon,
      accent: "violet",
      tags: ["3D", "Design", "Ideas"],
      highlights: ["work in progress", "verified releases only", "coming soon"],
    },
    {
      title: "Visual Experiments",
      version: "COMING SOON",
      subtitle: "visual studies",
      text: "A future collection for visual studies and design explorations when Mika is ready to publish them.",
      preview: mikaCosmicBackground,
      icon: communityIcon,
      accent: "cyan",
      tags: ["Visual", "Space", "Light"],
      highlights: ["in development", "personal studies", "coming soon"],
    },
    {
      title: "Future Works",
      version: "COMING SOON",
      subtitle: "new directions",
      text: "This card intentionally contains no fictional project: it will host confirmed future work.",
      preview: mikaCosmicBackground,
      icon: guestbookIcon,
      accent: "violet",
      tags: ["Interior", "3D", "Design"],
      highlights: ["not yet published", "no fabricated claims", "coming soon"],
    },
  ],
  ru: [
    {
      title: "Creative Projects",
      version: "COMING SOON",
      subtitle: "будущее портфолио",
      text: "Место для будущих опубликованных творческих проектов Mika. Незавершённые работы не выдаются за готовые.",
      preview: mikaCosmicBackground,
      icon: appIcon,
      accent: "violet",
      tags: ["3D", "Дизайн", "Идеи"],
      highlights: ["в процессе", "только реальные публикации", "скоро"],
    },
    {
      title: "Visual Experiments",
      version: "COMING SOON",
      subtitle: "визуальные исследования",
      text: "Будущая коллекция визуальных исследований и дизайн-экспериментов, когда Mika будет готова их опубликовать.",
      preview: mikaCosmicBackground,
      icon: communityIcon,
      accent: "cyan",
      tags: ["Визуал", "Пространство", "Свет"],
      highlights: ["в разработке", "личные исследования", "скоро"],
    },
    {
      title: "Future Works",
      version: "COMING SOON",
      subtitle: "новые направления",
      text: "Здесь нет вымышленного проекта: карточка предназначена для будущей подтверждённой работы.",
      preview: mikaCosmicBackground,
      icon: guestbookIcon,
      accent: "violet",
      tags: ["Интерьеры", "3D", "Дизайн"],
      highlights: ["ещё не опубликовано", "без вымышленных данных", "скоро"],
    },
  ],
};

function getMikaFeatures(locale: Locale): FeatureCard[] {
  const ru = locale === "ru";
  return [
    {
      title: ru ? "Книга гостей" : "Guestbook",
      label: ru ? "Социальное" : "Social",
      text: ru ? "Оставь сообщение в отдельном пространстве Mika." : "Leave a message in Mika's own guestbook space.",
      buttonLabel: ru ? "Открыть гостевую" : "Open Guestbook",
      href: "#guestbook",
      image: guestbookIcon,
      tone: "violet",
    },
    {
      title: ru ? "3D-пространства" : "3D spaces",
      label: ru ? "Направление" : "Direction",
      text: ru ? "Работа с формой, объёмом и пространством." : "Exploring form, volume, and space.",
      image: appIcon,
      tone: "cyan",
    },
    {
      title: ru ? "Интерьеры" : "Interiors",
      label: ru ? "Дизайн" : "Design",
      text: ru ? "Идеи интерьеров и аккуратные композиции." : "Interior ideas and carefully balanced compositions.",
      image: communityIcon,
      tone: "peach",
    },
    {
      title: "Telegram",
      label: ru ? "Контакт" : "Contact",
      text: ru ? "Подтверждённый способ связи с Mika." : "Mika's confirmed contact channel.",
      buttonLabel: ru ? "Написать в Telegram" : "Open Telegram",
      href: "https://t.me/MikaKagami_XIX",
      image: telegramIcon,
      tone: "violet",
    },
    {
      title: ru ? "Визуальные идеи" : "Visual ideas",
      label: ru ? "Эксперименты" : "Experiments",
      text: ru ? "Поиск новых визуальных решений без вымышленных достижений." : "Exploring new visual directions without fabricated claims.",
      image: communityIcon,
      tone: "cyan",
    },
  ];
}

function getMikaContent(locale: Locale): ProfileContent {
  const base = getSiteContent(locale);
  const ru = locale === "ru";
  return {
    ...base,
    siteMeta: {
      ...base.siteMeta,
      brandName: "Mika Kagami",
      brandLine: ru ? "3D · Интерьеры · Дизайн" : "3D · Interiors · Design",
      heroEyebrow: ru ? "Привет, я" : "Hi, I'm",
      heroTitle: "Mika Kagami",
      heroRole: ru ? "3D · Интерьеры · Дизайн" : "3D · Interiors · Design",
      heroDescription: ru
        ? "Мне нравится работать с 3D, придумывать интерьеры и пробовать новые идеи в дизайне."
        : "I enjoy working with 3D, imagining interiors, and exploring new ideas in design.",
      heroContactLabel: ru ? "Написать" : "Contact",
      discordPresenceId: "",
      featureTitle: ru ? "Мой мир" : "My world",
      featureDescription: ru
        ? "Мне нравятся аккуратные работы, где всё находится на своём месте."
        : "I enjoy thoughtful work where every element has its place.",
      appsTitle: ru ? "Творческие проекты" : "Creative projects",
      appsDescription: ru ? "Будущие работы будут появляться здесь после публикации." : "Future work will appear here after it is published.",
      appCardEyebrow: ru ? "Творческая работа" : "Creative work",
      footerCopy: ru
        ? `(c) ${new Date().getFullYear()} Mika Kagami. 3D, интерьеры и дизайн.`
        : `(c) ${new Date().getFullYear()} Mika Kagami. 3D, interiors, and design.`,
    },
    navigation: base.navigation.map((item) => {
      if (item.href === "#apps") return { ...item, label: ru ? "Работы" : "Works" };
      return item;
    }),
    featureCards: getMikaFeatures(locale),
    appCards: mikaAppsByLocale[locale],
    profile: {
      id: "mika",
      portrait: mikaPortrait,
      background: mikaCosmicBackground,
      presenceLabel: ru ? "Творческое пространство" : "Creative space",
      links: [{ label: "Telegram", href: "https://t.me/MikaKagami_XIX", image: telegramIcon }],
    },
    heroTypewriter: ru
      ? { prefix: "Мне нравится ", phrases: ["работать с 3D.", "придумывать интерьеры.", "пробовать идеи в дизайне.", "создавать аккуратные композиции."] }
      : { prefix: "I enjoy ", phrases: ["working with 3D.", "imagining interiors.", "exploring design ideas.", "creating balanced compositions."] },
  };
}

export function getProfileContent(profileId: ProfileId, locale: Locale): ProfileContent {
  if (profileId === "mika") return getMikaContent(locale);
  const base = getSiteContent(locale);
  const ru = locale === "ru";
  return {
    ...base,
    profile: {
      id: "metsuki",
      portrait: metsukiPortrait,
      presenceLabel: ru ? "Статус Discord" : "Discord presence",
      links: [
        { label: "Discord", href: "https://discord.com/users/836229144701829140", icon: "discord" },
        { label: "GitHub", href: "https://github.com/metsuwuki", icon: "github" },
      ],
    },
    heroTypewriter: ru
      ? { prefix: "Создаю современные приложения с ", phrases: ["красивыми интерфейсами.", "масштабируемой архитектурой.", "высокой производительностью.", "продуманным UX."] }
      : { prefix: "Building modern applications with ", phrases: ["beautiful interfaces.", "scalable architectures.", "high performance.", "clean user experiences."] },
  };
}
