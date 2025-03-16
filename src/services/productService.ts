import axios from "axios";

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
