import { ApiResponse } from "../model/api.type";
import { DeleteStatus } from "../model/delete.type";
import { EmployeeData } from "../model/employee.type";
import { HttpClient } from "../shared/utils/HttpClient";

export interface EmployeeQuery {
  term?: string;
}

export interface EmployeeUpdateBody {
  employeeId: string;
  data: EmployeeData;
}

export const createEmployee = async (payload: EmployeeData): ApiResponse<EmployeeData> => {
  const response = await HttpClient.post(`/employees`, payload);

  return response;
};

export const getAllEmployees = async (
  delet = DeleteStatus.ISNOTDELETE,
): ApiResponse<EmployeeData[]> => {
  const response = await HttpClient.get(`/employees?delete=${delet}`);

  return response;
};

export const getEmployeeById = async (employeeId: string): ApiResponse<EmployeeData> => {
  const response = await HttpClient.get(`/employees/${employeeId}`);

  return response;
};

export const getAllEmployeePaginations = async (query: EmployeeQuery): ApiResponse<EmployeeData[]> => {
  const response = await HttpClient.get(`/employees/pagination`, {
    params: query,
  });

  return response;
};

export const updateEmployeeById = async (body: EmployeeUpdateBody): ApiResponse<EmployeeData> => {
  const response = await HttpClient.put(
    `/employees/${body.employeeId}`,
    body.data,
  );

  return response;
};

export const isDeleteEmployeeById = async (body: EmployeeData): ApiResponse<EmployeeData> => {
  const response = await HttpClient.post(
    `/employees/selectDelete/${body._id}`,
    body,
  );

  return response;
};

export const deleteEmployeeById = async (employeeId: string): ApiResponse<EmployeeData> => {
  const response = await HttpClient.delete(`/employees/${employeeId}`);

  return response;
};
