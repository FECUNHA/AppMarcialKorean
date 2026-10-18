import '@testing-library/jest-dom/vitest'

afterEach(() => {
  vi.unstubAllGlobals()
  vi.restoreAllMocks()
  if (typeof window !== 'undefined') window.localStorage.clear()
})
