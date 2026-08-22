import { ApiResponse } from "../model/api.type";
import {
  LoginRequestData,
  LoginResponseData,
  UserProfileData,
} from "../model/userInfo.type";
import { HttpClient } from "../shared/utils/HttpClient";

export const login = async (payload: LoginRequestData): ApiResponse<LoginResponseData> => {
  const response = await HttpClient.post<LoginResponseData>(`/auth/login`, payload);

  return response;
};

export const getUserProfile = async (): ApiResponse<UserProfileData> => {
  const response = await HttpClient.get<UserProfileData>(`/users/profile`);

  return response;
};
