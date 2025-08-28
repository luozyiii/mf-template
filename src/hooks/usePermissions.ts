import { useCallback, useEffect, useMemo, useState } from 'react';
import { getStoreValue, subscribeStore } from 'mf-shared/store';

export type TemplatePermission = 'template:read' | string;

export const useTemplatePermissions = () => {
  const [permissions, setPermissions] = useState<Record<string, boolean>>({});
  const [roles, setRoles] = useState<string[]>([]);

  useEffect(() => {
    try {
      const perms = getStoreValue<Record<string, boolean>>('permissions') || {};
      setPermissions(perms);
      const user = getStoreValue<any>('user');
      setRoles(user?.permissions || (user?.role ? [user.role] : []));

      const unsubPerms = subscribeStore?.('permissions', (_k: string, newVal: any) => {
        setPermissions(newVal || {});
      });
      const unsubUser = subscribeStore?.('user', (_k: string, newVal: any) => {
        setRoles(newVal?.permissions || (newVal?.role ? [newVal.role] : []));
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
