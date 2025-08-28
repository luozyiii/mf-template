import { currentConfig } from '../config/deployment';
import { getVal, setVal } from '../store/keys';
import { clearAppData } from 'mf-shared/store';

// 认证相关工具类
export class AuthUtils {
  /**
   * 获取token - 简化版本，专注于独立运行
   */
  static getToken(): string | null {
    try {
      // 从统一的存储系统获取token
      const token = getVal('token');
      if (token) {
        console.log('AuthUtils.getToken: Found token');
        return token;
      }

      console.log('AuthUtils.getToken: No token found');
      return null;
    } catch (error) {
      console.warn('AuthUtils.getToken: Failed to get token:', error);
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
    // 清理URL，移除可能存在的token参数，避免URL污染
    let currentUrl = returnUrl || (window.location.origin + window.location.pathname);

    // 如果没有提供returnUrl，检查当前URL是否有有效的查询参数需要保留
    if (!returnUrl) {
      const urlParams = new URLSearchParams(window.location.search);
      // 移除token相关参数
      urlParams.delete('token');

      // 如果还有其他有效参数，保留它们
      const cleanParams = urlParams.toString();
      if (cleanParams) {
        currentUrl += '?' + cleanParams;
      }
    }

    console.log('AuthUtils.redirectToLogin: Redirecting with URL:', currentUrl);

    // 跳转到主应用登录页面
    const shellUrl = currentConfig.shellUrl;
    // 确保 shellUrl 以 / 结尾，避免重复的 /
    const baseUrl = shellUrl.endsWith('/') ? shellUrl.slice(0, -1) : shellUrl;
    window.location.href = `${baseUrl}/login?returnUrl=${encodeURIComponent(currentUrl)}`;
  }

  /**
   * 退出登录 - 简化版本
   */
  static logout(): void {
    try {
      // 清理应用数据 - 使用固定的存储键名
      clearAppData('mf-template-store');

      // 清理 token
      AuthUtils.removeToken();

      console.log('AuthUtils.logout: User data cleared successfully');
    } catch (error) {
      console.warn('AuthUtils.logout: Failed to clear user data:', error);
    }

    // 跳转到登录页面
    AuthUtils.redirectToLogin();
  }

  /**
   * 检查token是否过期（简单实现）
   */
  static isTokenExpired(): boolean {
    const token = AuthUtils.getToken();
    return !token;
  }
}
