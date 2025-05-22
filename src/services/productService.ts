import axios from "axios";
import { CatagoryData, ProductData } from "../model/product.type";

export const createProduct = async (payload: any): Promise<any> => {
  const response = await axios.post(
    `${import.meta.env.VITE_BASE_SERVER_URL}/products`,
    payload
  );

  return response;
};

export const getAllProducts = async (): Promise<any> => {
  const response = await axios.get(
    `${import.meta.env.VITE_BASE_SERVER_URL}/products`
  );

  return response;
};

export const createCatagory = async (payload: any): Promise<any> => {
  const response = await axios.post(
    `${import.meta.env.VITE_BASE_SERVER_URL}/products/catagory`,
    payload
  );

  return response;
};

export const getAllCatagories = async (): Promise<any> => {
  const response = await axios.get(
    `${import.meta.env.VITE_BASE_SERVER_URL}/products/catagories`
  );

  return response;
};

export const createTypeProduct = async (payload: any): Promise<any> => {
  const response = await axios.post(
    `${import.meta.env.VITE_BASE_SERVER_URL}/products/typeProduct`,
    payload
  );

  return response;
};

export const getAllTypeProduct = async (): Promise<any> => {
  const response = await axios.get(
    `${import.meta.env.VITE_BASE_SERVER_URL}/products/typeProduct`
  );

  return response;
};

export const getProductById = async (productId: string): Promise<any> => {
  const response = await axios.get(
    `${import.meta.env.VITE_BASE_SERVER_URL}/products/${productId}`
  );

  return response;
};

export const getCatagoryById = async (catagoryId: string): Promise<any> => {
  const response = await axios.get(
    `${import.meta.env.VITE_BASE_SERVER_URL}/products/catagories/${catagoryId}`
  );

  return response;
};

export const updateProductById = async (body: any): Promise<any> => {
  const response = await axios.put(
    `${import.meta.env.VITE_BASE_SERVER_URL}/products/update/${body.productId}`,
    body.data
  );

  return response;
};

export const updateCatagoryById = async (body: any): Promise<any> => {
  const response = await axios.put(
    `${import.meta.env.VITE_BASE_SERVER_URL}/products/catagories/update/${
      body.catagoryId
    }`,
    body.data
  );

  return response;
};

export const isDeleteProductById = async (body: ProductData): Promise<any> => {
  const response = await axios.post(
    `${import.meta.env.VITE_BASE_SERVER_URL}/products/selectDelete/${body._id}`,
    body
  );

  return response;
};

export const isDeleteCatagoryById = async (
  body: CatagoryData
): Promise<any> => {
  const response = await axios.post(
    `${import.meta.env.VITE_BASE_SERVER_URL}/products/catagories/selectDelete/${
      body._id
    }`,
    body
  );

  return response;
};

export const isDeleteTypeProductById = async (
  body: CatagoryData
): Promise<any> => {
  const response = await axios.post(
    `${
      import.meta.env.VITE_BASE_SERVER_URL
    }/products/typeProduct/selectDelete/${body._id}`,
    body
  );

  return response;
};

export const deleteProductById = async (productId: string): Promise<any> => {
  const response = await axios.delete(
    `${
      import.meta.env.VITE_BASE_SERVER_URL
    }/products/DeleteProduct/${productId}`
  );

  return response;
};
