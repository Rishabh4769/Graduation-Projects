import axios from 'axios';
import { getStoredToken, hasValidToken, logoutAndRedirect } from './auth';

let interceptorsConfigured = false;

export function configureApiClient() {
  if (interceptorsConfigured) {
    return;
  }

  axios.defaults.baseURL = '/api';

  axios.interceptors.request.use((config) => {
    const nextConfig = { ...config };
    const headers = { ...(nextConfig.headers || {}) };

    if (hasValidToken()) {
      headers.Authorization = `Bearer ${getStoredToken()}`;
    }

    nextConfig.headers = headers;
    return nextConfig;
  });

  axios.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        logoutAndRedirect();
      }

      return Promise.reject(error);
    }
  );

  interceptorsConfigured = true;
}
