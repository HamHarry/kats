import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import * as employeeServices from "../../services/employeeSevice";

const initialState: any = {};

const employeeSlice = createSlice({
  name: "documentInfoSlice",
  initialState,
  reducers: {},
  extraReducers() {},
});

export const createEmployee = createAsyncThunk(
  "employee/create",
  async (payload: any): Promise<any> => {
    const response = await employeeServices.createEmployee(payload);
    return response;
  }
);

export const getAllEmployees = createAsyncThunk(
  "employee/get/all",
  async (): Promise<any> => {
    const response = await employeeServices.getAllEmployees();
    return response;
  }
);

export const getEmployeeById = createAsyncThunk(
  "Employee/get/id",
  async (employeeId: string): Promise<any> => {
    const response = await employeeServices.getEmployeeById(employeeId);
    return response;
  }
);

export const updateEmployeeById = createAsyncThunk(
  "Employee/update/id",
  async (body: any): Promise<any> => {
    const response = await employeeServices.updateEmployeeById(body);
    return response;
  }
);

export const deleteEmployeeById = createAsyncThunk(
  "employee/deleteById",
  async (employeeId: string): Promise<any> => {
    const response = await employeeServices.deleteEmployeeById(employeeId);
    return response;
  }
);

export default employeeSlice.reducer;
