/**
 * Setup global Vitest. jsdom belum menyediakan ResizeObserver,
 * padahal beberapa komponen Vuetify (VImg, VProgressCircular) memakainya.
 */
class ResizeObserverStub {
  observe () {}
  unobserve () {}
  disconnect () {}
}

globalThis.ResizeObserver ??= ResizeObserverStub
