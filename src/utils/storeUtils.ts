import { configureStoreStrategy, setStoreValue } from 'mf-shared/store';
import { keyOf } from '../store/keys';
import { AuthUtils } from './authUtils';
import users from '../mock/userinfo.json';

/**
 * 存储初始化工具类
 * 统一处理独立运行时的存储配置
 */
export class StoreUtils {
  /**
   * 初始化独立运行时的全局存储
   */
  static async initStandaloneStore(): Promise<void> {
    // 检查是否已经有globalStore（来自主应用）
    if (typeof window !== 'undefined' && (window as any).globalStore) {
      console.log('🗄️ Template app: Using existing GlobalStore from main app');
      return;
    }

    // 如果没有全局存储，说明是独立运行，需要初始化
    if (typeof window !== 'undefined' && !(window as any).globalStore) {
      try {
        // 动态导入存储模块并初始化
        const { initGlobalStore, setStoreValue } = await import('mf-shared/store');

        console.log('🗄️ Template app: Initializing GlobalStore for standalone mode');
        initGlobalStore({
          enablePersistence: true,
          enableEncryption: true,
          storageKey: 'mf-template-store',
        });

        // 设置一些默认数据
        setStoreValue('userinfo', {
          name: '独立用户',
          age: 25,
          role: 'user',
        });

        setStoreValue('appConfig', {
          theme: 'light',
          language: 'zh-CN',
          version: '1.0.0-standalone',
        });

        console.log('🗄️ Template app: Global Store initialized for standalone mode');
      } catch (error) {
        console.warn('Template app: Failed to initialize store for standalone mode:', error);
      }
    } else {
      console.log('🗄️ Template app: Using existing global store from shell');
    }
  }

  /**
   * 处理 URL 中的 token 参数并配置存储
   */
  static async processTokenFromUrl(): Promise<void> {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');

    if (!token) {
      console.log('StoreUtils: No token found in URL');
      return;
    }

    console.log('StoreUtils: Processing token from URL:', token);

    try {
      // 首先使用AuthUtils设置token，确保一致性
      console.log('StoreUtils: Setting token via AuthUtils:', token);
      AuthUtils.setToken(token);

      // 将 token/user/app/permissions 写入短键（根据模式自动选择 g:sh: 或 t:tp:）
      configureStoreStrategy(keyOf('token'), {
        medium: 'local',
        encrypted: false,
      });
      
      // 确保与AuthUtils使用相同的token值
      console.log('StoreUtils: Setting token via setStoreValue:', token);
      setStoreValue(keyOf('token'), token);

      // 根据 token 在本地 mock 中匹配用户（简单规则：按 id=token 后缀）
      const matched = (users as any[]).find((u) => token.includes(`_${u.id}_`));
      
      if (matched) {
        configureStoreStrategy(keyOf('user'), {
          medium: 'local',
          encrypted: true,
        });
        configureStoreStrategy(keyOf('app'), {
          medium: 'local',
          encrypted: false,
        });
        configureStoreStrategy(keyOf('permissions'), {
          medium: 'local',
          encrypted: false,
        });
        
        setStoreValue(keyOf('user'), {
          id: matched.id,
          username: matched.username,
          name: matched.name,
          role: matched.role,
          permissions: matched.permissions,
        });
        
        setStoreValue(keyOf('app'), matched.appConfig);
        
        try {
          const permMap = Object.fromEntries(
            (matched.permissions || []).map((p: string) => [p, true])
          );
          setStoreValue(keyOf('permissions'), permMap);
        } catch {}
      }

      // 等待一小段时间确保存储操作完成
      await new Promise(resolve => setTimeout(resolve, 100));

      // 验证token是否成功存储
      const storedToken = AuthUtils.getToken();
      if (storedToken === token) {
        console.log('StoreUtils: Token successfully stored and verified');
      } else {
        console.warn('StoreUtils: Token storage verification failed');
      }

      // 清除URL中的所有token参数，避免token暴露在URL中
      const newUrl = new URL(window.location.href);
      // 删除所有token参数（可能有多个）
      while (newUrl.searchParams.has('token')) {
        newUrl.searchParams.delete('token');
      }
      window.history.replaceState({}, '', newUrl.toString());

      console.log('StoreUtils: Token processing completed');
    } catch (error) {
      console.warn('StoreUtils: Failed to configure store strategy for token:', error);
    }
  }
}
