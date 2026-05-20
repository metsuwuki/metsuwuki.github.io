/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_CLASH_SUPABASE_URL?: string;
  readonly VITE_CLASH_SUPABASE_ANON_KEY?: string;
  readonly VITE_DEV_MAIN_URL?: string;
  readonly VITE_DEV_ANIMESITE_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
