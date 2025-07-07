import { HttpClient } from "../shared/utils/HttpClient";

export const login = async (payload: any): Promise<any> => {
  const response = await HttpClient.post(`/auth/login`, payload);

  return response;
};

export const getUserProfile = async (): Promise<any> => {
  const response = await HttpClient.get(`/users/profile`);

  return response;
};
