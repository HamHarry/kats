import { ProductData, ProductDetail } from "./product.type";

export enum BookingStatus {
  PENDING = 0, // รอจ่ายเงิน
  PAID = 1, // จ่ายเงินแล้ว
  COMPLETED = 2, // เสร็จสิ้น
  CANCELED = 3, // ยกเลิก
}

export interface BookingData {
  _id?: string;
  number: string;
  receiptBookNo: string;
  bookDate: string;
  bookTime: string;
  name: string;
  carType: string;
  carModel: string;
  licensePlate: string;
  province: string;
  status: BookingStatus;
  product: ProductData;
  price: ProductDetail;
  tel: string;
  image?: string;
  slip?: string;
}
