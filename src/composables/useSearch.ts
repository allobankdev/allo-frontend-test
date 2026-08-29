import { storeToRefs } from 'pinia'
import { useRocketStore } from '@/stores/Rockets'

export function useSearch() {
  const rocketStore = useRocketStore()
  const { search, country, filteredRockets } = storeToRefs(rocketStore)

  function setSearch(value: string) {
    rocketStore.setSearch(value)
    
  }

  return {
    search,
    country,
    filteredRockets,
    setSearch
  }
}
