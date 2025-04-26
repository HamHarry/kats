import axios from "axios";
import { FinanceData } from "../model/finance.type";

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

export const getExpenseById = async (expenseId: string): Promise<any> => {
  const response = await axios.get(
    `${import.meta.env.VITE_BASE_SERVER_URL}/expenses/${expenseId}`
  );

  return response;
};

export const updateExpenseById = async (body: any): Promise<any> => {
  const response = await axios.put(
    `${import.meta.env.VITE_BASE_SERVER_URL}/expenses/${body.expenseId}`,
    body.data
  );

  return response;
};

export const approveExpenseById = async (body: FinanceData): Promise<any> => {
  const response = await axios.post(
    `${import.meta.env.VITE_BASE_SERVER_URL}/expenses/approve/${body._id}`,
    body
  );

  return response;
};

export const cencelExpenseById = async (body: FinanceData): Promise<any> => {
  const response = await axios.post(
    `${import.meta.env.VITE_BASE_SERVER_URL}/expenses/cencel/${body._id}`,
    body
  );

  return response;
};

export const isDeleteExpenseById = async (body: FinanceData): Promise<any> => {
  const response = await axios.post(
    `${import.meta.env.VITE_BASE_SERVER_URL}/expenses/selectDelete/${body._id}`,
    body
  );

  return response;
};
