import axios, { type AxiosInstance, type AxiosResponse } from "axios";
import { useMemo } from "react";

interface ApiHook {
  get: <T>(endpoint: string) => Promise<T>;
  post: <T, U extends object>(endpoint: string, data: U) => Promise<T>;
  patch: <T, U extends object>(endpoint: string, data: U) => Promise<T>;
  del: <T>(endpoint: string) => Promise<T>;
}

export function useApi(): ApiHook {
  const api: AxiosInstance = useMemo(() => {
    return axios.create({
      baseURL: import.meta.env.VITE_API_URL,
      withCredentials: true,
      headers: { "Content-Type": "application/json" },
    });
  }, []);

  const get = async <T>(endpoint: string): Promise<T> => {
    const res: AxiosResponse<T> = await api.get(endpoint);
    return res.data;
  };

  const post = async <T, U>(endpoint: string, data: U): Promise<T> => {
    const res: AxiosResponse<T> = await api.post(endpoint, data);
    return res.data;
  };

  const patch = async <T, U>(endpoint: string, data: U): Promise<T> => {
    const res: AxiosResponse<T> = await api.patch(endpoint, data);
    return res.data;
  };

  const del = async <T>(endpoint: string): Promise<T> => {
    const res: AxiosResponse<T> = await api.delete(endpoint);
    return res.data;
  };

  return { get, post, patch, del };
}
