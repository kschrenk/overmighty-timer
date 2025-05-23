/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_IS_DEV_USER?: "enabled" | "disabled";
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
