import { vi } from 'vitest'

// Mock ResizeObserver for Vuetify components under JSDOM
global.ResizeObserver = class ResizeObserver {
  observe () {
    // mock
  }
  unobserve () {
    // mock
  }
  disconnect () {
    // mock
  }
}

// Mock visualViewport if missing
if (typeof window !== 'undefined' && !window.visualViewport) {
  window.visualViewport = {
    width: 1024,
    height: 768,
    offsetLeft: 0,
    offsetTop: 0,
    pageLeft: 0,
    pageTop: 0,
    scale: 1,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  } as unknown as VisualViewport
}
