import { useMemo } from 'react';

/**
 * 检测当前应用是否作为远程模块运行
 * 用于条件性显示某些组件（如语言切换器）
 * 优化版本：简化检测逻辑，提高性能
 */
const useIsRemote = () => {
  const isRemote = useMemo(() => {
    // 简化的检测逻辑，按可靠性排序

    // 1. 检查主应用设置的全局标识（最可靠）
    if ((window as any).__MF_SHELL_APP__ === true) return true;

    // 2. 检查是否在 iframe 中运行（常见场景）
    if (window.parent !== window) return true;

    // 3. 检查主应用的 DOM 标识
    if (document.querySelector('[data-shell-app]')) return true;

    // 4. 检查端口和路径组合（用于开发环境）
    if (window.location.port === '3000' && window.location.pathname.includes('/template')) {
      return true;
    }

    // 5. 检查 URL 参数（备用方案）
    if (new URLSearchParams(window.location.search).has('embedded')) return true;

    // 默认为独立运行
    return false;
  }, []);

  // 开发环境下的简化调试信息
  if (process.env.NODE_ENV === 'development') {
    console.log('🔍 Remote mode:', isRemote);
  }

  return isRemote;
};

export default useIsRemote;
