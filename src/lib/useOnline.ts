import { useSyncExternalStore } from 'react'

function assinar(avisar: () => void) {
  window.addEventListener('online', avisar)
  window.addEventListener('offline', avisar)
  return () => {
    window.removeEventListener('online', avisar)
    window.removeEventListener('offline', avisar)
  }
}

/** Estado de conexão reativo (design D2): `navigator.onLine` + eventos `online`/`offline`. */
export function useOnline() {
  return useSyncExternalStore(assinar, () => navigator.onLine, () => true)
}
