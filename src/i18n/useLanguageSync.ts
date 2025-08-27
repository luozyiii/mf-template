import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

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
        // @ts-expect-error - Module Federation 动态导入
        const { getStoreValue, subscribeStore } = await import('mf-shared/store');
        
        // 获取当前全局语言设置
        const appConfig = getStoreValue('app') || {};
        if (appConfig.language && appConfig.language !== i18n.language) {
          console.log(`🌐 Template Hook: Syncing to ${appConfig.language}`);
          i18n.changeLanguage(appConfig.language);
        }
        
        // 订阅语言变化
        unsubscribe = subscribeStore('app', (_key: string, newValue: any) => {
          if (newValue?.language && newValue.language !== i18n.language) {
            console.log(`🌐 Template Hook: Language changed to ${newValue.language}`);
            i18n.changeLanguage(newValue.language);
          }
        });
        
        console.log('🌐 Template Hook: Language sync initialized');
      } catch (error) {
        console.log('🌐 Template Hook: No global store available, running standalone');
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
