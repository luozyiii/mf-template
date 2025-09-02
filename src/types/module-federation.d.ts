// Module Federation 类型声明
// 这些模块在运行时通过 Module Federation 提供

declare module 'mf-shared/store' {
  export interface StoreValue {
    [key: string]: any;
  }

  export interface AppConfig {
    theme?: string;
    language?: string;
    version?: string;
    [key: string]: any;
  }

  export interface UserInfo {
    name?: string;
    age?: number;
    role?: string;
    [key: string]: any;
  }

  // 存储相关函数
  export function getStoreValue(key: string): any;
  export function setStoreValue(key: string, value: any): void;
  export function subscribeStore(callback: (key: string, value: any) => void): () => void;
  export function clearAppData(): void;
  export function initGlobalStore(): void;
  export function configureStoreStrategy(strategy: any): void;
}
