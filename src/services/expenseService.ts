import { DeleteStatus } from "../model/delete.type";
import { FinanceData } from "../model/finance.type";
import { HttpClient } from "../shared/utils/HttpClient";

export const createExpense = async (payload: any): Promise<any> => {
  const response = await HttpClient.post(`/expenses`, payload);

  return response;
};

export const getAllExpenses = async (delet = DeleteStatus.ISNOTDELETE): Promise<any> => {
  const response = await HttpClient.get(`/expenses?delete=${delet}`);

  return response;
};

export const getExpenseById = async (expenseId: string): Promise<any> => {
  const response = await HttpClient.get(`/expenses/${expenseId}`);

  return response;
};

export const updateExpenseById = async (body: any): Promise<any> => {
  const response = await HttpClient.put(`/expenses/${body.expenseId}`, body.data);

  return response;
};

export const approveExpenseById = async (body: FinanceData): Promise<any> => {
  const response = await HttpClient.post(`/expenses/approve/${body._id}`, body);

  return response;
};

export const cencelExpenseById = async (body: FinanceData): Promise<any> => {
  const response = await HttpClient.post(`/expenses/cencel/${body._id}`, body);

  return response;
};

export const isDeleteExpenseById = async (body: FinanceData): Promise<any> => {
  const response = await HttpClient.post(`/expenses/selectDelete/${body._id}`, body);

  return response;
};

export const deleteExpenseById = async (expenseId: string): Promise<any> => {
  const response = await HttpClient.delete(`/expenses/${expenseId}`);

  return response;
};
