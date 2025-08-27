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
        // 检测是否在微前端环境中运行
        const isInMicroFrontend = (): boolean => {
          try {
            if (window !== window.parent) return true;
            if (window.location.pathname.includes('/template')) return true;
            if (window.location.port === '3000') return true;
            return false;
          } catch (error) {
            return false;
          }
        };

        // 首先尝试从 localStorage 读取保存的语言设置
        const getSavedLanguage = (): string | null => {
          try {
            const inMicroFrontend = isInMicroFrontend();

            if (inMicroFrontend) {
              // 微前端模式：优先从主应用的设置中读取
              const shellLanguage = localStorage.getItem('mf-shell-language');
              if (shellLanguage && supportedLanguages.some(lang => lang.code === shellLanguage)) {
                return shellLanguage;
              }
            }

            // 独立运行模式或微前端模式下主应用没有设置：读取自己的设置
            const templateLanguage = localStorage.getItem('mf-template-language');
            if (templateLanguage && supportedLanguages.some(lang => lang.code === templateLanguage)) {
              return templateLanguage;
            }
          } catch (error) {
            console.warn('Failed to read saved language from localStorage:', error);
          }
          return null;
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

          // 再等待一段时间后重新检查
          setTimeout(async () => {
            try {
              const updatedAppConfig = getStoreValue('app') || {};
              const updatedGlobalLanguage = updatedAppConfig.language;

              if (updatedGlobalLanguage && updatedGlobalLanguage !== i18n.language) {
                i18n.changeLanguage(updatedGlobalLanguage);
              }
            } catch (error) {
              // Ignore late sync errors
            }
          }, 500);
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
