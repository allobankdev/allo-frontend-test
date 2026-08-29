import { createStore, useStore as baseUseStore } from 'vuex'
import type { InjectionKey } from 'vue'
import type { Store } from 'vuex'
import type { RootState } from './types'
import { rocketsModule } from './rockets'

// Injection key for TypeScript support
export const key: InjectionKey<Store<RootState>> = Symbol('vuex-store')

// Create store
export const store = createStore<RootState>({
  modules: {
    rockets: rocketsModule
  },
  strict: import.meta.env.DEV
})

// Typed useStore hook
export function useStore(): Store<RootState> {
  return baseUseStore(key)
}

// Re-export types and constants
export type { RootState, RocketsState } from './types'
export { ActionTypes, GetterTypes, MutationTypes } from './rockets'
