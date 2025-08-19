import type React from 'react';
import { Alert } from 'antd';
import { useTemplatePermissions } from '../hooks/usePermissions';

interface Props {
  requirePerm?: string;
  requireAnyRole?: string[];
  children: React.ReactNode;
}

export const WithPermission: React.FC<Props> = ({
  requirePerm,
  requireAnyRole,
  children,
}) => {
  const { hasPermission, hasAnyRole } = useTemplatePermissions();

  if (requirePerm && !hasPermission(requirePerm)) {
    return <Alert type="warning" message="无访问权限" showIcon />;
  }

  if (
    requireAnyRole &&
    requireAnyRole.length > 0 &&
    !hasAnyRole(requireAnyRole)
  ) {
    return <Alert type="warning" message="角色不满足访问条件" showIcon />;
  }

  return <>{children}</>;
};
