import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import * as expenseServices from "../../services/expenseService";
import { FinanceData } from "../../model/finance.type";
const initialState: any = {};

const expenseSlice = createSlice({
  name: "documentInfoSlice",
  initialState,
  reducers: {},
  extraReducers() {},
});

export const createExpense = createAsyncThunk(
  "expense/create",
  async (payload: any): Promise<any> => {
    const response = await expenseServices.createExpense(payload);
    return response;
  }
);

export const getAllExpenses = createAsyncThunk(
  "expense/get/all",
  async (): Promise<any> => {
    const response = await expenseServices.getAllExpenses();
    return response;
  }
);

export const isDeleteExpenseById = createAsyncThunk(
  "expense/updatestatusDelete/id",
  async (body: FinanceData): Promise<any> => {
    const response = await expenseServices.isDeleteExpenseById(body);
    return response;
  }
);

export default expenseSlice.reducer;
