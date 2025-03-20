import axios from "axios";

export const createEmployee = async (payload: any): Promise<any> => {
  const response = await axios.post(
    `${import.meta.env.VITE_BASE_SERVER_URL}/employees`,
    payload
  );

  return response;
};

export const getAllEmployees = async (): Promise<any> => {
  const response = await axios.get(
    `${import.meta.env.VITE_BASE_SERVER_URL}/employees`
  );

  return response;
};
