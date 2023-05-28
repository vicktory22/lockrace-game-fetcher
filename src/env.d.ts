/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_GAMES_URL: string;
  readonly VITE_LOKI_URL: string;
  readonly VITE_LOKI_USER: string;
  readonly VITE_LOKI_API_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
