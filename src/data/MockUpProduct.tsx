import {
  Product,
  PRICE_TYPE,
  ProductType,
  Catagory,
} from "../model/product.type";

export const mockCategories: Catagory[] = [
  {
    _id: 1,
    name: "Coating",
    code: "C",
  },
  {
    _id: 2,
    name: "Damp",
    code: "D",
  },
  {
    _id: 3,
    name: "Guard",
    code: "G",
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
      { type: PRICE_TYPE.STANDARD, amount: 4900 },
      { type: PRICE_TYPE.STANDARD, amount: 6000 },
      { type: PRICE_TYPE.LUXURY, amount: 6900 },
      { type: PRICE_TYPE.LUXURY, amount: 8000 },
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
      { type: PRICE_TYPE.STANDARD, amount: 2500 },
      { type: PRICE_TYPE.STANDARD, amount: 2900 },
      { type: PRICE_TYPE.STANDARD, amount: 3500 },
      { type: PRICE_TYPE.STANDARD, amount: 3900 },
      { type: PRICE_TYPE.STANDARD, amount: 4900 },
    ],
    detail: "",
    productType: ProductType.GUN,
  },
];
