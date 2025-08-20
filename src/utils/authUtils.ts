import { currentConfig } from '../config/deployment';
import { clearByShortPrefix } from '../store/keys';
// @ts-ignore - MF runtime
import { getStoreValue, clearStoreByPrefix } from 'mf-shared/store';

// 认证相关工具类
export class AuthUtils {
  // 存储键名
  private static readonly TOKEN_KEY = 'auth_token';
  private static readonly USER_KEY = 'user_data';
  private static readonly PERMISSIONS_KEY = 'permissions_data';
  private static readonly PREFIX = 'mf-template-';

  /**
   * 获取token
   */
  static getToken(): string | null {
    try {
      // 优先从 globalStore（模板前缀）读取
      const v = getStoreValue<string>(`${AuthUtils.PREFIX}token`);
      if (v) return v;
      return sessionStorage.getItem(AuthUtils.TOKEN_KEY);
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
      sessionStorage.setItem(AuthUtils.TOKEN_KEY, token);
    } catch (error) {
      console.warn('Failed to set token:', error);
    }
  }

  /**
   * 移除token
   */
  static removeToken(): void {
    try {
      sessionStorage.removeItem(AuthUtils.TOKEN_KEY);
      sessionStorage.removeItem(AuthUtils.USER_KEY);
      sessionStorage.removeItem(AuthUtils.PERMISSIONS_KEY);
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
      const userData = sessionStorage.getItem(AuthUtils.USER_KEY);
      return userData ? JSON.parse(userData) : null;
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
      sessionStorage.setItem(AuthUtils.USER_KEY, JSON.stringify(userData));
    } catch (error) {
      console.warn('Failed to set user data:', error);
    }
  }

  /**
   * 获取权限数据
   */
  static getPermissions(): any {
    try {
      const permissions = sessionStorage.getItem(AuthUtils.PERMISSIONS_KEY);
      return permissions ? JSON.parse(permissions) : null;
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
      sessionStorage.setItem(
        AuthUtils.PERMISSIONS_KEY,
        JSON.stringify(permissions)
      );
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
    window.location.href = `${shellUrl}/login?returnUrl=${encodeURIComponent(currentUrl)}`;
  }

  /**
   * 退出登录
   */
  static logout(): void {
    try {
      // 清理模板前缀的 globalStore 数据（旧命名空间）
      clearStoreByPrefix(AuthUtils.PREFIX);
      // 清理短键命名空间（独立：user/app/permissions/token；集成：g:sh:*）
      clearByShortPrefix();
    } catch {}
    AuthUtils.removeToken();
    // 跳转到主应用登录页面，携带当前页面作为回调地址
    const currentUrl = window.location.href;
    const shellUrl = currentConfig.shellUrl;
    window.location.href = `${shellUrl}/login?returnUrl=${encodeURIComponent(currentUrl)}`;
  }

  /**
   * 检查token是否过期（简单实现）
   */
  static isTokenExpired(): boolean {
    const token = AuthUtils.getToken();
    return !token;
  }
}
