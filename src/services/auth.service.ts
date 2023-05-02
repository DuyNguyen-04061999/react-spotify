import { AUTH_API } from "@/config";
import { http } from "@/utils";

export const authService = {
  login: (form: any) => http.post(`${AUTH_API}/login`, form),

  loginByCode: (code: any) => http.post(`${AUTH_API}/login-by-code`, code),

  refreshToken: (data: any) => http.post(`${AUTH_API}/refresh-token`, data),
};
