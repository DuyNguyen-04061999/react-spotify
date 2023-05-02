import { AxiosInstance } from "axios";
import { authService } from "@/services/auth.service";
import { storeToken } from "./storage";

let refreshTokenPromise: null | Promise<any> = null;

export function interceptorsResponse(api: AxiosInstance) {
  api.interceptors.response.use(
    (res) => res?.data || res,
    async (error) => {
      try {
        if (
          error?.response?.status === 403 &&
          error?.response?.data?.error_code === "TOKEN_EXPIRED"
        ) {
          if (refreshTokenPromise) {
            await refreshTokenPromise;
          } else {
            const token = storeToken.get();
            refreshTokenPromise = authService.refreshToken({
              refreshToken: token?.refreshToken,
            });
            const res = await refreshTokenPromise;
            storeToken.set(res?.data);
            refreshTokenPromise = null;
          }
          return api(error?.config);
        }
      } catch (err) {
        console.log("err :>> ", err);
      }

      throw error;
    }
  );
}
