// Short key scheme for mf-template
// env:app:scope with scopes { user, app, permissions, token }
// env: t (template standalone) when standalone; g:sh when integrated (operate shell's data)

// @ts-ignore - MF runtime
import {
  getStoreValue,
  setStoreValue,
  subscribeStore,
  configureStoreStrategy,
  clearStoreByPrefix,
} from 'mf-shared/store';

export type Scope = 'user' | 'app' | 'permissions' | 'token';

const isStandaloneEnv = () => {
  try {
    const storageKey = (window as any)?.globalStore?.options?.storageKey;
    return storageKey === 'mf-template-store';
  } catch {
    return false;
  }
};

// 统一使用简化键（user/app/permissions/token），无论是否集成
export const shortPrefix = () => '';
export const keyOf = (scope: Scope) => scope;

// legacy mapping (when standalone operate template data; when integrated operate shell data)
const oldKeyOf = (scope: Scope) => {
  const standalone = isStandaloneEnv();
  const base = standalone ? 'mf-template-' : 'mf-shell-';
  switch (scope) {
    case 'user':
      return `${base}userinfo`;
    case 'app':
      return `${base}appconfig`;
    case 'permissions':
      return `${base}permissions`;
    case 'token':
      return `${base}token`;
  }
};

let migrated = false;
export const ensureMigrated = () => {
  if (migrated) return;
  try {
    (['user', 'app', 'permissions', 'token'] as Scope[]).forEach((s) => {
      const newK = keyOf(s);
      const oldK = oldKeyOf(s);
      const gshK = `g:sh:${s}`;
      const newVal = getStoreValue(newK);
      if (newVal === undefined || newVal === null) {
        const oldVal = getStoreValue(oldK);
        const gshVal = getStoreValue(gshK);
        const src = oldVal !== undefined && oldVal !== null ? oldVal : gshVal;
        if (src !== undefined && src !== null) {
          try {
            configureStoreStrategy?.(newK, {
              medium: 'local',
              encrypted: s === 'token',
            });
          } catch {}
          setStoreValue(newK, src);
        }
      }
    });
  } catch {}
  migrated = true;
};

export const getVal = (scope: Scope) => {
  ensureMigrated();
  const v = getStoreValue(keyOf(scope));
  if (v !== undefined && v !== null) return v;
  return getStoreValue(oldKeyOf(scope));
};

export const setVal = (scope: Scope, value: any) => {
  ensureMigrated();
  setStoreValue(keyOf(scope), value);
};

export const subscribeVal = (
  scope: Scope,
  cb: (key: string, val: any) => void
) => {
  ensureMigrated();
  const unsubNew = subscribeStore?.(keyOf(scope), cb);
  const unsubOld = subscribeStore?.(oldKeyOf(scope), cb);
  return () => {
    try {
      unsubNew?.();
    } catch {}
    try {
      unsubOld?.();
    } catch {}
  };
};

export const clearByShortPrefix = () => {
  try {
    if (shortPrefix()) clearStoreByPrefix(shortPrefix());
  } catch {}
};
