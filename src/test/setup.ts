class ResizeObserverStub {
  observe () {}
  unobserve () {}
  disconnect () {}
}

globalThis.ResizeObserver ??= ResizeObserverStub as unknown as typeof ResizeObserver

window.visualViewport ??= new EventTarget() as unknown as VisualViewport
