export enum PaymentCategory {
  WITHDRAW = 0,
  SALARY = 1,
}

export interface FinanceData {
  _id?: string;
  number: number;
  ownerName: string;
  section: PaymentCategory;
  category: string;
  date: string;
  datePrice: string;
  amount: number;
  detel: string;
}
