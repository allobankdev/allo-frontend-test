import { computed } from 'vue'
import { useTheme } from 'vuetify'

const THEME_STORAGE_KEY = 'allo-rockets:theme'

export function useAppTheme () {
  const theme = useTheme()

  const stored = localStorage.getItem(THEME_STORAGE_KEY)
  if (stored === 'light' || stored === 'dark') {
    theme.global.name.value = stored
  }

  const isDark = computed(() => theme.global.current.value.dark)

  function toggleTheme () {
    const next = isDark.value ? 'light' : 'dark'
    theme.global.name.value = next
    try {
      localStorage.setItem(THEME_STORAGE_KEY, next)
    } catch {
      // Non-critical — the toggle still works for the current session.
    }
  }

  return { isDark, toggleTheme }
}
