import axios from "axios";

export const login = async (payload: any): Promise<any> => {
  const response = await axios.post(
    `${import.meta.env.VITE_BASE_SERVER_URL}/auth/login`,
    payload
  );

  return response;
};
