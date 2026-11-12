import { type MaybeRefOrGetter, ref, toValue, watch } from 'vue'
import { type LoadStatus, useRocketStore } from '@/stores/rocket'
import type { Rocket } from '@/types/rocket'
import { getErrorMessage } from '@/utils/errorMessage'

/**
 * Mengelola pengambilan data satu rocket untuk layar detail beserta state UI-nya.
 * Data diambil ulang setiap kali id berubah; rocket yang sudah ada di store
 * langsung tampil tanpa request.
 *
 * @param id - Id rocket, biasanya dari parameter route.
 * @returns Rocket aktif, status, pesan error, dan fungsi `retry`.
 */
export function useRocketDetail (id: MaybeRefOrGetter<string>) {
  const rocketStore = useRocketStore()

  const rocket = ref<Rocket | null>(null)
  const status = ref<LoadStatus>('idle')
  const error = ref<string | null>(null)

  // Penanda request terakhir: respons lama diabaikan jika id sudah berganti
  // sebelum request sebelumnya selesai.
  let latestRequest = 0

  async function load () {
    const requestId = ++latestRequest
    const currentId = toValue(id)

    // Data dari cache dipakai langsung agar tidak ada kedipan loading.
    const cached = rocketStore.findRocket(currentId)
    if (cached) {
      rocket.value = cached
      status.value = 'success'
      error.value = null
      return
    }

    rocket.value = null
    status.value = 'loading'
    error.value = null

    try {
      const result = await rocketStore.loadRocketById(currentId)
      if (requestId !== latestRequest) return
      rocket.value = result
      status.value = 'success'
    } catch (caught) {
      if (requestId !== latestRequest) return
      error.value = getErrorMessage(caught)
      status.value = 'error'
    }
  }

  watch(() => toValue(id), load, { immediate: true })

  return { rocket, status, error, retry: load }
}
