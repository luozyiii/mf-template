import { useCallback } from 'react';
import templateI18nInstance, { addLanguageResource, saveLanguage } from '.';

/**
 * 尝试同步语言到全局store
 */
const syncLanguageToGlobalStore = async (languageCode: string) => {
  try {
    const { getStoreValue, setStoreValue } = await import('mf-shared/store');

    // 获取现有的应用配置，保持其他设置不变
    const currentAppConfig = getStoreValue('app') || {};
    const updatedConfig = {
      ...currentAppConfig,
      language: languageCode,
    };

    setStoreValue('app', updatedConfig);
    console.log(`🌐 Template: Synced language ${languageCode} to global store`);
  } catch (_error) {
    console.log('🌐 Template: Global store not available, language saved locally only');
  }
};

/**
 * mf-template 应用的语言切换钩子
 * 提供切换当前应用语言的功能，支持动态加载翻译资源
 * 无论在独立运行还是微前端模式下，都会尝试同步到全局store
 */
const useSwitchLanguage = () => {
  const switchLanguage = useCallback(async (languageCode: string) => {
    // 动态加载翻译资源（如果尚未加载）
    await addLanguageResource(languageCode);

    // 切换语言
    templateI18nInstance.changeLanguage(languageCode);

    // 保存语言设置到 localStorage（现在也会同步到全局store）
    await saveLanguage(languageCode);

    // 尝试同步到全局store（无论是否在微前端环境中）
    await syncLanguageToGlobalStore(languageCode);
  }, []);

  const getCurrentLanguage = useCallback(() => {
    return templateI18nInstance.language;
  }, []);

  return {
    switchLanguage,
    getCurrentLanguage,
  };
};

// 导出可以直接调用的语言切换函数（非 Hook）
export const switchLanguage = async (languageCode: string) => {
  // 动态加载翻译资源（如果尚未加载）
  await addLanguageResource(languageCode);

  // 切换语言
  templateI18nInstance.changeLanguage(languageCode);

  // 保存语言设置到 localStorage（现在也会同步到全局store）
  await saveLanguage(languageCode);

  // 尝试同步到全局store（无论是否在微前端环境中）
  await syncLanguageToGlobalStore(languageCode);
};

export default useSwitchLanguage;
