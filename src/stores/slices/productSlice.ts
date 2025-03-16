import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import * as productServices from "../../services/productService";

const initialState: any = {};

const productSlice = createSlice({
  name: "documentInfoSlice",
  initialState,
  reducers: {},
  extraReducers() {},
});

export const createProduct = createAsyncThunk(
  "product/create",
  async (payload: any): Promise<any> => {
    const response = await productServices.createProduct(payload);
    return response;
  }
);

export const getAllProducts = createAsyncThunk(
  "product/get/all",
  async (): Promise<any> => {
    const response = await productServices.getAllProducts();
    return response;
  }
);

export const createCatagory = createAsyncThunk(
  "catagory/create",
  async (payload: any): Promise<any> => {
    const response = await productServices.createCatagory(payload);
    return response;
  }
);

export const getAllCatagories = createAsyncThunk(
  "catagories/get/all",
  async (): Promise<any> => {
    const response = await productServices.getAllCatagories();
    return response;
  }
);

export default productSlice.reducer;
