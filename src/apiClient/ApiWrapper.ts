import { getTokens, saveTokens } from '../services/token.service';
import { getDeviceId } from '../utils/deviceUtils';
import { ApiResponse, BaseApiConfig, BaseHttpClient } from './BaseHttpClient';

export type ApiConfig = BaseApiConfig;

class ApiWrapper extends BaseHttpClient {
  private logoutHandler?: () => void;
  constructor(baseURL: string) {
    super(baseURL, {
      getRefreshToken: async () => {
        const { refreshToken } = await getTokens()
        return refreshToken || null;
      },
      onTokenRefreshed: async (authData: string) => {
        await saveTokens(authData);
      },
      onRefreshTokenFailure: async () => {
        await this.handleLogout();
      }
    });
    this.setAuthHeaders();
  }

  public setLogoutHandler(handler: () => void) {
    this.logoutHandler = handler;
  }

  private async handleLogout() {
      if (this.logoutHandler) {
        this.logoutHandler();
      } else {
        console.warn('Logout handler not set');
      }
  }

  private async setAuthHeaders() {
    this.instance.interceptors.request.use(async (config) => {
      const deviceId = await getDeviceId()
      if (deviceId) {
        config.headers = config.headers || {};
        config.headers['Device-ID'] = deviceId;
      }

      if (config.skipAuthRefresh) {
        return config;
      }

      const token = (await getTokens())?.accessToken
      if (token) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });
  }

  public async get<T>(url: string, config?: ApiConfig): Promise<ApiResponse<T>> {
    return super.request<T>('GET', url, undefined, config);
  }

  public async post<T>(url: string, data?: any, config?: ApiConfig): Promise<ApiResponse<T>> {
    return super.request<T>('POST', url, data, config);
  }

  public async put<T>(url: string, data?: any, config?: ApiConfig): Promise<ApiResponse<T>> {
    return super.request<T>('PUT', url, data, config);
  }

  public async patch<T>(url: string, data?: any, config?: ApiConfig): Promise<ApiResponse<T>> {
    return super.request<T>('PATCH', url, data, config);
  }

  public async delete<T>(url: string, data?: any, config?: ApiConfig): Promise<ApiResponse<T>> {
    return super.request<T>('DELETE', url, data, config);
  }

  public async uploadFile<T>(
    url: string,
    file: any,
    config?: Omit<ApiConfig, 'headers'> & { headers?: Record<string, string> }
  ): Promise<ApiResponse<T>> {
    const formData = new FormData();
    formData.append('file', file);

    return super.request<T>('POST', url, formData, {
      ...config,
      headers: {
        ...config?.headers,
        'Content-Type': 'multipart/form-data',
      },
    });
  }
}

const BASE_URL = "https://warden.alpha.haanaa.org/";
export const ApiClient = new ApiWrapper(BASE_URL);

// 'https://pop.alpha.haanaa.org/api/v1/cms/cats?screen_type=home'