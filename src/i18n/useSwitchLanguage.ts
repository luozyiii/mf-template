import { useCallback } from 'react';
import templateI18nInstance, { addLanguageResource, saveLanguage } from '.';

/**
 * mf-template 应用的语言切换钩子
 * 提供切换当前应用语言的功能，支持动态加载翻译资源
 */
const useSwitchLanguage = () => {
  const switchLanguage = useCallback(async (languageCode: string) => {
    // 动态加载翻译资源（如果尚未加载）
    await addLanguageResource(languageCode);

    // 切换语言
    templateI18nInstance.changeLanguage(languageCode);

    // 保存语言设置到 localStorage
    saveLanguage(languageCode);
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

  // 保存语言设置到 localStorage
  saveLanguage(languageCode);
};

export default useSwitchLanguage;
