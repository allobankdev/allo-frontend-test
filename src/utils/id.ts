/**
 * utils/id.ts
 */

export const LOCAL_ID_PREFIX = 'local-'

export function createLocalId (): string {
  // `crypto.randomUUID` is only available in secure contexts (https / localhost).
  const unique = typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`
  return `${LOCAL_ID_PREFIX}${unique}`
}

export function isLocalId (id: string): boolean {
  return id.startsWith(LOCAL_ID_PREFIX)
}
