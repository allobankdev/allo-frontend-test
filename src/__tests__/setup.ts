if (typeof window !== 'undefined' && !window.matchMedia) {
  window.matchMedia = ((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  })) as unknown as typeof window.matchMedia
}

if (typeof window !== 'undefined' && !('ResizeObserver' in window)) {
  class ResizeObserverStub {
    observe () {}
    unobserve () {}
    disconnect () {}
  }
  window.ResizeObserver = ResizeObserverStub as unknown as typeof window.ResizeObserver
}

if (typeof window !== 'undefined' && !('IntersectionObserver' in window)) {
  class IntersectionObserverStub {
    private callback: IntersectionObserverCallback
    constructor (callback: IntersectionObserverCallback) {
      this.callback = callback
    }
    observe (target: Element) {
      this.callback(
        [{ isIntersecting: true, target } as IntersectionObserverEntry],
        this as unknown as IntersectionObserver,
      )
    }
    unobserve () {}
    disconnect () {}
  }
  window.IntersectionObserver = IntersectionObserverStub as unknown as typeof window.IntersectionObserver
}
