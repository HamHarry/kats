export interface BookingsRevenue {
  totalRevenue: number;
  bookingCount: number;
  averageRevenue?: number;
}

export enum ExpenseCategory {
  FUEL = "FUEL",
  TRAVEL = "TRAVEL",
  ACCOMMODATION = "ACCOMMODATION",
  ALLOWANCE = "ALLOWANCE",
  TRANSPORT = "TRANSPORT",
  TOOL = "TOOL",
  MEDICAL = "MEDICAL",
  OTHER = "OTHER",
  SALARY_ADVANCE = "SALARY_ADVANCE",
}

export interface ExpensesByCategory {
  FUEL: number;
  TRAVEL: number;
  ACCOMMODATION: number;
  ALLOWANCE: number;
  TRANSPORT: number;
  TOOL: number;
  MEDICAL: number;
  OTHER: number;
  SALARY_ADVANCE: number;
  total: number;
}

export interface DashboardPeriod {
  bookingsRevenue: BookingsRevenue;
  bookingsRevenuePending: BookingsRevenue;
  expensesByCategory: ExpensesByCategory;
  netProfit: number;
}

export interface DashboardSummary {
  year: DashboardPeriod;
  month: DashboardPeriod;
}
