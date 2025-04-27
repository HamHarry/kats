import { DeleteStatus } from "./delete.type";
import { ProductData, ProductDetail } from "./product.type";

export enum BookingStatus {
  PENDING = 0, // รอจ่ายเงิน
  PAID = 1, // จ่ายเงินแล้ว
  COMPLETED = 2, // เสร็จสิ้น
  CANCELED = 3, // ยกเลิก
  DELETE = 4, // สถานะลบ
}

export interface CarStructure {
  serviceNo: number; // ครั้งที่
  serviceDate: string; // วันที่เข้ารับบริการ
  isBeam: boolean; // คาน
  isWheelArch: boolean; // ซุ้มล้อ
  isControlArm: boolean; // ปีกนก
  isChassis: boolean; // แชสซี่ส์
  isUnderbody: boolean; // ใต้ท้อง
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
  guarantees?: CarStructure[];
  price: ProductDetail;
  tel: string;
  image?: string;
  slip?: string;
  delete: DeleteStatus;
}
