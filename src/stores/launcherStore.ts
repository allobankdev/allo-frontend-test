
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getLaunchers } from '../services/launcherApi'
import type { Launcher } from '../services/launcherApi'

export const useLauncherStore = defineStore('launcher', () => {
  const launchers = ref<Launcher[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const hasFetched = ref(false)

  async function fetchLaunchers() {
    if (loading.value || hasFetched.value) return

    loading.value = true
    error.value = null

    try {
      const data = await getLaunchers()

      const customLaunchers = launchers.value.filter(
        (launcher) => launcher.isCustom === true,
      )

      launchers.value = [...customLaunchers, ...data]
      console.log(launchers.value);
      
      hasFetched.value = true
    } catch (err) {
      console.error('Failed to fetch launchers:', err)
      error.value = 'Gagal mengambil data roket.'
    } finally {
      loading.value = false
    }
  }

  function generateLauncherId(): number {
    return launchers.value.reduce(
      (max, launcher) => Math.max(max, launcher.id),
      0,
    ) + 1
  }

  function addLauncher(
    launcher: Omit<Launcher, 'id' | 'isCustom'>,
  ): Launcher {
    const newLauncher: Launcher = {
      ...launcher,
      id: generateLauncherId(),
      isCustom: true,
    }

    launchers.value.unshift(newLauncher)

    return newLauncher
  }

  return {
    launchers,
    loading,
    error,
    hasFetched,
    fetchLaunchers,
    addLauncher,
    generateLauncherId,
  }
})
