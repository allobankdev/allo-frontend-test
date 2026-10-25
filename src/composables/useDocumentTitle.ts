import { watchEffect } from 'vue'
import type { MaybeRefOrGetter } from 'vue'
import { toValue } from 'vue'

const SITE_NAME = 'SpaceX Rocket Explorer'

export function useDocumentTitle (title: MaybeRefOrGetter<string | null | undefined>) {
  watchEffect(() => {
    const value = toValue(title)
    document.title = value ? `${value} · ${SITE_NAME}` : SITE_NAME
  })
}
