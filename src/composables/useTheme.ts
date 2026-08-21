import { ref, computed, onMounted } from 'vue'

const savedTheme = typeof window !== 'undefined' ? localStorage.getItem('hig-theme') : null
const isDark = ref(
  savedTheme
    ? savedTheme === 'dark'
    : typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches
)

export function useTheme() {
  const currentTheme = computed(() => (isDark.value ? 'dark' : 'light'))

  function updateDom(dark: boolean) {
    if (typeof document === 'undefined') return
    const themeName = dark ? 'dark' : 'light'
    document.documentElement.setAttribute('data-theme', themeName)
    if (dark) {
      document.documentElement.classList.add('dark')
      document.documentElement.classList.remove('light')
    } else {
      document.documentElement.classList.add('light')
      document.documentElement.classList.remove('dark')
    }
  }

  function toggleTheme() {
    isDark.value = !isDark.value
    const themeName = isDark.value ? 'dark' : 'light'
    localStorage.setItem('hig-theme', themeName)
    updateDom(isDark.value)
  }

  function initTheme() {
    updateDom(isDark.value)

    if (typeof window !== 'undefined') {
      const darkMQ = window.matchMedia('(prefers-color-scheme: dark)')
      darkMQ.addEventListener('change', (e) => {
        if (!localStorage.getItem('hig-theme')) {
          isDark.value = e.matches
          updateDom(isDark.value)
        }
      })
    }
  }

  onMounted(() => {
    initTheme()
  })

  return {
    isDark,
    currentTheme,
    toggleTheme,
    initTheme,
  }
}
