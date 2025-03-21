export enum PRICE_TYPE {
  LUXURY = 1,
  STANDARD = 2,
}

export enum ProductType {
  KATS = 1,
  GUN = 2,
}

export interface Catagory {
  _id?: number;
  name: string;
  code: string;
}

export interface ProductDetail {
  type: PRICE_TYPE;
  amount: number;
}

export interface Product {
  _id?: number;
  name: string;
  catagory: Catagory;
  productDetails: ProductDetail[];
  detail: string;
  productType: ProductType;
}
