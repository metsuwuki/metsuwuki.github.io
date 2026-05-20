/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_DEV_CLASH_CLAN_URL?: string;
  readonly VITE_DEV_ANIMESITE_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
