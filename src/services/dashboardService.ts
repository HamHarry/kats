import { HttpClient } from "../shared/utils/HttpClient";

interface DashboardDateParams {
  startDate?: string;
  endDate?: string;
}

const buildQueryParams = (params: DashboardDateParams): string => {
  const queryParams = new URLSearchParams();

  if (params.startDate) {
    queryParams.append("startDate", params.startDate);
  }
  if (params.endDate) {
    queryParams.append("endDate", params.endDate);
  }

  const queryString = queryParams.toString();
  return queryString ? `?${queryString}` : "";
};

export const getDashboardSummary = async (params: DashboardDateParams): Promise<any> => {
  const queryString = buildQueryParams(params);
  const response = await HttpClient.get(`/dashboard/summary${queryString}`);
  return response;
};

export const getDashboardBookingsRevenue = async (params: DashboardDateParams): Promise<any> => {
  const queryString = buildQueryParams(params);
  const response = await HttpClient.get(`/dashboard/bookings-revenue${queryString}`);
  return response;
};

export const getDashboardExpensesByCategory = async (params: DashboardDateParams): Promise<any> => {
  const queryString = buildQueryParams(params);
  const response = await HttpClient.get(`/dashboard/expenses-by-category${queryString}`);
  return response;
};
