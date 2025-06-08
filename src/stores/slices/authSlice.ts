import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import * as authService from "../../services/authService";

const initialState: any = {};

const authSlice = createSlice({
  name: "documentInfoSlice",
  initialState,
  reducers: {},
  extraReducers() {},
});

export const login = createAsyncThunk(
  "auth/login",
  async (payload: any): Promise<any> => {
    const response = await authService.login(payload);
    return response;
  }
);

export default authSlice.reducer;
