import { ApiResponse } from "../model/api.type";
import { DeleteStatus } from "../model/delete.type";
import { CatagoryData, ProductData, TypeProductData } from "../model/product.type";
import { HttpClient } from "../shared/utils/HttpClient";

export interface ProductUpdateBody {
  productId: string;
  data: ProductData;
}

export interface CatagoryUpdateBody {
  catagoryId: string;
  data: CatagoryData;
}

export interface TypeProductUpdateBody extends TypeProductData {
  typeProductId: string;
}

export const createProduct = async (payload: ProductData): ApiResponse<ProductData> => {
  const response = await HttpClient.post<ProductData>(`/products`, payload);

  return response;
};

export const getAllProducts = async (delet = DeleteStatus.ISNOTDELETE): ApiResponse<ProductData[]> => {
  const response = await HttpClient.get<ProductData[]>(`/products?delete=${delet}`);

  return response;
};

export const createCatagory = async (payload: CatagoryData): ApiResponse<CatagoryData> => {
  const response = await HttpClient.post<CatagoryData>(`/products/catagory`, payload);

  return response;
};

export const getAllCatagories = async (delet = DeleteStatus.ISNOTDELETE): ApiResponse<CatagoryData[]> => {
  const response = await HttpClient.get<CatagoryData[]>(`/products/catagories?delete=${delet}`);

  return response;
};

export const createTypeProduct = async (payload: TypeProductData): ApiResponse<TypeProductData> => {
  const response = await HttpClient.post<TypeProductData>(`/products/typeProduct`, payload);

  return response;
};

export const getAllTypeProduct = async (
  delet = DeleteStatus.ISNOTDELETE
): ApiResponse<TypeProductData[]> => {
  const response = await HttpClient.get<TypeProductData[]>(`/products/typeProduct?delete=${delet}`);

  return response;
};

export const getProductById = async (productId: string): ApiResponse<ProductData> => {
  const response = await HttpClient.get<ProductData>(`/products/${productId}`);

  return response;
};

export const getCatagoryById = async (catagoryId: string): ApiResponse<CatagoryData> => {
  const response = await HttpClient.get<CatagoryData>(`/products/catagories/${catagoryId}`);

  return response;
};

export const getTypeProductById = async (typeProductId: string): ApiResponse<TypeProductData> => {
  const response = await HttpClient.get<TypeProductData>(`/products/typeProduct/${typeProductId}`);

  return response;
};

export const updateProductById = async (body: ProductUpdateBody): ApiResponse<ProductData> => {
  const response = await HttpClient.put<ProductData>(`/products/update/${body.productId}`, body.data);

  return response;
};

export const updateCatagoryById = async (body: CatagoryUpdateBody): ApiResponse<CatagoryData> => {
  const response = await HttpClient.put<CatagoryData>(
    `/products/catagories/update/${body.catagoryId}`,
    body.data
  );

  return response;
};

export const updateTypeProductById = async (
  body: TypeProductUpdateBody
): ApiResponse<TypeProductData> => {
  const response = await HttpClient.put<TypeProductData>(
    `/products/typeProduct/update/${body.typeProductId}`,
    body
  );

  return response;
};

export const isDeleteProductById = async (body: ProductData): ApiResponse<ProductData> => {
  const response = await HttpClient.post<ProductData>(`/products/selectDelete/${body._id}`, body);

  return response;
};

export const isDeleteCatagoryById = async (body: CatagoryData): ApiResponse<CatagoryData> => {
  const response = await HttpClient.post<CatagoryData>(
    `/products/catagories/selectDelete/${body._id}`,
    body
  );

  return response;
};

export const isDeleteTypeProductById = async (body: CatagoryData): ApiResponse<TypeProductData> => {
  const response = await HttpClient.post<TypeProductData>(
    `/products/typeProduct/selectDelete/${body._id}`,
    body
  );

  return response;
};

export const deleteProductById = async (productId: string): ApiResponse<ProductData> => {
  const response = await HttpClient.delete<ProductData>(`/products/DeleteProduct/${productId}`);

  return response;
};

export const deleteCatagoryById = async (productId: string): ApiResponse<CatagoryData> => {
  const response = await HttpClient.delete<CatagoryData>(`/products/DeleteCatagory/${productId}`);

  return response;
};

export const deleteTypeProductById = async (productId: string): ApiResponse<TypeProductData> => {
  const response = await HttpClient.delete<TypeProductData>(
    `/products/DeleteTypeProduct/${productId}`
  );

  return response;
};
