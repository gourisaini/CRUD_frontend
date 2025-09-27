import axios, { AxiosError } from 'axios';

const instance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_KEY,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

instance.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      console.warn('⚠ Unauthorized! Redirecting to login...');
    }
    return Promise.reject(error);
  }
);

export default instance;
