/// <reference types="vite/client" />
/// <reference types="unplugin-vue-router/client" />

interface ImportMetaEnv {
  /** Overrides the Launch Library 2 base URL (defaults to the lldev host). */
  readonly VITE_LL2_API_BASE_URL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
