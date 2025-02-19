export enum PRICE_TYPE {
  LUXURY = 1,
  STANDARD = 2,
}

export interface Category {
  _id?: number;
  name: string;
  code: string;
}

export interface ProductDetail {
  type: PRICE_TYPE;
  price: number;
}

export interface Product {
  _id?: number;
  name: string;
  catagory: Category;
  productDetails: ProductDetail[];
  detail: string;
}
