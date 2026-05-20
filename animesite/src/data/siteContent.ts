import type { UiIconName } from "../components/UiIcon";

export type NavigationItem = {
  label: string;
  href: string;
};

export type Rule = {
  icon: UiIconName;
  title: string;
  desc: string;
};

export type HighlightCard = {
  title: string;
  text: string;
  icon: UiIconName;
};

export type ChannelEntry = {
  name: string;
  description: string;
};

export type ChannelGroup = {
  title: string;
  eyebrow: string;
  summary: string;
  accent: "cyan" | "violet" | "pink" | "lavender";
  icon: UiIconName;
  channels: ChannelEntry[];
};

export type VoiceGroup = {
  title: string;
  text: string;
  icon: UiIconName;
  items: string[];
};

export type RoleGroup = {
  title: string;
  text: string;
  icon: UiIconName;
  items: string[];
};

export type SecurityItem = {
  icon: UiIconName;
  title: string;
  desc: string;
};

export type OnboardingStep = {
  step: string;
  title: string;
  text: string;
};

export const siteMeta = {
  brandName: "KAGAMI",
  brandLine: "игры | чат | кино",
  heroEyebrow: "Игры, комьюнити и поиск тиммейтов",
  heroTitle: "Discord-сообщество",
  heroDescription:
    "KAGAMI - это место, где собираются игроки, любители аниме и кино. Роли, каналы, голосовые комнаты и кино-вечера.",
  heroSideTitle: "Дружелюбная атмосфера",
  heroSideText: "Общайся, ищи команду, смотри кино вместе. Все в одном месте.",
  aboutTitle: "Добро пожаловать в KAGAMI",
  aboutDescription:
    "Сервер для тех, кто хочет играть, общаться и находить единомышленников. Заходи, выбирай роли и вливайся.",
  aboutIntroTitle: "Что внутри",
  aboutIntroText:
    "Отдельные зоны для чата, кино и поддержки. Роли под устройство, игры и уведомления.",
  featuresSectionTitle: "Структура сервера",
  featuresSectionDesc:
    "Информация, общение, кино и поддержка - каждая зона на своем месте и без лишнего шума.",
  guideSectionVoiceTitle: "Голосовые комнаты",
  guideSectionVoiceDesc: "Обычный голос, вариант без микро, AFK и приватные комнаты.",
  guideSectionRolesEyebrow: "Роли",
  ctaTitle: "Вступай и выбирай свое место",
  ctaText: "Каналы, роли, медиа, кино-вечера и поддержка уже настроены и ждут тебя."
};

export const navigation: NavigationItem[] = [
  { label: "О сервере", href: "#about" },
  { label: "Каналы", href: "#channels" },
  { label: "Голос и роли", href: "#voice" },
  { label: "Безопасность", href: "#security" },
  { label: "Вступить", href: "#join" }
];

export const heroChips = ["Дружное комьюнити", "Кино-вечера", "Поиск тиммейтов", "Голос и текст"];

export const heroSideChips = ["Приветственная зона", "Четкие правила", "Медиа", "Приватные комнаты"];

export const welcomeHighlights = [
  "Быстрый старт",
  "Отдельные зоны: чат, кино, поддержка",
  "Роли: устройство, игры, уведомления"
];

export const highlightCards: HighlightCard[] = [
  {
    title: "Без токсика",
    text: "Правила соблюдаются, поэтому атмосфера остается спокойной и комфортной.",
    icon: "shield"
  },
  {
    title: "Все по категориям",
    text: "Каналы разделены по смыслу: легче ориентироваться и быстрее находить нужное.",
    icon: "grid"
  },
  {
    title: "На любой вкус",
    text: "Игры, аниме, кино или просто общение - для всего есть свое место.",
    icon: "compass"
  }
];

export const rules: Rule[] = [
  {
    icon: "heart",
    title: "Будь дружелюбен",
    desc: "относись к другим так, как хочешь, чтобы относились к тебе"
  },
  {
    icon: "users",
    title: "Уважай участников",
    desc: "без оскорблений и личных нападок"
  },
  {
    icon: "shield",
    title: "Без токсика и агрессии",
    desc: "токсичное поведение ведет к бану"
  },
  {
    icon: "slash",
    title: "Без провокаций",
    desc: "не разжигай конфликты в чатах"
  }
];

export const channelGroups: ChannelGroup[] = [
  {
    title: "Инфо",
    eyebrow: "Основная информация",
    summary: "Правила, идеи и команды ботов.",
    accent: "cyan",
    icon: "info",
    channels: [
      { name: "#info", description: "информация о сервере" },
      { name: "#ideas", description: "предложения" },
      { name: "#bot-spam", description: "команды ботов" }
    ]
  },
  {
    title: "Сообщество",
    eyebrow: "Социальное пространство",
    summary: "Чат, выдача ролей и медиа.",
    accent: "violet",
    icon: "chat",
    channels: [
      { name: "#general", description: "общий чат" },
      { name: "#auto-roles", description: "выдача ролей" },
      { name: "#media", description: "клипы и медиа" }
    ]
  },
  {
    title: "Кино",
    eyebrow: "Кино-вечера",
    summary: "Предложи фильм, возьми билет и собери компанию.",
    accent: "pink",
    icon: "cinema",
    channels: [
      { name: "#offers", description: "предложения фильмов" },
      { name: "#tickets", description: "билеты на просмотр" },
      { name: "#cinema", description: "кино-вечер" }
    ]
  },
  {
    title: "Приложения",
    eyebrow: "Поддержка и инструменты",
    summary: "Боты и тикеты для помощи.",
    accent: "lavender",
    icon: "bot",
    channels: [
      { name: "#apps", description: "боты и приложения" },
      { name: "#ticket-config", description: "настройка тикетов" },
      { name: "#create-ticket", description: "создать тикет" }
    ]
  }
];

