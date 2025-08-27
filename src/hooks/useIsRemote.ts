import { useMemo } from 'react';

/**
 * 检测当前应用是否作为远程模块运行
 * 用于条件性显示某些组件（如语言切换器）
 * 优化版本：使用 useMemo 避免重复计算
 */
const useIsRemote = () => {
  const isRemote = useMemo(() => {
    // 优先级检测：最可靠的指标优先

    // 1. 检查主应用设置的全局标识（最可靠）
    const hasShellGlobal = (window as any).__MF_SHELL_APP__ === true;
    if (hasShellGlobal) return true;

    // 2. 检查主应用的 DOM 标识
    const hasShellElements = document.querySelector('[data-shell-app]') !== null;
    if (hasShellElements) return true;

    // 3. 检查端口和路径组合（较可靠）
    const isOnShellPort = window.location.port === '3000';
    const isInMicroFrontendPath = window.location.pathname.includes('/template');
    if (isOnShellPort && isInMicroFrontendPath) return true;

    // 4. 检查 URL 参数
    const searchParams = new URLSearchParams(window.location.search);
    const hasEmbeddedParam = searchParams.has('embedded');
    if (hasEmbeddedParam) return true;

    // 5. 检查是否在 iframe 中运行
    const isInIframe = window.parent !== window;
    if (isInIframe) return true;

    // 6. 检查其他全局标识
    const hasRemoteFlag = (window as any).__MF_REMOTE_MODE__ === true;
    if (hasRemoteFlag) return true;

    // 默认为独立运行
    return false;
  }, []);

  // 只在开发环境输出调试信息
  if (process.env.NODE_ENV === 'development') {
    console.log('🔍 Remote detection result:', {
      isRemote,
      port: window.location.port,
      pathname: window.location.pathname,
      hasShellGlobal: (window as any).__MF_SHELL_APP__ === true,
      hasShellElements: document.querySelector('[data-shell-app]') !== null,
    });
  }

  return isRemote;
};

export default useIsRemote;
