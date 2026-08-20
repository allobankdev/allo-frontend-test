import { onBeforeUnmount, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useRocketStore } from '@/stores/rocket'

export function useRocketList () {
  const store = useRocketStore()
  const { rockets, listError, listStatus } = storeToRefs(store)
  let activeController: AbortController | undefined

  function load (force = false) {
    activeController?.abort()
    activeController = new AbortController()

    return store.loadRockets({
      force,
      signal: activeController.signal,
    })
  }

  onMounted(() => void load())
  onBeforeUnmount(() => activeController?.abort())

  return {
    rockets,
    listError,
    listStatus,
    load,
  }
}
