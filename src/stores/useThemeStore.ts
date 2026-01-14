import {defineStore} from 'pinia'

export const useThemeStore = defineStore('theme', {
  state: () => ({
    theme: 'dark' as 'dark' | 'light',
  }),
  actions: {
    toggle() {
      this.theme = this.theme === 'light' ? 'dark' : 'light'
    },
  },
  persist: true,
})
