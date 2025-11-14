import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import * as dashboardServices from "../../services/dashboardService";

interface DashboardDateParams {
  startDate?: string;
  endDate?: string;
}

const initialState: any = {};

const dashboardSlice = createSlice({
  name: "dashboardSlice",
  initialState,
  reducers: {},
  extraReducers() {},
});

export const getDashboardSummary = createAsyncThunk("dashboard/summary", async (params: DashboardDateParams): Promise<any> => {
  const response = await dashboardServices.getDashboardSummary(params);
  return response;
});

export const getDashboardBookingsRevenue = createAsyncThunk("dashboard/bookings-revenue", async (params: DashboardDateParams): Promise<any> => {
  const response = await dashboardServices.getDashboardBookingsRevenue(params);
  return response;
});

export const getDashboardExpensesByCategory = createAsyncThunk("dashboard/expenses-by-category", async (params: DashboardDateParams): Promise<any> => {
  const response = await dashboardServices.getDashboardExpensesByCategory(params);
  return response;
});

export default dashboardSlice.reducer;
