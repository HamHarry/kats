import { ApiResponse } from "../model/api.type";
import { DeleteStatus } from "../model/delete.type";
import { FinanceData } from "../model/finance.type";
import { HttpClient } from "../shared/utils/HttpClient";

export interface ExpenseUpdateBody {
  expenseId: string;
  data: FinanceData;
}

export const createExpense = async (payload: FinanceData): ApiResponse<FinanceData> => {
  const response = await HttpClient.post(`/expenses`, payload);

  return response;
};

export const getAllExpenses = async (delet = DeleteStatus.ISNOTDELETE): ApiResponse<FinanceData[]> => {
  const response = await HttpClient.get(`/expenses?delete=${delet}`);

  return response;
};

export const getExpenseById = async (expenseId: string): ApiResponse<FinanceData> => {
  const response = await HttpClient.get(`/expenses/${expenseId}`);

  return response;
};

export const updateExpenseById = async (body: ExpenseUpdateBody): ApiResponse<FinanceData> => {
  const response = await HttpClient.put(`/expenses/${body.expenseId}`, body.data);

  return response;
};

export const approveExpenseById = async (body: FinanceData): ApiResponse<FinanceData> => {
  const response = await HttpClient.post(`/expenses/approve/${body._id}`, body);

  return response;
};

export const cencelExpenseById = async (body: FinanceData): ApiResponse<FinanceData> => {
  const response = await HttpClient.post(`/expenses/cencel/${body._id}`, body);

  return response;
};

export const isDeleteExpenseById = async (body: FinanceData): ApiResponse<FinanceData> => {
  const response = await HttpClient.post(`/expenses/selectDelete/${body._id}`, body);

  return response;
};

export const deleteExpenseById = async (expenseId: string): ApiResponse<FinanceData> => {
  const response = await HttpClient.delete(`/expenses/${expenseId}`);

  return response;
};
