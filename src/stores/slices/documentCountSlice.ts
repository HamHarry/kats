import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import * as documentCountServices from "../../services/documentCountService";

const initialState: any = {};

const documentCountSlice = createSlice({
  name: "documentInfoSlice",
  initialState,
  reducers: {},
  extraReducers() {},
});

export const getAllDocumentCounts = createAsyncThunk(
  "employee/get/all",
  async (): Promise<any> => {
    const response = await documentCountServices.getAllDocumentCounts();
    return response;
  }
);

export default documentCountSlice.reducer;
