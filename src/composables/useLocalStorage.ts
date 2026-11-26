import { computed, ref } from "vue"

const serializer = {
  write: <T>(data: T) => JSON.stringify(data),
  read: <T>(data: string | null): T | undefined => {
    if (!data) return
    try {
      return JSON.parse(data)
    } catch (error) {
      console.error("Error while parsing localstorage data", error)
    }
  }
}

export const useLocalStorage = <T>(key: string, initValue?: T) => {
  const data = ref<T | undefined>(serializer.read(localStorage.getItem(key)) || initValue)
  const computedData = computed<T>({
    get: () => data.value,
    set: (v) => {
      data.value = v
      localStorage.setItem(key, serializer.write(v))
    }
  })

  return computedData
}