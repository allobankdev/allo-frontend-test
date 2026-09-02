import { computed } from 'vue'
import type { Ref } from 'vue'
import type { Rocket } from '@/types/rocket'

/**
 * Composable that filters a reactive list of rockets by a search query.
 * Matches against both `full_name` and `description` (case-insensitive).
 *
 * @param rockets - A ref or computed ref of the full rocket list.
 * @param query   - A ref containing the current search string.
 * @returns A computed ref of the filtered rockets.
 */
export function useRocketFilter(rockets: Ref<Rocket[]>, query: Ref<string>) {
  const filteredRockets = computed<Rocket[]>(() => {
    const trimmed = query.value.trim().toLowerCase()

    if (!trimmed) return rockets.value

    return rockets.value.filter((rocket) => {
      const nameMatch = rocket.full_name.toLowerCase().includes(trimmed)
      const descMatch = rocket.description?.toLowerCase().includes(trimmed) ?? false
      return nameMatch || descMatch
    })
  })

  return { filteredRockets }
}

