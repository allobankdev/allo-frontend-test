/// <reference types="vite/client" />
/// <reference types="unplugin-vue-router/client" />

/**
 * `vue-tsc` resolves single-file components natively, but a plain TypeScript
 * service (VS Code without Vue's Take Over Mode, and other editors) does not,
 * and reports `Cannot find module './App.vue'`. This shim types every SFC
 * import as a Vue component so the editor agrees with `npm run type-check`.
 */
declare module '*.vue' {
  import type { DefineComponent } from 'vue'

  const component: DefineComponent<Record<string, unknown>, Record<string, unknown>, unknown>
  export default component
}
