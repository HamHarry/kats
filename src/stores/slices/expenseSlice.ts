import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import * as expenseServices from "../../services/expenseService";
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

export default expenseSlice.reducer;
