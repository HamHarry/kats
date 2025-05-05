import { DeleteStatus } from "./delete.type";

export enum PRICE_TYPE {
  LUXURY = 1,
  STANDARD = 2,
}

export interface CatagoryData {
  _id?: string;
  name: string;
  code: string;
  delete: DeleteStatus; // สถานะการลบ
}

export interface TypeProductData {
  _id?: string;
  name: string;
  code: string;
  delete: DeleteStatus; // สถานะการลบ
}

export interface ProductDetail {
  type: PRICE_TYPE;
  amount: number;
}

export interface ProductData {
  _id?: string;
  name: string;
  catagory: CatagoryData;
  catagoryId: string;
  productDetails: ProductDetail[];
  detail: string;
  typeProductId: string;
  typeProduct: TypeProductData;
  delete: DeleteStatus; // สถานะการลบ
}
