import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import * as productServices from "../../services/productService";
import { CatagoryData, ProductData } from "../../model/product.type";

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

export const getProductById = createAsyncThunk(
  "product/get/id",
  async (productId: string): Promise<any> => {
    const response = await productServices.getProductById(productId);
    return response;
  }
);

export const getCatagoryById = createAsyncThunk(
  "catagory/get/id",
  async (catagoryId: string): Promise<any> => {
    const response = await productServices.getCatagoryById(catagoryId);
    return response;
  }
);

export const updateProductById = createAsyncThunk(
  "product/update/id",
  async (body: any): Promise<any> => {
    const response = await productServices.updateProductById(body);
    return response;
  }
);

export const updateCatagoryById = createAsyncThunk(
  "catagory/update/id",
  async (body: any): Promise<any> => {
    const response = await productServices.updateCatagoryById(body);
    return response;
  }
);

export const isDeleteProductById = createAsyncThunk(
  "product/delete/id",
  async (body: ProductData): Promise<any> => {
    const response = await productServices.isDeleteProductById(body);
    return response;
  }
);

export const isDeleteCatagoryById = createAsyncThunk(
  "catagory/delete/id",
  async (body: CatagoryData): Promise<any> => {
    const response = await productServices.isDeleteCatagoryById(body);
    return response;
  }
);

export default productSlice.reducer;
