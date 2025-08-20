import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import * as employeeServices from "../../services/employeeSevice";
import { RootState } from "../store";

export interface EmployeeImageUpdateForm {
  imageName?: string;
}

export interface EmployeeState {
  profileImage?: EmployeeImageUpdateForm;
}

const initialState: EmployeeState = {};

const employeeSlice = createSlice({
  name: "documentInfoSlice",
  initialState,
  reducers: {
    setProfileImage: (state, action: PayloadAction<EmployeeImageUpdateForm | undefined>) => {
      state.profileImage = action.payload;
    },
  },
  extraReducers() {},
});

export const createEmployee = createAsyncThunk("employee/create", async (payload: any): Promise<any> => {
  const response = await employeeServices.createEmployee(payload);
  return response;
});

export const getAllEmployees = createAsyncThunk("employee/get/all", async (): Promise<any> => {
  const response = await employeeServices.getAllEmployees();
  return response;
});

export const getAllEmployeePaginations = createAsyncThunk("employee/get/all/Pagination", async (query: any): Promise<any> => {
  const response = await employeeServices.getAllEmployeePaginations(query);
  return response;
});

export const getEmployeeById = createAsyncThunk("Employee/get/id", async (employeeId: string): Promise<any> => {
  const response = await employeeServices.getEmployeeById(employeeId);
  return response;
});

export const updateEmployeeById = createAsyncThunk("Employee/update/id", async (body: any): Promise<any> => {
  const response = await employeeServices.updateEmployeeById(body);
  return response;
});

export const deleteEmployeeById = createAsyncThunk("employee/deleteById", async (employeeId: string): Promise<any> => {
  const response = await employeeServices.deleteEmployeeById(employeeId);
  return response;
});

export const profileImageSelector = (store: RootState) => store.employeeReducer.profileImage;

export const { setProfileImage } = employeeSlice.actions;

export default employeeSlice.reducer;
