import { DeleteStatus } from "../model/delete.type";
import { CatagoryData, ProductData } from "../model/product.type";
import { HttpClient } from "../shared/utils/HttpClient";

export const createProduct = async (payload: any): Promise<any> => {
  const response = await HttpClient.post(`/products`, payload);

  return response;
};

export const getAllProducts = async (delet = DeleteStatus.ISNOTDELETE): Promise<any> => {
  const response = await HttpClient.get(`/products?delete=${delet}`);

  return response;
};

export const createCatagory = async (payload: any): Promise<any> => {
  const response = await HttpClient.post(`/products/catagory`, payload);

  return response;
};

export const getAllCatagories = async (delet = DeleteStatus.ISNOTDELETE): Promise<any> => {
  const response = await HttpClient.get(`/products/catagories?delete=${delet}`);

  return response;
};

export const createTypeProduct = async (payload: any): Promise<any> => {
  const response = await HttpClient.post(`/products/typeProduct`, payload);

  return response;
};

export const getAllTypeProduct = async (delet = DeleteStatus.ISNOTDELETE): Promise<any> => {
  const response = await HttpClient.get(`/products/typeProduct?delete=${delet}`);

  return response;
};

export const getProductById = async (productId: string): Promise<any> => {
  const response = await HttpClient.get(`/products/${productId}`);

  return response;
};

export const getCatagoryById = async (catagoryId: string): Promise<any> => {
  const response = await HttpClient.get(`/products/catagories/${catagoryId}`);

  return response;
};

export const getTypeProductById = async (typeProductId: string): Promise<any> => {
  const response = await HttpClient.get(`/products/typeProduct/${typeProductId}`);

  return response;
};

export const updateProductById = async (body: any): Promise<any> => {
  const response = await HttpClient.put(`/products/update/${body.productId}`, body.data);

  return response;
};

export const updateCatagoryById = async (body: any): Promise<any> => {
  const response = await HttpClient.put(
    `/products/catagories/update/${body.catagoryId}`,
    body.data
  );

  return response;
};

export const updateTypeProductById = async (body: any): Promise<any> => {
  const response = await HttpClient.put(`/products/typeProduct/update/${body.typeProductId}`, body);

  return response;
};

export const isDeleteProductById = async (body: ProductData): Promise<any> => {
  const response = await HttpClient.post(`/products/selectDelete/${body._id}`, body);

  return response;
};

export const isDeleteCatagoryById = async (body: CatagoryData): Promise<any> => {
  const response = await HttpClient.post(`/products/catagories/selectDelete/${body._id}`, body);

  return response;
};

export const isDeleteTypeProductById = async (body: CatagoryData): Promise<any> => {
  const response = await HttpClient.post(`/products/typeProduct/selectDelete/${body._id}`, body);

  return response;
};

export const deleteProductById = async (productId: string): Promise<any> => {
  const response = await HttpClient.delete(`/products/DeleteProduct/${productId}`);

  return response;
};

export const deleteCatagoryById = async (productId: string): Promise<any> => {
  const response = await HttpClient.delete(`/products/DeleteCatagory/${productId}`);

  return response;
};

export const deleteTypeProductById = async (productId: string): Promise<any> => {
  const response = await HttpClient.delete(`/products/DeleteTypeProduct/${productId}`);

  return response;
};
