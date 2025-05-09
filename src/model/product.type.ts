export enum PRICE_TYPE {
  LUXURY = 1,
  STANDARD = 2,
}

export enum ProductType {
  KATS = 1,
  GUN = 2,
}

export interface Catagory {
  _id?: string;
  name: string;
  code: string;
}

export interface ProductDetail {
  type: PRICE_TYPE;
  amount: number;
}

export interface ProductData {
  _id?: string;
  name: string;
  catagory: Catagory;
  catagoryId: string;
  productDetails: ProductDetail[];
  detail: string;
  productType: ProductType;
}
