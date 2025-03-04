import { Product, PRICE_TYPE, ProductType } from "../model/product.type";

export const mockCategories = [
  {
    _id: 1,
    name: "Coating",
    code: "C",
  },
];

export const mockUpProducts: Product[] = [
  {
    _id: 1,
    name: "KATS Coating",
    catagory: {
      _id: 1,
      name: "Coating",
      code: "C",
    },
    productDetails: [
      { type: PRICE_TYPE.STANDARD, price: 4900 },
      { type: PRICE_TYPE.STANDARD, price: 6000 },
      { type: PRICE_TYPE.LUXURY, price: 6900 },
      { type: PRICE_TYPE.LUXURY, price: 8000 },
    ],
    detail: "",
    productType: ProductType.KATS,
  },
  {
    _id: 2,
    name: "Gun Protection",
    catagory: {
      _id: 1,
      name: "Coating",
      code: "C",
    },
    productDetails: [
      { type: PRICE_TYPE.STANDARD, price: 2500 },
      { type: PRICE_TYPE.STANDARD, price: 2900 },
      { type: PRICE_TYPE.STANDARD, price: 3500 },
      { type: PRICE_TYPE.STANDARD, price: 3900 },
      { type: PRICE_TYPE.STANDARD, price: 4900 },
    ],
    detail: "",
    productType: ProductType.GUN,
  },
];
