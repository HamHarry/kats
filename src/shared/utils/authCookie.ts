import Cookies from "js-cookie";
import { cookieConstants } from "../../constants";

export interface AuthTokens {
  accessToken: string;
  expiresIn: number | string;
  refreshToken: string;
  refreshExpiresIn: number | string;
}

/**
 * secure ตั้งได้เฉพาะตอนรันบน https ไม่งั้น browser จะไม่ยอมเซ็ต cookie เลยตอน dev
 */
const getCookieOptions = (): Cookies.CookieAttributes => ({
  secure: window.location.protocol === "https:",
  sameSite: "strict",
});

/**
 * จุดเดียวที่เขียน token ลง cookie — แก้ที่นี่ที่เดียวไม่ต้องไล่แก้หลายที่
 */
export const setAuthCookies = (tokens: Partial<AuthTokens>) => {
  const { accessToken, expiresIn, refreshToken, refreshExpiresIn } = tokens;
  if (!accessToken) return;

  const options = getCookieOptions();

  Cookies.set(cookieConstants.TOKEN_KEY, accessToken, options);
  Cookies.set(cookieConstants.TOKEN_EXPIRES_IN, String(expiresIn ?? ""), options);

  if (refreshToken) {
    Cookies.set(cookieConstants.REFRESH_TOKEN_KEY, refreshToken, options);
    Cookies.set(
      cookieConstants.REFRESH_TOKEN_EXPIRES_IN,
      String(refreshExpiresIn ?? ""),
      options,
    );
  }
};

export const clearAuthCookies = () => {
  Cookies.remove(cookieConstants.TOKEN_KEY);
  Cookies.remove(cookieConstants.TOKEN_EXPIRES_IN);
  Cookies.remove(cookieConstants.REFRESH_TOKEN_KEY);
  Cookies.remove(cookieConstants.REFRESH_TOKEN_EXPIRES_IN);
};
