import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import {
  defaultLocale,
  getSiteContent,
  type Locale,
  type LocalizedSiteContent
} from "../data/siteContent";

type PageLocaleContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  content: LocalizedSiteContent;
};

const PageLocaleContext = createContext<PageLocaleContextValue | null>(null);

type PageLocaleProviderProps = {
  children: ReactNode;
};

export function PageLocaleProvider({ children }: PageLocaleProviderProps) {
  const [locale, setLocale] = useState<Locale>(defaultLocale);
  const content = useMemo(() => getSiteContent(locale), [locale]);

  const value = useMemo(() => ({ locale, setLocale, content }), [locale, content]);

  return <PageLocaleContext.Provider value={value}>{children}</PageLocaleContext.Provider>;
}

export function usePageLocale() {
  const context = useContext(PageLocaleContext);

  if (!context) {
    throw new Error("usePageLocale must be used within PageLocaleProvider");
  }

  return context;
}
