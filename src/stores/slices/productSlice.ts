import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import * as productServices from "../../services/productService";
import {
  CatagoryData,
  ProductData,
  TypeProductData,
} from "../../model/product.type";

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

export const createTypeProduct = createAsyncThunk(
  "typeProduct/create",
  async (payload: any): Promise<any> => {
    const response = await productServices.createTypeProduct(payload);
    return response;
  }
);

export const getAllTypeProduct = createAsyncThunk(
  "typeProduct/get/all",
  async (): Promise<any> => {
    const response = await productServices.getAllTypeProduct();
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

export const getTypeProductById = createAsyncThunk(
  "typeProduct/get/id",
  async (typeProductId: string): Promise<any> => {
    const response = await productServices.getTypeProductById(typeProductId);
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

export const updateTypeProductById = createAsyncThunk(
  "typeProduct/update/id",
  async (body: any): Promise<any> => {
    const response = await productServices.updateTypeProductById(body);
    return response;
  }
);

export const isDeleteProductById = createAsyncThunk(
  "product/IsDelete/id",
  async (body: ProductData): Promise<any> => {
    const response = await productServices.isDeleteProductById(body);
    return response;
  }
);

export const isDeleteCatagoryById = createAsyncThunk(
  "catagory/IsDelete/id",
  async (body: CatagoryData): Promise<any> => {
    const response = await productServices.isDeleteCatagoryById(body);
    return response;
  }
);

export const isDeleteTypeProductById = createAsyncThunk(
  "typeProduct/IsDelete/id",
  async (body: TypeProductData): Promise<any> => {
    const response = await productServices.isDeleteTypeProductById(body);
    return response;
  }
);

export const deleteProductById = createAsyncThunk(
  "product/Delete/id",
  async (productId: string): Promise<any> => {
    const response = await productServices.deleteProductById(productId);
    return response;
  }
);

export const deleteCatagoryById = createAsyncThunk(
  "catagory/Delete/id",
  async (productId: string): Promise<any> => {
    const response = await productServices.deleteCatagoryById(productId);
    return response;
  }
);

export const deleteTypeProductById = createAsyncThunk(
  "typeProduct/Delete/id",
  async (productId: string): Promise<any> => {
    const response = await productServices.deleteTypeProductById(productId);
    return response;
  }
);

export default productSlice.reducer;
