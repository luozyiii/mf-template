import { currentConfig } from '../config/deployment';
import { getVal, setVal } from '../store/keys';
import { clearAppData } from 'mf-shared/store';

// 认证相关工具类
export class AuthUtils {
  /**
   * 获取token
   */
  static getToken(): string | null {
    try {
      // 优先从 globalStore 读取
      const token = getVal('token');
      if (token) {
        console.log('AuthUtils.getToken: Found token via getVal');
        return token;
      }

      // 如果没有找到，尝试从不同的存储位置读取
      // 检查 mf-shell-store（主应用存储）
      const shellStoreData = localStorage.getItem('mf-shell-store');
      if (shellStoreData) {
        try {
          const parsed = JSON.parse(shellStoreData);
          if (parsed.token) {
            console.log('AuthUtils.getToken: Found token in mf-shell-store');
            return parsed.token;
          }
        } catch {}
      }

      // 检查 mf-template-store（独立运行存储）
      const templateStoreData = localStorage.getItem('mf-template-store');
      if (templateStoreData) {
        try {
          const parsed = JSON.parse(templateStoreData);
          if (parsed.token) {
            console.log('AuthUtils.getToken: Found token in mf-template-store');
            return parsed.token;
          }
        } catch {}
      }

      console.log('AuthUtils.getToken: No token found in any storage');
      return null;
    } catch (error) {
      console.warn('Failed to get token:', error);
      return null;
    }
  }

  /**
   * 设置token
   */
  static setToken(token: string): void {
    try {
      setVal('token', token);
    } catch (error) {
      console.warn('Failed to set token:', error);
    }
  }

  /**
   * 移除token
   */
  static removeToken(): void {
    try {
      setVal('token', undefined);
    } catch (error) {
      console.warn('Failed to remove token:', error);
    }
  }

  /**
   * 检查是否已登录
   */
  static isAuthenticated(): boolean {
    const token = AuthUtils.getToken();
    return !!token;
  }

  /**
   * 获取用户数据
   */
  static getUserData(): any {
    try {
      return getVal('user');
    } catch (error) {
      console.warn('Failed to get user data:', error);
      return null;
    }
  }

  /**
   * 设置用户数据
   */
  static setUserData(userData: any): void {
    try {
      setVal('user', userData);
    } catch (error) {
      console.warn('Failed to set user data:', error);
    }
  }

  /**
   * 获取权限数据
   */
  static getPermissions(): any {
    try {
      return getVal('permissions');
    } catch (error) {
      console.warn('Failed to get permissions:', error);
      return null;
    }
  }

  /**
   * 设置权限数据
   */
  static setPermissions(permissions: any): void {
    try {
      setVal('permissions', permissions);
    } catch (error) {
      console.warn('Failed to set permissions:', error);
    }
  }

  /**
   * 跳转到登录页面
   * @param returnUrl 登录成功后的回调地址
   */
  static redirectToLogin(returnUrl?: string): void {
    const currentUrl = returnUrl || window.location.href;
    // 跳转到主应用登录页面
    const shellUrl = currentConfig.shellUrl;
    // 确保 shellUrl 以 / 结尾，避免重复的 /
    const baseUrl = shellUrl.endsWith('/') ? shellUrl.slice(0, -1) : shellUrl;
    window.location.href = `${baseUrl}/login?returnUrl=${encodeURIComponent(currentUrl)}`;
  }

  /**
   * 退出登录
   */
  static logout(): void {
    try {
      // 获取当前应用的存储键名
      const storageKey = (window as any)?.globalStore?.options?.storageKey || 'mf-template-store';

      // 使用新的 clearAppData 方法清理所有应用数据
      clearAppData(storageKey);

      // 清理 session 数据
      AuthUtils.removeToken();
    } catch (error) {
      console.warn('Failed to logout:', error);
    }

    // 跳转到主应用登录页面，携带当前页面作为回调地址
    const currentUrl = window.location.href;
    const shellUrl = currentConfig.shellUrl;
    // 确保 shellUrl 以 / 结尾，避免重复的 /
    const baseUrl = shellUrl.endsWith('/') ? shellUrl.slice(0, -1) : shellUrl;
    window.location.href = `${baseUrl}/login?returnUrl=${encodeURIComponent(currentUrl)}`;
  }

  /**
   * 检查token是否过期（简单实现）
   */
  static isTokenExpired(): boolean {
    const token = AuthUtils.getToken();
    return !token;
  }
}
