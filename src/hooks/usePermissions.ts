import { useCallback, useEffect, useMemo, useState } from 'react';
// @ts-ignore - MF runtime
import { getStoreValue, subscribeStore } from 'mf-shared/store';

export type TemplatePermission = 'template:read' | string;

export const useTemplatePermissions = () => {
  const [permissions, setPermissions] = useState<Record<string, boolean>>({});
  const [roles, setRoles] = useState<string[]>([]);

  useEffect(() => {
    try {
      const perms = getStoreValue<Record<string, boolean>>('roles') || {};
      setPermissions(perms);
      const user = getStoreValue<any>('user');
      setRoles(user?.roles || (user?.role ? [user.role] : []));

      const unsubPerms = subscribeStore?.(
        'roles',
        (_k: string, newVal: any) => {
          setPermissions(newVal || {});
        }
      );
      const unsubUser = subscribeStore?.('user', (_k: string, newVal: any) => {
        setRoles(newVal?.roles || (newVal?.role ? [newVal.role] : []));
      });
      return () => {
        try {
          unsubPerms?.();
          unsubUser?.();
        } catch {}
      };
    } catch {}
  }, []);

  const hasPermission = useCallback(
    (perm: TemplatePermission): boolean => {
      return permissions[perm] === true;
    },
    [permissions]
  );

  const hasAnyRole = useCallback(
    (need: string[]): boolean => {
      if (!need?.length) return true;
      return need.some((r) => roles.includes(r));
    },
    [roles]
  );

  const summary = useMemo(() => ({ permissions, roles }), [permissions, roles]);

  return { permissions, roles, hasPermission, hasAnyRole, summary };
};
