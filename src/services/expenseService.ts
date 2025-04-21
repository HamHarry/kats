import axios from "axios";

export const createExpense = async (payload: any): Promise<any> => {
  const response = await axios.post(
    `${import.meta.env.VITE_BASE_SERVER_URL}/expenses`,
    payload
  );

  return response;
};

export const getAllExpenses = async (): Promise<any> => {
  const response = await axios.get(
    `${import.meta.env.VITE_BASE_SERVER_URL}/expenses`
  );

  return response;
};
