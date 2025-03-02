import { Product } from "./product.type";

export enum BookingStatus {
  PENDING = 0, // รอจ่ายเงิน
  PAID = 1, // จ่ายเงินแล้ว
  COMPLETED = 2, // เสร็จสิ้น
  CANCELED = 3, // ยกเลิก
}

export interface Guarantees {
  _id?: string;
  number: string;
  volume: string;
  bookDate: string;
  bookTime: string;
  name: string;
  carType: string;
  carModel: string;
  register: string;
  status: BookingStatus;
  product: Product;
  price: string;
  tel: string;
  image: string;
  imagePrice?: string;
}
