// Store key management for mf-template

import { getStoreValue, setStoreValue, subscribeStore } from 'mf-shared/store';

export type Scope = 'user' | 'app' | 'permissions' | 'token';

export const keyOf = (scope: Scope) => scope;

export const getVal = (scope: Scope) => {
  return getStoreValue(keyOf(scope));
};

export const setVal = (scope: Scope, value: any) => {
  setStoreValue(keyOf(scope), value);
};

export const subscribeVal = (scope: Scope, cb: (key: string, val: any) => void) => {
  return (subscribeStore as any)?.(keyOf(scope), (key: string, newValue: any, _oldValue: any) =>
    cb(key, newValue)
  );
};

export const clearByShortPrefix = () => {
  try {
    const scopes: Scope[] = ['user', 'app', 'permissions', 'token'];
    scopes.forEach((scope) => {
      try {
        setStoreValue(keyOf(scope), undefined);
      } catch {}
    });
  } catch {}
};
