import { onWatcherCleanup, ref, watch, type Ref } from 'vue'

/**
 * Mirrors a reactive ref after a delay, cancelling stale timers automatically
 * when the source changes or the owning scope unmounts. Empty strings flush immediately.
 */
export function useDebouncedRef<T>(source: Ref<T>, delay = 300) {
  const debouncedValue = ref(source.value) as Ref<T>
  const isPending = ref(false)

  watch(source, (newValue) => {
    if (typeof newValue === 'string' && newValue === '') {
      debouncedValue.value = newValue
      isPending.value = false
      return
    }

    isPending.value = true
    const timer = setTimeout(() => {
      debouncedValue.value = newValue
      isPending.value = false
    }, delay)

    onWatcherCleanup(() => {
      clearTimeout(timer)
    })
  })

  return {
    debouncedValue,
    isPending,
  }
}
