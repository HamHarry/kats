import { RoleData } from "../data/permissions";
import { DeleteStatus } from "./delete.type";

export enum PaymentStatus {
  BANK = 0, // เงินสด
  CASH = 1, // ธนาคาร
}

export enum PaymentType {
  MONTHLY = 0, // รายวัน
  DAILY = 1, // รายเดือน
}

export enum BankType {
  BANK_OF_AYUDHYA = 0, // ธนาคารกรุงศรีอยุธยา
  BANGKOK_BANK = 1, // ธนาคารกรุงเทพ
  KRUNG_THAI_BANK = 2, // ธนาคารกรุงไทย
  KASIKORNBANK = 3, // ธนาคารกสิกรไทย
  TMBTHANACHART_BANK = 4, // ธนาคารทหารไทยธนชาต
  GOVERNMENT_SAVINGS_BANK = 5, // ธนาคารออมสิน
  SIAM_COMMERCIAL_BANK = 6, // ธนาคารไทยพาณิชย์
}

export interface EmployeeData {
  _id?: string;
  firstName: string;
  lastName: string;
  tel: string;
  email?: string;
  role: RoleData;
  roleId: string;
  image: string;
  salary?: SalaryData;
  delete: DeleteStatus;
}

export interface EmployeeDataForm extends Omit<EmployeeData, "role" | "delete"> {}

export interface SalaryData {
  paymentStatus?: PaymentStatus;
  paymentType?: PaymentType;
  bankName?: BankType;
  accountNumber?: string;
  amount?: number;
}
