declare module '*.module.css' {
  const classes: { [key: string]: string };
  export default classes;
}

declare module '*.module.scss' {
  const classes: { [key: string]: string };
  export default classes;
}

declare module '*.module.sass' {
  const classes: { [key: string]: string };
  export default classes;
}

declare module '*.module.less' {
  const classes: { [key: string]: string };
  export default classes;
}

declare module 'mf-shared/store' {
  export function initGlobalStore(options?: any): void;
  export function setStoreValue(key: string, value: any, callback?: any): void;
  export function getStoreValue<T = any>(key: string): T | undefined;
  export function subscribeStore(
    key: string,
    callback: (key: string, newVal: any, oldVal?: any) => void
  ): () => void;
  export function unsubscribeStore(key: string, callback: any): void;
  export function clearStore(): void;
  export function configureStoreStrategy(
    keyOrPrefix: string,
    strategy: any
  ): void;
  export function clearStoreByPrefix(prefix: string): void;
  export function clearAppData(appStorageKey: string): void;
  const _default: any;
  export default _default;
}
