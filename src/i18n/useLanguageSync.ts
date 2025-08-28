import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { supportedLanguages } from '.';

/**
 * 语言同步钩子
 * 在微前端环境中自动同步主应用的语言设置
 */
const useLanguageSync = () => {
  const { i18n } = useTranslation();

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    const initLanguageSync = async () => {
      try {
        // 简化的微前端环境检测
        const isInMicroFrontend = (): boolean => {
          return window !== window.parent ||
                 (window.location.port === '3000' && window.location.pathname.includes('/template'));
        };

        // 简化的语言获取逻辑
        const getSavedLanguage = (): string | null => {
          const inMicroFrontend = isInMicroFrontend();

          // 微前端模式：优先从主应用读取，否则从自己读取
          const storageKey = inMicroFrontend ? 'mf-shell-language' : 'mf-template-language';
          const savedLanguage = localStorage.getItem(storageKey);

          return savedLanguage && supportedLanguages.some(lang => lang.code === savedLanguage)
            ? savedLanguage
            : null;
        };

        // @ts-expect-error - Module Federation 动态导入
        const { getStoreValue, subscribeStore } = await import('mf-shared/store');

        // 等待一小段时间，确保主应用已经初始化了全局 store
        await new Promise(resolve => setTimeout(resolve, 100));

        // 获取当前全局语言设置
        const appConfig = getStoreValue('app') || {};
        const globalLanguage = appConfig.language;

        if (globalLanguage) {
          // 微前端模式：优先使用全局 store 的语言
          if (globalLanguage !== i18n.language) {
            i18n.changeLanguage(globalLanguage);
          }
        } else {
          // 全局 store 没有语言设置，等待主应用设置
          // 使用保存的语言设置作为临时方案
          const savedLanguage = getSavedLanguage();
          if (savedLanguage && savedLanguage !== i18n.language) {
            i18n.changeLanguage(savedLanguage);
          }

          // 简化：移除重复检查，依赖订阅机制
        }
        
        // 订阅语言变化
        unsubscribe = subscribeStore('app', (_key: string, newValue: any) => {
          if (newValue?.language && newValue.language !== i18n.language) {
            i18n.changeLanguage(newValue.language);
          }
        });
      } catch (error) {
        // No global store available, running standalone
      }
    };

    initLanguageSync();

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [i18n]);
};

export default useLanguageSync;