export const voiceGroups: VoiceGroup[] = [
  {
    title: "Основные комнаты",
    text: "Для игр, разговоров и посиделок.",
    icon: "mic",
    items: ["Без микро", "Общий 64kbps", "Общий 128kbps"]
  },
  {
    title: "Приватные",
    text: "Создай или настрой личную голосовую комнату.",
    icon: "lock",
    items: ["Редактировать", "Создать"]
  },
  {
    title: "Тихие зоны",
    text: "AFK и личное пространство.",
    icon: "moon",
    items: ["AFK", "Одиночество"]
  }
];

export const roleGroups: RoleGroup[] = [
  {
    title: "Устройство",
    text: "Покажи, на чем играешь.",
    icon: "device",
    items: ["ПК", "Мобильный", "Планшет"]
  },
  {
    title: "Любимые игры",
    text: "Найди игроков со схожими интересами.",
    icon: "gamepad",
    items: ["Игровые префы", "Поиск группы", "Сбор пати"]
  },
  {
    title: "Уведомления",
    text: "Гибкие пинги для поиска тиммейтов.",
    icon: "bell",
    items: ["Пинг тиммейтов", "Обновления", "Гибкая настройка"]
  }
];

export const onboardingSteps: OnboardingStep[] = [
  {
    step: "01",
    title: "Читай #info",
    text: "Структура и правила сервера."
  },
  {
    step: "02",
    title: "Выбери роли",
    text: "Устройство, игры и уведомления."
  },
  {
    step: "03",
    title: "Погружайся",
    text: "Чат, медиа или голосовые комнаты."
  }
];

export const socialLinks = {
  discord: "https://discord.gg/ZZyBZytaWT",
  github: "https://github.com/metsuwuki",
  mainSite: "/"
};

export const securityThreats: SecurityItem[] = [
  {
    icon: "warning",
    title: "Фишинговые сайты",
    desc: "поддельные страницы копируют интерфейс Discord и крадут логин с паролем"
  },
  {
    icon: "warning",
    title: "QR-авторизация",
    desc: "скан чужого QR-кода может мгновенно открыть доступ к твоему аккаунту"
  },
  {
    icon: "warning",
    title: "Кража токена",
    desc: "вредоносный скрипт читает токен из браузера и передает его атакующему"
  },
  {
    icon: "warning",
    title: "Вредоносные расширения",
    desc: "подозрительные расширения могут перехватывать трафик и данные сессии"
  },
  {
    icon: "warning",
    title: "Зараженные .exe и скрипты",
    desc: "\"читы\", генераторы Nitro и сомнительные оверлеи часто несут стилеры"
  },
  {
    icon: "warning",
    title: "Self-XSS через консоль",
    desc: "если тебя просят вставить код в DevTools, почти наверняка пытаются украсть данные"
  },
  {
    icon: "warning",
    title: "Атака через webhook",
    desc: "скомпрометированный бот или webhook может рассылать вредоносные ссылки от лица сервера"
  },
  {
    icon: "warning",
    title: "Социальная инженерия",
    desc: "\"ваш аккаунт заблокирован, перейдите для подтверждения\" - классика фишинга"
  },
  {
    icon: "warning",
    title: "Нитро-скам",
    desc: "ссылки на бесплатный Nitro ведут на фишинг или запускают вредоносный код"
  },
  {
    icon: "warning",
    title: "Утечки паролей из сторонних сервисов",
    desc: "если один пароль используется везде, утечка на другом сайте открывает и Discord"
  }
];

export const securityTips: SecurityItem[] = [
  {
    icon: "shieldCheck",
    title: "Включи 2FA через приложение",
    desc: "используй Google Authenticator или Authy, а не SMS"
  },
  {
    icon: "shieldCheck",
    title: "Никогда не сканируй чужие QR",
    desc: "QR для входа в Discord дает прямой доступ к аккаунту"
  },
  {
    icon: "shieldCheck",
    title: "Не переходи по ссылкам в DM",
    desc: "даже знакомый аккаунт мог быть взломан и рассылать фишинг"
  },
  {
    icon: "shieldCheck",
    title: "Не вставляй код в консоль",
    desc: "настоящая поддержка никогда не просит открывать DevTools и выполнять команды"
  },
  {
    icon: "shieldCheck",
    title: "Используй уникальный пароль",
    desc: "лучше хранить его в менеджере паролей вроде Bitwarden или 1Password"
  },
  {
    icon: "shieldCheck",
    title: "Проверяй URL перед входом",
    desc: "настоящий адрес - только discord.com, без похожих подделок"
  },
  {
    icon: "shieldCheck",
    title: "Закрывай чужие сессии",
    desc: "периодически проверяй список устройств и удаляй незнакомые входы"
  },
  {
    icon: "shieldCheck",
    title: "Не качай сторонние клиенты",
    desc: "модифицированные клиенты и сомнительные плагины часто требуют доступ к токену"
  },
  {
    icon: "shieldCheck",
    title: "Осторожнее с ботами",
    desc: "не выдавай ботам права администратора без крайней необходимости"
  },
  {
    icon: "shieldCheck",
    title: "Включи фильтр личных сообщений",
    desc: "ограничь DM от незнакомых пользователей, если не хочешь лишний риск"
  }
];
