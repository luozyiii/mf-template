import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface ScrollToTopProps {
  /**
   * 是否启用平滑滚动
   * @default true
   */
  smooth?: boolean;
  /**
   * 滚动延迟时间（毫秒）
   * @default 100
   */
  delay?: number;
  /**
   * 是否在路由变化时自动滚动到顶部
   * @default true
   */
  autoScroll?: boolean;
}

/**
 * 微前端环境下的滚动到顶部组件
 *
 * 针对微前端环境优化：
 * 1. 优先滚动主应用的内容区域
 * 2. 处理嵌套路由的滚动
 * 3. 避免与主应用的滚动逻辑冲突
 */
export const ScrollToTop: React.FC<ScrollToTopProps> = ({
  smooth = true,
  delay = 100,
  autoScroll = true,
}) => {
  const location = useLocation();

  // biome-ignore lint/correctness/useExhaustiveDependencies: location.pathname 是必要的，用于在路由变化时触发滚动
  useEffect(() => {
    if (!autoScroll) return;

    const scrollToTop = () => {
      // 在微前端环境中，优先滚动主应用的内容区域
      const scrollTargets = [
        // 主应用的内容区域
        document.querySelector('.ant-layout-content'),
        // 当前应用的滚动容器
        document.querySelector('[data-scroll-container]'),
        // 备选滚动目标
        document.querySelector('main'),
        document.body,
        document.documentElement,
      ].filter(Boolean) as HTMLElement[];

      scrollTargets.forEach((target) => {
        if (target) {
          try {
            if (
              smooth &&
              'scrollTo' in target &&
              typeof target.scrollTo === 'function'
            ) {
              // 平滑滚动
              target.scrollTo({
                top: 0,
                left: 0,
                behavior: 'smooth',
              });
            } else {
              // 即时滚动
              target.scrollTop = 0;
              if ('scrollLeft' in target) {
                target.scrollLeft = 0;
              }
            }
          } catch (error) {
            // 降级处理
            console.warn(
              'MicroFrontend ScrollToTop: 滚动失败，使用降级方案',
              error
            );
            target.scrollTop = 0;
          }
        }
      });

      // 通知主应用进行滚动（如果在微前端环境中）
      if (window.parent !== window) {
        try {
          window.parent.postMessage(
            {
              type: 'MICRO_FRONTEND_SCROLL_TO_TOP',
              source: 'template',
              smooth,
            },
            '*'
          );
        } catch (error) {
          console.warn('无法向主应用发送滚动消息:', error);
        }
      }
    };

    if (delay > 0) {
      // 延迟滚动，等待页面内容加载完成
      const timer = setTimeout(scrollToTop, delay);
      return () => clearTimeout(timer);
    } else {
      // 立即滚动
      scrollToTop();
    }
  }, [location.pathname, smooth, delay, autoScroll]);

  // 这个组件不渲染任何内容
  return null;
};

/**
 * 手动滚动到顶部的工具函数（微前端版本）
 */
export const scrollToTop = (
  options: { smooth?: boolean; delay?: number } = {}
) => {
  const { smooth = true, delay = 0 } = options;

  const doScroll = () => {
    // 微前端环境下的滚动目标
    const targets = [
      document.querySelector('.ant-layout-content'),
      document.querySelector('[data-scroll-container]'),
      document.querySelector('main'),
      document.body,
      document.documentElement,
    ].filter(Boolean) as HTMLElement[];

    targets.forEach((target) => {
      if (target) {
        try {
          if (smooth && 'scrollTo' in target) {
            target.scrollTo({
              top: 0,
              left: 0,
              behavior: 'smooth',
            });
          } else {
            target.scrollTop = 0;
          }
        } catch {
          target.scrollTop = 0;
        }
      }
    });

    // 通知主应用
    if (window.parent !== window) {
      try {
        window.parent.postMessage(
          {
            type: 'MICRO_FRONTEND_SCROLL_TO_TOP',
            source: 'template',
            smooth,
          },
          '*'
        );
      } catch (error) {
        console.warn('无法向主应用发送滚动消息:', error);
      }
    }
  };

  if (delay > 0) {
    setTimeout(doScroll, delay);
  } else {
    doScroll();
  }
};

export default ScrollToTop;
