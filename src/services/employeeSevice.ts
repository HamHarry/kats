import axios from "axios";

export const createEmployee = async (payload: any): Promise<any> => {
  const response = await axios.post(
    `${import.meta.env.VITE_BASE_SERVER_URL}/employees`,
    payload
  );

  return response;
};

export const getAllEmployees = async (): Promise<any> => {
  const response = await axios.get(
    `${import.meta.env.VITE_BASE_SERVER_URL}/employees`
  );

  return response;
};

export const getEmployeeById = async (employeeId: string): Promise<any> => {
  const response = await axios.get(
    `${import.meta.env.VITE_BASE_SERVER_URL}/employees/${employeeId}`
  );

  return response;
};

export const getAllEmployeePaginations = async (query: any): Promise<any> => {
  const response = await axios.get(
    `${import.meta.env.VITE_BASE_SERVER_URL}/employees/pagination`,
    { params: query }
  );

  return response;
};

export const updateEmployeeById = async (body: any): Promise<any> => {
  const response = await axios.put(
    `${import.meta.env.VITE_BASE_SERVER_URL}/employees/${body.employeeId}`,
    body.data
  );

  return response;
};

export const deleteEmployeeById = async (employeeId: string): Promise<any> => {
  const response = await axios.delete(
    `${import.meta.env.VITE_BASE_SERVER_URL}/employees/${employeeId}`
  );

  return response;
};
