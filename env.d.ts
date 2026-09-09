/// <reference types="vite/client" />
/// <reference types="unplugin-vue-router/client" />

interface ImportMetaEnv {
  /** Overrides the Launch Library 2 base URL — see .env.example. Falls back to the dev host when unset. */
  readonly VITE_API_BASE_URL?: string
}
