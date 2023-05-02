import { AxiosInstance } from "axios";
import { storeToken } from "./storage";

//======= trc khi gui api ========
export function interceptorsRequest(api: AxiosInstance) {
  api.interceptors.request.use(
    (config) => {
      const token = storeToken.get();
      if (token) {
        config.headers.Authorization = `Bearer ${token.accessToken}`;
      }
      return config;
    },
    (error: any) => {
      if (error instanceof Error) {
        throw error;
      }
    }
  );
}
