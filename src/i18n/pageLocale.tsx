import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import {
  defaultLocale,
  type Locale,
} from "../data/siteContent";
import { getProfileContent, type ProfileContent, type ProfileId } from "../data/profileContent";

type PageLocaleContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  content: ProfileContent;
  profileId: ProfileId;
};

const PageLocaleContext = createContext<PageLocaleContextValue | null>(null);

type PageLocaleProviderProps = {
  children: ReactNode;
  profileId: ProfileId;
};

export function PageLocaleProvider({ children, profileId }: PageLocaleProviderProps) {
  const [locale, setLocale] = useState<Locale>(defaultLocale);
  const content = useMemo(() => getProfileContent(profileId, locale), [locale, profileId]);

  const value = useMemo(() => ({ locale, setLocale, content, profileId }), [locale, content, profileId]);

  return <PageLocaleContext.Provider value={value}>{children}</PageLocaleContext.Provider>;
}

export function usePageLocale() {
  const context = useContext(PageLocaleContext);

  if (!context) {
    throw new Error("usePageLocale must be used within PageLocaleProvider");
  }

  return context;
}
