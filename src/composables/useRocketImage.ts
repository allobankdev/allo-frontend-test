import { ref } from 'vue'
import { isMissing } from '@/utils/format'

export const ROCKET_PLACEHOLDER_IMAGE = '/placeholder-rocket.svg'

/** Launchers known to carry a null/broken image in LL2 2.2.0. */
const KNOWN_MISSING_IMAGE_IDS = new Set<string>(['522'])

export function resolveRocketImage (imageUrl: string | null | undefined, id: number | string): string {
  if (isMissing(imageUrl)) return ROCKET_PLACEHOLDER_IMAGE
  if (KNOWN_MISSING_IMAGE_IDS.has(String(id))) return ROCKET_PLACEHOLDER_IMAGE
  return String(imageUrl)
}

export function useRocketImage (imageUrl: string | null | undefined, id: number | string) {
  const src = ref(resolveRocketImage(imageUrl, id))
  const failed = ref(false)

  function onError () {
    if (!failed.value) {
      failed.value = true
      src.value = ROCKET_PLACEHOLDER_IMAGE
    }
  }

  return { src, onError }
}
