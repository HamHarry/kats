import axios from "axios";
import dayjs from "dayjs";
import Cookies from "js-cookie";
import join from "url-join";
import { cookieConstants } from "../../constants";
import { AuthTokens, setAuthCookies } from "./authCookie";

const isAbsoluteURLRegex = /^(?:\w+:)\/\//;
const axiosApiInstance = axios.create();
const axiosRefreshInstance = axios.create();
const TIME_MINUTE_EXPIRED = 30;

axiosApiInstance.interceptors.request.use(async (config) => {
  if (!isAbsoluteURLRegex.test(config.url!)) {
    config.url = join(`${import.meta.env.VITE_BASE_SERVER_URL}`, config.url!);
    const token = Cookies.get(cookieConstants.TOKEN_KEY);

    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
  }
  
  const pattern = new RegExp("/auth/*");
  const isAuthModule = pattern.test(config.url!);
  
  if (!isAuthModule) {
    const expiresIn = Cookies.get(cookieConstants.TOKEN_EXPIRES_IN);
    const expiredDate = dayjs(Number(expiresIn) * 1000).toDate();
    const currentDate = new Date();
    
    if (expiresIn) {
      const isExpired = dayjs(expiredDate).diff(currentDate, "minute") < TIME_MINUTE_EXPIRED;
      
      if (isExpired) {
        try {
          const refreshTokenCookie = Cookies.get(cookieConstants.REFRESH_TOKEN_KEY);
          if (!refreshTokenCookie) throw new Error("ไม่พบ refresh token");

          const refreshUrl = `${import.meta.env.VITE_BASE_SERVER_URL}/auth/refresh-token`;
          // server คืน token ชุดใหม่มาตรง ๆ ไม่ได้ห่อใน { data }
          const { data: tokens } = await axiosRefreshInstance.post<AuthTokens>(refreshUrl, {
            refreshToken: refreshTokenCookie,
          });

          if (tokens?.accessToken) {
            config.headers['Authorization'] = `Bearer ${tokens.accessToken}`;
            setAuthCookies(tokens);
          }
        } catch (error) {
          return Promise.reject(error);
        }
      }
    }
  }
  
  config.timeout = 30000;
  return config;
});

axiosApiInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (axios.isCancel(error)) {
      return Promise.resolve();
    } else if (error.code && error.code === 'ECONNABORTED') {
      return Promise.reject({
        response: {
          status: 408,
          data: {
            code: 'NOT_CONNECT_NETWORK',
            message: 'Network request timed out. Please try again later.'
          }
        }
      });
    } else if (!error.response) {
      return Promise.reject({
        response: {
          status: 500,
          data: {
            code: 'NOT_CONNECT_NETWORK',
            message: 'Network request failed. Please check your internet connection.'
          }
        }
      });
    }
    return Promise.reject(error);
  }
);

export const HttpClient = axiosApiInstance;