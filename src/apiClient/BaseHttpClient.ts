import axios, {
    AxiosError,
    AxiosInstance,
    AxiosRequestConfig,
    AxiosResponse,
    InternalAxiosRequestConfig,
    Method,
} from 'axios';

declare module 'axios' {
  interface AxiosRequestConfig {
    retry?: boolean;
    maxRetries?: number;
    retryDelay?: number;
    skipAuthRefresh?: boolean;
  }
}

export type ApiResponse<T = any> = {
  success: boolean;
  status?: number;
  message: string;
  data?: T;
};

type RefreshTokenConfig = {
  enableTokenRefresh?: boolean;
  refreshTokenUrl?: string;
  onRefreshTokenFailure?: () => Promise<void>;
  getRefreshToken?: () => Promise<string | null>;
  onTokenRefreshed?: (token: string) => Promise<void>;
};

export type BaseApiConfig = AxiosRequestConfig & {
  retry?: boolean;
  maxRetries?: number;
  retryDelay?: number;
  skipAuthRefresh?: boolean;
  serviceBaseUrl?: string; // Added to support dynamic service base URL override
};

export abstract class BaseHttpClient {
  protected instance: AxiosInstance;
  private retryCounts: Map<string, number> = new Map();
  private isRefreshing = false;
  private refreshSubscribers: ((token: string) => void)[] = [];
  private refreshTokenConfig: Required<RefreshTokenConfig>;

  constructor(baseURL: string, refreshConfig?: RefreshTokenConfig) {
    this.instance = axios.create({
      baseURL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.refreshTokenConfig = {
      enableTokenRefresh: true,
      refreshTokenUrl: '/auth/refresh',
      onRefreshTokenFailure: async () => {
        console.log('Refresh token failed - please login again');
      },
      getRefreshToken: async () => null,
      onTokenRefreshed: async () => {},
      ...refreshConfig,
    };

    this.setupInterceptors();
  }

  protected setupInterceptors(): void {
    this.instance.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => this.handleRequest(config),
      (error: AxiosError) => this.handleRequestError(error)
    );

    this.instance.interceptors.response.use(
      (response: AxiosResponse) => this.handleResponse(response),
      async (error: AxiosError) => this.handleResponseError(error)
    );
  }

  protected handleRequest(config: InternalAxiosRequestConfig): InternalAxiosRequestConfig {
    const requestKey = this.getRequestKey(config);
    this.retryCounts.set(requestKey, 0);
    return config;
  }

  protected handleRequestError(error: AxiosError): Promise<AxiosError> {
    return Promise.reject(error);
  }

  protected handleResponse(response: AxiosResponse): AxiosResponse {
    const requestKey = this.getRequestKey(response.config);
    this.retryCounts.delete(requestKey);
    return response;
  }

  protected async handleResponseError(error: AxiosError): Promise<any> {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      retry?: boolean;
      maxRetries?: number;
      retryDelay?: number;
      skipAuthRefresh?: boolean;
      _retry?: boolean;
    };

    // Handle token refresh for 401 errors
    if (error.response?.status === 401 && 
        this.refreshTokenConfig.enableTokenRefresh && 
        !originalRequest.skipAuthRefresh &&
        !originalRequest._retry) {
      
      if (this.isRefreshing) {
        return new Promise((resolve, reject) => {
          this.refreshSubscribers.push((token: string) => {
            try {
              originalRequest.headers = originalRequest.headers || {};
              originalRequest.headers.Authorization = `Bearer ${token}`;
              resolve(this.instance(originalRequest));
            } catch (err) {
              reject(err);
            }
          });
        });
      }

      originalRequest._retry = true;
      this.isRefreshing = true;

      try {
        const refreshToken = await this.refreshTokenConfig.getRefreshToken();
        if (!refreshToken) {
          throw new Error('No refresh token available');
        }

        const refreshResponse = await axios.post(
          `${this.instance.defaults.baseURL}${this.refreshTokenConfig.refreshTokenUrl}`,
          { refreshToken },
          { skipAuthRefresh: true }
        );

        const refreshedAuthData = refreshResponse.data;
        const newToken = refreshedAuthData.token;
        await this.refreshTokenConfig.onTokenRefreshed(refreshedAuthData);

        this.instance.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
        originalRequest.headers = originalRequest.headers || {};
        originalRequest.headers.Authorization = `Bearer ${newToken}`;

        this.processSubscribers(newToken);
        return this.instance(originalRequest);
      } catch (refreshError) {
        this.refreshSubscribers = [];
        await this.refreshTokenConfig.onRefreshTokenFailure();
        return Promise.reject(this.transformError(error));
      } finally {
        this.isRefreshing = false;
      }
    }

    // Original retry logic
    if (!originalRequest?.retry) {
      return Promise.reject(this.transformError(error));
    }

    const requestKey = this.getRequestKey(originalRequest);
    const retryCount = this.retryCounts.get(requestKey) || 0;
    const maxRetries = originalRequest.maxRetries ?? 3;
    const retryDelay = originalRequest.retryDelay ?? 1000;

    if (retryCount >= maxRetries) {
      this.retryCounts.delete(requestKey);
      return Promise.reject(this.transformError(error));
    }

    this.retryCounts.set(requestKey, retryCount + 1);
    await new Promise(resolve => setTimeout(resolve, retryDelay));
    return this.instance(originalRequest);
  }

  private processSubscribers(token: string) {
    this.refreshSubscribers.forEach(callback => callback(token));
    this.refreshSubscribers = [];
  }

  protected transformError(error: AxiosError): ApiResponse {
    if (error.response) {
      const status = error.response.status;
      let message = 'Request failed';

      switch (status) {
        case 400: message = 'Bad Request'; break;
        case 401: message = 'Unauthorized'; break;
        case 403: message = 'Forbidden'; break;
        case 404: message = 'Not Found'; break;
        case 500: message = 'Internal Server Error'; break;
        default: message = `Error: ${status}`;
      }

      return {
        success: false,
        status,
        message,
        data: error.response.data,
      };
    } else if (error.request) {
      return {
        success: false,
        status: undefined,
        message: 'Network Error - No response received',
        data: null,
      };
    } else {
      return {
        success: false,
        status: undefined,
        message: error.message,
        data: null,
      };
    }
  }

  protected transformResponse<T>(response: AxiosResponse<T>): ApiResponse<T> {
    return {
      success: true,
      status: response.status,
      message: 'Request successful',
      data: response.data,
    };
  }

  private getRequestKey(config: InternalAxiosRequestConfig): string {
    return `${config.method}-${config.url}`;
  }

  protected async request<T>(
    method: Method,
    url: string,
    data?: any,
    config?: BaseApiConfig
  ): Promise<ApiResponse<T>> {
    if (config?.serviceBaseUrl) {
      config.baseURL = config.serviceBaseUrl;
      delete config.serviceBaseUrl;
    }
    try {
      const response = await this.instance.request<T>({
        method,
        url,
        data,
        ...config,
      });
      console.log(`Request to ${url} successful`, this.instance.defaults.baseURL);
      return this.transformResponse<T>(response);
    } catch (error) {
      return Promise.reject(this.transformError(error as AxiosError));
    }
  }
}