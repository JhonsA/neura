/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** @see https://vitejs.dev/guide/env-and-mode */
  readonly VITE_WAVE_ANIMATED: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
