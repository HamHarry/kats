import axios from "axios";
import { RoleData } from "../data/permissions";

export const createRole = async (payload: any): Promise<any> => {
  const response = await axios.post(
    `${import.meta.env.VITE_BASE_SERVER_URL}/permissions/role`,
    payload
  );

  return response;
};

export const getAllRoles = async (): Promise<any> => {
  const response = await axios.get(
    `${import.meta.env.VITE_BASE_SERVER_URL}/permissions/role`
  );

  return response;
};

export const getRoleById = async (roleId: string): Promise<any> => {
  const response = await axios.get(
    `${import.meta.env.VITE_BASE_SERVER_URL}/permissions/role/${roleId}`
  );

  return response;
};

export const updateRoleById = async (body: any): Promise<any> => {
  const response = await axios.put(
    `${import.meta.env.VITE_BASE_SERVER_URL}/permissions/role/update/${
      body.roleId
    }`,
    body.data
  );

  return response;
};

export const isDeleteRoleById = async (body: RoleData): Promise<any> => {
  const response = await axios.post(
    `${import.meta.env.VITE_BASE_SERVER_URL}/permissions/role/selectDelete/${
      body._id
    }`,
    body
  );

  return response;
};
