import { ref, watch, type MaybeRefOrGetter, toValue } from 'vue'
import { fetchRocketById } from '@/services/rocketApi'
import { ApiError, isAbortError, toErrorMessage } from '@/services/httpClient'
import { isLocalRocketId, useRocketStore } from '@/stores/rockets'
import type { RequestStatus, Rocket } from '@/types/rocket'

/** Uses the stored rocket when available, otherwise fetches it from the API. */
export function useRocketDetail (id: MaybeRefOrGetter<string>) {
  const store = useRocketStore()

  const rocket = ref<Rocket | null>(null)
  const status = ref<RequestStatus>('idle')
  const error = ref<string | null>(null)
  /** Retrying won't help (unknown id, or a user-added rocket lost on reload). */
  const notFound = ref(false)

  let abortController: AbortController | null = null

  function fail (message: string, isNotFound: boolean) {
    rocket.value = null
    error.value = message
    notFound.value = isNotFound
    status.value = 'error'
  }

  async function load () {
    abortController?.abort()
    abortController = null

    const rocketId = toValue(id)
    error.value = null
    notFound.value = false

    const cached = store.findRocket(rocketId)
    if (cached) {
      rocket.value = cached
      status.value = 'success'
      return
    }

    if (isLocalRocketId(rocketId)) {
      fail('This rocket was added in a previous session and is no longer available.', true)
      return
    }

    const controller = new AbortController()
    abortController = controller
    rocket.value = null
    status.value = 'loading'
    try {
      rocket.value = await fetchRocketById(rocketId, controller.signal)
      status.value = 'success'
    } catch (err) {
      if (isAbortError(err)) return
      fail(toErrorMessage(err), err instanceof ApiError && err.status === 404)
    } finally {
      if (abortController === controller) abortController = null
    }
  }

  watch(() => toValue(id), load, { immediate: true })

  function cancel () {
    abortController?.abort()
    abortController = null
  }

  return { rocket, status, error, notFound, retry: load, cancel }
}
