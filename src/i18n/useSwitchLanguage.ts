import { useCallback } from 'react';
import templateI18nInstance, { addLanguageResource } from '.';

/**
 * mf-template 应用的语言切换钩子
 * 提供切换当前应用语言的功能，支持动态加载翻译资源
 */
const useSwitchLanguage = () => {
  const switchLanguage = useCallback(async (languageCode: string) => {
    console.log(`🌐 Template app: Switching language to ${languageCode}`);

    // 动态加载翻译资源（如果尚未加载）
    await addLanguageResource(languageCode);

    // 切换语言
    templateI18nInstance.changeLanguage(languageCode);
  }, []);

  const getCurrentLanguage = useCallback(() => {
    return templateI18nInstance.language;
  }, []);

  return {
    switchLanguage,
    getCurrentLanguage,
  };
};

export default useSwitchLanguage;
