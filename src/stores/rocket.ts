import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { ApiError, fetchRocketById, fetchRockets } from '@/services/rocketApi'
import type { Rocket } from '@/types/rocket'
import { getErrorMessage } from '@/utils/errorMessage'
import { filterRockets } from '@/utils/filterRockets'

/** Status pengambilan data untuk menentukan state UI (Loading, Fail, Success). */
export type LoadStatus = 'idle' | 'loading' | 'error' | 'success'

/** Data rocket baru dari form tambah rocket, tanpa id. */
export type NewRocketInput = Omit<Rocket, 'id'>

/** Awalan id rocket buatan pengguna agar tidak bentrok dengan id dari API. */
const CUSTOM_ID_PREFIX = 'custom-'

/**
 * Store data rocket: list dari API, rocket tambahan pengguna, filter, dan cache detail.
 * Hasil fetch disimpan di memori supaya pindah halaman tidak memicu request ulang
 * (API anonim dibatasi 15 request/jam).
 */
export const useRocketStore = defineStore('rocket', () => {
  const apiRockets = ref<Rocket[]>([])
  const customRockets = ref<Rocket[]>([])
  /** Rocket hasil fetch detail yang tidak ada di list, misalnya saat halaman detail dibuka langsung. */
  const detailCache = ref<Record<string, Rocket>>({})
  const listStatus = ref<LoadStatus>('idle')
  const listError = ref<string | null>(null)
  const searchQuery = ref('')

  /** Semua rocket, rocket tambahan pengguna tampil paling atas. */
  const rockets = computed(() => [...customRockets.value, ...apiRockets.value])
  /** Rocket yang lolos filter `searchQuery`. */
  const filteredRockets = computed(() => filterRockets(rockets.value, searchQuery.value))

  let pendingList: Promise<void> | null = null

  /**
   * Memuat list rocket dari API. Tidak melakukan request jika data sudah ada,
   * kecuali `force` bernilai true (dipakai tombol Retry).
   * Pemanggilan bersamaan berbagi satu request yang sama.
   */
  function loadRockets (options: { force?: boolean } = {}): Promise<void> {
    if (listStatus.value === 'success' && !options.force) return Promise.resolve()
    if (pendingList) return pendingList

    listStatus.value = 'loading'
    listError.value = null

    pendingList = fetchRockets()
      .then(result => {
        apiRockets.value = result
        listStatus.value = 'success'
      })
      .catch(error => {
        listError.value = getErrorMessage(error)
        listStatus.value = 'error'
      })
      .finally(() => {
        pendingList = null
      })

    return pendingList
  }

  /** Mencari rocket di list dan cache detail tanpa request ke API. */
  function findRocket (id: string): Rocket | undefined {
    return rockets.value.find(rocket => rocket.id === id) ?? detailCache.value[id]
  }

  /**
   * Mengambil satu rocket: cek cache dulu, request ke API hanya jika belum ada.
   *
   * @param id - Id rocket dari parameter route.
   * @throws {ApiError} Jika rocket tidak ditemukan atau request gagal.
   */
  async function loadRocketById (id: string): Promise<Rocket> {
    const cached = findRocket(id)
    if (cached) return cached

    // Rocket buatan pengguna hanya ada di memori; setelah reload datanya hilang
    // dan API pasti membalas 404, jadi tidak perlu menghabiskan request.
    if (id.startsWith(CUSTOM_ID_PREFIX)) throw new ApiError(404)

    const rocket = await fetchRocketById(id)
    detailCache.value[id] = rocket
    return rocket
  }

  /**
   * Menambah rocket baru ke state aplikasi (API bersifat read-only).
   *
   * @param input - Data rocket dari form.
   * @returns Rocket yang tersimpan beserta id lokalnya.
   */
  function addRocket (input: NewRocketInput): Rocket {
    const rocket: Rocket = { ...input, id: `${CUSTOM_ID_PREFIX}${crypto.randomUUID()}` }
    customRockets.value.unshift(rocket)
    return rocket
  }

  // Pinia mewajibkan semua state setup store dikembalikan (devtools dan plugin bergantung padanya).
  return {
    apiRockets,
    customRockets,
    detailCache,
    listStatus,
    listError,
    searchQuery,
    rockets,
    filteredRockets,
    loadRockets,
    findRocket,
    loadRocketById,
    addRocket,
  }
})
