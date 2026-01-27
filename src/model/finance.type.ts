import { DeleteStatus } from "./delete.type";

export enum PaymentCategory {
  WITHDRAW = 0,
  SALARY = 1, // เบิกเงินเดือน
}

export enum CategoryType {
  FUEL = 0, // น้ำมัน
  TRAVEL = 1, // เดินทาง
  ACCOMMODATION = 2, // ที่พัก
  ALLOWANCE = 3, // เบี้ยเลี้ยง
  TRANSPORT = 4, // ขนส่ง
  TOOL = 5, // อุปกรณ์
  MEDICAL = 6, // รักษา
  OTHER = 7, // อื่นๆ
  SALARY_ADVANCE = 8, // เบิกเงินเดือน
  PAYROLL = 9, // เงินเดือนพนักงาน
}

export enum ExpenseStatus {
  PENDING = 0,
  APPROVE = 1,
  CANCEL = 2,
}

export interface CatagoryDetail {
  type: CategoryType;
  amount: number;
}

export interface FinanceData {
  _id?: string;
  codeId: number;
  employeeId: string; // ชื่อบุคคล
  ownerName: string; // หัวข้อ
  section: PaymentCategory; // หมวดหมู่
  categorys: CatagoryDetail[];
  date: string; // วันที่สร้าง
  datePrice: string; // วันที่จ่าย
  detel: string; // รายละเอียด
  delete: DeleteStatus; // สถานะการลบ
  slip?: string; // หลักฐานการจ่ายเงิน
  status: ExpenseStatus; // สถานะการอนุมัติ
}
