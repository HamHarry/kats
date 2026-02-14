import { HttpClient } from "../shared/utils/HttpClient";

export const createEmployee = async (payload: any): Promise<any> => {
  const response = await HttpClient.post(`/employees`, payload);

  return response;
};

export const getAllEmployees = async (): Promise<any> => {
  const response = await HttpClient.get(`/employees`);

  return response;
};

export const getEmployeeById = async (employeeId: string): Promise<any> => {
  const response = await HttpClient.get(`/employees/${employeeId}`);

  return response;
};

export const getAllEmployeePaginations = async (query: any): Promise<any> => {
  const response = await HttpClient.get(`/employees/pagination`, {
    params: query,
  });

  return response;
};

export const updateEmployeeById = async (body: any): Promise<any> => {
  const response = await HttpClient.put(
    `/employees/${body.employeeId}`,
    body.data,
  );

  return response;
};

export const isDeleteEmployeeById = async (body: any): Promise<any> => {
  const response = await HttpClient.post(
    `/employees/selectDelete/${body._id}`,
    body,
  );

  return response;
};

export const deleteEmployeeById = async (employeeId: string): Promise<any> => {
  const response = await HttpClient.delete(`/employees/${employeeId}`);

  return response;
};
