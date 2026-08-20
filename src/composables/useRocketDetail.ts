import { computed, onBeforeUnmount, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useRocketStore } from '@/stores/rocket'

export function useRocketDetail () {
  const route = useRoute()
  const store = useRocketStore()
  const rocketId = computed(() => String(route.params.id ?? ''))
  let activeController: AbortController | undefined

  const rocket = computed(() => store.findRocket(rocketId.value))
  const loadState = computed(() => store.getDetailState(rocketId.value))

  function load (force = false) {
    activeController?.abort()
    activeController = new AbortController()

    return store.loadRocket(rocketId.value, {
      force,
      signal: activeController.signal,
    })
  }

  watch(rocketId, () => void load(), { immediate: true })
  onBeforeUnmount(() => activeController?.abort())

  return {
    rocket,
    rocketId,
    loadState,
    load,
  }
}
